import { supabaseAdmin } from "~/core/integrations/supabase/supabase.server";
import { SERVER_URL } from "~/core/utils/env.server";

import { mapAuthSession } from "../utils/map-auth-session";

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.api.signInWithEmail(
    email,
    password
  );

  if (!data || error) return null;

  return mapAuthSession(data);
}

export async function sendMagicLink(email: string) {
  return supabaseAdmin.auth.api.sendMagicLinkEmail(email, {
    redirectTo: `${SERVER_URL}/oauth/callback`,
  });
}

export async function signInWithDiscord() {
  const data = await supabaseAdmin.auth.signIn(
    {
      provider: "discord",
    },
    {
      redirectTo: `${SERVER_URL}/oauth/callback`,
      scopes: "identify email guilds",
    }
  );
  const oauthToken = data.session?.provider_token;

  return {
    session: mapAuthSession(data.session),
    data,
    oauthToken,
  };
}
