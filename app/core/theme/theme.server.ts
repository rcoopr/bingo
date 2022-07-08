import { createCookieSessionStorage } from "@remix-run/node";

import { isTheme, Theme } from "./theme-provider";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "bingo-color-scheme",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    toggleTheme: () => {
      const themeValue = session.get("theme");
      session.set(
        "theme",
        themeValue === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
      );
    },
    commit: () => themeStorage.commitSession(session),
  };
}
