"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

// 🧩 Initialize your Supabase client (only once)
const supabase = createClient(
  "<YOUR_SUPABASE_URL>",
  "<YOUR_SUPABASE_ANON_KEY>"
);

export default function LoggedInView() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusBar, setStatusBar] = useState(true);
  const [activityBar, setActivityBar] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Fetch current user session
  useEffect(() => {
    async function getUser() {
      // Get the currently logged-in user (if any)
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        console.log("✅ Logged-in user:", session.user);
      } else {
        console.log("No active session");
      }
    }

    getUser();

    // Optional: subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🧠 Function to call your Supabase Edge Function
  async function handleAddBookmark() {
    if (!user) {
      alert("Please log in first to add a bookmark.");
      return;
    }

    try {
      const functionUrl =
        "https://wzzlkcfytxzccrcyavju.functions.supabase.co/addBookmark";

      const payload = {
        user_id: user.id, // ✅ now dynamic!
        url: "https://example.com",
        title: "Example Bookmark",
        description: "this is a test"
      };

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(
            await supabase.auth.getSession()
          ).data.session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Edge function error:", errText);
        alert(`Failed to add bookmark: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Bookmark added successfully:", data);
      setIsBookmarked(true);
    } catch (error) {
      console.error("❌ Error adding bookmark:", error);
      alert("Something went wrong. Check console for details.");
    }
  }

  // === same UI code as before ===
  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 85%,
              rgba(189,108,38,0.35) 0%,
              rgba(113,40,120,0.25) 35%,
              rgba(24,11,98,0.35) 60%,
              transparent 90%
            )
          `,
          transform: "translateY(10%) scale(1.1)",
          filter: "blur(12px)"
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35) 10%, transparent 70%)",
          mixBlendMode: "multiply"
        }}
      />

      {/* === CONTENT === */}
      <div className="relative z-10 flex flex-col justify-around items-center text-center px-4 py-3 w-full h-full">
        <img
          src="/logo.png"
          alt="WebLink Logo"
          className="w-9 h-9 mb-2 select-none"
          draggable="false"
        />

        <div className="flex flex-col gap-2 w-[10.3rem] mx-auto">
          <button
            onClick={handleAddBookmark}
            disabled={isBookmarked}
            className={`flex items-center justify-between text-[9px] font-medium rounded-md h-6 px-2 transition-colors ${
              isBookmarked
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            <span>
              {isBookmarked ? "Bookmark saved!" : "Bookmark this page"}
            </span>
            {isBookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-2.5 h-2.5 text-green-600"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-2.5 h-2.5"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            )}
          </button>

          {/* Subtitle */}
          <p className="text-[9px] text-gray-300 leading-snug max-w-[11rem]">
            {user
              ? `Logged in as ${user.email}`
              : "Please log in to save bookmarks."}
          </p>
        </div>
      </div>
    </div>
  );
}