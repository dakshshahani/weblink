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

type BookmarkTagRelation = {
  bookmark_id: string;
  tag_id: string;
  tag_name?: string; // derived later
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(
    {}
  );
  const [bookmarkTagData, setBookmarkTagData] = useState<BookmarkTagRelation[]>(
    []
  );
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

      // Build both a list of names and an ID→Name map
      const tags = Array.isArray(tagJson?.tags)
        ? tagJson.tags.map((t: any) => t?.name).filter(Boolean)
        : [];
      const tagIdToNameMap = new Map(
        Array.isArray(tagJson?.tags)
          ? tagJson.tags.map((t: any) => [t.tag_id, t.name])
          : []
      );

      setAvailableTags(tags);

      // Initialize toggle state (one per tag + settings)
      const toggles = tags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {
        settings: false,
      });
      setActiveToggles(toggles);

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

      // ✅ Extract correct field: "bookmark_tags"
      const rawRelations = Array.isArray(bookmarkTagJson?.bookmark_tags)
        ? bookmarkTagJson.bookmark_tags
        : [];

      // ⚡ Add readable tag_name using the map from getTag
      const relationships: BookmarkTagRelation[] = rawRelations.map(
        (rel: any) => ({
          bookmark_id: rel.bookmark_id,
          tag_id: rel.tag_id,
          tag_name: tagIdToNameMap.get(rel.tag_id) ?? null,
        })
      );

      setBookmarkTagData(relationships);
      console.log("Mapped Bookmark ↔ Tag data:", relationships);
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
    if (activeTags.length === 0) return graphData;

    // find bookmark_ids linked to any of the active tags
    const matchedBookmarkIds = bookmarkTagData
      .filter((bt) => activeTags.includes(bt.tag_name ?? ""))
      .map((bt) => bt.bookmark_id);

    const nodes = graphData.nodes.filter((n) =>
      matchedBookmarkIds.includes(n.id as string)
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
          activeTags={activeTags} // ✅ new prop
          onToggleChange={handleToggleChange}
          onSignOut={handleSignOut}
        />

        <div className="bg-gray-200 overflow-hidden rounded-3xl w-full m-2">
          <div className="flex gap-4 p-4">
            <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white" />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Welcome to NodeBook</h1>
              {header()}
            </div>
          </div>

          <div className="p-4">
            <ForceGraph
              allNodes={graphData.nodes}
              allLinks={graphData.links}
              filteredNodes={filteredGraph.nodes}
              filteredLinks={filteredGraph.links}
              selectedTags={activeTags}
            />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
