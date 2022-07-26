import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useMatches } from "@remix-run/react";
import clsx from "clsx";

import { requireAuthSession } from "~/core/auth/guards";
import { UserMenu } from "~/core/components";

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

// const endpoint = "https://discord.com/api/v10";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);
  // const authSession = await requireAuthSession(request);

  // const discordData = await fetch(endpoint + "/oauth2/@me", {
  //   method: "GET",
  //   headers: { Authorization: `Bearer ${authSession.accessToken}` },
  // });
  // const rawDiscordData = await discordData.json();

  // const discordSession = {
  //   avatar: rawDiscordData.avatar,
  //   username: rawDiscordData.username,
  // };

  return json({});
};

export default function ManagePage() {
  const matches = useMatches();
  // const [sidebar, setSidebar] = useState("games");

  const activeTab = matches.find((match) => !!match.handle?.dashboardTab);
  const activeTabIndex = tabs.findIndex(
    (tab) => tab.title === activeTab?.handle?.dashboardTab
  );
  const indicator =
    activeTabIndex < 0
      ? {
          tx: 0,
          opacity: 0,
        }
      : { tx: activeTabIndex * 100, opacity: 1 };

  return (
    <div className="flex h-full max-h-screen min-h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <div className="px-6 text-lg uppercase">Bingo</div>
        <nav className="flex">
          <div className="grid auto-cols-fr grid-flow-col rounded-lg bg-slate-700 p-1 text-slate-200">
            {tabs.map((link, index) => (
              <div key={link.path} className="relative">
                {index === 0 && (
                  <div
                    className="absolute inset-0 z-0 rounded-md bg-sky-200 transition-all duration-300"
                    style={{
                      transform: `translateX(${indicator.tx}%)`,
                      opacity: indicator.opacity,
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
        <UserMenu />
      </header>
      {/* min height at least the height of Breadcrumbs title + crumbs so no content shift when no crumbs exist */}
      {/* <div className="flex min-h-[3.75rem] justify-between">
        <Breadcrumbs />
      </div> */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <Outlet />
      </div>
    </div>
  );
}
