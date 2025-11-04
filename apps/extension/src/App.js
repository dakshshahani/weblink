/* global chrome */
import React, { useEffect, useState } from "react";
import "./App.css";
import LoggedInView from "./components/LoggedInView";
import { BackgroundGlow } from "./components/BackgroundGlow";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_SCOPES,
  GOOGLE_AUTH_URL,
  GOOGLE_TOKEN_URL,
  GOOGLE_USER_INFO_URL,
} from "./config/googleAuth";

// Helper function to get user session from background worker
async function getUserFromBackground() {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: "getUser" }, (response) => {
        resolve(response?.user || null);
      });
    } catch {
      resolve(null);
    }
  });
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Runs once when popup opens
  useEffect(() => {
    const initSession = async () => {
      // Check if user is already logged in via background worker
      const user = await getUserFromBackground();
      if (user) {
        console.log("✅ User from background:", user.email);
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }

      // Check Chrome storage directly as fallback
      try {
        const result = await chrome.storage.local.get(["googleUser"]);
        if (result.googleUser) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error checking storage:", err);
      }

      setLoading(false);
    };

    initSession();
  }, []);

  // 🔹 Google Login Popup Flow using Google OAuth 2.0 directly
  const handleGoogleOAuth = async () => {
    try {
      // Validate client ID is configured
      if (
        !GOOGLE_CLIENT_ID ||
        GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE"
      ) {
        alert("Please configure GOOGLE_CLIENT_ID in src/config/googleAuth.js");
        console.error("Google Client ID not configured");
        return;
      }

      // Get extension ID for redirect URL
      const extensionId = chrome.runtime.id;
      const redirectUrl = `https://${extensionId}.chromiumapp.org/`;

      // Log redirect URL for debugging (user needs to add this to Google Cloud Console)
      console.log("🔗 Extension ID:", extensionId);
      console.log(
        "🔗 Redirect URI to add in Google Cloud Console:",
        redirectUrl
      );

      // Generate state parameter for security
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Build Google OAuth authorization URL
      const authUrl = new URL(GOOGLE_AUTH_URL);
      authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUrl);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", GOOGLE_SCOPES);
      authUrl.searchParams.set("access_type", "offline"); // Required for refresh token
      authUrl.searchParams.set("prompt", "consent"); // Force consent to get refresh token
      authUrl.searchParams.set("state", state);

      // Launch Chrome identity popup for Google login
      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl.toString(),
          interactive: true,
        },
        async (callbackUrl) => {
          if (chrome.runtime.lastError) {
            const error = chrome.runtime.lastError;
            console.error("Auth flow error:", error);

            // Check if it's a redirect_uri_mismatch error
            if (
              error.message &&
              error.message.includes("redirect_uri_mismatch")
            ) {
              const extensionId = chrome.runtime.id;
              const redirectUri = `https://${extensionId}.chromiumapp.org/`;
              alert(
                `Redirect URI Mismatch Error!\n\n` +
                  `Please add this redirect URI to Google Cloud Console:\n\n` +
                  `${redirectUri}\n\n` +
                  `Steps:\n` +
                  `1. Go to https://console.cloud.google.com/apis/credentials\n` +
                  `2. Click on your OAuth 2.0 Client ID\n` +
                  `3. Add "${redirectUri}" to "Authorized redirect URIs"\n` +
                  `4. Save and try again`
              );
            }
            return;
          }

          if (!callbackUrl) {
            console.error("No redirect URL received");
            return;
          }

          console.log("✅ Redirect complete:", callbackUrl);

          try {
            // Parse the callback URL to extract authorization code
            const url = new URL(callbackUrl);

            // Check for OAuth errors in the callback
            const error = url.searchParams.get("error");
            const errorDescription = url.searchParams.get("error_description");

            if (error) {
              console.error("OAuth error:", error, errorDescription);

              if (error === "redirect_uri_mismatch") {
                const extensionId = chrome.runtime.id;
                const redirectUri = `https://${extensionId}.chromiumapp.org/`;
                alert(
                  `Redirect URI Mismatch Error!\n\n` +
                    `Please add this redirect URI to Google Cloud Console:\n\n` +
                    `${redirectUri}\n\n` +
                    `Steps:\n` +
                    `1. Go to https://console.cloud.google.com/apis/credentials\n` +
                    `2. Click on your OAuth 2.0 Client ID\n` +
                    `3. Add "${redirectUri}" to "Authorized redirect URIs"\n` +
                    `4. Save and try again`
                );
              } else {
                alert(
                  `OAuth Error: ${error}\n\n${
                    errorDescription || "Please check the console for details."
                  }`
                );
              }
              return;
            }

            const code = url.searchParams.get("code");
            const returnedState = url.searchParams.get("state");

            // Verify state matches (security check)
            if (returnedState !== state) {
              console.error("State mismatch - possible CSRF attack");
              return;
            }

            if (!code) {
              console.error("No authorization code in redirect URL");
              return;
            }

            // Exchange authorization code for tokens
            const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                code: code,
                client_id: GOOGLE_CLIENT_ID,
                redirect_uri: redirectUrl,
                grant_type: "authorization_code",
              }),
            });

            if (!tokenResponse.ok) {
              const error = await tokenResponse.json();
              console.error("Token exchange error:", error);
              return;
            }

            const tokens = await tokenResponse.json();
            console.log("✅ Tokens received");

            // Get user info from Google API
            const userResponse = await fetch(GOOGLE_USER_INFO_URL, {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            });

            if (!userResponse.ok) {
              console.error("Failed to fetch user info");
              return;
            }

            const userInfo = await userResponse.json();
            console.log("✅ User info:", userInfo);

            // Store tokens and user info
            const userData = {
              ...userInfo,
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expires_at: Date.now() + tokens.expires_in * 1000,
            };

            await chrome.storage.local.set({ googleUser: userData });

            // Notify background worker
            chrome.runtime.sendMessage({
              type: "userUpdate",
              user: userData,
            });

            setIsLoggedIn(true);
            console.log("✅ User logged in:", userInfo.email);
          } catch (err) {
            console.error("Error processing OAuth callback:", err);
          }
        }
      );
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  // 🔹 Loading fallback
  if (loading) {
    return (
      <div className="w-[15rem] h-[15rem] flex items-center justify-center text-white bg-neutral-950">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  // 🔹 Authenticated View
  if (isLoggedIn) {
    return <LoggedInView />;
  }

  // 🔹 Login Screen
  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      <BackgroundGlow />

      <div className="relative z-10 flex flex-col items-center text-center px-3">
        <img
          src="/logo.png"
          alt="WebLink Logo"
          className="w-16 h-16 mb-3 select-none"
          draggable="false"
        />
        <h1 className="text-xl font-semibold mb-1">WebLink</h1>
        <p className="text-xs text-gray-300 mb-4">All your links, linked.</p>

        <button
          onClick={handleGoogleOAuth}
          className="flex items-center justify-center gap-2 w-[13rem] py-2 text-sm font-medium rounded-md transition-transform active:scale-[0.98]"
          style={{ backgroundColor: "#180B62", color: "#fff" }}
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
