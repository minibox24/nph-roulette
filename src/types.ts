export interface BoardArticleListResponse {
  result: {
    articleList: {
      item: BoardArticle;
    }[];
    pageInfo: {
      visibleNextButton: boolean;
    };
  };
}

export interface BoardArticle {
  articleId: number;
  writerInfo: {
    nickName: string;
  };
  headName: string;
  subject: string;
  summary: string;
}

export interface Result {
  noob: BoardArticle[];
  pro: BoardArticle[];
  hacker: BoardArticle[];
}
