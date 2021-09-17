declare type TrelloCard = {
  customFieldItems: [
    {
      value: {
        text: string,
      },
    },
  ],
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
  labels: string[],
  slug?: string,
  title: string,
};
