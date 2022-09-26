declare type TrelloCustomField = {
  idCustomField: string,
  value: {
    checked?: string,
    text?: string,
  },
};

declare type TrelloCard = {
  customFieldItems: TrelloCustomField[],
  desc: string,
  due: string,
  dueComplete: boolean,
  id: string,
  labels: [
    {
      name: string,
    },
  ],
  name: string,
};

declare type Post = {
  date: string,
  hideTitle?: boolean,
  html?: string,
  id: string,
  labels: string[],
  slug?: string,
  title: string,
};
