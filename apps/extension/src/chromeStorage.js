/* global chrome */

// Safely check if we're running inside a Chrome extension
const hasChromeStorage =
  typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

// A lightweight storage adapter compatible with both Chrome extension and web
export const chromeStorageAdapter = {
  getItem: async (key) => {
    if (hasChromeStorage) {
      const result = await chrome.storage.local.get([key]);
      return result[key] ?? null;
    } else {
      // fallback to localStorage when running on localhost
      return localStorage.getItem(key);
    }
  },
  setItem: async (key, value) => {
    if (hasChromeStorage) {
      await chrome.storage.local.set({ [key]: value });
    } else {
      localStorage.setItem(key, value);
    }
  },
  removeItem: async (key) => {
    if (hasChromeStorage) {
      await chrome.storage.local.remove(key);
    } else {
      localStorage.removeItem(key);
    }
  },
};