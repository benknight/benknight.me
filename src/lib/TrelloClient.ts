const base = 'https://api.trello.com/1';

export async function fetchPosts(): Promise<[TrelloCard]> {
  const params = new URLSearchParams({
    attachments: 'true',
    customFieldItems: 'true',
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN,
  });
  const response = await fetch(
    `${base}/lists/${process.env.TRELLO_LIST_POSTS}/cards?${params.toString()}`,
  );
  return await response.json();
}
