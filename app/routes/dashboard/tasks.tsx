import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
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

export const handle = {
  dashboardTab: "Tasks",
  breadcrumb: () => <Link to="/dashboard">Some Route</Link>,
};

export default function NoteIndexPage() {
  // const { nbOfNotes } = useLoaderData();
  // useWatchNotes();

  return (
    <>
      <div className="flex h-full w-80 flex-col items-center">
        {/* Sidebar */}
        <Link to="new" className="btn gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          NEW TASK
        </Link>

        <hr />
      </div>

      {/* Main view of dashboard */}
      <div className="m-3 mt-0 flex flex-1 flex-col rounded-lg rounded-tl-3xl bg-base-300 p-6">
        <Outlet />
      </div>
    </>
  );
}
