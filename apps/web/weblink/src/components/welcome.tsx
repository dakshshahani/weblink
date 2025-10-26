"use client";

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
      <h1 className="text-4xl font-bold mb-2">Welcome to Weblink</h1>
      <p className="text-gray-300 mb-6">All your links, linked.</p>
      <Button className="py-2 px-8" onClick={handleGoogleOAuth}> Start linking with  <Image src="/google.svg" alt="google" width={15} height={15} /></Button>
      </div>
  );
}