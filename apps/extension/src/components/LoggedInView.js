"use client";
import React, { useState } from "react";

import { supabase } from "../supabaseClient";

export default function LoggedInView() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusBar, setStatusBar] = useState(true);
  const [activityBar, setActivityBar] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);

    if (newState) {
      const url = window.location.href;
      const title = document.title || "Untitled Page";
      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "No description available.";

      try {
        const response = await fetch("https://wzzlkcfytxzccrcyavju.supabase.co/addBookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            title,
            description,
            statusBar,
            activityBar,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Error:", result.error);
          alert("Failed to save bookmark. Please try again.");
          setIsBookmarked(false);
          return;
        }

        alert("Bookmark saved successfully!");
      } catch (err) {
        console.error("Network error:", err);
        alert("Network issue. Please check your connection.");
        setIsBookmarked(false);
      }
    }
  };

  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      {/* === BACKGROUND GLOW === */}
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
          filter: "blur(12px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35) 10%, transparent 70%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* === CONTENT === */}
      <div className="relative z-10 flex flex-col justify-around items-center text-center px-4 py-3 w-full h-full">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="WebLink Logo"
          className="w-9 h-9 mb-2 select-none"
          draggable="false"
        />

        {/* === Bookmark + Tags === */}
        <div className="flex flex-col gap-2 w-[10.3rem] mx-auto">
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
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
            We’ve determined this page links with /input no/ links!
          </p>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-between bg-white text-black text-[9px] font-medium rounded-md h-6 w-full px-2 hover:bg-gray-200 transition"
            >
              <span>Add tags</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-2.5 h-2.5 transition-transform ${
                  showDropdown ? "rotate-180" : "rotate-0"
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Animated dropdown content */}
            <div
              className={`absolute left-0 mt-1 w-full bg-white text-black text-[9px] rounded-md shadow-md border border-gray-200 z-20 p-1.5 space-y-0.5 
                transform transition-all duration-200 ease-out origin-top ${
                  showDropdown
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
            >
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-[2px]">
                <input
                  type="checkbox"
                  className="accent-[#180B62] h-2.5 w-2.5"
                  checked={statusBar}
                  onChange={() => setStatusBar(!statusBar)}
                />
                <span>Status Bar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-[2px]">
                <input
                  type="checkbox"
                  className="accent-[#180B62] h-2.5 w-2.5"
                  checked={activityBar}
                  onChange={() => setActivityBar(!activityBar)}
                />
                <span>Activity Bar</span>
              </label>

              <button
                onClick={() => alert("Add new tag clicked")}
                className="flex items-center gap-2 w-full text-left px-2 py-[2px] rounded hover:bg-gray-100 text-[#180B62] font-medium"
              >
                <span>+ Add a new tag</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-[8px] text-gray-400 mt-3 max-w-[10rem] text-center leading-snug">
          Add tags in addition to the ones we’ve identified.
        </p>
      </div>
    </div>
  );
}
