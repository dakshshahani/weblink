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
    return new Response(JSON.stringify({ error: "Use DELETE method" }), {
      status: 405,
      headers,
    });

  try {
    const url = new URL(req.url);
    const bookmark_id = url.searchParams.get("bookmark_id");
    const tag_id = url.searchParams.get("tag_id");

    if (!bookmark_id || !tag_id)
      return new Response(
        JSON.stringify({ error: "Missing bookmark_id or tag_id" }),
        { status: 400, headers },
      );

    const { error } = await supabase
      .from("bookmark_tags")
      .delete()
      .eq("bookmark_id", bookmark_id)
      .eq("tag_id", tag_id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, bookmark_id, tag_id }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("removeTag error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});