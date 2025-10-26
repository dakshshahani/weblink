// apps/extension/server/supabase/functions/generateEmbedding/index.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { supabase } from "../../../../utils/supabaseClient.ts";
import { generateEmbedding } from "../../../../services/embeddings/generateEmbedding.ts";

serve(async (req) => {
  try {
    const { bookmark_id } = await req.json();

    if (!bookmark_id) {
      return new Response("Missing bookmark_id", { status: 400 });
    }

    // 1️⃣ Fetch bookmark text
    const { data: bookmark, error: fetchErr } = await supabase
      .from("bookmarks")
      .select("content")
      .eq("bookmark_id", bookmark_id)
      .single();

    if (fetchErr || !bookmark?.content) {
      console.error("Fetch error:", fetchErr);
      return new Response("Bookmark not found or empty content", {
        status: 404,
      });
    }

    // 2️⃣ Generate embedding
    const { vector, model_used, updated_at } = await generateEmbedding(
      bookmark.content
    );

    // 3️⃣ Store embedding record
    const { error: insertErr } = await supabase.from("embedding").insert([
      {
        bookmark_id,
        vector,
        model_used,
        updated_at,
      },
    ]);

    if (insertErr) {
      console.error("Insert error:", insertErr);
      return new Response("Failed to insert embedding", { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
d