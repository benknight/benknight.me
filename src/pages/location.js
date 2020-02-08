import { graphql } from 'gatsby';
import moment from 'moment';
import React from 'react';
import Colophon from '../components/Colophon';
import styles from './location.module.css';

export const query = graphql`
  {
    rows: allAirtable(
      filter: { table: { eq: "Location" } }
      sort: { order: DESC, fields: data___Date }
    ) {
      edges {
        node {
          data {
            Address
            Date
            Emoji
            Lat
            Lng
            Google_Maps_Link
          }
        }
      }
    }
  }
`;

function formatDate(...input) {
  const calendar = moment(input[0]).calendar(null, {
    // lastDay: '[Yesterday]',
    // lastWeek: '[Last] dddd',
    // sameDay: '[Today]',
    sameElse: function(now) {
      if (this.year() === now.year()) {
        return 'MMMM D';
      }
      return 'LL';
    },
  });
  const days = Math.round(
    Math.max(1, moment(input[1]).diff(moment(input[0]), 'days', true)),
  );
  return `${calendar} · ${days} ${days > 1 ? 'days' : 'day'}`;
}

export default function Location({ data }) {
  const rows = data.rows.edges.map(({ node: { data } }) => data);
  return (
    <>
      <Colophon />
      <ul id="root" className="px-8 px16-l pb-16 m-0 m-auto text-center">
        {rows.map((row, index) => {
          const prev = rows[index - 1];
          return (
            <li className="mt-16" key={row.Date}>
              <a className="inline-block" href={row['Google Maps Link']}>
                <span
                  className={[
                    `${styles.emoji}`,
                    'bg-gray-200 dark:bg-black inline-block w-16 h-16 mb-4 text-3xl text-center rounded-full',
                  ].join(' ')}>
                  {row.Emoji}
                </span>
                <br />
                <b>{row.Address}</b>
                <br />
                <time dateTime={row.Date}>{formatDate(row.Date, prev && prev.Date)}</time>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
