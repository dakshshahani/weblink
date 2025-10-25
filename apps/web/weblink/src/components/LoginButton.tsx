"use client";

import { supabase } from "../lib/supabaseClient";

export default function LoginButton() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="rounded bg-blue-600 px-4 py-2 text-white"
    >
      Sign in with Google
    </button>
  );
}