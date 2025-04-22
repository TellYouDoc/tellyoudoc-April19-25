import { useState, useEffect } from "react";
import "../styles/Partner.css";

import Ribbon from "../assets/images/ribon.png";

import whoisin from "../assets/images/who-can-join-1.png";
import whoisin2 from "../assets/images/who-can-join-2.png";
import whoisin3 from "../assets/images/who-can-join-3.png";
import whoisin4 from "../assets/images/who-can-join-4.png";
import whoisin5 from "../assets/images/who-can-join-5.png";

import logo1 from "../assets/images/logos/symptom-logging-mastalgia-chart.png";
import logo2 from "../assets/images/logos/breast-logo.png";
import logo3 from "../assets/images/logos/doctor-logo.png";

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
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // State to track which inputs have focus
  const [focusedInput, setFocusedInput] = useState(null);

  // State to track window size for responsive styling
  const [isMobile, setIsMobile] = useState(false);

  // State to track if the form is showing
  const [showForm, setShowForm] = useState(false);

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

  // Auto-hide feedback after 6 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [feedback]);

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
          const navbarHeight = 80; // Height of the navbar
          const additionalOffset = 10; // Extra space to prevent overlapping with headings
          const sectionPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition =
            sectionPosition - navbarHeight - additionalOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
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
    padding: "8px 15px",
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
    height: "45px",
    boxSizing: "border-box",
    lineHeight: "normal",
  });

  // Restore the original label style
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

  // Update textarea style to align content to the top
  const textareaStyle = (name) => ({
    ...inputStyle(name),
    height: "120px",
    resize: "vertical",
    paddingTop: "12px",
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
    paddingRight: "30px",
  });

  // Error message style
  const errorStyle = {
    color: "#ff4d4f",
    fontSize: "12px",
    marginTop: "5px",
    fontWeight: "500",
  };

  // Feedback message styles
  const feedbackStyle = {
    success: {
      backgroundColor: "#f6ffed",
      border: "1px solid #b7eb8f",
      borderLeft: "4px solid #52c41a",
      color: "#52c41a",
    },
    error: {
      backgroundColor: "#fff2f0",
      border: "1px solid #ffccc7",
      borderLeft: "4px solid #ff4d4f",
      color: "#ff4d4f",
    },
    base: {
      padding: "16px",
      borderRadius: "4px",
      marginBottom: "20px",
      fontSize: "16px",
      lineHeight: "1.5",
      position: "relative",
      animation: "slideDown 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
  };

  // Form validation function
  const validateForm = () => {
    let formErrors = {};

    // Name validation
    if (!formData.fullName.trim()) {
      formErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      formErrors.fullName = "Name must be at least 3 characters";
    }

    // Mobile validation
    if (!formData.mobileNumber.trim()) {
      formErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      formErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    // Email validation
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Enter a valid email address";
    }

    // City validation
    if (!formData.city.trim()) {
      formErrors.city = "City is required";
    }

    // State validation
    if (!formData.state) {
      formErrors.state = "Please select a state";
    }

    // Specialization validation
    if (!formData.specialization) {
      formErrors.specialization = "Please select a specialization";
    }

    // Qualification validation
    if (!formData.qualification.trim()) {
      formErrors.qualification = "Qualification is required";
    }

    // Experience validation
    if (formData.experience === "") {
      formErrors.experience = "Experience is required";
    } else if (
      parseInt(formData.experience) < 0 ||
      parseInt(formData.experience) > 50
    ) {
      formErrors.experience = "Experience must be between 0-50 years";
    }

    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    // Clear feedback when user makes changes
    if (feedback.message) {
      setFeedback({ type: "", message: "" });
    }
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Clear any existing feedback
    setFeedback({ type: "", message: "" });

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(
          "https://api.tellyoudoc.com/api/v1/beta-partner/register",
          formData
        );

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

          // Set success feedback
          setFeedback({
            type: "success",
            message:
              "Your data was submitted successfully, Our team will get back to you",
          });

          // Close the form after a short delay
          setTimeout(() => {
            setShowForm(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error submitting form:", error);

        // Handle 400 errors (usually validation errors from the backend)
        if (error.response && error.response.status === 400) {
          // Highlight email and mobile fields
          setErrors({
            ...errors,
            email: "Email already exists",
            mobileNumber: "Phone number already exists",
          });

          // Set specific error message
          setFeedback({
            type: "error",
            message:
              "The submitted Email and Phone number already exists. Try with other credentials",
          });
        } else {
          // Generic error for other issues
          setFeedback({
            type: "error",
            message:
              "There was an error submitting your application. Please try again later.",
          });
        }
      }
    }

    setIsSubmitting(false);
  };

  // Style for the floating label form groups
  const formGroupStyle = {
    marginBottom: "20px",
    position: "relative",
  };

  // Adjust the form grid style to be consistent
  const formGridStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  };

  // Adjust the form grid item style
  const formGridItemStyle = {
    flex: 1,
    position: "relative",
  };

  // Feedback message component
  const FeedbackMessage = () => {
    if (!feedback.message) return null;

    return (
      <div
        className={`feedback-message ${
          feedback.type === "success" ? "feedback-success" : "feedback-error"
        }`}
      >
        <div className="feedback-icon">
          {feedback.type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </div>
        <div className="feedback-content">{feedback.message}</div>
      </div>
    );
  };

  // Benefits Array for Both Hero and Form Sections
  const allBenefits = [
    {
      id: 1,
      title: "Badges & Recognition",
      description: "In-app special badges and public acknowledgment.",
      className: "benefit-1",
    },
    {
      id: 2,
      title: "Free, Full Access to Core Features",
      description:
        "Full access to all the key features during the beta period.",
      className: "benefit-2",
    },
    {
      id: 3,
      title: "Premium Benefits Post-Beta",
      description: "Discounts on fees for feature modules.",
      className: "benefit-3",
    },
    {
      id: 4,
      title: "Priority Access to New Features",
      description:
        "Be the first to try out new modules, functionalities and updates.",
      className: "benefit-4",
    },
    {
      id: 5,
      title: "Referral Benefits",
      description: "Bonus for successful referring other doctors.",
      className: "benefit-5",
    },
    {
      id: 6,
      title: "Co-creation Opportunities",
      description: "Directly connect and work with development team",
      className: "benefit-6",
    },
  ];

  // Using the first 4 benefits for the hero section
  const heroBenefits = allBenefits.slice(0, 5);

  // Beta Launch Features Array
  const betaLaunchFeatures = [
    {
      id: 1,
      icon: logo1,
      title: "Symptom Logging & Mastalgia Chart",
      description:
        "Mastalgia Chart for Analyzing Symptom Patterns and Breast Health Monitoring with Direct Patient Input.",
    },
    {
      id: 2,
      icon: logo2,
      title: "Breast Cancer Screening & Evaluation",
      description:
        "Breast Cancer Screening Module for Individual or Awareness Campaigns.",
    },
    {
      id: 3,
      icon: logo3,
      title: "Chemotherapy Monitoring",
      description:
        "Doctor-Led Chemotherapy Monitoring for Expert Tracking of Treatment Progress and Patient Response.",
    },
  ];

  // Who Can Join Array
  const whoCanJoinItems = [
    {
      id: 1,
      title: "Oncologists (Breast Cancer Specialists & Surgeons)",
      description:
        "Experts involved in surgical or post-surgical care of breast cancer patients.",
      className: "who-can-join-item-1",
      icon: whoisin,
    },
    {
      id: 2,
      title: "Chemotherapy & Radiation Experts",
      description:
        "Specialists in administering and monitoring cancer treatment protocols.",
      className: "who-can-join-item-2",
      icon: whoisin2,
    },
    {
      id: 3,
      title: "Hospital Oncology Departments",
      description:
        "Teams or institutions managing oncology care, screenings, and follow-ups.",
      className: "who-can-join-item-3",
      icon: whoisin3,
    },
    {
      id: 4,
      title: "Cancer Research Institutions & Medical Colleges",
      description:
        "Academic & Research bodies interested in digital cancer care.",
      className: "who-can-join-item-4",
      icon: whoisin4,
    },
    {
      id: 5,
      title: "Other healthcare professionals",
      description:
        "Any other healthcare professionals working in the field of oncology in India.",
      className: "who-can-join-item-5",
      icon: whoisin5,
    },
  ];

  // Function to handle showing the form with slide animation
  const handleShowForm = (e) => {
    e.preventDefault();

    if (showForm) {
      setShowForm(false);
      return;
    }

    setShowForm(true);
  };

  return (
    <div className="partner-container">
      {/* Hero Section */}
      <section className="partner-hero">
        <div className="hero-content-wrapper">
          <div className={`hero-text ${showForm ? "slide-out-left" : ""}`}>
            <div className="hero-label">Partner Program</div>
            <h1 className="hero-title">
              Join the future of <span className="brand-orange" style={{ color: "#05AFA4" }}>Oncology</span>{" "}
              care
            </h1>
            <p className="hero-description">
              Be among the first to experience{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "#FF7007",
                  display: "inline",
                }}
              >
                tellyou
              </span>
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "#05AFA4",
                  display: "inline",
                }}
              >
                doc
              </span>{" "}
              — a smarter way to streamline cancer diagnosis, treatment
              management, and patient support. <br/><br/> Join the Beta program and help to
              shape the future of cancer care alongside leading oncologists.
            </p>
            <div className="hero-cta">
              <div className="cta-buttons">
                <a href="#beta-launch-section" className="cta-button">
                  Beta Features
                </a>
              </div>
              <div className="cta-buttons">
                <a href="#who-can-join-section" className="cta-button">
                  Who can join ?
                </a>
              </div>
              <div className="cta-buttons">
                <a className="cta-button" onClick={handleShowForm}>
                  Join Beta
                </a>
              </div>
            </div>
          </div>

          <div className="hero-space">
            <div className="benefits-container">
              <h2 className="benefits-heading">Beta Benefits</h2>

              {heroBenefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className={`benefit ${benefit.className}`}
                >
                  <div className="benefit-header">
                    <div className="benefit-count">{benefit.id}</div>
                    <h3 className="benefit-title">{benefit.title}</h3>
                  </div>
                  <p
                    className={`benefit-description ${
                      isMobile
                        ? "benefit-description-mobile"
                        : "benefit-description-desktop"
                    }`}
                  >
                    {benefit.description}
                  </p>
                </div>
              ))}

              <div className="benefit-more">
                <span>And many more...</span>
              </div>
            </div>
          </div>

          <div
            className={`hero-form-container ${showForm ? "slide-in-left" : ""}`}
          >
            <div className="hero-form-wrapper">
              <div className="hero-form-header">
                <h2 className="hero-form-title">Join the Beta Program</h2>
                <button
                  className="hero-form-close"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <div className="eligibility-note">
                <span className="asterisk">*</span> Only professionals and institutions working in India having valid registration.
              </div>
              <div className="hero-form-content">
                <form onSubmit={handleSubmit} className="form-container">
                  {/* Feedback message */}
                  <FeedbackMessage />

                  <div style={{ ...formGroupStyle, marginBottom: "12px" }}>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onFocus={() => handleFocus("fullName")}
                      onBlur={handleBlur}
                      style={{ ...inputStyle("fullName") }}
                      required
                    />
                    <label htmlFor="fullName" style={labelStyle("fullName")}>
                      Full Name
                    </label>
                    {errors.fullName && (
                      <div style={{ ...errorStyle, marginTop: "2px" }}>
                        {errors.fullName}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      ...formGridStyle,
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={formGridItemStyle}>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        onFocus={() => handleFocus("mobileNumber")}
                        onBlur={handleBlur}
                        style={{ ...inputStyle("mobileNumber") }}
                        required
                        maxLength="10"
                      />
                      <label
                        htmlFor="mobileNumber"
                        style={labelStyle("mobileNumber")}
                      >
                        Mobile Number
                      </label>
                      {errors.mobileNumber && (
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.mobileNumber}
                        </div>
                      )}
                    </div>

                    <div style={formGridItemStyle}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        style={{ ...inputStyle("email") }}
                        required
                      />
                      <label htmlFor="email" style={labelStyle("email")}>
                        Email Address
                      </label>
                      {errors.email && (
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      ...formGridStyle,
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={formGridItemStyle}>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onFocus={() => handleFocus("city")}
                        onBlur={handleBlur}
                        style={{ ...inputStyle("city") }}
                        required
                      />
                      <label htmlFor="city" style={labelStyle("city")}>
                        City
                      </label>
                      {errors.city && (
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.city}
                        </div>
                      )}
                    </div>

                    <div style={formGridItemStyle}>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onFocus={() => handleFocus("state")}
                        onBlur={handleBlur}
                        style={{ ...selectStyle("state") }}
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
                      {errors.state && (
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.state}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      ...formGridStyle,
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={formGridItemStyle}>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        onFocus={() => handleFocus("specialization")}
                        onBlur={handleBlur}
                        style={{ ...selectStyle("specialization") }}
                        required
                      >
                        <option value=""></option>
                        <option value="Oncologist">Oncologist</option>
                        <option value="General Physician">
                          General Physician
                        </option>
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
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.specialization}
                        </div>
                      )}
                    </div>
                    <div style={formGridItemStyle}>
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        onFocus={() => handleFocus("qualification")}
                        onBlur={handleBlur}
                        style={{ ...inputStyle("qualification") }}
                        required
                      />
                      <label
                        htmlFor="qualification"
                        style={labelStyle("qualification")}
                      >
                        Medical Qualification
                      </label>
                      {errors.qualification && (
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.qualification}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      ...formGridStyle,
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={formGridItemStyle}>
                      <input
                        type="text"
                        id="hospitalName"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        onFocus={() => handleFocus("hospitalName")}
                        onBlur={handleBlur}
                        style={{ ...inputStyle("hospitalName") }}
                      />
                      <label
                        htmlFor="hospitalName"
                        style={labelStyle("hospitalName")}
                      >
                        Hospital / Clinic Name
                      </label>
                    </div>

                    <div style={formGridItemStyle}>
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
                        style={{ ...inputStyle("experience") }}
                        required
                      />
                      <label
                        htmlFor="experience"
                        style={labelStyle("experience")}
                      >
                        Years of Experience
                      </label>
                      {errors.experience && (
                        <div style={{ ...errorStyle, marginTop: "2px" }}>
                          {errors.experience}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ ...formGroupStyle, marginBottom: "12px" }}>
                    <textarea
                      id="reason"
                      name="reason"
                      maxLength="100"
                      value={formData.reason}
                      onChange={handleChange}
                      onFocus={() => handleFocus("reason")}
                      onBlur={handleBlur}
                      style={{
                        ...textareaStyle("reason"),
                        minHeight: "80px",
                      }}
                    ></textarea>
                    <label
                      htmlFor="reason"
                      style={{
                        ...labelStyle("reason"),
                        top:
                          formData.reason || focusedInput === "reason"
                            ? "-10px"
                            : "12px",
                        transform:
                          formData.reason || focusedInput === "reason"
                            ? "translateY(0)"
                            : "translateY(0)",
                        fontSize:
                          formData.reason || focusedInput === "reason"
                            ? "12px"
                            : "16px",
                        backgroundColor:
                          formData.reason || focusedInput === "reason"
                            ? "white"
                            : "transparent",
                        padding:
                          formData.reason || focusedInput === "reason"
                            ? "0 5px"
                            : "0",
                      }}
                    >
                      Reason to Join
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`form-submit-button ${
                      isSubmitting
                        ? "form-submit-button-submitting"
                        : "form-submit-button-active"
                    }`}
                    disabled={isSubmitting}
                    style={{
                      padding: "10px 20px",
                      marginTop: "8px",
                      fontSize: "16px",
                    }}
                  >
                    {isSubmitting ? "Processing..." : "Click to Join"}
                  </button>

                  {/* Privacy Assurance as footnote */}
                  <div
                    style={{
                      fontSize: "0.85rem",
                      marginTop: "8px",
                      color: "#666",
                      textAlign: "left"
                    }}
                  >
                    <small style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                      <span style={{ color: "#e83e8c" }}>*</span>
                      <strong>Assurance of Privacy: </strong> We value your
                      trust. All your details will be kept confidential and used
                      only for internal beta coordination.
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .hero-content-wrapper {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          min-height: 750px;
          padding-top: 30px;
        }

        .hero-text {
          transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
          width: 48%;
          padding-right: 20px;
          align-self: flex-start;
        }

        .slide-out-left {
          transform: translateX(-120%);
          opacity: 0;
        }

        .hero-space {
          width: 48%;
          margin-left: 4%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-self: flex-start;
        }

        .hero-form-container {
          position: absolute;
          top: 30px;
          left: 0;
          width: 48%;
          height: auto;
          background: transparent;
          transform: translateX(-120%);
          transition: transform 0.8s ease-in-out;
          z-index: 10;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 20px 20px 40px;
          box-shadow: none;
          border-radius: 0;
          backdrop-filter: none;
        }

        .slide-in-left {
          transform: translateX(0);
        }

        .hero-form-wrapper {
          width: 100%;
          max-width: 100%;
          background: #fff;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 10px 25px rgba(232, 62, 140, 0.12);
          position: relative;
        }

        .hero-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(232, 62, 140, 0.2);
          background: #fff;
          z-index: 5;
        }

        .hero-form-title {
          font-size: 1.3rem;
          color: #2c3e50;
          margin: 0;
          position: relative;
        }

        .hero-form-title:after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 2px;
          border-radius: 2px;
        }

        .hero-form-close {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #888;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .hero-form-close:hover {
          background: rgba(232, 62, 140, 0.1);
          color: #e83e8c;
        }

        .hero-form-content .form-container {
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
        }

        @media (max-width: 992px) {
          .hero-content-wrapper {
            min-height: 1050px;
            flex-direction: column;
            padding-top: 20px;
          }

          .hero-text,
          .hero-space {
            width: 100%;
            padding-right: 0;
          }

          .hero-form-container {
            width: 100%;
            top: 20px;
          }

          .hero-space {
            margin-top: 30px;
            margin-left: 0;
          }
        }

        @media (max-width: 768px) {
          .hero-content-wrapper {
            min-height: 1200px;
            padding-top: 15px;
          }

          .hero-form-container {
            width: 100%;
            padding: 15px;
            top: 15px;
          }

          .hero-form-wrapper {
            padding: 15px;
          }
        }

        .feedback-message {
          margin-bottom: 15px;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          animation: fadeInDown 0.4s ease-out forwards;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .feedback-success {
          background-color: rgba(72, 187, 120, 0.1);
          border-left: 4px solid #48bb78;
          color: #2f855a;
        }

        .feedback-error {
          background-color: rgba(245, 101, 101, 0.1);
          border-left: 4px solid #f56565;
          color: #c53030;
        }

        .feedback-icon {
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feedback-content {
          flex: 1;
          font-weight: 500;
          line-height: 1.4;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-group {
          position: relative;
          margin-bottom: 15px;
        }
        
        .form-container input,
        .form-container select,
        .form-container textarea {
          display: block;
          width: 100%;
          box-sizing: border-box;
          font-size: 16px;
          line-height: normal;
          font-family: inherit;
        }
        
        .form-container input:focus,
        .form-container select:focus,
        .form-container textarea:focus {
          border-color: #4A90E2 !important;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }
        
        .form-container label {
          transition: all 0.2s ease;
          pointer-events: none;
        }
        
        /* Ensure text visibility in input fields */
        .form-container input::placeholder,
        .form-container textarea::placeholder {
          opacity: 0;
        }
        
        .form-container input:focus::placeholder,
        .form-container textarea:focus::placeholder {
          opacity: 0.5;
        }
        
        /* Fix for text visibility in inputs */
        .form-container input[type="text"],
        .form-container input[type="email"],
        .form-container input[type="tel"],
        .form-container input[type="number"] {
          text-overflow: ellipsis;
          padding-top: 0;
          padding-bottom: 0;
          height: 45px;
          line-height: 45px;
        }
        
        /* Fix for select elements */
        .form-container select {
          text-overflow: ellipsis;
          padding-right: 30px !important;
        }
        
        /* Fix for textarea */
        .form-container textarea {
          padding-top: 12px;
          min-height: 80px;
          line-height: 1.5;
        }
        
        /* Fix for the labels positioning */
        .form-container label {
          z-index: 2;
        }
        
        /* Make sure error messages don't cause layout shifts */
        .form-container [style*="errorStyle"] {
          min-height: 18px;
          display: block;
        }
        
        /* Fix spacing when form is showing */
        .hero-form-content {
          padding: 0 10px;
        }

        .eligibility-note {
          font-size: 0.85rem;
          color: #666;
          margin: -5px 0 10px 0;
          padding: 0 10px;
          font-style: italic;
          text-align: left;
        }
        
        .eligibility-note .asterisk {
          color: #e83e8c;
          font-weight: bold;
          margin-right: 2px;
        }
      `}</style>

      {/* Beta Launch Section */}
      <section className="beta-launch-section" id="beta-launch-section">
        {/* Section Heading */}
        <div className="beta-launch-heading-container">
          <h2 className="beta-launch-main-heading">
            Current <span className="beta-launch-heading-accent">Beta</span>{" "}
            Features
          </h2>
          <div className="beta-launch-heading-underline"></div>
        </div>

        {/* Bubble decorations */}
        <div className="beta-launch-bubble beta-launch-bubble-large"></div>
        <div className="beta-launch-bubble beta-launch-bubble-extra-large"></div>
        <div className="beta-launch-bubble beta-launch-bubble-small"></div>

        <div className="beta-launch-boxes-container">
          {/* Image Box */}
          <div className="beta-launch-image-box">
            <img
              src={Ribbon}
              alt="Mammary Evaluation App"
              className="beta-launch-image"
            />
          </div>

          {/* Feature Boxes */}
          {betaLaunchFeatures.map((feature) => (
            <div key={feature.id} className="beta-launch-feature-box">
              <div className="beta-launch-feature-icon" style={{ width: "120px", height: "120px", borderWidth: "2px" }}>
                <img src={feature.icon} alt={feature.title} style={{ width: "110px", height: "110px" }} />
              </div>
              <div className="beta-launch-feature-content">
                <h3 className="beta-launch-feature-title">{feature.title}</h3>
                <p className="beta-launch-feature-description">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className="who-can-join-section" id="who-can-join-section">
        {/* Section Heading */}
        <div className="who-can-join-heading-container">
          <h2 className="who-can-join-main-heading">
            Who can Join ?
          </h2>
          <div className="who-can-join-heading-underline"></div>
        </div>

        {/* Bubble decorations */}
        <div className="who-can-join-bubble who-can-join-bubble-large"></div>
        <div className="who-can-join-bubble who-can-join-bubble-extra-large"></div>
        <div className="who-can-join-bubble who-can-join-bubble-small"></div>

        <style>
          {`
            .who-can-join-table {
              width: 80%;
              max-width: 900px;
              margin: 30px auto;
              border-collapse: collapse;
              background-color: white;
              box-shadow: 0 5px 15px rgba(232, 62, 140, 0.15);
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid rgba(232, 62, 140, 0.3);
              text-align: left;
            }
            
            .who-can-join-table td {
              padding: 10px 15px;
              border-bottom: 1px solid rgba(232, 62, 140, 0.1);
              color: #5a6a7e;
              font-size: 15px;
              text-align: left;
            }
            
            .who-can-join-table tr:last-child td {
              border-bottom: none;
            }
            
            .who-can-join-table tr:hover td {
              background-color: rgba(255, 245, 247, 0.6);
            }
            
            .who-can-join-table-footer {
              text-align: left;
              font-style: italic;
              color: #e83e8c;
              font-size: 16px;
              margin: 10px auto 40px;
              width: 90%;
              max-width: 1200px;
              padding-left: 20px;
            }
            
            @media (max-width: 768px) {
              .who-can-join-table th, 
              .who-can-join-table td {
                padding: 12px 15px;
                font-size: 14px;
              }
            }
            
            .who-can-join-table tr:nth-child(even) {
              background-color: rgba(255, 245, 247, 0.3);
            }

            .highlight {
              color: #e83e8c;
              font-weight: 500;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .who-can-join-table {
              animation: fadeIn 0.6s ease-out forwards;
            }

            @keyframes pulse {
              0% { opacity: 0.8; }
              50% { opacity: 1; }
              100% { opacity: 0.8; }
            }
            
            .who-can-join-table tr:last-child td {
              animation: pulse 2s infinite ease-in-out;
            }

            .healthcare-pro-container {
              display: flex;
              width: 100%;
              gap: 15px;
              padding: 5px 0;
            }
            
            .healthcare-pro-image-cell {
              flex: 0 0 auto;
            }
            
            .healthcare-pro-content-cell {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 5px;
              justify-content: center;
              text-align: left;
            }
            
            .healthcare-pro-name {
              font-weight: 700;
              font-size: 20px;
              font-family: 'Montserrat', sans-serif;
              color: #e83e8c;
              letter-spacing: 0.3px;
              line-height: 1.3;
              text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
              text-transform: capitalize;
              margin-bottom: 3px;
              text-align: left;
            }
            
            .healthcare-pro-description {
              color: #5a6a7e;
              font-size: 16px;
              line-height: 1.4;
              text-align: left;
            }
            
            .healthcare-pro-icon {
              width: 80px;
              height: 80px;
              object-fit: contain;
              border-radius: 50%;
              background: rgba(255, 107, 157, 0.1);
              padding: 6px;
              box-shadow: 0 2px 5px rgba(232, 62, 140, 0.2);
            }

            .who-can-join-section {
              padding: 40px 0;
              position: relative;
              overflow: hidden;
              background-color: #fff;
            }
            
            .who-can-join-heading-container {
              text-align: center;
              margin-bottom: 20px;
            }
          `}
        </style>

        <table className="who-can-join-table">
          <tbody>
            {whoCanJoinItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="healthcare-pro-container">
                    <div className="healthcare-pro-image-cell">
                      <img
                        src={item.icon}
                        alt={`${item.title} icon`}
                        className="healthcare-pro-icon"
                      />
                    </div>
                    <div className="healthcare-pro-content-cell">
                      <div className="healthcare-pro-name">{item.title}</div>
                      <div className="healthcare-pro-description">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Partner;
