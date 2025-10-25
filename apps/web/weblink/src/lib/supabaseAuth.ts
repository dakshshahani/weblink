"use client";

import { supabase } from "./supabaseClient";

/**
 * Starts Supabase OAuth sign‑in with Google.
 * You can reuse or extend this for any other provider.
 */
export async function handleGoogleOAuth() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) console.error("OAuth Error:", error.message);
}