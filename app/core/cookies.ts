import { createCookie } from "@remix-run/node";

export type ColorScheme = "light" | "dark";

export const colorSchemeCookie = createCookie("color-scheme");

const getColorSchemeToken = async (request: Request) =>
  await colorSchemeCookie.parse(request.headers.get("Cookie"));

export const getColorScheme = async (request: Request) => {
  const userSelectedColorScheme = await getColorSchemeToken(request);
  const systemPreferredColorScheme = request.headers.get(
    "Sec-CH-Prefers-Color-Scheme"
  );

  const colorScheme: ColorScheme =
    userSelectedColorScheme ?? systemPreferredColorScheme ?? "dark";
  return colorScheme;
};
