# Fix Redirect URI Mismatch Error

If you're seeing the error: **"Error 400: redirect_uri_mismatch"**, follow these steps:

## Quick Fix Steps

### 1. Find Your Extension ID

1. Open Chrome and go to `chrome://extensions/`
2. Make sure "Developer mode" is enabled (toggle in top right)
3. Find your WebLink extension
4. Copy the **Extension ID** (it's a long string like `abcdefghijklmnopqrstuvwxyz123456`)

OR

1. Open the extension popup
2. Open the browser console (right-click extension popup → Inspect → Console tab)
3. Click the "Start linking with Google" button
4. You'll see in the console:
   ```
   🔗 Extension ID: YOUR_EXTENSION_ID_HERE
   🔗 Redirect URI to add in Google Cloud Console: https://YOUR_EXTENSION_ID_HERE.chromiumapp.org/
   ```

### 2. Add Redirect URI to Google Cloud Console

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Select your project (the one with your OAuth Client ID)
3. Click on your **OAuth 2.0 Client ID** (the one ending in `.apps.googleusercontent.com`)
4. Scroll down to **Authorized redirect URIs**
5. Click **+ ADD URI**
6. Add this URI (replace `YOUR_EXTENSION_ID` with your actual extension ID):

   ```
   https://YOUR_EXTENSION_ID.chromiumapp.org/
   ```

   **Important:**

   - Must start with `https://`
   - Must end with `/`
   - Must match exactly (case-sensitive)

7. Click **SAVE**

### 3. Test Again

1. Reload your extension in Chrome (`chrome://extensions/` → click reload icon)
2. Try signing in again
3. The error should be resolved!

## Troubleshooting

**Still getting the error?**

- Double-check the redirect URI is entered **exactly** as shown above
- Make sure there are no extra spaces before or after
- Wait a few minutes after saving - Google sometimes takes time to propagate changes
- Try clearing your browser cache and cookies
- Check that you're using the correct OAuth Client ID in `src/config/googleAuth.js`

**The redirect URI format is correct:**

- ✅ `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`
- ❌ `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org` (missing trailing slash)
- ❌ `http://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/` (must be https)
- ❌ `https://YOUR_EXTENSION_ID.chromiumapp.org/` (must use actual ID)

## Alternative: See Error Details

After rebuilding, if you still get the error, the extension will now show an alert with:

- Your exact redirect URI
- Direct link to Google Cloud Console
- Step-by-step instructions
