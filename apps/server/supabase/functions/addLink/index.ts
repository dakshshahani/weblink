import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

// Initialize Supabase client inside the function (Edge Functions cannot import local files)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json();
    const { source_bookmark_id, target_bookmark_id, relevance_score } = body;

    // Basic input validation
    if (!source_bookmark_id || !target_bookmark_id || relevance_score === undefined) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: source_bookmark_id, target_bookmark_id, or relevance_score",
        }),
        { status: 400, headers }
      );
    }

    const link_id = uuidv4();

    // Insert the new link
    const { error } = await supabase.from("bookmark_links").insert({
      link_id,
      source_bookmark_id,
      target_bookmark_id,
      relevance_score,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Link created successfully",
        link_id,
        source_bookmark_id,
        target_bookmark_id,
        relevance_score,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("addLink error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});