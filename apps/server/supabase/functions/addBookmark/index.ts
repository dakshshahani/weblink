import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // Handle CORS pre-flight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await req.json();
    const { user_id, title, url, description, favicon_url } = body;

    if (!url || !user_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: url or user_id",
        }),
        { status: 400, headers }
      );
    }

    const bookmark_id = uuidv4();

    const { error } = await supabase.from("Bookmark").insert({
      bookmark_id,
      user_id,
      title,
      url,
      description,
      favicon_url,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bookmark added successfully",
        bookmark_id,
      }),
      { headers, status: 200 }
    );
  } catch (err) {
    console.error("Add bookmark error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers }
    );
  }
});