import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://wzzlkcfytxzccrcyavju.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6emxrY2Z5dHh6Y2NyY3lhdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDY4MjMsImV4cCI6MjA3NjkyMjgyM30.LVXzxQF5DzXXWn-zpLphl2v_83WtcT3fyMrv--KT1LY",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: {
        getItem: async (key) => {
          const data = await chrome.storage.local.get(key);
          return data[key];
        },
        setItem: async (key, value) => {
          await chrome.storage.local.set({ [key]: value });
        },
        removeItem: async (key) => {
          await chrome.storage.local.remove(key);
        },
      },
    },
  }
);

// Start listening for updates
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    await chrome.storage.local.set({ supabaseSession: session });
  } else {
    await chrome.storage.local.remove("supabaseSession");
  }
});

// 🧠 Keep session auto-refresh active
supabase.auth.startAutoRefresh();

// Handle popup requests
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getSession") {
    chrome.storage.local.get("supabaseSession", (data) => {
      sendResponse({ session: data.supabaseSession || null });
    });
    return true; // keep message channel open for async sendResponse
  }
});