export function getPostSlug(card: TrelloCard): string {
  return card.customFieldItems.find(
    item => item.idCustomField === process.env.TRELLO_CUSTOM_FIELD_ID_SLUG,
  )?.value.text;
}
