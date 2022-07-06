import type { LoaderFunction } from "@remix-run/node";
import { Outlet, NavLink, useLocation } from "@remix-run/react";
import clsx from "clsx";

import { requireAuthSession } from "~/core/auth/guards";
import { LogoutButton, Breadcrumbs } from "~/core/components";

const tabs = [
  {
    path: "games",
    title: "Games",
  },
  {
    path: "tasks",
    title: "Tasks",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);

  return null;
};

export default function ManagePage() {
  const { pathname } = useLocation();
  const activeTabIndex = tabs.findIndex(
    (tab) => pathname.split("/")[1] === tab.path
  );

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <div className="px-6 text-lg uppercase">Bingo</div>
        <nav className="flex">
          <div className="grid auto-cols-fr grid-flow-col rounded-lg bg-slate-700 p-1 text-slate-200">
            {tabs.map((link, index) => (
              <div key={link.path} className="relative">
                {index === 0 && (
                  <div
                    className="absolute inset-0 z-0 rounded-md bg-sky-200 transition-transform duration-300"
                    style={{
                      transform: `translateX(${activeTabIndex * 100}%)`,
                    }}
                  />
                )}
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    clsx(
                      isActive && "text-slate-700",
                      "text-md relative z-10 flex h-full items-center justify-center rounded-md px-4 py-1 font-medium transition-colors duration-300"
                    )
                  }
                >
                  {link.title}
                </NavLink>
              </div>
            ))}
          </div>
        </nav>
        {/* <h1 className="text-3xl font-bold capitalize">{pagename}</h1> */}
        <LogoutButton />
      </header>
      {/* min height at least the height of Breadcrumbs title + crumbs so no content shift when no crumbs exist */}
      {/* <div className="flex min-h-[3.75rem] justify-between">
        <Breadcrumbs />
      </div> */}
      <div className="flex flex-1">
        <Outlet />
      </div>
    </div>
  );
}
