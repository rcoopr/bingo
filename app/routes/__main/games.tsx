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

export default function GamesPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <>
      <div className="flex h-full w-80 flex-col items-start">
        <Link
          to="new"
          className="rounded-md border-2 border-cyan-400 py-2 px-4 text-xl hover:bg-cyan-400/10"
        >
          + New Game
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
                  📝 {game.title}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      <Outlet />
    </>
  );
}
