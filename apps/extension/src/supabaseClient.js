import { createClient } from "@supabase/supabase-js";
import { chromeStorageAdapter } from "./chromeStorage";

export const supabase = createClient(
  "https://wzzlkcfytxzccrcyavju.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6emxrY2Z5dHh6Y2NyY3lhdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDY4MjMsImV4cCI6MjA3NjkyMjgyM30.LVXzxQF5DzXXWn-zpLphl2v_83WtcT3fyMrv--KT1LY",
  {
    auth: {
      storage: chromeStorageAdapter, // 👈 use persistent chrome.storage
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);