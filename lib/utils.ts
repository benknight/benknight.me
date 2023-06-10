export function getPostDate(card: TrelloCard): string {
  return card.customFieldItems.find(
    item => item.idCustomField === process.env.TRELLO_CUSTOM_FIELD_ID_DATE,
  )?.value.date;
}

export function getPostSlug(card: TrelloCard): string {
  return card.customFieldItems.find(
    item => item.idCustomField === process.env.TRELLO_CUSTOM_FIELD_ID_SLUG,
  )?.value.text;
}

export function getPostTitle(card: TrelloCard): string {
  return card.customFieldItems.find(
    item => item.idCustomField === process.env.TRELLO_CUSTOM_FIELD_ID_TITLE,
  )?.value.text;
}

export function isPostPublic(card: TrelloCard) {
  return (
    card.customFieldItems.find(
      item => item.idCustomField === process.env.TRELLO_CUSTOM_FIELD_ID_VISIBILITY,
    )?.idValue === process.env.TRELLO_CUSTOM_FIELD_ID_VISIBILITY_PUBLIC
  );
}

export function isPostPrivate(card: TrelloCard) {
  return (
    card.customFieldItems.find(
      item => item.idCustomField === process.env.TRELLO_CUSTOM_FIELD_ID_VISIBILITY,
    )?.idValue === process.env.TRELLO_CUSTOM_FIELD_ID_VISIBILITY_PRIVATE
  );
}
