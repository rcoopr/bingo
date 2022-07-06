import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import toast from "react-hot-toast";

import { requireAuthSession } from "~/core/auth/guards";
import { useWatchNotes } from "~/modules/note/hooks";
import { getNoteCount } from "~/modules/note/queries";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);

  // const nbOfNotes = await getNoteCount();

  // return json({
  //   nbOfNotes,
  // });
  return null;
};

const notify = () => toast("sup");
export default function NoteIndexPage() {
  // const { nbOfNotes } = useLoaderData();
  // useWatchNotes();

  return (
    <>
      <p>TASKS</p>
      <br />
      <div>
        <h2>Server number of notes:</h2>
        <button onClick={notify}>notify</button>
        {/* <span>{nbOfNotes}</span> */}
      </div>
    </>
  );
}
