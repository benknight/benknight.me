import kebabCase from 'lodash/kebabCase';

export default function getPostSlug(card: TrelloCard) {
  return card.customFieldItems[0]?.value.text || kebabCase(card.name);
}
