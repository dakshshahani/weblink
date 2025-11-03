import React from "react";
import { Button } from "./ui/button";

export function BookmarkButton({ onBookmark, className }) {
  const handleClick = () => {
    if (onBookmark) {
      onBookmark();
    } else {
      // Default behavior
      console.log("Bookmark this page clicked");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`flex items-center justify-between bg-white text-black text-[9px] font-medium rounded-md h-6 px-2 hover:bg-gray-200 transition-colors ${
        className || ""
      }`}
      variant="ghost"
    >
      <span>Bookmark this page</span>
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
    </Button>
  );
}
