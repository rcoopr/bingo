import * as React from "react";

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { signInWithDiscord } from "~/core/auth/mutations";
import { getAuthSession } from "~/core/auth/session.server";
import { BxLeftArrowAlt } from "~/core/components";
import { assertIsPost } from "~/core/utils/http.server";

import { LOGIN_DEFAULT_REDIRECT } from "../core/auth/const";
import { SignInWithDiscord } from "../core/components/sign-in-discord";

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await getAuthSession(request);

  if (authSession) return redirect(LOGIN_DEFAULT_REDIRECT);

  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);

  const authSession = await signInWithDiscord();

  if (!authSession.data.url) return json({});

  return redirect(authSession.data.url);
};

export const meta: MetaFunction = () => ({
  title: "Login",
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Link to="/">
        <div className="absolute top-6 left-6 rounded-full p-2 text-slate-400 hover:bg-slate-200/10 hover:text-slate-300">
          <BxLeftArrowAlt width={32} height={32} />
        </div>
      </Link>
      <div className="mx-auto w-full max-w-md px-8">
        <div className="mt-6">
          <div className="relative flex items-center text-sm">
            <p className="px-2 text-center text-slate-400">
              We require discord login so we can integrate with the submission
              bot -{" "}
              <Link to="#" className="text-indigo-400 hover:text-indigo-300">
                Find out more
              </Link>
            </p>
          </div>
          <div className="mt-6">
            {/* <Form method="post" replace ref={formRef}>
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <button
                type="submit"
                disabled={disabled}
                className="flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-600"
              >
                Log in with Discord
              </button>
            </Form> */}
            <SignInWithDiscord />
          </div>
        </div>
      </div>
    </div>
  );
}
