// Authentication utility functions
import { setCookie } from './cookieUtils';

// Save authentication tokens with proper cookie settings
export function saveAuthTokens(accessToken, refreshToken, userData) {
  if (accessToken) {
    // Save access token - important for authentication
    document.cookie = `AccessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
    
    // Also save as fallback in localStorage
    localStorage.setItem('AccessToken', accessToken);
  }
  
  if (refreshToken) {
    // Save refresh token - important for maintaining sessions
    document.cookie = `RefreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
    
    // Also save as fallback in localStorage
    localStorage.setItem('RefreshToken', refreshToken);
  }
  
  if (userData) {
    // Save user data
    localStorage.setItem('UserData', JSON.stringify(userData));
  }
  
  return true;
}

// Check if the user is authenticated
export function isAuthenticated() {
  // Check both cookies and localStorage for tokens
  const cookieAccessToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('AccessToken='))
    ?.split('=')[1];
    
  const cookieRefreshToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('RefreshToken='))
    ?.split('=')[1];
    
  const localAccessToken = localStorage.getItem('AccessToken');
  const localRefreshToken = localStorage.getItem('RefreshToken');
  
  // Use either cookie or localStorage tokens
  const accessToken = cookieAccessToken || localAccessToken;
  const refreshToken = cookieRefreshToken || localRefreshToken;
  
  console.log('Auth check tokens:', { 
    cookieAccessToken,
    cookieRefreshToken,
    localAccessToken,
    localRefreshToken,
    finalAccessToken: accessToken,
    finalRefreshToken: refreshToken
  });
  
  return !!(accessToken && refreshToken);
}

// Clear all authentication data
export function logout() {
  // Clear cookies
  document.cookie = 'AccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'RefreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Clear localStorage
  localStorage.removeItem('AccessToken');
  localStorage.removeItem('RefreshToken');
  localStorage.removeItem('UserData');
  
  return true;
}

// Get user data
export function getUserData() {
  const userDataString = localStorage.getItem('UserData');
  if (userDataString) {
    try {
      return JSON.parse(userDataString);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  return null;
}
