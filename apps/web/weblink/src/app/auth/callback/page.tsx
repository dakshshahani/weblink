"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log("Logged in user:", session.user);
        router.push("/");
      } else {
        console.log("No session found");
      }
    };

    processLogin();
  }, [router]);

  return <p>Redirecting...</p>;
}