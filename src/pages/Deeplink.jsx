import React, { useEffect } from 'react';

const Deeplink = () => {
  useEffect(() => {
    // 1. Read the doctorId from the URL
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("doctorId");

    // 2. Your app's deep link (tellyoudoc:// is your custom scheme)
    const appLink = `tellyoudoc://connect?doctorId=${doctorId}`;

    // 3. Fallback to Play Store if app not installed
    const fallbackLink = "https://play.google.com/store/apps/details?id=com.tellyoudoc.patient";

    // 4. Try to open the app
    window.location.href = appLink;

    // 5. After 1.5 seconds, redirect to Play Store
    const timeout = setTimeout(() => {
      window.location.href = fallbackLink;
    }, 1500);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div>
        <h2>Connecting to TellyYouDoc App...</h2>
        <p>Redirecting to the TellyYouDoc App...</p>
        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          <p>If the app doesn't open automatically, you'll be redirected to the Play Store.</p>
        </div>
      </div>
    </div>
  );
};

export default Deeplink;