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
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  if (req.method !== "DELETE")
    return new Response(JSON.stringify({ error: "Use DELETE" }), {
      status: 405,
      headers,
    });

  try {
    const url = new URL(req.url);
    const tag_id = url.searchParams.get("tag_id");

    if (!tag_id)
      return new Response(JSON.stringify({ error: "Missing tag_id" }), {
        status: 400,
        headers,
      });

    // Delete relationships in join table first
    await supabase.from("bookmark_tags").delete().eq("tag_id", tag_id);

    // Delete the tag itself
    const { error } = await supabase.from("Tag").delete().eq("tag_id", tag_id);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, tag_id }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("deleteTag error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});