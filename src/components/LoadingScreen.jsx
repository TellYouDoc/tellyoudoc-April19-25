// filepath: c:\Users\prita\Desktop\Website\WebApp\src\components\LoadingScreen.jsx
import { useEffect, useState, useCallback } from 'react';
import '../styles/LoadingScreen.css';
import tellyoudocLogo from '../assets/tellyoudoc.png';

const LoadingScreen = ({ show = false, message = "Loading..." }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [progressSpeed, setProgressSpeed] = useState(1);
  
  const updateProgress = useCallback(() => {
    setProgress(prev => {
      // Slow down progress as it gets closer to 90%
      const remaining = 90 - prev;
      const increment = Math.max(0.5, (remaining / 90) * progressSpeed * (Math.random() * 3 + 1));
      const newValue = prev + increment;
      
      // Adjust speed based on progress
      if (prev > 60) {
        setProgressSpeed(0.7);
      } else if (prev > 30) {
        setProgressSpeed(0.85);
      }
      
      return newValue > 90 ? 90 : newValue;
    });
  }, [progressSpeed]);
  
  useEffect(() => {
    let progressInterval;
    let visibilityTimeout;
    
    if (show) {
      setIsVisible(true);
      setProgress(0);
      setProgressSpeed(1);
      
      // Smoother progress animation
      progressInterval = setInterval(updateProgress, 150);
    } else {
      // Complete the progress smoothly
      setProgress(100);
      
      // Hide the loading screen with a slight delay
      visibilityTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(visibilityTimeout);
    };
  }, [show, updateProgress]);
  
  if (!isVisible && !show) {
    return null;
  }
  
  return (
    <div className={`loading-screen ${!show && progress >= 100 ? 'loading-screen-exit' : ''}`}>
      <div className="loading-content">
        <div className="loading-brand">
          <div className="loading-icon">
            <img 
              src={tellyoudocLogo} 
              alt="tellyouDoc" 
              className="logo-icon"
            />
          </div>
        </div>
        
        <div className="loading-progress-container">
          <div
            className="loading-progress-bar"
            style={{ 
              width: `${progress}%`,
              transition: `width ${progress === 100 ? '0.4s' : '0.8s'} cubic-bezier(0.4, 0, 0.2, 1)`
            }}
          />
        </div>
        
        <p className="loading-message">{message}</p>
        
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;