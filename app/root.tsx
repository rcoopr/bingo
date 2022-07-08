import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import reset from "normalize.css";
import { Toaster } from "react-hot-toast";

import { getAuthSession } from "./core/auth/session.server";
import { SupabaseRealtimeProvider } from "./core/integrations/supabase/realtime-context";
import {
  Theme,
  Themed,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "./core/theme/theme-provider";
import { ThemeSwitch } from "./core/theme/theme-switch";
import { getThemeSession } from "./core/theme/theme.server";
import { SUPABASE_ANON_PUBLIC, SUPABASE_URL } from "./core/utils/env.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "stylesheet", href: reset },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  themeSession.toggleTheme();

  return json(
    { success: true },
    { headers: { "Set-Cookie": await themeSession.commit() } }
  );
};

type LoaderData = {
  realtimeSession: {
    accessToken: string | undefined;
    expiresIn: number | undefined;
    expiresAt: number | undefined;
  };
  ENV: {
    SUPABASE_URL: string;
    SUPABASE_ANON_PUBLIC: string | undefined;
  };
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  // authSession only required for realtime supabase features
  // in dev, this is not required ???
  const authSession = await getAuthSession(request);

  // const themeSession = await getThemeSession(request);
  // const colorScheme = await themeSession.getTheme();
  const themeSession = await getThemeSession(request);

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
    theme: themeSession.getTheme(),
  });
};

// const txPaths: string[] = [];

function App({ ENV }: Partial<LoaderData>) {
  const [theme] = useTheme();
  // const transition = useTransition();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(theme)} />
      </head>
      <body className={clsx(theme, "h-full")}>
        <Toaster position="bottom-right" />
        <SupabaseRealtimeProvider>
          <main className="relative min-h-screen bg-slate-100 from-slate-900 to-slate-700 text-slate-800 dark:bg-gradient-to-br dark:text-slate-300">
            <div className="absolute bottom-4 right-4 z-10">
              <ThemeSwitch on={theme === Theme.LIGHT} />
              <Themed dark={<p>dark</p>} light={<p>light</p>} />
              <p>{theme}</p>
            </div>
            {/* <div
              className={
                transition.state === "loading" &&
                txPaths.includes(transition.location.pathname)
                  ? "scale-90 transform-gpu opacity-50 grayscale transition-all duration-300"
                  : "grayscale-0 transition-all duration-300"
              }
            > */}
            <Outlet />
            {/* </div> */}
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

export default function AppWithProviders() {
  const { ENV, theme } = useLoaderData();

  return (
    <ThemeProvider specifiedTheme={theme}>
      <App ENV={ENV} />
    </ThemeProvider>
  );
}
