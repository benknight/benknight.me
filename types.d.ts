declare type TrelloCustomField = {
  idCustomField: string,
  idValue: string,
  value: {
    checked?: string,
    date?: string,
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
  html?: string,
  id: string,
  slug?: string,
  title: string,
};

declare type PostVisibility = 'public' | 'private' | 'unlisted';
