import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";

import { signInWithDiscord } from "~/core/auth/mutations";
import { assertIsPost } from "~/core/utils/http.server";

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);

  const authSession = await signInWithDiscord();

  if (!authSession.data.url) return json({});

  return redirect(authSession.data.url);
};
