import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getAuthSession } from "~/core/auth/session.server";
import { HomeLinks } from "~/core/components";

type LoaderData = {
  userId?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = (await getAuthSession(request)) || {};

  return json({ userId });
};

export default function Index() {
  const { userId } = useLoaderData() as LoaderData;

  return (
    <div className=" sm:flex sm:items-center sm:justify-center">
      <div className="relative mx-auto max-w-7xl pb-16 pt-8 sm:py-0 sm:px-6 lg:px-8">
        <div className="relative sm:overflow-hidden sm:rounded-2xl">
          <div className="lg:pb-18 relative px-4 py-8 sm:py-6 lg:py-8">
            <h1 className="space-x-8 text-center text-[clamp(4rem,_10vw,_10rem)] font-extrabold tracking-tight">
              <span className="uppercase text-secondary drop-shadow-md">
                Team
              </span>
              <span className="uppercase text-accent drop-shadow-md">
                Bingo
              </span>
            </h1>
            <div className="mx-auto my-10 flex max-w-sm justify-center pb-6 sm:max-w-none">
              <HomeLinks isAuth={!!userId} />
            </div>
            <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
              <div className="flex w-full flex-col items-stretch gap-2">
                {[
                  ...new Array(10).fill(0).map((_, i) => (
                    <div key={i} className="rounded bg-base-300 p-2">
                      {i}
                    </div>
                  )),
                ]}
              </div>
            </div>
          </div>
          <div className="lg:pb-18 relative px-4 py-8 sm:py-6 lg:py-8">
            <Link
              to="/notes"
              className="text-cyan-300 underline hover:text-cyan-200"
            >
              Reference page - notes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
