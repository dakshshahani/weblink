"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ForceGraph from "@/components/ForceGraph";
import { getGraphData } from "@/lib/graphData";

type Node = {
  id: string | number;
  name: string;
  tag?: string;
};

type Link = {
  source: string | number;
  target: string | number;
  relevance?: number;
};

type BookmarkTag = {
  bookmark_id: string;
  tag_name: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(
    {}
  );
  const [bookmarkTagData, setBookmarkTagData] = useState<BookmarkTag[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // 🌐 Step 1: Fetch full graph (bookmarks + connections)
  useEffect(() => {
    getGraphData().then(setGraphData);
  }, []);

  // 👤 Step 2: Fetch user, tags, and bookmark-tag relationships
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUser(user);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      console.log("User access token:", accessToken);

      /* ------------------ FETCH AVAILABLE TAGS ------------------ */
      const tagResponse = await fetch(
        `https://wzzlkcfytxzccrcyavju.supabase.co/functions/v1/getTag?user_id=${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const tagJson = await tagResponse.json();
      const tags = Array.isArray(tagJson?.tags)
        ? tagJson.tags.map((t: any) => t?.name).filter(Boolean)
        : [];

      setAvailableTags(tags);

      // Initialize toggle state (one per tag + settings)
      const toggles = tags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {
        settings: false,
      });
      setActiveToggles(toggles);
      console.log("User ID", user.id);

      /* ------------------ FETCH BOOKMARK-TAG LINKS ------------------ */
      const bookmarkTagResponse = await fetch(
        `https://wzzlkcfytxzccrcyavju.supabase.co/functions/v1/getBookmarkTag?user_id=${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bookmarkTagJson = await bookmarkTagResponse.json();
      console.log("Bookmark ↔ Tag data:", bookmarkTagJson);
      // Expecting form: [{ bookmark_id, tag_name }]
      const relationships = Array.isArray(bookmarkTagJson)
        ? bookmarkTagJson
        : Array.isArray(bookmarkTagJson?.data)
        ? bookmarkTagJson.data
        : [];

      setBookmarkTagData(relationships);
      console.log("Bookmark ↔ Tag data:", relationships);
    };

    fetchUserData();
  }, []);

  /* ------------------ AUTH LOGIC ------------------ */
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) window.location.href = "/";
    else console.error("Sign-out error:", error.message);
  }

  /* ------------------ TAG TOGGLE HANDLER ------------------ */
  const handleToggleChange = (key: string, isActive: boolean) => {
    setActiveToggles((prev) => ({
      ...prev,
      [key]: isActive,
    }));
  };

  /* ------------------ ACTIVE TAG LIST ------------------ */
  const activeTags = Object.entries(activeToggles)
    .filter(([key, value]) => key !== "settings" && value)
    .map(([key]) => key);

  /* ------------------ GRAPH FILTER ------------------ */
  const filteredGraph = useMemo(() => {
    // no active tags → show everything
    if (activeTags.length === 0) return graphData;

    const linkedBookmarkIds = bookmarkTagData
      .filter((bt) => activeTags.includes(bt.tag_name))
      .map((bt) => bt.bookmark_id);

    const nodes = graphData.nodes.filter((n) =>
      linkedBookmarkIds.includes(n.id)
    );

    const nodeIds = new Set(nodes.map((n) => n.id));
    const links = graphData.links.filter(
      (l) => nodeIds.has(l.source) && nodeIds.has(l.target)
    );

    return { nodes, links };
  }, [graphData, activeTags, bookmarkTagData]);

  /* ------------------ LOADING STATE ------------------ */
  if (!user) return <p>Loading dashboard...</p>;

  /* ------------------ HEADER DISPLAY ------------------ */
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
        <p className="text-muted-foreground">
          Active Tags: {activeTags.join(", ")}
        </p>
      );
    }

    return null;
  };

  /* ------------------ RENDER ------------------ */
  return (
    <main>
      <SidebarProvider>
        <SidebarPanel
          availableTags={availableTags}
          onToggleChange={handleToggleChange}
          onSignOut={handleSignOut}
        />

        <div className="min-w-screen rounded-3xl m-2">
          <div className="flex gap-4 p-4">
            <SidebarTrigger className="bg-white" />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Welcome to NodeBook</h1>
              {header()}
            </div>
          </div>

          <div className="flex flex-1 h-[93vh] w-[84vw] p-4">
            <ForceGraph
              nodes={filteredGraph.nodes}
              links={filteredGraph.links}
              selectedTags={activeTags}
            />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
