import React from "react";
import { cn } from "./lib/utils";

export function BackgroundGlow({ className, intensity = 100 }) {
  // clamp intensity 0–100 and convert to 0–1 for opacity
  const o = Math.max(0, Math.min(100, intensity)) / 100;

  return (
    <>
      {/* GLOW LAYER */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(
              120% 70% at 50% 115%,
              rgba(255, 214, 94, ${0.85 * o}) 0%,
              rgba(255, 115, 170, ${0.65 * o}) 32%,
              rgba(108, 55, 255, ${0.55 * o}) 55%,
              rgba(0, 0, 0, 0) 70%
            )
          `,
          filter: "blur(12px)",
          transform: "translateZ(0)",
        }}
      />

      {/* SUBTLE VIGNETTE TO DARKEN CORNERS */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(120% 100% at 50% 120%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 75%),
            radial-gradient(100% 80% at 50% -10%, rgba(0,0,0,0.20), rgba(0,0,0,0.55))
          `,
          mixBlendMode: "multiply",
        }}
      />

      {/* OPTIONAL: a faint grain for texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2248%22 height=%2248%22 filter=%22url(%23n)%22 opacity=%220.25%22/></svg>')",
          backgroundSize: "auto",
        }}
      />
    </>
  );
}
