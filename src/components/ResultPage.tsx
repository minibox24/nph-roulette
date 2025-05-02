import { motion } from "motion/react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { COLORS } from "../constants";
import { BoardArticle, Result } from "../types";
import { getNickname, getTier } from "../utils";

interface ResultPageProps {
  result: Result;
}

export default function ResultPage({ result }: ResultPageProps) {
  const openPages = (lane: BoardArticle[]) => {
    const urls = lane.map((article) => {
      return `https://cafe.naver.com/steamindiegame/${article.articleId}`;
    });

    urls.forEach((url) => {
      open(url, "_blank");
    });
  };

  const copy = () => {
    let text = ``;

    const makeText = (lane: BoardArticle[], name: string) => {
      text += `[${name}]\n`;
      lane.forEach((article) => {
        text += `${getNickname(article)}\n`;
      });
      text += `\n\n`;
    };

    makeText(result.noob, "눕");
    makeText(result.pro, "프로");
    makeText(result.hacker, "해커");

    window.navigator.clipboard.writeText(text).then(() => {
      toast("클립보드에 공지 내용을 복사했습니다!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    });
  };

  return (
    <motion.div
      className="flex h-screen flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className="mt-auto flex flex-col gap-6">
        <LaneInfo name="눕" lane={result.noob} index={0} />
        <LaneInfo name="프로" lane={result.pro} index={1} />
        <LaneInfo name="해커" lane={result.hacker} index={2} />
      </div>

      <div className="mt-auto flex w-full gap-2 p-4">
        <Button onClick={() => openPages(result.noob)}>
          눕 게시글 모두 열기
        </Button>
        <Button onClick={() => openPages(result.pro)}>
          프로 게시글 모두 열기
        </Button>
        <Button onClick={() => openPages(result.hacker)}>
          해커 게시글 모두 열기
        </Button>

        <Button className="ml-auto" onClick={copy}>
          공지 복사하기
        </Button>
      </div>

      <ToastContainer />
    </motion.div>
  );
}

function Button({
  children,
  onClick,
  className,
}: {
  children: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={twMerge(
        "cursor-pointer rounded-lg bg-[#062B1C] px-6 py-3 font-semibold shadow transition hover:brightness-150",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function LaneInfo({
  name,
  lane,
  index: laneIndex,
}: {
  name: string;
  lane: BoardArticle[];
  index: number;
}) {
  return (
    <div className="flex gap-2">
      {lane.map((article, index) => (
        <UserCard
          key={`${name}-${index}`}
          article={article}
          idx={index + laneIndex * 3} // 3개씩 나눠서 애니메이션
        />
      ))}
    </div>
  );
}

function UserCard({ idx, article }: { idx: number; article: BoardArticle }) {
  const [tierIndex] = getTier(article);

  return (
    <motion.div
      className="relative flex h-56 w-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md text-center shadow-md"
      onClick={() => {
        open(
          `https://cafe.naver.com/steamindiegame/${article.articleId}`,
          "_blank",
        );
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
    >
      <div
        className="absolute -z-10 size-56 scale-150 rounded-md opacity-70"
        style={{
          backgroundColor: `${COLORS[tierIndex]}`,
        }}
      />

      <img
        src={`/tier/${tierIndex}.webp`}
        className="size-36 rounded-md object-contain"
      />

      {/* 넘어가면 ... */}
      <div className="w-52 overflow-hidden text-lg text-ellipsis whitespace-nowrap">
        <b>{article.writerInfo.nickName}</b>
        <p className="-mt-1 text-sm opacity-70">({getNickname(article)})</p>
      </div>
    </motion.div>
  );
}
