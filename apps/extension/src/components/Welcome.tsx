"use client";

import React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <img
        src="../../public/logo.png"
        alt="Logo"
        width={140}
        height={140}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold mb-2">Welcome to Weblink</h1>
      <p className="text-gray-300 mb-6">All your links, linked.</p>
      <Button className="py-2 px-8" onClick={() => setOpen(true)}>
        {" "}
        Start linking with{" "}
        <img src="../public/google.svg" alt="google" width={15} height={15} />
      </Button>
    </div>
  );
}
