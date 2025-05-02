import { useEffect, useState } from "react";
import MainPage from "./components/MainPage";
import ResultPage from "./components/ResultPage";
import { BoardArticle, BoardArticleListResponse, Result } from "./types";
import { makeResult } from "./utils";

export default function App() {
  const [lane, setLane] = useState<number | null>(null);
  const [articles, setArticles] = useState<BoardArticle[] | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const fetchPage = async (page: number) => {
        const response = await fetch(
          `https://naver.minibox.dev/internal/wakzoo-board/308/${page}`,
        );

        if (!response.ok) {
          console.error("Failed to fetch articles");
          return {} as BoardArticleListResponse;
        }

        const data = await response.json();

        return data as BoardArticleListResponse;
      };

      const articles = [];
      let page = 1;

      while (true) {
        const data = await fetchPage(page);

        articles.push(...data.result.articleList.map((x) => x.item));
        if (!data?.result?.pageInfo?.visibleNextButton) break;

        page++;
      }

      setArticles(articles);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (!lane || !articles) return;

    const r = makeResult(lane, articles);
    console.log(r);
    setResult(r);
  }, [articles, lane]);

  if (lane && result) {
    return <ResultPage result={result} />;
  }

  return <MainPage articles={articles} run={(lane) => setLane(lane)} />;
}
