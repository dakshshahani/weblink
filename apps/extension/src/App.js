import React, { useState } from "react";
import "./App.css";
import LoggedInView from "./components/LoggedInView.js";
import { BackgroundGlow } from "./components/BackgroundGlow.js";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <LoggedInView />;
  }

  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      <BackgroundGlow />

      {/* === LOGO + TEXT === */}
      <div className="relative z-10 flex flex-col items-center text-center px-3">
        <img
          src="/logo.png"
          alt="WebLink Logo"
          className="w-16 h-16 mb-3 select-none"
          draggable="false"
        />
        <h1 className="text-xl font-semibold mb-1">WebLink</h1>
        <p className="text-xs text-gray-300 mb-4">All your links, linked.</p>

        {/* === GOOGLE SIGN-IN BUTTON — logo on right, color #180B62 === */}
        <button
          onClick={() => setIsLoggedIn(true)}
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
