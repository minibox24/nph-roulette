import { HACKERS, PROS, TIER } from "./constants";
import { BoardArticle, Result } from "./types";

function choice<T>(arr: T[], n: number, array2?: T[]): T[] {
  // If array2 is provided, exclude its elements from arr
  let filteredArr = arr;
  if (array2 && array2.length > 0) {
    const set2 = new Set(array2);
    filteredArr = arr.filter((item) => !set2.has(item));
  }

  if (n <= 0 || filteredArr.length === 0) return [];
  const result: T[] = [];
  const used = new Set<number>();
  const len = filteredArr.length;

  while (result.length < Math.min(n, len)) {
    const randArray = new Uint32Array(1);
    crypto.getRandomValues(randArray);
    const idx = randArray[0] % len;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(filteredArr[idx]);
    }
  }
  return result;
}

export function getTier(article: BoardArticle): [number, string] {
  const match = article.subject.match(/\[(.*?)\]/);
  if (match) {
    let tierName = match[1];
    const tierIndex = TIER.findIndex((tier) => tier.includes(tierName));

    if (tierIndex !== -1) {
      tierName = TIER[tierIndex][0];
      return [tierIndex, tierName];
    }
  }

  return [0, "언랭"];
}

function choiceLane(
  tierData: number[],
  articles: BoardArticle[],
  lane: number,
  beforeArticles?: BoardArticle[],
): BoardArticle[] {
  const availableArticles = articles.filter((article) => {
    const [tier] = getTier(article);
    return tierData[1] <= tier && tier <= tierData[0];
  });

  const selectedArticles = choice(availableArticles, lane, beforeArticles);

  return selectedArticles;
}

export function makeResult(lane: number, articles: BoardArticle[]): Result {
  const noobArticles = articles.filter((a) => a.headName === "눕프핵 눕 신청");
  const proArticles = articles.filter((a) => a.headName === "눕프핵 프로신청");
  const hackerArticles = articles.filter(
    (a) => a.headName === "눕프핵 해커신청",
  );

  // #region 프로
  const pro = choiceLane(PROS[0], proArticles, lane);

  // 프로 부족하면 2순위에서 뽑기
  if (pro.length != lane) {
    const pro2 = choiceLane(PROS[1], proArticles, lane - pro.length, pro);
    pro.push(...pro2);
  }
  // #endregion 프로

  // #region 해커
  // 해커에 마카게 2명 먼저 뽑기
  const hacker = choiceLane([11, 11], hackerArticles, 2);

  // 나머지 해커 1순위 뽑기
  const hacker2 = choiceLane(
    HACKERS[0],
    hackerArticles,
    lane - hacker.length,
    hacker,
  );
  hacker.push(...hacker2);

  // 해커 부족하면 2순위에서 뽑기
  if (hacker.length != lane) {
    const hacker3 = choiceLane(
      HACKERS[1],
      hackerArticles,
      lane - hacker.length,
      hacker,
    );
    hacker.push(...hacker3);
  }
  // #endregion 해커

  return {
    noob: choice(noobArticles, lane),
    pro,
    hacker,
  };
}

export function getNickname(article: BoardArticle): string | null {
  const match = article.summary.match(/\b[a-zA-Z0-9_]{2,16}\b/);
  return match ? match[0] : article.writerInfo.nickName;
}
