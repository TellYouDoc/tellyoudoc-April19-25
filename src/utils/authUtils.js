// Authentication utility functions
import { setCookie, getCookie } from "./cookieUtils";

// Save authentication tokens with proper cookie settings
export function saveAuthTokens(accessToken, refreshToken, userData) {
  if (accessToken) {
    // Save access token - important for authentication
    document.cookie = `AccessToken=${accessToken}; path=/; max-age=${
      60 * 60 * 24 * 30
    }; samesite=strict`;

    // Also save as fallback in localStorage
    localStorage.setItem("AccessToken", accessToken);
  }

  if (refreshToken) {
    // Save refresh token - important for maintaining sessions
    document.cookie = `RefreshToken=${refreshToken}; path=/; max-age=${
      60 * 60 * 24 * 30
    }; samesite=strict`;

    // Also save as fallback in localStorage
    localStorage.setItem("RefreshToken", refreshToken);
  }

  if (userData) {
    // Save user data
    localStorage.setItem("UserData", JSON.stringify(userData));
  }

  return true;
}

// Check if the user is authenticated
export function isAuthenticated() {
  // Check both cookies and localStorage for tokens
  const cookieAccessToken = getCookie("AccessToken");
  const cookieRefreshToken = getCookie("RefreshToken");

  const localAccessToken = localStorage.getItem("AccessToken");
  const localRefreshToken = localStorage.getItem("RefreshToken");

  // Use either cookie or localStorage tokens
  const accessToken = cookieAccessToken || localAccessToken;
  const refreshToken = cookieRefreshToken || localRefreshToken;

  // Synchronize cookie and localStorage if they're mismatched but valid
  if (accessToken && refreshToken) {
    // If cookie exists but localStorage doesn't, update localStorage
    if (cookieAccessToken && !localAccessToken) {
      localStorage.setItem("AccessToken", cookieAccessToken);
    }

    // If localStorage exists but cookie doesn't, update cookie
    if (localAccessToken && !cookieAccessToken) {
      document.cookie = `AccessToken=${localAccessToken}; path=/; max-age=${
        60 * 60 * 24 * 30
      }; samesite=strict`;
    }

    // Do the same for refresh token
    if (cookieRefreshToken && !localRefreshToken) {
      localStorage.setItem("RefreshToken", cookieRefreshToken);
    }

    if (localRefreshToken && !cookieRefreshToken) {
      document.cookie = `RefreshToken=${localRefreshToken}; path=/; max-age=${
        60 * 60 * 24 * 30
      }; samesite=strict`;
    }

    // Also update the current page in case of refresh
    const currentPath = window.location.pathname;
    if (
      currentPath &&
      currentPath !== "/" &&
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      currentPath !== "/partner" &&
      currentPath !== "/home" &&
      !currentPath.startsWith("/admin")
    ) {
      localStorage.setItem("lastViewedPage", currentPath);
    }
  }

  return !!(accessToken && refreshToken);
}

// Remove all authentication data (logout)
export function clearAuthData() {
  // Clear cookies
  document.cookie =
    "AccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
  document.cookie =
    "RefreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";

  // Clear localStorage
  localStorage.removeItem("AccessToken");
  localStorage.removeItem("RefreshToken");
  localStorage.removeItem("UserData");
}

// Get user data
export function getUserData() {
  const userDataString = localStorage.getItem("UserData");
  if (userDataString) {
    try {
      return JSON.parse(userDataString);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
  return null;
}
