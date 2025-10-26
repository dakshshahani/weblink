import React from "react";
import "./App.css";

export default function App() {
  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      {/* === GLOW BACKGROUND === */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 85%,
              rgba(189, 108, 38, 0.35) 0%,       /* orange glow */
              rgba(113, 40, 120, 0.25) 35%,      /* violet */
              rgba(24, 11, 98, 0.35) 60%,        /* indigo */
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

        {/* === ONE BUTTON WITH GOOGLE ICON ON THE RIGHT === */}
        <button
          onClick={() => alert("Google Sign-In coming soon 🚀")}
          className="flex items-center justify-center gap-2 w-[13rem] py-1.5 bg-white text-black text-sm font-medium rounded-md shadow-sm hover:bg-gray-100 transition border border-gray-200"
        >
          {/* Text first, logo second */}
          <span>Sign in with Google</span>
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