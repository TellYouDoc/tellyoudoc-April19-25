// filepath: c:\Users\Ankan Chakraborty\OneDrive\Desktop\IIIT Guwahati\Website\live\tellyoudoc-April19-25\src\pages\Organization\Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import "../../styles/Organization/OrganizationLogin.css";
import tellyouDocLogo from "../../assets/tellyoudoc.png";
import { getCookie } from "../../utils/cookieUtils";
import apiService from "../../services/api";

const OrganizationLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Add subtle background animation
    document.body.classList.add("login-bg-animation");

    // Trigger animations when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("login-bg-animation");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.identifier || !formData.password) {
        setError("Please enter both username/email and password");
        setIsLoading(false);
        return;
      }

      // For now, we'll use a placeholder for the organization login API
      // This should be updated once the actual API endpoint is available
      
      // Mock API call for demonstration
      // const response = await apiService.OrganizationService.login(formData);
      
      // Simulating a successful login response
      const mockResponse = {
        status: 200,
        data: {
          data: {
            tokens: {
              accessToken: "org-access-token",
              refreshToken: "org-refresh-token"
            },
            organization: {
              id: "org123",
              name: "Sample Organization",
              email: formData.identifier
            }
          }
        }
      };

      // When the actual API is implemented, replace this with:
      // const response = await apiService.OrganizationService.login(formData);
      const response = mockResponse;

      // Check if the response is successful
      if (response.status === 200) {
        setSuccessMessage("Login successful! Redirecting...");

        // Store the access token and organization data
        localStorage.setItem("orgAuth", "true");
        
        // Save tokens to cookies and localStorage
        if (response.data && response.data.data.tokens.accessToken) {
          document.cookie = `AccessToken=${response.data.data.tokens.accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
          localStorage.setItem('AccessToken', response.data.data.tokens.accessToken);
        }

        if (response.data && response.data.data.tokens.refreshToken) {
          document.cookie = `RefreshToken=${response.data.data.tokens.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
          localStorage.setItem('RefreshToken', response.data.data.tokens.refreshToken);
        }

        // Save organization data
        if (response.data && response.data.data.organization) {
          localStorage.setItem('organizationData', JSON.stringify(response.data.data.organization));
        }

        setTimeout(() => {
          navigate("/organization/dashboard");
        }, 1000);
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className={`auth-card ${isVisible ? "visible" : ""}`}>
          <div className="auth-header">
            <img
              src={tellyouDocLogo}
              alt="TellyouDoc Logo"
              className="logo-icon"
            />
            <h2 className="animated-item fade-in delay-1">Organization Portal</h2>
            <p className="animated-item fade-in delay-2">
              Sign in to access your organization's dashboard
            </p>
          </div>

          {error && (
            <div className="auth-error animated-item fade-in">{error}</div>
          )}

          {successMessage && (
            <div className="auth-success animated-item fade-in">
              {successMessage}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group animated-item slide-up delay-3">
              <label htmlFor="identifier">Username or Email</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className="input-animated"
                required
              />
            </div>

            <div className="form-group animated-item slide-up delay-4">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-animated"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            <div className="form-footer animated-item slide-up delay-5">
              <button
                type="submit"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLogin;