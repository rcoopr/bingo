import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/core/auth/guards";

import {
  getActiveGameCount,
  getGameCount,
} from "../../../modules/game/queries";

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await requireAuthSession(request);

  const userGameCount = await getGameCount({ userId });
  const userActiveGameCount = await getActiveGameCount({ userId });

  return json({
    userGameCount,
    userActiveGameCount,
  });
};

export default function NoteIndexPage() {
  const { userGameCount, userActiveGameCount } = useLoaderData();

  return (
    <div className="grid grid-flow-col gap-4 p-6">
      <div className="flex w-max flex-col items-start">
        <div className="stats stats-vertical border border-base-content/10 px-[16px] shadow ease-out-back animate-in zoom-in-90 highlight-x-[16px] lg:stats-horizontal">
          <div className="stat text-base-content">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Active Games</div>
            <div className="stat-value text-primary">{userActiveGameCount}</div>
            <div className="stat-desc">{"\u2002"}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Games</div>
            <div className="stat-value text-secondary">{userGameCount}</div>
            <div className="stat-desc">{"\u2002"}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <img alt="avatar" src="https://placeimg.com/128/128/people" />
                </div>
              </div>
            </div>
            <div className="stat-value">86%</div>
            <div className="stat-title">Tasks done</div>
            <div className="stat-desc text-secondary">31 tasks remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
