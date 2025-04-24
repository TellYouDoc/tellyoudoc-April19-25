// Cookie helper functions

// Check if cookies are accepted
export function areCookiesAccepted() {
  return localStorage.getItem('cookiesAccepted') === 'true';
}

// Get cookie value by name (checks both cookies and localStorage fallback)
export function getCookie(name) {
    
  // First check regular cookies
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  
  // If not found and we're using fallbacks, check localStorage
  const fallbackValue = localStorage.getItem(`cookie_fallback_${name}`);
  if (fallbackValue) {
    return fallbackValue;
  }
  
  // Also check the regular localStorage (for backward compatibility)
  return localStorage.getItem(name);
}

// Set cookie with options (only if consent is given)
export function setCookie(name, value, options = {}) {
  // Check if this is an essential cookie or if user has accepted cookies
  const isEssential = options.essential === true;
  const cookiesAccepted = areCookiesAccepted();
  
  // Only set cookie if it's essential or user has given consent
  if (isEssential || cookiesAccepted) {
    const defaultOptions = {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      sameSite: 'strict'
    };
    
    const cookieOptions = { ...defaultOptions, ...options };
    let cookieString = `${name}=${value}; path=${cookieOptions.path}`;
    
    if (cookieOptions.maxAge) {
      cookieString += `; max-age=${cookieOptions.maxAge}`;
    }
    
    if (cookieOptions.sameSite) {
      cookieString += `; samesite=${cookieOptions.sameSite}`;
    }
    
    if (cookieOptions.secure) {
      cookieString += '; secure';
    }
    
    document.cookie = cookieString;
    return true;
  }
  
  // If cookies are not accepted and it's not essential, store in localStorage as fallback
  if (!isEssential && !cookiesAccepted) {
    localStorage.setItem(`cookie_fallback_${name}`, value);
    return false;
  }
}

// Remove cookie (handles both cookie and localStorage fallback)
export function removeCookie(name) {
  // Remove actual cookie
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  
  // Remove fallback from localStorage
  localStorage.removeItem(`cookie_fallback_${name}`);
  
  // Remove from regular localStorage too (for backward compatibility)
  localStorage.removeItem(name);
}
