"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ForceGraph from "@/components/ForceGraph";
import { getGraphData } from "@/lib/graphData";

/**
 * Type-safe keys for all sidebar buttons
 * Add/remove keys here to match your SidebarPanel items
 */
type ToggleKey =
  | "settings"
  | "Work"
  | "Study"
  | "AI"
  | "Personal"
  | "Ideas"
  | "To‑Read";

type Node = {
  id: string | number;
  name: string;
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

  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  useEffect(() => {
    getGraphData().then(setData);
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      window.location.href = "/"; // 👈 this sends the user back to route "/"
    } else {
      console.error("Sign-out error:", error.message);
    }
  }
  // Fetch user data from Supabase
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

  /**
   * Handles toggles coming from the Sidebar
   */
  const handleToggleChange = (key: string, isActive: boolean) => {
    // Logic: only one active 'page' (settings or tags) at a time
    setActiveToggles((prev) => {
      const newState: Record<string, boolean> = {};

      // If settings is toggled, clear everything else
      if (key === "settings") {
        newState["settings"] = isActive;
        return newState as Record<ToggleKey, boolean>;
      }

      // If a tag is toggled, deactivate settings
      Object.keys(prev).forEach((k) => {
        if (k !== "settings") {
          newState[k] = false;
        }
      });

      // Toggle the clicked tag
      newState[key] = isActive;

      return newState as Record<ToggleKey, boolean>;
    });
  };

  /**
   * Determines which main content section to show
   */
  const header = () => {
    // Settings page
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

    // Tags pages
    const activeTag = Object.keys(activeToggles).find(
      (tag) => tag !== "settings" && activeToggles[tag as ToggleKey]
    );

    if (activeTag) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">#{activeTag}</h1>
          <p className="text-muted-foreground">
            Showing content filtered by the <strong>{activeTag}</strong> tag.
          </p>
        </div>
      );
    }

    // Default home content
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to NodeBook</h1>
        <p className="text-muted-foreground">
          All your links, linked — start by selecting a tag or open settings.
        </p>
      </div>
    );
  };

  return (
    <main className="">
      <SidebarProvider>
        {/* Sidebar with toggle communication */}
        <SidebarPanel
          onToggleChange={handleToggleChange}
          onSignOut={handleSignOut}
        />

        {/* ---- Main content area ---- */}
        <div className="flex-1 flex flex-col p-10 relative bg-white">
          {/* Sidebar Toggle Button (floats, doesn’t affect layout) */}
          <div className="absolute top-4 left-4 z-50 ">
            <SidebarTrigger />
          </div>

          {/* Main Page Content */}
          <div className="flex-1 flex flex-col">
            {header()}
            <ForceGraph nodes={data.nodes} links={data.links} />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
