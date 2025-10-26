/* global chrome */
import React, { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import LoggedInView from "./components/LoggedInView";
import { BackgroundGlow } from "./components/BackgroundGlow";

// Helper function (no hooks inside — safe)
async function getSessionFromBackground() {
  return new Promise((resolve) => {
    // Ask background worker for existing Supabase session
    try {
      chrome.runtime.sendMessage({ type: "getSession" }, (response) => {
        resolve(response?.session || null);
      });
    } catch {
      // If not in extension context (like localhost dev)
      resolve(null);
    }
  });
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Runs once when popup opens
  useEffect(() => {
    const initSession = async () => {
      // 1️⃣ Try background first
      const bgSession = await getSessionFromBackground();
      if (bgSession) {
        console.log("✅ Session from background:", bgSession.user.email);
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }

      // 2️⃣ Fallback to session from Supabase client
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setLoading(false);
    };

    initSession();

    // 🔹 Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Google Login Popup Flow
  const handleGoogleOAuth = async () => {
  try {
    // Ask Supabase for the login URL (no auto redirect)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { skipBrowserRedirect: true },
    });

    if (error) throw error;
    if (!data?.url) return;

    // Launch Chrome identity popup for Google login
    chrome.identity.launchWebAuthFlow(
      {
        url: data.url,
        interactive: true,
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Auth flow cancelled:", chrome.runtime.lastError);
          return;
        }

        console.log("✅ Redirect complete:", redirectUrl);

        // Ask Supabase client to refresh its session (tokens are now stored)
        const {
          data: { session },
          error: sessErr,
        } = await supabase.auth.getSession();

        if (sessErr) {
          console.error("Session error:", sessErr);
          return;
        }

        if (session?.user) {
          console.log("✅ User logged in:", session.user.email);
          setIsLoggedIn(true);
        } else {
          console.warn("No session loaded after redirect");
        }
      }
    );
  } catch (err) {
    console.error("OAuth error:", err);
  }
};

  // 🔹 Loading fallback
  if (loading) {
    return (
      <div className="w-[15rem] h-[15rem] flex items-center justify-center text-white bg-neutral-950">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  // 🔹 Authenticated View
  if (isLoggedIn) {
    return <LoggedInView />;
  }

  // 🔹 Login Screen
  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      <BackgroundGlow />

      <div className="relative z-10 flex flex-col items-center text-center px-3">
        <img
          src="/logo.png"
          alt="WebLink Logo"
          className="w-16 h-16 mb-3 select-none"
          draggable="false"
        />
        <h1 className="text-xl font-semibold mb-1">WebLink</h1>
        <p className="text-xs text-gray-300 mb-4">All your links, linked.</p>

        <button
          onClick={handleGoogleOAuth}
          className="flex items-center justify-center gap-2 w-[13rem] py-2 text-sm font-medium rounded-md transition-transform active:scale-[0.98]"
          style={{ backgroundColor: "#180B62", color: "#fff" }}
        >
          <span>Start linking with</span>
          <img
            src="/google.svg"
            alt="Google logo"
            className="w-4 h-4"
            draggable="false"
          />
        </button>
      </div>
    </div>
  );
}