export function getPostSlug(card: TrelloCard): string {
  return card.customFieldItems.find(item => item.id === '6144a3b5b840be7e5e9e3a1e')?.value
    .text;
}

export function getPostTitle(card: TrelloCard): string {
  return card.customFieldItems.find(item => item.id === '6144a4a27fe5ea49ec26c546')?.value
    .text;
}
