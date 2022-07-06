import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/core/auth/guards";

import { getGameCount } from "../../../modules/game/queries";

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await requireAuthSession(request);

  const userGameCount = await getGameCount({ userId });

  return json({
    userGameCount,
  });
};

export default function NoteIndexPage() {
  const { userGameCount } = useLoaderData();

  return (
    <div className="grid grid-flow-col gap-4">
      <div className="flex w-max flex-col items-start">
        <h2>Active Games</h2>
        <h2 className="text-5xl font-bold">{userGameCount}</h2>
      </div>
    </div>
  );
}
