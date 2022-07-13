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

export default function DashboardPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="m-3 mt-0 grid w-full place-items-center rounded-lg bg-base-300 p-6">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <h2 className="text-xl font-semibold">👷 WIP</h2>
      </div>
    </div>
  );
}
