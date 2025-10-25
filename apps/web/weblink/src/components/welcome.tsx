"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
      <Image
        src="/logo.png"
        alt="Logo"
        width={140}
        height={140}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold mb-2">Welcome to NodeBook</h1>
      <p className="text-gray-300 mb-6">All your links, linked.</p>

      <Button className="py-2 px-8" onClick={() => setOpen(true)}>Start</Button>

      {/* --- Main Welcome Dialog --- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Welcome to NodeBook</DialogTitle>
            <DialogDescription>
              Login or create an account to sync your links!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex justify-center gap-6">
            <Button
              variant={!login ? "secondary" : "default"}
              onClick={() => {
                setLogin(true);
                setSignup(false);
                setOpen(false);
              }}
            >
              Login
            </Button>

            <Button
              variant={!signup ? "secondary" : "default"}
              onClick={() => {
                setSignup(true);
                setLogin(false);
                setOpen(false);
              }}
            >
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Login Dialog --- */}
      <Dialog open={login} onOpenChange={setLogin}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Login to NodeBook</DialogTitle>
            <DialogDescription>
              Enter your credentials to continue.
            </DialogDescription>
          </DialogHeader>

          <form className="flex flex-col gap-4 mt-4">
            <input
              type="email"
              placeholder="Email"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setLogin(false)}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant={isLoginFilled ? "default" : "secondary"}
                disabled={!isLoginFilled}
                onClick={() => {
                  // TODO: handle backend login
                }}
              >
                Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Signup Dialog --- */}
      <Dialog open={signup} onOpenChange={setSignup}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Create an Account</DialogTitle>
            <DialogDescription>
              Fill in your details to get started.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
              }
              setError("");
              // TODO: handle backend signup
            }}
          >
            <input
              type="text"
              placeholder="Name"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className={`px-3 py-2 rounded border focus:outline-none focus:ring ${
                !passwordsMatch && confirmPassword
                  ? "border-red-500 focus:ring-red-600 bg-gray-800"
                  : "border-gray-700 focus:ring-blue-600 bg-gray-800"
              }`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (password !== e.target.value) {
                  setError("Passwords do not match");
                } else {
                  setError("");
                }
              }}
            />

            {error && (
              <p className="text-red-500 text-sm font-medium -mt-2">{error}</p>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setSignup(false)}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant={isSignupFilled ? "default" : "secondary"}
                disabled={!isSignupFilled}
              >
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}