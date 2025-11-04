// Google OAuth 2.0 Configuration
// Get your Client ID from: https://console.cloud.google.com/apis/credentials
// Make sure to add your extension redirect URL: https://YOUR_EXTENSION_ID.chromiumapp.org/

export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "42599562957-r3cr5luuqjajaneqdn4lkpimt2bp6giu.apps.googleusercontent.com";

// Google OAuth scopes
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

// Google OAuth endpoints
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USER_INFO_URL =
  "https://www.googleapis.com/oauth2/v2/userinfo";
