
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";
import { generateEmbedding } from "../../../services/embeddings/generateEmbedding.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // Handle CORS preflight
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
    const { bookmark_id, user_id, title, url, description } = body;

    if (!bookmark_id || !user_id || !title || !url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers }
      );
    }

    console.log(`Generating embedding for bookmark: ${bookmark_id}`);

    // Generate embedding from title + description + URL
    const textToEmbed = `${title}. ${description || ""} ${url}`;
    const vector = await generateEmbedding(textToEmbed);

    // Find similar existing bookmarks before inserting the new one
    const { data: existingEmbeddings, error: fetchError } = await supabase
      .from("embeddings")
      .select("bookmark_id, vector")
      .neq("bookmark_id", bookmark_id);

    if (fetchError) throw fetchError;

    let similar: { bookmark_id: string; similarity: number }[] = [];

    if (existingEmbeddings && existingEmbeddings.length > 0) {
      // Run similarity manually using the SQL RPC
      const { data: matches, error: simError } = await supabase.rpc(
        "match_bookmarks",
        {
          query_embedding: vector,
          match_threshold: 0.7,
          match_count: 5,
          user_id,
        }
      );
      if (simError) throw simError;

      similar = matches?.filter((m) => m.bookmark_id !== bookmark_id) || [];
    }

    // insert the embedding for this new bookmark
    const { error: embedError } = await supabase.from("embeddings").insert([
      {
        bookmark_id,
        vector,
        model_used: "text-embedding-3-small",
        updated_at: new Date().toISOString(),
      },
    ]);
    if (embedError) throw embedError;

    //Link this bookmark to previously existing similar ones
    if (similar.length > 0) {
      const links = similar.map((sim) => ({
        link_id: uuidv4(),
        source_bookmark_id: bookmark_id,
        target_bookmark_id: sim.bookmark_id,
        relevance_score: sim.similarity,
        user_id,
        created_at: new Date().toISOString(),
      }));

      const { error: linkError } = await supabase
        .from("bookmark_links")
        .insert(links);

      if (linkError) throw linkError;
      console.log(`Linked ${links.length} related bookmarks`);
    } else {
      console.log("No related bookmarks found");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Embedding generated & linked to similar bookmarks",
        related_count: similar.length,
      }),
      { headers, status: 200 }
    );
  } catch (err) {
    console.error("Embedding Function Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});


