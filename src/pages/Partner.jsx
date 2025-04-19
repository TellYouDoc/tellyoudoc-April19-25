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

  // State to track form validation errors
  const [errors, setErrors] = useState({});

  // State to track form submission status
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    isCredentialsExists: false,
  });

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

  // Update form input styles to include smooth transitions and error states
  const inputStyle = (name) => ({
    ...interactiveStyle,
    width: "100%",
    padding: "15px 15px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "white",
    outline: "none",
    height: "55px",
    boxSizing: "border-box",
    borderColor: errors[name]
      ? "#e74c3c"
      : focusedInput === name || formData[name]
      ? "#4A90E2"
      : "#ddd",
  });

  // Update textarea styles to include smooth transitions and error states
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

  // Update select styles to include smooth transitions and error states
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

  // Update label styles to include smooth transitions and error states
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
      ? "#e74c3c"
      : formData[name] || focusedInput === name
      ? "#4A90E2"
      : "#666",
    pointerEvents: "none",
    backgroundColor:
      formData[name] || focusedInput === name ? "white" : "transparent",
    padding: formData[name] || focusedInput === name ? "0 5px" : "0",
    zIndex: "1",
  });

  // Style for error messages
  const errorMessageStyle = {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "5px",
    marginLeft: "5px",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State validation
    if (!formData.state) {
      newErrors.state = "Please select your state";
    }

    // Specialization validation
    if (!formData.specialization) {
      newErrors.specialization = "Please select your specialization";
    }

    // Qualification validation
    if (!formData.qualification.trim()) {
      newErrors.qualification = "Qualification is required";
    }

    // Experience validation
    if (formData.experience === "") {
      newErrors.experience = "Years of experience is required";
    } else if (
      parseInt(formData.experience) < 0 ||
      parseInt(formData.experience) > 50
    ) {
      newErrors.experience = "Experience must be between 0 and 50 years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document
          .getElementById(firstErrorField)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
    });

    try {
      const response = await axios.post(
        "https://api.tellyoudoc.com/api/v1/beta-partner/register",
        formData
      );

      if (response.status === 201) {
        // Success
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: false,
        });

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
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response.status === 400) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          isError: true,
          isCredentialsExists: true,
        });
        alert("There was an error submitting your form. Please try again.");
      } else {
        if (error.response.status === 500) {
          setFormStatus({
            isSubmitting: false,
            isSubmitted: false,
            isError: true,
          });
        }
      }
    }
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

          {/* Form Submission Status */}
          {formStatus.isSubmitted && !formStatus.isCredentialsExists && (
            <div
              style={{
                padding: "clamp(20px, 5vw, 40px)",
                backgroundColor: "#e7f4e4",
                borderRadius: "10px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
              <h3
                style={{
                  fontSize: "24px",
                  color: "#2c3e50",
                  marginBottom: "10px",
                }}
              >
                Thank You for Joining!
              </h3>
              <p style={{ color: "#5a6a7e", lineHeight: "1.6" }}>
                We've received your application and will be in touch shortly.
              </p>
            </div>
          )}

          {formStatus.isCredentialsExists && (
            <div
              style={{
                padding: "clamp(20px, 5vw, 40px)",
                backgroundColor: "#f4e4e4",
                borderRadius: "10px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
              <h3
                style={{
                  fontSize: "24px",
                  color: "#2c3e50",
                  marginBottom: "10px",
                }}
              >
                Email and Mobile Number already exists
              </h3>
              <p style={{ color: "#5a6a7e", lineHeight: "1.6" }}>
                Your email and mobile number are already registered with us.
                Please use a different email or mobile number to register.
              </p>
            </div>
          )}

          {/* Credentials already exists */}
        </div>
      </section>
    </div>
  );
};

export default Partner;
