"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("✅ Logged in user:", session.user);
        router.push("/dashboard");
      } else {
        console.warn("⚠️ No session found");
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  return <p>Redirecting...</p>;
}