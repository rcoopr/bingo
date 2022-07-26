import { Link, useLocation, useParams } from "@remix-run/react";
import clsx from "clsx";

type SidebarProps = {
  className?: string;
  data: {
    email: string;
    games: {
      title: string;
      id: number;
    }[];
  };
};

const getStatus = (pathname: string) => {
  if (pathname.endsWith("new")) return "creating";
  if (pathname.endsWith("edit")) return "editing";
  return "idle";
};

export const Sidebar = ({ className, data }: SidebarProps) => {
  const { gameId } = useParams();
  const location = useLocation();
  const status = getStatus(location.pathname);

  return (
    <div
      className={clsx(
        className,
        "flex h-full w-80 flex-col items-center overflow-auto px-2"
      )}
    >
      <CallToAction status={status} />

      <List data={data} activeItem={gameId} />
    </div>
  );
};

type CTAStatus = "creating" | "editing" | "idle";

const CallToAction = ({ status }: { status: CTAStatus }) => (
  <Link
    to="new"
    className={clsx(
      "btn btn-success btn-wide relative z-10 mb-6 gap-2",
      status === "creating" && "btn-disabled bg-success-content text-success"
    )}
  >
    <svg
      className={clsx(
        "absolute left-0 top-full z-0 w-full",
        status === "creating" ? " text-success-content" : " text-success"
      )}
      width="256"
      height="12"
      viewBox="0 0 256 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="transition-all duration-200"
        d={
          status === "creating"
            ? "M 128 11.5 C 118 11.5 108 0 88 0 H 168 C 148 0 138 11.5 128 11.5 Z"
            : "M 128 0 C 118 0 108 0 88 0 H 168 C 148 0 138 0 128 0 Z"
        }
        fill="currentColor"
      />
    </svg>

    <span className="fade-in-0">
      {status === "creating" ? "Creating..." : <span>+ New Game</span>}
    </span>
  </Link>
);

const List = ({
  data,
  activeItem,
}: {
  data: SidebarProps["data"];
  activeItem: string | undefined;
}) => (
  <ul className="menu rounded-box w-full bg-base-100 p-2">
    {data.games.length === 0 ? (
      <EmptyList title={data.email} />
    ) : (
      <>
        <li
          className={clsx("menu-title", data.games.length === 0 && "disabled")}
        >
          <span>RSN: {data.email}</span>
        </li>
        {data.games.map((game, index) => (
          <li
            key={game.id}
            className={clsx(game.id.toString() === activeItem && "bordered")}
          >
            <Link
              to={game.id.toString()}
              className={clsx(index > 6 && "text-base-content/70")}
            >
              {index < 1 ? `🔑` : index < 2 ? `🕛` : index > 6 ? `🕜` : `🎮`}{" "}
              {game.title}
            </Link>
          </li>
        ))}
      </>
    )}
  </ul>
);

const EmptyList = ({ title }: { title: string }) => (
  <>
    <li className="disabled menu-title">
      <span>RSN: {title}</span>
    </li>
    <li className="disabled">
      <span>No games found</span>
    </li>
  </>
);
