import { animate } from "motion";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { BoardArticle } from "../types";

interface MainPageProps {
  articles: BoardArticle[] | null;
  run: (lane: number) => void;
}

export default function MainPage({ articles, run }: MainPageProps) {
  const [lane, setLane] = useState(6);
  const logoRef = useRef<HTMLImageElement>(null);
  const [hidden, setHidden] = useState(false);

  const handleClick = async () => {
    if (articles === null) return;

    setHidden(true);

    if (logoRef.current) {
      await animate(
        logoRef.current,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { rotate: [0, 2500], opacity: [1, 0], scale: [1, 10] },
        { duration: 1.3, easing: "ease-in-out" },
      ).finished;
    }

    run(lane);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
      <img ref={logoRef} src="/logo.webp" className="w-2xl" />

      {!hidden && (
        <>
          <p className="mt-4 text-neutral-400">
            {articles === null
              ? "신청자를 불러오는 중 입니다..."
              : `${articles.length}명의 신청자를 발견했습니다.`}
          </p>

          <button
            className={twMerge(
              "mt-6 flex items-center gap-2 rounded-lg bg-[#062B1C] px-6 py-3 font-semibold shadow transition",
              articles === null
                ? "cursor-not-allowed opacity-30"
                : "cursor-pointer hover:brightness-150",
            )}
            onClick={handleClick}
          >
            <input
              type="number"
              value={lane}
              onChange={(e) => setLane(Number(e.target.value))}
              className="w-12 rounded bg-[#164532] px-2 py-1 text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
            <span className="whitespace-nowrap">라인 뽑기</span>
          </button>

          <p className="absolute bottom-4 text-center text-xs text-neutral-400">
            공지사항의{" "}
            <a
              href="https://cafe.naver.com/steamindiegame/5539638"
              target="_blank"
              className="underline"
            >
              제목 가이드라인
            </a>
            을 준수하지 않은 게시글은 포함되지 않습니다.
            <br />꼭 제목에 오타가 있는지 확인해주세요.
          </p>
        </>
      )}
    </div>
  );
}
