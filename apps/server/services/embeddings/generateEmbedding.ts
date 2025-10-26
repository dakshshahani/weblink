// apps/server/services/embeddings/generateEmbedding.ts

// replace this
// import OpenAI from "npm:openai";
// with this
import OpenAI from "https://esm.sh/openai@4.61.0"; // or latest version

/**
 * Generates an embedding vector for given text using OpenAI.
 *
 * @param text - Text to embed (title, description, etc.)
 * @returns { vector, model_used, updated_at }
 */
export async function generateEmbedding(text: string) {
  if (!text?.trim()) {
    throw new Error("generateEmbedding: empty or invalid text input");
  }

  const openAIKey = Deno.env.get("OPENAI_API_KEY");
  if (!openAIKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  // Initialize OpenAI client with your API key
  const openai = new OpenAI({ apiKey: openAIKey });

  // Request an embedding
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const vector = response.data[0].embedding;

  return {
    vector,
    model_used: "text-embedding-3-small",
    updated_at: new Date().toISOString(),
  };
}
