#!/usr/bin/env node
/**
 * Add Readwise highlight links to pages/reading.mdx.
 *
 * Fetches your books from the Readwise API, matches them by title against the
 * book entries in the reading list, and appends a ` · [highlights](url)` link
 * to each matched line.
 *
 * Usage:
 *   READWISE_TOKEN=xxxx node scripts/add-readwise-links.mjs          # dry run (preview only)
 *   READWISE_TOKEN=xxxx node scripts/add-readwise-links.mjs --write  # apply changes
 *
 * Get your token at https://readwise.io/access_token
 *
 * Note: readwise.io/bookreview/<id> pages are only viewable while you are
 * logged in to your own Readwise account. Visitors to the public site will
 * hit a login wall unless you instead enable public sharing per book and
 * swap in those share URLs.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MDX_PATH = path.join(__dirname, '..', 'pages', 'reading.mdx');

const TOKEN = process.env.READWISE_TOKEN;
const WRITE = process.argv.includes('--write');

// Matches a book list item: `- _**Title**_ ...rest`
const BOOK_LINE = /^(\s*-\s+_\*\*(.+?)\*\*_)(.*)$/;
// A previously-appended link, so re-runs replace rather than duplicate.
const EXISTING_SUFFIX = /\s*·\s*\[highlights\]\(https:\/\/readwise\.io\/[^)]+\)\s*$/;

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/\*\*/g, '')
    .split(':')[0] // drop subtitle after a colon
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9 ]/g, '') // strip punctuation, asterisks, smart quotes
    .replace(/\s+/g, ' ')
    .trim();

async function fetchAllBooks() {
  const books = [];
  let url = 'https://readwise.io/api/v2/books/?page_size=1000&category=books';
  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${TOKEN}` },
    });
    if (!res.ok) {
      throw new Error(
        `Readwise API ${res.status} ${res.statusText}: ${await res.text()}`
      );
    }
    const data = await res.json();
    books.push(...data.results);
    url = data.next;
  }
  return books;
}

function buildMatcher(books) {
  const byNorm = new Map();
  for (const b of books) {
    if (!b.highlights_url || !b.num_highlights) continue;
    const key = normalize(b.title);
    // Prefer the entry with the most highlights on collisions.
    const existing = byNorm.get(key);
    if (!existing || b.num_highlights > existing.num_highlights) {
      byNorm.set(key, b);
    }
  }
  return (title) => {
    const key = normalize(title);
    if (byNorm.has(key)) return byNorm.get(key);
    // Fall back to a containment match (handles subtitle / punctuation drift).
    for (const [k, b] of byNorm) {
      if (k.includes(key) || key.includes(k)) return b;
    }
    return null;
  };
}

async function main() {
  if (!TOKEN) {
    console.error(
      'Missing READWISE_TOKEN. Get one at https://readwise.io/access_token\n' +
        'Then: READWISE_TOKEN=xxxx node scripts/add-readwise-links.mjs [--write]'
    );
    process.exit(1);
  }

  const books = await fetchAllBooks();
  const match = buildMatcher(books);
  console.log(`Fetched ${books.length} books from Readwise.\n`);

  const src = await fs.readFile(MDX_PATH, 'utf8');
  const lines = src.split('\n');

  let matched = 0;
  const unmatched = [];

  const out = lines.map((line) => {
    const m = line.match(BOOK_LINE);
    if (!m) return line;

    const title = m[2];
    const base = line.replace(EXISTING_SUFFIX, ''); // strip any prior link
    const book = match(title);

    if (!book) {
      unmatched.push(title);
      return base; // leave the line as-is (also removes a stale link if any)
    }

    matched++;
    console.log(`  ✓ ${title}  →  ${book.highlights_url}`);
    return `${base} · [highlights](${book.highlights_url})`;
  });

  console.log(`\nMatched ${matched} book(s).`);
  if (unmatched.length) {
    console.log(`\nNo Readwise match for ${unmatched.length} entr(ies):`);
    for (const t of unmatched) console.log(`  – ${t}`);
  }

  if (!WRITE) {
    console.log('\nDry run — no files changed. Re-run with --write to apply.');
    return;
  }

  await fs.writeFile(MDX_PATH, out.join('\n'));
  console.log(`\nWrote updates to ${path.relative(process.cwd(), MDX_PATH)}.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
