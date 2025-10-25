// apps/extension/server/services/embeddings/generateEmbedding.ts
import OpenAI from "npm:openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

export async function generateEmbedding(text: string) {
  if (!text?.trim()) throw new Error("Empty text for embedding");

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
