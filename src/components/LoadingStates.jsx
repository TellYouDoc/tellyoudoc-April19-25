import React from 'react';
import '../styles/LoadingStates.css';

// Basic loading spinner component with size variants
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`loading-spinner ${className}`}>
      <div className={`spinner ${size}`}></div>
    </div>
  );
};

// Section loading state for individual panels or components
export const SectionLoading = ({ message = 'Loading data...' }) => {
  return (
    <div className="section-loading">
      <LoadingSpinner size="medium" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

// Full page loading state for entire views
export const FullPageLoading = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="full-page-loading">
      <LoadingSpinner size="large" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

// Component to display when no data is available
export const NoDataMessage = ({ 
  title = 'No data available', 
  subtitle = 'There is no information to display at this time.', 
  actionText = 'Add Data', 
  onAction = null,
  icon = '📋'
}) => {
  return (
    <div className="no-data-message">
      <div className="no-data-icon">{icon}</div>
      <h3 className="no-data-title">{title}</h3>
      <p className="no-data-subtitle">{subtitle}</p>
      {onAction && (
        <div className="no-data-action">
          <button onClick={onAction}>{actionText}</button>
        </div>
      )}
    </div>
  );
};

// Default export for all loading state components
const LoadingStates = {
  LoadingSpinner,
  SectionLoading,
  FullPageLoading,
  NoDataMessage
};

export default LoadingStates;