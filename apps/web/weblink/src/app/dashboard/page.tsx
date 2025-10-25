"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { SidebarPanel } from "@/components/SidebarPanel";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <main>
        <SidebarPanel/>
      <h1 className="text-3xl font-bold">
        Welcome, {user.user_metadata.full_name}
      </h1>
      <p className="text-gray-500">{user.email}</p>
      <button
        className="mt-6 rounded bg-red-600 px-4 py-2 text-white"
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
      >
        Sign Out
      </button>
    </main>
  );
}
