import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  Outlet,
  Link,
  NavLink,
  useLocation,
} from "@remix-run/react";

import { requireAuthSession } from "~/core/auth/guards";
import { LogoutButton } from "~/core/components";
import { notFound } from "~/core/utils/http.server";
import type { getNotes } from "~/modules/note/queries";
import { getNoteCount } from "~/modules/note/queries";

const navLinks = [
  {
    path: "games",
    title: "Games",
  },
  {
    path: "tasks",
    title: "Tasks",
  },
];

type LoaderData = {
  email: string;
  notes: Awaited<ReturnType<typeof getNotes>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);

  return null;
};

export default function ManagePage() {
  const { pathname } = useLocation();
  const pagename = pathname.match(/\w+$/gi)?.[0];

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 text-white">
        <nav className="flex">
          {navLinks.map((link) => (
            <div key={link.path} className="text-md px-4">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `text-cyan-400 underline underline-offset-4`
                    : undefined
                }
                to={link.path}
              >
                {link.title}
              </NavLink>
            </div>
          ))}
        </nav>
        <h1 className="text-3xl font-bold capitalize">{pagename}</h1>
        <LogoutButton />
      </header>
      <Outlet />
    </div>
  );
}
