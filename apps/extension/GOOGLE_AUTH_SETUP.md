# Google OAuth 2.0 Setup Guide

This extension uses Google OAuth 2.0 directly (not through Supabase Auth) for authentication.

## Setup Steps

### 1. Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Chrome App** as the application type
6. Copy your **Client ID**

### 2. Configure Extension Redirect URL

1. In Google Cloud Console, under your OAuth 2.0 Client ID settings
2. Add your extension's redirect URL to **Authorized redirect URIs**:

   ```
   https://YOUR_EXTENSION_ID.chromiumapp.org/
   ```

   **How to find your Extension ID:**

   - Load the extension in Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Your Extension ID will be displayed (a long string)

### 3. Configure Client ID in Extension

**Option A: Set in code (for development)**

1. Open `src/config/googleAuth.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```javascript
   export const GOOGLE_CLIENT_ID =
     "your-actual-client-id-here.apps.googleusercontent.com";
   ```

**Option B: Use environment variable (recommended for production)**

1. Create a `.env` file in the extension directory:
   ```
   GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   ```
2. The webpack config will automatically pick it up during build

### 4. Required OAuth Scopes

The extension requests the following scopes:

- `https://www.googleapis.com/auth/userinfo.email` - User's email address
- `https://www.googleapis.com/auth/userinfo.profile` - User's basic profile info

Make sure these scopes are enabled in your Google Cloud Console project.

### 5. Enable Required APIs

In Google Cloud Console:

1. Go to **APIs & Services** → **Library**
2. Enable **Google+ API** (or **People API**)

### 6. Build and Load Extension

1. Build the extension:

   ```bash
   npm run build
   ```

2. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Testing

After setup, clicking "Start linking with Google" in the extension popup should:

1. Open a Google sign-in popup
2. After authentication, close the popup
3. Show the logged-in view in the extension popup (not in the OAuth popup)

## Troubleshooting

- **"Please configure GOOGLE_CLIENT_ID" error**: Make sure you've set the Client ID in `src/config/googleAuth.js`
- **Redirect URI mismatch**: Verify the redirect URL in Google Cloud Console matches exactly: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
- **OAuth popup doesn't close**: Check browser console for errors, ensure redirect URL is correctly configured
- **Extension opens in login popup**: This should be fixed - ensure you've rebuilt after the latest changes
