import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (req.method === "OPTIONS")
    return new Response("ok", { headers });

  if (req.method !== "DELETE")
    return new Response(JSON.stringify({ error: "Use DELETE" }), {
      status: 405,
      headers,
    });

  try {
    const url = new URL(req.url);
    const bookmark_id = url.searchParams.get("bookmark_id");

    if (!bookmark_id)
      return new Response(
        JSON.stringify({ error: "Missing bookmark_id param" }),
        { status: 400, headers },
      );

    // Delete related tags and links first (FK cleanup)
    await supabase.from("bookmark_tags").delete().eq("bookmark_id", bookmark_id);
    await supabase.from("bookmark_links").delete().or(`source_bookmark_id.eq.${bookmark_id},target_bookmark_id.eq.${bookmark_id}`);

    // Then delete the bookmark
    const { error } = await supabase.from("Bookmark").delete().eq("bookmark_id", bookmark_id);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, bookmark_id }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("deleteBookmark error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});