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
  const [fade, setFade] = useState(false); // 페이드 상태 추가

  const handleClick = async () => {
    if (articles === null) return;

    // 효과음 재생
    const audio = new Audio("/button.webm");
    audio.play();

    setFade(true); // 페이드아웃 시작

    // 페이드아웃이 끝난 뒤 hidden 처리 및 run 호출
    setTimeout(() => {
      setHidden(true);
      run(lane);
    }, 700); // 0.7초 후(transition-duration과 맞춤)
  };

  return (
    <div
      className={twMerge(
        "flex h-screen flex-col items-center justify-center overflow-hidden transition-opacity duration-700",
        fade ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
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

          <div className="absolute bottom-2 left-2 text-[8px] text-neutral-400">
            <p>개발: 미니박스</p>
            <p>디자인: 우주이루다</p>
            <p>영상: LCM</p>
            <p>SFX: Ticon@EMS!!</p>
          </div>
        </>
      )}
    </div>
  );
}
