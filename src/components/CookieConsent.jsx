import { useState, useEffect } from 'react';
import '../styles/CookieConsent.css';

function CookieConsent({ onAccept, onDecline }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    // For testing: Force the banner to show regardless of localStorage state
    // Remove this line once you've confirmed the banner works
    // localStorage.removeItem('cookiesAccepted');
    
    // Only show the banner if they haven't made a choice yet
    if (cookiesAccepted === null) {
      // Add slight delay for better UX
      const timer = setTimeout(() => {
        setVisible(true);
        console.log('Cookie consent should be visible now');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      console.log('Cookie consent not shown because cookiesAccepted =', cookiesAccepted);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setVisible(false);
    if (onDecline) onDecline();
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-container">
      <div className="cookie-consent-content">
        <div className="cookie-text">
          <h3>Cookie Notice</h3>
          <p>
            We use cookies to enhance your experience on our website. By clicking "Accept All", 
            you consent to the use of cookies for authentication and personalization.
            You can read more in our <a href="/privacy-policy">Cookie Policy</a>.
          </p>
        </div>
        <div className="cookie-buttons">
          <button onClick={handleDecline} className="button-decline">
            Decline Non-Essential
          </button>
          <button onClick={handleAccept} className="button-accept">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
