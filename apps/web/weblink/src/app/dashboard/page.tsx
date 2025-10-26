"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ForceGraph from "@/components/ForceGraph";
import { getGraphData } from "@/lib/graphData";

/**
 * Type-safe keys for all sidebar buttons (match your sidebar setup)
 */
export type ToggleKey =
  | "settings"
  | "Work"
  | "Study"
  | "AI"
  | "Personal"
  | "Ideas"
  | "To‑Read"
  | "Framework"
  | "Library"
  | "Language"
  | "Database";

type Node = {
  id: string | number;
  name: string;
  tag?: string;
};

type Link = {
  source: string | number;
  target: string | number;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeToggles, setActiveToggles] = useState<
    Record<ToggleKey, boolean>
  >({} as Record<ToggleKey, boolean>);

  // data for the graph
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // Fetch graph data
  useEffect(() => {
    getGraphData().then(setData);
  }, []);

  // Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) window.location.href = "/";
    else console.error("Sign-out error:", error.message);
  }

  /**
   * 👉 Toggle logic: each tag independent (can be multi‑select)
   */
  const handleToggleChange = (key: ToggleKey, isActive: boolean) => {
    setActiveToggles((prev) => ({
      ...prev,
      [key]: isActive,
    }));
  };

  /**
   * Compute array of active tags (exclude non-tag keys like "settings")
   */
  const activeTags = Object.entries(activeToggles)
    .filter(([key, value]) => key !== "settings" && value)
    .map(([key]) => key);

  if (!user) return <p>Loading dashboard...</p>;

  /**
   * Header text (optional: show selected tags)
   */
  const header = () => {
    if (activeToggles["settings"]) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p className="text-muted-foreground">
            Change your preferences or manage your account here.
          </p>
        </div>
      );
    }

    if (activeTags.length > 0) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            Active Tags: {activeTags.join(", ")}
          </h1>
          <p className="text-muted-foreground">
            Showing bookmarks for multiple tags.
          </p>
        </div>
      );
    }
  };

  return (
    <main>
      <SidebarProvider>
        <SidebarPanel
          onToggleChange={handleToggleChange}
          onSignOut={handleSignOut}
        />

        <div className="min-w-screen  rounded-3xl m-2">
          <div className="flex gap-4 p-4 items-center ">
            <SidebarTrigger className="bg-white" />
            <h1 className="text-2xl font-bold ">Welcome to NodeBook</h1>
          </div>
          {header()}
          <div className="flex-1 flex flex-col">
            {/* Pass array of active tags to the graph */}
            <ForceGraph
              nodes={data.nodes}
              links={data.links}
              selectedTags={activeTags}
            />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
