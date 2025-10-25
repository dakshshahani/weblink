"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
      <SidebarProvider>
        <SidebarPanel />
        <main>
            <SidebarTrigger />
        </main>
      </SidebarProvider>
    </main>
  );
}
