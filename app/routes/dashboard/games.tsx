import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Outlet, NavLink, Link } from "@remix-run/react";
import clsx from "clsx";

import { requireAuthSession } from "~/core/auth/guards";
import { notFound } from "~/core/utils/http.server";

import { getGames } from "../../modules/game/queries";

type LoaderData = {
  email: string;
  games: Awaited<ReturnType<typeof getGames>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { userId, email } = await requireAuthSession(request);

  const games = await getGames({ userId });

  if (!games) {
    throw notFound(`No user with id ${userId}`);
  }

  return json<LoaderData>({ email, games });
};

export const handle = {
  dashboardTab: "Games",
  breadcrumb: () => <Link to="/dashboard">Some Route</Link>,
};

export default function GamesPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <>
      <div className="flex h-full w-80 flex-col items-center">
        {/* Sidebar */}
        <Link to="new" className="btn gap-2">
          <span>+</span>
          New Game
        </Link>

        <hr />

        {data.games.length === 0 ? (
          <p className="p-4">{data.email} has no games yet</p>
        ) : (
          <ol>
            {data.games.map((game) => (
              <li key={game.id}>
                <NavLink
                  className={({ isActive }) =>
                    `${clsx("block p-4 text-xl", isActive && "bg-white")}`
                  }
                  to={game.id.toString()}
                >
                  🎮 {game.title}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Main view of dashboard */}
      <div className="m-3 mt-0 flex flex-1 flex-col rounded-lg rounded-tl-3xl bg-base-300 p-6">
        <Outlet />
      </div>
    </>
  );
}
