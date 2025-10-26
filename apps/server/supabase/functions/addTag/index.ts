import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // CORS pre‑flight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json();
    const { bookmark_id, tag_name } = body;

    if (!bookmark_id || !tag_name) {
      return new Response(
        JSON.stringify({ error: "Missing bookmark_id or tag_name" }),
        { status: 400, headers }
      );
    }

    // Check if tag already exists (case‑insensitive)
    const { data: existingTag, error: findError } = await supabase
      .from("Tag")
      .select("*")
      .ilike("name", tag_name)
      .limit(1)
      .single();

    if (findError && findError.code !== "PGRST116") throw findError;

    let tag_id: string;

    // Create the tag if it doesn’t exist
    if (!existingTag) {
      tag_id = uuidv4();
      const { error } = await supabase
        .from("Tag")
        .insert({ tag_id, name: tag_name });
      if (error) throw error;
    } else {
      tag_id = existingTag.tag_id;
    }

    // Link tag to bookmark
    const { error: linkError } = await supabase
      .from("bookmark_tags")
      .insert({ bookmark_id, tag_id });
    if (linkError && !linkError.message.includes("duplicate"))
      throw linkError;

    return new Response(
      JSON.stringify({
        success: true,
        tag_id,
        bookmark_id,
        tag_name,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("addTag error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});