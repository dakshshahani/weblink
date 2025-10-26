
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client using service role key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // Common headers for all responses (CORS + JSON)
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Handle OPTIONS (preflight) requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  }

  // Allow only GET
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use GET." }),
      { status: 405, headers }
    );
  }

  try {
    // Pull ?user_id=... from query parameters
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameter: user_id" }),
        { status: 400, headers }
      );
    }

    // Fetch all bookmarks belonging to this user
    const { data, error } = await supabase
      .from("Bookmark") // 👈 change to lowercase if your table is lowercase
      .select(
        "bookmark_id, user_id, title, url, description, favicon_url, created_at"
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        count: data?.length ?? 0,
        bookmarks: data ?? [],
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("getBookmarks error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers }
    );
  }
});