import { useState, useEffect } from "react";
import "../styles/Partner.css";

import axios from "axios";

const Partner = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    city: "",
    state: "",
    specialization: "",
    hospitalName: "",
    qualification: "",
    experience: "",
    reason: "",
  });

  // State for form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to track which inputs have focus
  const [focusedInput, setFocusedInput] = useState(null);

  // State to track window size for responsive styling
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Responsive styles object for reuse
  const responsive = {
    container: {
      padding: "clamp(20px, 5vw, 80px) clamp(15px, 3vw, 40px)",
    },
    heading: {
      fontSize: "clamp(24px, 5vw, 32px)",
    },
    subheading: {
      fontSize: "clamp(20px, 4vw, 24px)",
    },
    paragraph: {
      fontSize: "clamp(14px, 3vw, 16px)",
    },
    smallText: {
      fontSize: "clamp(12px, 2vw, 14px)",
    },
  };

  // Add smooth scrolling behavior
  useEffect(() => {
    // Apply smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth";

    // Add click handlers for anchor links
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener("click", handleAnchorClick);
    });

    // Cleanup event listeners
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchorClick);
      });
    };
  }, []);

  // Add smooth transition for all interactive elements
  const interactiveStyle = {
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  // Input style with error handling
  const inputStyle = (name) => ({
    ...interactiveStyle,
    width: "100%",
    padding: "15px 15px",
    fontSize: "16px",
    border: `1px solid ${
      errors[name]
        ? "#ff4d4f"
        : focusedInput === name || formData[name]
        ? "#4A90E2"
        : "#ddd"
    }`,
    borderRadius: "5px",
    backgroundColor: "white",
    outline: "none",
    height: "55px",
    boxSizing: "border-box",
  });

  // Update textarea styles to include error handling
  const textareaStyle = (name) => ({
    ...inputStyle(name),
    height: "120px",
    resize: "vertical",
    paddingTop: "25px",
    paddingBottom: "10px",
    verticalAlign: "top",
    lineHeight: "1.5",
    textAlign: "left",
  });

  // Update select styles to include error handling
  const selectStyle = (name) => ({
    ...inputStyle(name),
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    backgroundImage:
      'url(\'data:image/svg+xml;utf8,<svg fill="%23666" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "20px",
  });

  // Error message style
  const errorStyle = {
    color: "#ff4d4f",
    fontSize: "12px",
    marginTop: "5px",
    fontWeight: "500",
  };

  // Update label styles to include error handling
  const labelStyle = (name) => ({
    ...interactiveStyle,
    position: "absolute",
    left: "15px",
    top: formData[name] || focusedInput === name ? "-10px" : "50%",
    transform:
      formData[name] || focusedInput === name
        ? "translateY(0)"
        : "translateY(-50%)",
    fontSize: formData[name] || focusedInput === name ? "12px" : "16px",
    color: errors[name]
      ? "#ff4d4f"
      : formData[name] || focusedInput === name
      ? "#4A90E2"
      : "#666",
    pointerEvents: "none",
    backgroundColor:
      formData[name] || focusedInput === name ? "white" : "transparent",
    padding: formData[name] || focusedInput === name ? "0 5px" : "0",
    zIndex: "1",
  });

  // Form validation function
  const validateForm = () => {};

  const handleChange = (e) => {};

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(
          "https://api.tellyoudoc.com/api/v1/beta-partner/register",
          formData
        );

        console.log(response);

        if (response.status === 200 || response.status === 201) {
          // Reset the form
          setFormData({
            fullName: "",
            mobileNumber: "",
            email: "",
            city: "",
            state: "",
            specialization: "",
            hospitalName: "",
            qualification: "",
            experience: "",
            reason: "",
          });
          alert("Thank you for your interest! We will contact you soon.");
        }
      } catch (e) {
        console.error("Error submitting form:", error);
      }
    }

    setIsSubmitting(false);
  };

  // Style for the floating label form groups
  const formGroupStyle = {
    marginBottom: "25px",
    position: "relative",
  };

  return (
    <div className="partner-container">
      {/* Hero Section */}
      <section className="partner-hero">
        <div className="hero-background">
          <img src="/partner-hero.jpg" alt="Partner with TellYouDoc" />
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-text">
            <div className="hero-label">Partner Program</div>
            <h1 className="hero-title">
              Be the First to Experience{" "}
              <span style={{ color: "orange", fontWeight: 800 }}>tellyou</span>
              <span style={{ color: "green", fontWeight: 800 }}>doc</span>
            </h1>
            <p className="hero-description">
              Get early access to powerful tools built for oncology practices &
              clinics
            </p>

            <div className="hero-cta">
              <div className="cta-buttons">
                <a href="#partner-form" className="cta-button">
                  Join Beta
                </a>
              </div>
            </div>
          </div>

          <div className="hero-space">
            <div className="benefits-container">
              <h2 className="benefits-heading">Beta Benefits</h2>
              <div className="benefit benefit-1">
                <div className="benefit-header">
                  <div className="benefit-count">1</div>
                  <h3
                    style={{
                      textAlign: "left",
                      fontSize: "1.5rem",
                      color: "#2a7d73",
                    }}
                  >
                    Early access to future modules
                  </h3>
                </div>
                <p
                  style={{
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: isMobile ? "visible" : "hidden",
                    textOverflow: "ellipsis",
                    paddingLeft: "3.2rem",
                  }}
                >
                  Exclusive Features | Priority Updates | Beta Testing
                </p>
              </div>
              <div className="benefit benefit-2">
                <div className="benefit-header">
                  <div className="benefit-count">2</div>
                  <h3
                    style={{
                      textAlign: "left",
                      fontSize: "1.5rem",
                      color: "#2a7d73",
                    }}
                  >
                    Collaborate with product team
                  </h3>
                </div>
                <p
                  style={{
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: isMobile ? "visible" : "hidden",
                    textOverflow: "ellipsis",
                    paddingLeft: "3.2rem",
                  }}
                >
                  Pre-Screened Patients | Matching Algorithm | Growth
                  Opportunity
                </p>
              </div>
              <div className="benefit benefit-3">
                <div className="benefit-header">
                  <div className="benefit-count">3</div>
                  <h3
                    style={{
                      textAlign: "left",
                      fontSize: "1.5rem",
                      color: "#2a7d73",
                    }}
                  >
                    Free access during beta program
                  </h3>
                </div>
                <p
                  style={{
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: isMobile ? "visible" : "hidden",
                    textOverflow: "ellipsis",
                    paddingLeft: "3.2rem",
                  }}
                >
                  Comprehensive Insights | Performance Metrics | Patient Trends
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Partner Form */}
      <section
        id="partner-form"
        className="form-section"
        style={{
          padding: responsive.container.padding,
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #eaeef2",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "auto",
            width: "100%",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(30px, 6vw, 50px)",
            }}
          >
            <h2
              style={{
                fontSize: responsive.heading.fontSize,
                color: "#2c3e50",
                marginBottom: "clamp(10px, 3vw, 16px)",
                fontWeight: "600",
              }}
            >
              Join the TellYouDoc Beta Program
            </h2>
            <p
              style={{
                fontSize: responsive.paragraph.fontSize,
                color: "#5a6a7e",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
                padding: "0 clamp(10px, 3vw, 20px)",
              }}
            >
              Fill in your details below and become part of our exclusive
              network of healthcare professionals
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              padding: "clamp(20px, 5vw, 40px)",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div style={formGroupStyle}>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => handleFocus("fullName")}
                onBlur={handleBlur}
                style={inputStyle("fullName")}
                required
              />
              <label htmlFor="fullName" style={labelStyle("fullName")}>
                Full Name
              </label>
              {errors.fullName && (
                <div style={errorStyle}>{errors.fullName}</div>
              )}
            </div>

            <div style={formGroupStyle}>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                onFocus={() => handleFocus("mobileNumber")}
                onBlur={handleBlur}
                style={inputStyle("mobileNumber")}
                required
                maxLength="10"
              />
              <label htmlFor="mobileNumber" style={labelStyle("mobileNumber")}>
                Mobile Number
              </label>
              {errors.mobileNumber && (
                <div style={errorStyle}>{errors.mobileNumber}</div>
              )}
            </div>

            <div style={formGroupStyle}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                style={inputStyle("email")}
                required
              />
              <label htmlFor="email" style={labelStyle("email")}>
                Email Address
              </label>
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              <div style={formGroupStyle}>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onFocus={() => handleFocus("city")}
                  onBlur={handleBlur}
                  style={inputStyle("city")}
                  required
                />
                <label htmlFor="city" style={labelStyle("city")}>
                  City
                </label>
                {errors.city && <div style={errorStyle}>{errors.city}</div>}
              </div>

              <div style={formGroupStyle}>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onFocus={() => handleFocus("state")}
                  onBlur={handleBlur}
                  style={selectStyle("state")}
                  required
                >
                  <option value=""></option>
                  <option value="Assam">Assam</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Other">Other</option>
                </select>
                <label htmlFor="state" style={labelStyle("state")}>
                  State
                </label>
                {errors.state && <div style={errorStyle}>{errors.state}</div>}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              <div style={formGroupStyle}>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  onFocus={() => handleFocus("specialization")}
                  onBlur={handleBlur}
                  style={selectStyle("specialization")}
                  required
                >
                  <option value=""></option>
                  <option value="Oncologist">Oncologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Other">Other</option>
                </select>
                <label
                  htmlFor="specialization"
                  style={labelStyle("specialization")}
                >
                  Medical Specialization
                </label>
                {errors.specialization && (
                  <div style={errorStyle}>{errors.specialization}</div>
                )}
              </div>
              <div style={formGroupStyle}>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  onFocus={() => handleFocus("qualification")}
                  onBlur={handleBlur}
                  style={inputStyle("qualification")}
                  required
                />
                <label
                  htmlFor="qualification"
                  style={labelStyle("qualification")}
                >
                  Medical Qualification
                </label>
                {errors.qualification && (
                  <div style={errorStyle}>{errors.qualification}</div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              <div style={formGroupStyle}>
                <input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("hospitalName")}
                  onBlur={handleBlur}
                  style={inputStyle("hospitalName")}
                />
                <label
                  htmlFor="hospitalName"
                  style={labelStyle("hospitalName")}
                >
                  Hospital / Clinic Name
                </label>
              </div>

              <div style={formGroupStyle}>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleChange}
                  onFocus={() => handleFocus("experience")}
                  onBlur={handleBlur}
                  style={inputStyle("experience")}
                  required
                />
                <label htmlFor="experience" style={labelStyle("experience")}>
                  Years of Experience
                </label>
                {errors.experience && (
                  <div style={errorStyle}>{errors.experience}</div>
                )}
              </div>
            </div>

            <div style={formGroupStyle}>
              <textarea
                id="reason"
                name="reason"
                maxLength="100"
                value={formData.reason}
                onChange={handleChange}
                onFocus={() => handleFocus("reason")}
                onBlur={handleBlur}
                style={textareaStyle("reason")}
              ></textarea>
              <label htmlFor="reason" style={labelStyle("reason")}>
                Reason to Join (optional)
              </label>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: isSubmitting ? "#87b7eb" : "#4A90E2",
                color: "white",
                padding: "15px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                marginTop: "10px",
                boxShadow: "0 4px 10px rgba(74, 144, 226, 0.3)",
                position: "relative",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Click to Join"}
            </button>

            {Object.keys(errors).length > 0 && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#fff2f0",
                  borderLeft: "3px solid #ff4d4f",
                  fontSize: "14px",
                  color: "#5a6a7e",
                }}
              >
                Please correct the errors above to submit the form.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Partner;
