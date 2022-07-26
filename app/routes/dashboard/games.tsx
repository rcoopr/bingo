import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/core/auth/guards";
import { notFound } from "~/core/utils/http.server";

import { Sidebar } from "../../core/components/sidebar/sidebar";
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
      <Sidebar data={data} />
      {/* Main view of dashboard */}
      <div className="m-3 mt-0 flex flex-1 flex-col overflow-auto rounded-lg rounded-tl-3xl bg-base-300">
        <Outlet />
      </div>
    </>
  );
}
