import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { isPrefetch } from "remix-utils";

import { requireAuthSession } from "~/core/auth/guards";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);

  const headers = new Headers();

  if (isPrefetch(request)) {
    headers.set("Cache-Control", "private, max-age=10, smax-age=0");
  }

  return json({ headers });
};

export default function CreateGamePage() {
  return (
    <div className="relative mx-auto max-w-7xl pb-16 pt-8 sm:py-0 sm:px-6 lg:px-8">
      <p>
        creating new game
        <Link to="new" className="text-blue-500 underline">
          create a new note.
        </Link>
      </p>
      <br />
      <div>
        <h2>Server number of notes:</h2>
      </div>
    </div>
  );
}
