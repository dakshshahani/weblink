// Background worker for Google OAuth authentication
// Handles user session management and token storage

// Handle popup requests
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getUser") {
    chrome.storage.local.get("googleUser", (data) => {
      sendResponse({ user: data.googleUser || null });
    });
    return true; // keep message channel open for async sendResponse
  }

  if (msg.type === "userUpdate" && msg.user) {
    // Explicitly update user when popup notifies us
    chrome.storage.local.set({ googleUser: msg.user });
    sendResponse({ success: true });
    return true;
  }

  if (msg.type === "logout") {
    // Clear user data on logout
    chrome.storage.local.remove("googleUser");
    sendResponse({ success: true });
    return true;
  }
});

// Listen for storage changes to sync across extension contexts
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.googleUser) {
    console.log("User data updated in storage");
  }
});
