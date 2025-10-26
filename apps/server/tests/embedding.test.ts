// apps/server/tests/embedding.test.ts
import OpenAI from "npm:openai";
import { generateEmbedding } from "../services/embeddings/generateEmbedding.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.203.0/testing/asserts.ts";

Deno.test("generateEmbedding works correctly", async () => {
  const text = "Testing bookmarks for embedded systems";
  const { vector, model_used, updated_at } = await generateEmbedding(text);

  // Verify results
  console.log("Model used:", model_used);
  console.log("Updated at:", updated_at);
  console.log("Vector preview:", vector.slice(0, 5)); // first 5 numbers

  // Assertions
  assert(Array.isArray(vector), "vector should be an array");
  assertEquals(model_used, "text-embedding-3-small");
  assert(vector.length > 1000, "expected embedding length around 1536");
});
