import type { Game } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireAuthSession } from "~/core/auth/guards";
import { commitAuthSession } from "~/core/auth/session.server";
import { assertIsDelete } from "~/core/utils/http.server";
import { deleteGame } from "~/modules/game/mutations";
import { getGame } from "~/modules/game/queries";

import { GameView } from "../../../core/components/board/game";

type LoaderData = {
  game: Game;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAuthSession(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ id: Number(params.gameId) });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ game });
};

export const action: ActionFunction = async ({ request, params }) => {
  assertIsDelete(request);

  const authSession = await requireAuthSession(request);
  invariant(params.gameId, "gameId not found");

  await deleteGame({ id: Number(params.gameId) });

  return redirect("/dashboard/games", {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
};

export default function GameDetailsPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col gap-4 p-6">
      <GameView game={data.game} />
      <div className="divider" />
      <Form method="delete" className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Game not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
