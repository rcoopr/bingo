import React from "react";

import { useFetcher, useSearchParams } from "@remix-run/react";

export function SignInWithDiscord() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const ref = React.useRef<HTMLFormElement>(null);
  const discordAuth = useFetcher();
  const { data, state, type } = discordAuth;
  const isSuccessFull = type === "done" && !data?.error;
  const isLoading = state === "submitting" || state === "loading";
  const buttonLabel = isLoading
    ? "Waiting for Discord..."
    : "Log in with Discord";

  React.useEffect(() => {
    if (isSuccessFull) {
      ref.current?.reset();
    }
  }, [isSuccessFull]);

  return (
    <discordAuth.Form
      method="post"
      action="/oauth/discord"
      replace={false}
      ref={ref}
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-600"
      >
        {buttonLabel}
      </button>
    </discordAuth.Form>
  );
}
