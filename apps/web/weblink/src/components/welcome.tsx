"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { handleGoogleOAuth } from "@/lib/supabaseAuth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Welcome() {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  // individual form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Mouse tracking for gradient animation
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const animationRef = useRef<number | null>(null);

  // Validation checks
  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;
  const isLoginFilled = email.trim() !== "" && password.trim() !== "";
  const isSignupFilled =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    passwordsMatch;

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse to a smaller range around center (40-60%) for subtlety
      const x = 50 + ((e.clientX / window.innerWidth - 0.5) * 20);
      const y = 50 + ((e.clientY / window.innerHeight - 0.5) * 20);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth gradient animation effect
  useEffect(() => {
    const animateGradient = () => {
      setGradientPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.005, // Extremely slow easing
        y: prev.y + (mousePosition.y - prev.y) * 0.005
      }));
      animationRef.current = requestAnimationFrame(animateGradient);
    };

    animationRef.current = requestAnimationFrame(animateGradient);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-white transition-all duration-2000 ease-out"
      style={{
        background: `radial-gradient(400% 400% at ${gradientPosition.x}% ${gradientPosition.y}%, #AD6B32 0%, #180E57 16.48%, #161340 24.88%, #100D25 35%, #000 100%)`
      }}
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={140}
        height={140}
        className="mb-6"
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