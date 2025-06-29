import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import "../../styles/AdminLogin.css";
import tellyouDocLogo from "../../assets/tellyoudoc.png";

import { getCookie } from "../../utils/cookieUtils";
import apiService from "../../services/api";

import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.username || !formData.password) {
        setError("Please enter both username and password");
        setIsLoading(false);
        return;
      }

      const loginObject = {
        identifier: formData.username,
        password: formData.password,
      };

      // Login API call
      const response = await apiService.AdministratorService.login(loginObject);

      // Check if the response is successful
      if (response.status === 200) {
        setSuccessMessage("Login successful! Redirecting...");

        // Store the access token in local storage
        localStorage.setItem("adminAuth", "true");
        
        // Log the response data structure
        console.log('Response data:', response.data);
        
        // Save tokens to cookies and localStorage
        if (response.data && response.data.data.tokens.accessToken) {
          document.cookie = `AccessToken=${response.data.data.tokens.accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
          localStorage.setItem('AccessToken', response.data.data.tokens.accessToken);
          console.log('Access token saved:', response.data.data.tokens.accessToken);
        }

        if (response.data && response.data.data.tokens.refreshToken) {
          document.cookie = `RefreshToken=${response.data.data.tokens.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
          localStorage.setItem('RefreshToken', response.data.data.tokens.refreshToken);
          console.log('Refresh token saved:', response.data.data.tokens.refreshToken);
        }

        console.log("Admin data from the response: " + response.data.data.admin);

        // Log admin data before saving
        if (response.data && response.data.data.admin) {
          console.log('Admin data being saved:', response.data.data.admin);
          localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));

          // Verify the data was saved correctly
          const savedData = localStorage.getItem('adminData');
          console.log('Verified saved admin data:', JSON.parse(savedData));
        } else {
          console.warn('No admin data found in response:', response.data);
        }

        setTimeout(() => {
          navigate("/admin/dashboard");
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
            <h2 className="animated-item fade-in delay-1">Admin Portal</h2>
            <p className="animated-item fade-in delay-2">
              Sign in to access administrator features
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
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className="input-animated"
                required
              />
            </div>

            <div className="form-group animated-item slide-up delay-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-animated"
                required
              />
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

export default AdminLogin;
