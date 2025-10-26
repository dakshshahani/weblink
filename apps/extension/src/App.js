/* global chrome */
import React, { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import LoggedInView from "./components/LoggedInView.js";
import { BackgroundGlow } from "./components/BackgroundGlow.js";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1️⃣  Check for session on mount
  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setLoading(false);
    };
    initSession();

    // 2️⃣  Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3️⃣  Google sign‑in handler
  const handleGoogleOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: chrome.identity.getRedirectURL(), // 🧭 required for Chrome extension
      },
    });
    if (error) console.error("Login Error:", error.message);
  };

  // 4️⃣  Loading fallback (optional)
  if (loading) {
    return (
      <div className="w-[15rem] h-[15rem] flex items-center justify-center text-white bg-neutral-950">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  // 5️⃣  If logged in → render dashboard; otherwise → sign‑in view
  if (isLoggedIn) {
    return <LoggedInView />;
  }

  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      <BackgroundGlow />

      {/* === LOGIN UI === */}
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
          style={{
            backgroundColor: "#180B62",
            color: "#fff",
          }}
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