import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
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

export const loader: LoaderFunction = async ({ request }) =>
  // uncomment if you want to use realtime supabase features
  // const authSession = await getAuthSession(request);

  // return json({
  //   realtimeSession: {
  //     accessToken: authSession?.accessToken,
  //     expiresIn: authSession?.expiresIn,
  //     expiresAt: authSession?.expiresAt,
  //   },
  //   ENV: {
  //     SUPABASE_URL,
  //     SUPABASE_ANON_PUBLIC,
  //   },
  // });
  json({
    ENV: {
      SUPABASE_URL,
      SUPABASE_ANON_PUBLIC,
    },
  });

const txPaths = ["/"];

export default function App() {
  const { ENV } = useLoaderData() as Window;
  const transition = useTransition();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Toaster position="bottom-right" />
        <SupabaseRealtimeProvider>
          <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-slate-300">
            <div
              className={
                transition.state === "loading" &&
                txPaths.includes(transition.location.pathname)
                  ? "scale-90 transform-gpu opacity-50 grayscale transition-all duration-300"
                  : "grayscale-0 transition-all duration-300"
              }
            >
              <Outlet />
            </div>
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
