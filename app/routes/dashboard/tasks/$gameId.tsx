import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireAuthSession } from "~/core/auth/guards";
import { commitAuthSession } from "~/core/auth/session.server";
import { assertIsDelete } from "~/core/utils/http.server";
import { deleteGame } from "~/modules/game/mutations";
import { getGame } from "~/modules/game/queries";

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireAuthSession(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ id: Number(params.gameId) });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ game });
};

export const action: ActionFunction = async ({ request, params }) => {
  assertIsDelete(request);

  const authSession = await requireAuthSession(request);
  invariant(params.gameId, "gameId not found");

  await deleteGame({ id: Number(params.gameId) });

  return redirect("/games", {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
};

export default function GameDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.game.title}</h3>
      <p className="py-6">{data.game.description}</p>
      <p className="py-6">{data.game.startDate}</p>
      <p className="py-6">{data.game.endDate}</p>
      <hr className="my-4" />
      <Form method="delete">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
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
