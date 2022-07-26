import type { Game } from "@prisma/client";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import clsx from "clsx";

import { GameBoard } from "./board";
export type OptimisticGame = Partial<
  Pick<
    UseDataFunctionReturn<Game>,
    "title" | "description" | "startDate" | "endDate"
  >
>;
type GameViewProps = {
  game: UseDataFunctionReturn<Game> | OptimisticGame;
};

export function GameView({ game }: GameViewProps) {
  return (
    <>
      {game.startDate && game.endDate && (
        <GameProgressBar startDate={game.startDate} endDate={game.endDate} />
      )}
      <h2 className="text-2xl font-bold">{game.title}</h2>
      {game.description && <h3 className="text-lg">{game.description}</h3>}
      <GameBoard
        tiles={Array(20)
          .fill(0)
          .map((_, i) => ({
            task: i.toString(),
            points: i * 100 + 100,
            status:
              Math.random() > 0.3
                ? "done"
                : Math.random() > 0.5
                ? "submitted"
                : "fresh",
          }))}
        size={{ width: 5, height: 4 }}
      />
      <code>{JSON.stringify(game, null, 3)}</code>
    </>
  );
}

type GameProgressBarProps = Pick<
  UseDataFunctionReturn<Game>,
  "startDate" | "endDate"
>;

const GameProgressBar = ({
  startDate: startDateString,
  endDate: endDateString,
}: GameProgressBarProps) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const now = new Date();
  const progress = Math.min(
    1,
    (now.getTime() - startDate.getTime()) /
      (endDate.getTime() - startDate.getTime())
  );

  return (
    <div className="relative z-0 flex items-center justify-between overflow-hidden rounded-full bg-base-content/20 py-1 px-2">
      <div
        className={clsx(
          "absolute right-full -z-10 h-full w-[200%] rounded-full transition-all duration-700 ease-out-back animate-in slide-in-from-left-full",
          // "flex items-center justify-end pr-6 font-semibold",
          progress === 1
            ? "bg-warning text-warning-content"
            : progress === 0
            ? "bg-base-content text-base-300"
            : "bg-primary text-primary-content"
        )}
        style={{ transform: `translateX(${(progress * 100) / 2}%)` }}
      >
        {/* {progress === 1 ? "Completed" : "In Progress"} */}
      </div>
      <div className="text-md p-1 font-semibold text-base-300">
        {startDate.getDate()}{" "}
        {startDate.toLocaleString("default", { month: "long" })}
      </div>
      <div className="text-md p-1 font-semibold text-base-300">
        {endDate.getDate()}{" "}
        {endDate.toLocaleString("default", { month: "long" })}
      </div>
    </div>
  );
};
