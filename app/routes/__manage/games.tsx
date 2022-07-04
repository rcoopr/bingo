import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Outlet, Link, NavLink } from "@remix-run/react";

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
    <main className="flex h-full">
      <div className="flex h-full w-80 flex-col items-center">
        <Link
          to="new"
          className="rounded-md border-2 border-cyan-400 py-2 px-4 text-xl text-slate-50 hover:bg-cyan-400/10"
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
                    `block p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={game.id}
                >
                  📝 {game.title}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </main>
  );
}
