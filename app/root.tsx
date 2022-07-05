import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { Toaster } from "react-hot-toast";

import { getAuthSession } from "./core/auth/session.server";
import type { ColorScheme } from "./core/cookies";
import { getColorScheme, colorSchemeCookie } from "./core/cookies";
import { SupabaseRealtimeProvider } from "./core/integrations/supabase/realtime-context";
import { SUPABASE_ANON_PUBLIC, SUPABASE_URL } from "./core/utils/env.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const action: ActionFunction = async ({ request }) => {
  const currentColorScheme = await getColorScheme(request);
  const newColorScheme: ColorScheme =
    currentColorScheme === "light" ? "dark" : "light";

  return redirect(request.url, {
    headers: {
      "Set-Cookie": await colorSchemeCookie.serialize(newColorScheme),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  // authSession only required for realtime supabase features
  // in dev, this is not required ???
  const authSession = await getAuthSession(request);

  const colorScheme = await getColorScheme(request);

  return json({
    realtimeSession: {
      accessToken: authSession?.accessToken,
      expiresIn: authSession?.expiresIn,
      expiresAt: authSession?.expiresAt,
    },
    ENV: {
      SUPABASE_URL,
      SUPABASE_ANON_PUBLIC,
    },
    colorScheme,
  });
};

const txPaths: string[] = [];

export default function App() {
  const { ENV, colorScheme } = useLoaderData();
  const transition = useTransition();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={colorScheme === "light" ? "h-full" : "dark h-full"}>
        <Toaster position="bottom-right" />
        <SupabaseRealtimeProvider>
          <main className="relative min-h-screen bg-slate-100 from-slate-900 to-slate-700 text-slate-800 dark:bg-gradient-to-br dark:text-slate-300">
            <div className="absolute bottom-4 right-4 z-10">
              <Form method="post">
                <button type="submit" className="bg-black p-6 text-cyan-600">
                  theme
                </button>
              </Form>
            </div>
            {/* <div
              className={
                transition.state === "loading" &&
                txPaths.includes(transition.location.pathname)
                  ? "scale-90 transform-gpu opacity-50 grayscale transition-all duration-300"
                  : "grayscale-0 transition-all duration-300"
              }
            >
              <Outlet />
            </div> */}
            <Outlet />
          </main>
        </SupabaseRealtimeProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
