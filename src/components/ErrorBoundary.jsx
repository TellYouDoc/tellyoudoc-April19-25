import React, { Component } from 'react';
import '../styles/ErrorBoundary.css'; // Assuming you have a CSS file for styling

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You can also log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    // Reset the error state and try to re-render the component
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  handleReportError = () => {
    // Implement error reporting logic here
    // This could send the error details to your backend or a third-party service
    alert("Error has been reported to our development team. Thank you!");
  }

  render() {
    if (this.state.hasError) {
      // Render error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Something went wrong</h2>
            <p>We're sorry, but there seems to be an issue with this part of the application.</p>
            
            {this.props.showDetails && this.state.error && (
              <div className="error-details">
                <h3>Error Details</h3>
                <p>{this.state.error.toString()}</p>
                <details>
                  <summary>Stack Trace</summary>
                  <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                </details>
              </div>
            )}
            
            <div className="error-actions">
              <button 
                onClick={this.handleRetry} 
                className="retry-button"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReportError} 
                className="report-button"
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
