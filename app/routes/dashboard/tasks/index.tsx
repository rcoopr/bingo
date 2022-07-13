import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import toast from "react-hot-toast";

import { requireAuthSession } from "~/core/auth/guards";

import { getGameCount } from "../../../modules/game/queries";

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await requireAuthSession(request);

  const userGameCount = await getGameCount({ userId });

  return json({
    userGameCount,
  });
};

const notify = () => toast("sup");

export default function NoteIndexPage() {
  const { userGameCount } = useLoaderData();

  return (
    <div className="grid grid-flow-col gap-4">
      <div className="flex w-max flex-col items-start">
        <p>TASKS</p>
        <br />
        <div>
          <h2>Server number of notes:</h2>
          <button onClick={notify}>notify</button>
          {/* <span>{nbOfNotes}</span> */}
        </div>
      </div>
    </div>
  );
}
