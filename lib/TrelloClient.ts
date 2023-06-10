const base = 'https://api.trello.com/1';

export async function fetchCards(): Promise<[TrelloCard]> {
  const params = new URLSearchParams({
    // attachments: 'true',
    customFieldItems: 'true',
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN,
  });
  const response = await fetch(
    `${base}/boards/${process.env.TRELLO_BOARD_ID}/cards?${params.toString()}`,
  );
  return await response.json();
}
