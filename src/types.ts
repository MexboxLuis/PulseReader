export type Article = {
  id: string;
  title: string;
  description: string;
  url: string;
  published: string | null;
};

export type Feed = {
  id: string;
  title: string;
  description: string;
  lastUpdated: string | null;
  articles: Article[];
};

export type RootStackParamList = {
  Feeds: undefined;
  FeedDetails: undefined;
  ArticleView: { url: string; title?: string };
};
