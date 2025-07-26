# PWA Manifest Documentation

## What is manifest.json?
The `manifest.json` file enables Progressive Web App (PWA) features, allowing users to "install" your website as an app on their devices. This improves user engagement and mobile experience, which positively impacts SEO.

## Properties Explained:

### Basic Information
- **name**: Full name of the application - appears in app stores and installation prompts
- **short_name**: Used when there's limited space (home screen, app launcher)
- **description**: Explains what the app does to users and search engines

### App Behavior
- **start_url**: The page that loads when the app is launched
- **display**: How the app appears when launched
  - `"standalone"`: Removes browser UI, looks like a native app
- **orientation**: Preferred screen orientation
  - `"portrait-primary"`: Primarily portrait mode, can rotate to landscape
- **scope**: Defines which pages are part of the app experience

### Visual Design
- **background_color**: Color shown while the app is loading
- **theme_color**: Color of the browser UI when the app is active
- **lang**: Primary language of the app

### Categorization
- **categories**: Helps app stores and browsers categorize your app
  - `["medical", "health", "lifestyle"]`: Healthcare-related categories

### Icons
- **192x192**: Standard size for Android home screen
- **512x512**: High-resolution icon for app stores and larger displays
- **purpose**: `"any maskable"` - icon can be adapted to different shapes

### Screenshots
- **1280x720**: Wide screenshot for desktop/tablet displays
- Shown in app stores and installation prompts

## SEO Benefits:
1. **Mobile Engagement**: PWA features increase time on site
2. **User Experience**: Better mobile experience improves Core Web Vitals
3. **Installation Rate**: Higher engagement leads to better search rankings
4. **App Store Presence**: Can appear in app stores for additional visibility 