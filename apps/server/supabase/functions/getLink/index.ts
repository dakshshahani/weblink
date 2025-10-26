import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, OPTIONS, POST, DELETE, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers });

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use GET." }),
      { status: 405, headers },
    );
  }

  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const source_bookmark_id = url.searchParams.get("source_bookmark_id");
    const target_bookmark_id = url.searchParams.get("target_bookmark_id");

    // Require user_id (for filtering)
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameter: user_id" }),
        { status: 400, headers }
      );
    }
    // Optional filters
    let query = supabase
      .from("bookmark_links")
      .select(
        "link_id, user_id, source_bookmark_id, target_bookmark_id, relevance_score, created_at"
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });


    if (source_bookmark_id)
      query = query.eq("source_bookmark_id", source_bookmark_id);
    if (target_bookmark_id)
      query = query.eq("target_bookmark_id", target_bookmark_id);

    const { data, error } = await query;

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        user_id,
        count: data?.length ?? 0,
        links: data ?? [],
      }),
      { status: 200, headers },
    );
  } catch (err) {
    console.error("getLinks error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});

