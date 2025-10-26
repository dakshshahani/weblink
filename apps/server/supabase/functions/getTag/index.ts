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
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameter: user_id" }),
        { status: 400, headers },
      );
    }

const { data, error } = await supabase
      .from("Tag") 
      .select("tag_id, user_id, name, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });



    

   

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        user_id,
        count: data?.length ?? 0,
        tags: data ?? [],
      }),
      { status: 200, headers },
    );
  } catch (err) {
    console.error("getTags error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});