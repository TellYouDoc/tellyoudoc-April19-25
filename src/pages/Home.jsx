import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Input, Button, message } from "antd";

// Importing styles
import "../styles/Home.css";
import "../styles/FAQs.css";

// Importing API service
import apiService from "../services/api";

// Importing components
import Welcome_Navbar from "../components/Welcome_Navbar";
import Footer from "../components/Footer";

// Importing images
import iiitgLogo from "../assets/images/iiitg.png";
import drishtiLogo from "../assets/images/drishti-cps.png";
import doctorImageUrl from "../assets/images/dr-soumen-das.png";

// Simple placeholder images
const Home = () => {
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // State to track form validation errors
  const [errors, setErrors] = useState({});

  // State to track form submission status
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
  });

  // State for scroll to top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State for WhatsApp modal
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);

  // State for Patient modal
  const [patientModalVisible, setPatientModalVisible] = useState(false);

  // State for FAQ expansion
  const [expandedFAQs, setExpandedFAQs] = useState({});

  // Toggle FAQ expansion
  const toggleFAQ = (index) => {
    setExpandedFAQs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Form handling functions
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number to only allow digits
    if (name === "phone") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData({
        ...formData,
        [name]: limitedDigits,
      });
    }
    // Special handling for email to remove spaces and convert to lowercase
    else if (name === "email") {
      // Remove all spaces and convert to lowercase
      const cleanedEmail = value.replace(/\s/g, "").toLowerCase();
      setFormData({
        ...formData,
        [name]: cleanedEmail,
      });
    }
    // Special handling for name and message to replace multiple spaces with single space
    else if (name === "name" || name === "message") {
      // Replace multiple spaces with a single space
      const cleanedText = value.replace(/\s+/g, " ");
      setFormData({
        ...formData,
        [name]: cleanedText,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
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
      const response = await apiService.homePageService.contactUs(formData);

      if (response.status === 201 || response.status === 200) {
        // Success
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: false,
        });

        // Reset the form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
      });
      alert("There was an error submitting your form. Please try again.");
    }
  };

  // Style for error messages
  const errorMessageStyle = {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "5px",
    marginLeft: "5px",
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle scroll event to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300); // Show button after scrolling 300px
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // WhatsApp modal functions
  const handleWhatsappModalOpen = () => {
    setWhatsappModalVisible(true);
  };

  const handleWhatsappModalClose = () => {
    setWhatsappModalVisible(false);
  };

  // Patient modal functions
  const handlePatientModalOpen = () => {
    setPatientModalVisible(true);
  };

  const handlePatientModalClose = () => {
    setPatientModalVisible(false);
  };

  return (
    <>
      <Welcome_Navbar />
      <div className="home-home-container" id="home-container">
        {/* Hero Section */}
        <section id="home" className="home-hero-section">
          <div className="home-hero-background"></div>
          <div className="home-hero-content-wrapper">
            <div className="home-about-content home-hero-text">
              <div>
                <div className="home-hero-about-header">
                  <h5
                    className="home-hero-title"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a5a52, #037073, #2a4f7a)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: "1rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.5px",
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    Connect with Every Patient & No More Lost
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-10px",
                        left: 0,
                        width: "80px",
                        height: "4px",
                        background: "linear-gradient(90deg, #2a7d73, #3b6baa)",
                        borderRadius: "2px",
                      }}
                    ></span>
                  </h5>
                </div>
                <div className="home-hero-about-info">
                  <p
                    className="home-hero-description"
                    style={{
                      marginBottom: "2rem",
                      color: "#333",
                      lineHeight: 1.7,
                      textShadow: "none",
                    }}
                  >
                    Designed for doctors who prefer to practice offline in
                    non-metro cities, towns and villages.
                  </p>

                  {/* Feature navigation buttons */}
                  <div className="home-hero-feature-buttons">
                    <button
                      className="home-feature-button"
                      onClick={() =>
                        document
                          .getElementById("product")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Features
                    </button>
                    <button
                      className="home-feature-button"
                      onClick={() =>
                        document
                          .getElementById("benefits")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Benefits
                    </button>
                    <button
                      className="home-feature-button"
                      onClick={() =>
                        document
                          .getElementById("how-it-works")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      How it works
                    </button>
                    <button
                      className="home-feature-button patient-button"
                      onClick={handlePatientModalOpen}
                      style={{
                        background: "linear-gradient(135deg, #3b6baa, #2a7d73)",
                        color: "white",
                        border: "none",
                        fontWeight: "600",
                        boxShadow: "0 4px 15px rgba(59, 107, 170, 0.3)",
                        position: "relative",
                        overflow: "hidden",
                        padding: "10px 50px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(59, 107, 170, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(59, 107, 170, 0.3)";
                      }}
                    >
                      Patient
                      <span
                        style={{
                          position: "absolute",
                          top: "3px",
                          right: "8px",
                          background: "#ff4757",
                          color: "white",
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        NEW
                      </span>
                    </button>
                  </div>

                  <div className="home-hero-cta">
                    <button
                      className="home-cta-button"
                      onClick={handleWhatsappModalOpen}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(42, 125, 115, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(42, 125, 115, 0.3)";
                      }}
                    >
                      Get the App Free
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="about-section">
          <div className="home-section-header">
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              About Us
            </h2>
          </div>
          <div className="home-about-section-content">
            <div className="home-about-section-about-content">
              <div className="home-about-section-about-info about-beautiful-flex">
                <div
                  className="home-about-section-about-item about-beautiful-item"
                  style={{ borderRight: "none" }}
                >
                  <div
                    className="home-about-section-about-item-label"
                    style={{ fontWeight: "normal" }}
                  >
                    Vision
                  </div>
                  <p>
                    To become India's most trusted digital companion for every
                    doctor in{" "}
                    <span style={{ color: "#000000", fontWeight: "bold" }}>
                      Bharat's towns and villages
                    </span>{" "}
                    — empowering them by seamlessly connected with their
                    patients, become easily accessible, more efficient practices
                    using accessible technology that respects tradition,
                    language, and local healthcare needs regardless of digital
                    familiarity.
                  </p>
                </div>
                {/* Vertical Divider */}
                <div
                  style={{
                    width: "1px",
                    minHeight: "100px",
                    background: "linear-gradient(180deg, #b2dfdb, #3b6baa)",
                    margin: "0 1rem",
                    alignSelf: "stretch",
                  }}
                ></div>
                <div className="home-about-section-about-item about-beautiful-item">
                  <div
                    className="home-about-section-about-item-label"
                    style={{ fontWeight: "normal" }}
                  >
                    Mission
                  </div>
                  <p>
                    Our mission is to empower offline doctors in India's
                    non-metro cities, towns and villages with user-friendly and
                    reliable digital tools. We simplify QR-based patient
                    connection, multilingual platform that enables symptom-based
                    consultation, follow-up tracking, and digital
                    outreach—without requiring patients to be tech-savvy. We
                    provide clear patient insights, enabling doctors to focus on
                    delivering quality care and build lasting relationships,
                    even with patients who are not digitally active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section
          id="product"
          className="product-section"
          style={{
            background:
              "linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #f8f9fa 100%)",
            padding: "100px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>
          <div
            className="home-section-header"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Features
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#666",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Everything You Need, Nothing You Don't
            </p>
          </div>

          <div
            className="product-content tellyoudoc-offers-content home-product-section-content"
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Features Layout - Simple Grid Design */}
            <div
              className="features-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "3rem",
                marginBottom: "4rem",
              }}
            >
              {/* Feature 1 */}
              <div
                className="simple-feature"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #2a7d73, #05A1A4)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(42, 125, 115, 0.2)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M3,11 L3,13 L10.5,13 L8.5,15 L15,9 L8.5,3 L10.5,5 L3,5 L3,7 M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2 Z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Personalized Practice QR
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Generate unique QR codes for instant patient connections and
                    seamless practice access.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                className="simple-feature"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #3b6baa, #2a7d73)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(59, 107, 170, 0.2)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2 A10,10 0 0,0 2,12 A10,10 0 0,0 12,22 A10,10 0 0,0 22,12 A10,10 0 0,0 12,2 M16.2,9.1 L11,14.3 L7.8,11.1 L9.2,9.7 L11,11.5 L14.8,7.7 L16.2,9.1 Z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Patient Visit Requests
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Manage consultation requests and patient queue efficiently
                    with organized workflow.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                className="simple-feature"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #4CAF50, #05A1A4)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Symptom Pre-screening
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Review symptoms before appointments for better preparation
                    and more focused consultations.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div
                className="simple-feature"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #8E24AA, #4CAF50)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(142, 36, 170, 0.2)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Digital Treatment Notes
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Share prescriptions and follow-up instructions digitally for
                    better patient care continuity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="benefits-section"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f0f8ff 100%)",
            padding: "100px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>

          <div
            className="home-section-header"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Benefits
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#666",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Know Every Patient Who Is Looking for You
            </p>
          </div>

          <div
            className="benefits-content"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Unified Benefits Card */}
            <div
              className="unified-benefits-card"
              style={{
                background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                borderRadius: "25px",
                padding: "3rem",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(42, 125, 115, 0.1)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                marginBottom: "2rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 50px rgba(42, 125, 115, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* 2x2 Grid Layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "1fr 1fr",
                  gap: "0",
                  height: "100%",
                }}
              >
                {/* Benefit 1 - Top Left */}
                <div
                  style={{
                    padding: "2rem",
                    borderRight: "1px solid rgba(42, 125, 115, 0.15)",
                    borderBottom: "1px solid rgba(42, 125, 115, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #3b6baa, #2a7d73)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "1rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Expand Your Reach Through Social Media
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.6",
                    }}
                  >
                    Leverage digital platforms to extend your practice's
                    visibility and connect with more patients in your community.
                  </p>
                </div>

                {/* Benefit 2 - Top Right */}
                <div
                  style={{
                    padding: "2rem",
                    borderBottom: "1px solid rgba(42, 125, 115, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #05A1A4, #2a7d73)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "1rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Reduce No-Shows and Improve Patient Retention
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.6",
                    }}
                  >
                    Minimize missed appointments and keep patients engaged with
                    your practice for better continuity of care.
                  </p>
                </div>

                {/* Benefit 3 - Bottom Left */}
                <div
                  style={{
                    padding: "2rem",
                    borderRight: "1px solid rgba(42, 125, 115, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #4CAF50, #05A1A4)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "1rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Improve Patient Satisfaction and Gain Loyalty
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.6",
                    }}
                  >
                    Enhance patient experience through better communication and
                    care, building lasting relationships and trust.
                  </p>
                </div>

                {/* Benefit 4 - Bottom Right */}
                <div
                  style={{
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #8E24AA, #4CAF50)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "1rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Gain Deeper Insights into Patient Engagement
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.6",
                    }}
                  >
                    Access valuable data and analytics to understand patient
                    behavior and optimize your practice's performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="how-it-works"
          className="how-it-works-section"
          style={{
            background:
              "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f8ff 100%)",
            padding: "100px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>

          <div
            className="home-section-header"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              How it Works
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#666",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              A simple 4-step process that connects you with patients without
              any complexity
            </p>
            <div
              style={{
                width: "100px",
                height: "4px",
                margin: "0 auto 2rem auto",
              }}
            ></div>
          </div>

          <div
            className="how-it-works-content"
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Steps Container - Single Line Design */}
            <div
              className="steps-container"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
                alignItems: "center",
              }}
            >
              {/* Step 1 */}
              <div
                className="simple-step"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",

                  maxWidth: "700px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(42, 125, 115, 0.2)",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    1
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Put Your QR in the Clinic
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Get a printed and shareable QR that patients can scan. You
                    will see every patient who searched for you.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className="simple-step"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",

                  maxWidth: "700px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #3b6baa, #05A1A4)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(59, 107, 170, 0.2)",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    2
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Patient Sends Visit Request
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Patients scan your QR and describe their symptoms before
                    meeting you for better preparation.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className="simple-step"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",

                  maxWidth: "700px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #05A1A4, #4CAF50)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(5, 161, 164, 0.2)",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    3
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    You Accept or Decline
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    You decide who to treat, when, and where. Complete control
                    over your practice schedule.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div
                className="simple-step"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",

                  maxWidth: "700px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #4CAF50, #8E24AA)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    4
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Track Ongoing Cases
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    See new symptoms, reply with treatment notes, and send
                    follow-up instructions digitally.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Message */}
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                borderRadius: "20px",
                color: "white",
                boxShadow: "0 10px 25px rgba(42, 125, 115, 0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  margin: 0,
                  lineHeight: "1.5",
                  color: "#ffffff",
                  fontStyle: "italic",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                No website, no listing, no tech clutter. Just your offline
                practice — made smarter.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="faq-section"
          style={{
            background:
              "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f8ff 100%)",
            padding: "100px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>

          <div
            className="home-section-header"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#666",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Find answers to common questions about our platform
            </p>
          </div>

          <div
            className="faq-content"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* FAQ Items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* FAQ Item 1 */}
              <div
                className="faq-item"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(42, 125, 115, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleFAQ(1)}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    How do patients reach me?
                  </h4>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                      transform: expandedFAQs[1]
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </div>
                {expandedFAQs[1] && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(42, 125, 115, 0.1)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      They scan your QR and get connected.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 2 */}
              <div
                className="faq-item"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(42, 125, 115, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleFAQ(2)}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    Can I know who are looking for me?
                  </h4>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "linear-gradient(135deg, #3b6baa, #2a7d73)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                      transform: expandedFAQs[2]
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </div>
                {expandedFAQs[2] && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(42, 125, 115, 0.1)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      Yes. You will know if anyone scans your QR.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 3 */}
              <div
                className="faq-item"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(42, 125, 115, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleFAQ(3)}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    Do I need to teach patients?
                  </h4>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "linear-gradient(135deg, #05A1A4, #2a7d73)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                      transform: expandedFAQs[3]
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </div>
                {expandedFAQs[3] && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(42, 125, 115, 0.1)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      No, the app is super simple.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 4 */}
              <div
                className="faq-item"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(42, 125, 115, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleFAQ(4)}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    What if I can't accept new patients?
                  </h4>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "linear-gradient(135deg, #4CAF50, #05A1A4)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                      transform: expandedFAQs[4]
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </div>
                {expandedFAQs[4] && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(42, 125, 115, 0.1)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      You can decline or suggest later dates.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 5 */}
              <div
                className="faq-item"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(42, 125, 115, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleFAQ(5)}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    Do I need a receptionist or PC?
                  </h4>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "linear-gradient(135deg, #8E24AA, #4CAF50)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                      transform: expandedFAQs[5]
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </div>
                {expandedFAQs[5] && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(42, 125, 115, 0.1)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      Not at all—your phone is enough.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 6 */}
              <div
                className="faq-item"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(42, 125, 115, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleFAQ(6)}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    Can I use this with my paper prescription?
                  </h4>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "linear-gradient(135deg, #FF9800, #8E24AA)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                      transform: expandedFAQs[6]
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </div>
                {expandedFAQs[6] && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(42, 125, 115, 0.1)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      Yes, no need to change your current practice style.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Who can use */}
        <section id="who-can-use" className="home-who-can-use-section">
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>
          <div className="home-section-header">
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Who Can Use
            </h2>
          </div>
          <div className="who-can-use-container">
            <div className="who-can-use-content">
              <div className="who-can-use-intro">
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#666",
                    textAlign: "center",
                    fontWeight: "400",
                    lineHeight: "1.6",
                    marginBottom: "-1.5rem",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  The tellyoudoc is built for real doctors running real
                  clinics—not just big hospitals or tech-savvy cities where
                  advanced digital tools often feel out of reach. Whether you
                  work alone, run a small chamber, or serve patients in
                  semi-urban or rural areas, tellyoudoc helps you digitize your
                  care, one patient at a time.
                </p>
              </div>
              <div className="who-can-use-list">
                <div className="who-can-use-item">
                  <div className="who-can-use-icon">
                    <span>🏥</span>
                  </div>
                  <p>
                    Run a physical clinic or practice in semi-urban, towns, or
                    rural areas across India.
                  </p>
                </div>
                <div className="who-can-use-item">
                  <div className="who-can-use-icon">
                    <span>🤝</span>
                  </div>
                  <p>
                    Wish to connect easily with their patients who prefer
                    in-person interactions.
                  </p>
                </div>
                <div className="who-can-use-item">
                  <div className="who-can-use-icon">
                    <span>📈</span>
                  </div>
                  <p>
                    Want to grow their practice ensuring patients' easy reach
                    without complex apps.
                  </p>
                </div>
                <div className="who-can-use-item">
                  <div className="who-can-use-icon">
                    <span>📋</span>
                  </div>
                  <p>
                    Find challenging to keep track of patient visits, follow-up
                    and retention.
                  </p>
                </div>
                <div className="who-can-use-item">
                  <div className="who-can-use-icon">
                    <span>💡</span>
                  </div>
                  <p>
                    Looking for a reliable, easy-to-use digital solution that
                    respects the traditional doctor-patient relationship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section id="founders" className="home-founders-section">
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>
          <div className="home-section-header">
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Core Team
            </h2>
          </div>
          <div className="founders-container">
            <div className="founder-card">
              <div className="home-founder-header">
                <div className="founder-image">
                  <img
                    src="https://ieee-ims.org/sites/ieeeims/files/styles/cc_imgstyle_4_x_5/public/contacts/photo/profile_pic.jpg?h=6b0b5157&itok=lCD0DDnm"
                    alt="Dr. Shovan Barma"
                  />
                </div>
                <div
                  className="founder-title-group"
                  style={{ alignSelf: "flex-end" }}
                >
                  <h3>Dr. Shovan Barma</h3>
                  <p className="founder-role">
                    Founder,{" "}
                    <span style={{ color: "#FF7007", fontWeight: 800 }}>
                      tellyou
                    </span>
                    <span style={{ color: "#05AFA4", fontWeight: 800 }}>
                      doc
                    </span>
                  </p>
                  <p className="founder-affiliation">
                    Associate Professor, IIIT Guwahati
                  </p>
                </div>
              </div>
              <p className="founder-summary">
                Dr. Shovan Barma is the visionary behind tellyoudoc, a digital
                health platform designed to simplify the way patients connect
                with doctors—especially in critical and chronic care like breast
                cancer. Dr. Barma serves as an Associate Professor in the
                Department of ECE at IIIT Guwahati. With a Ph.D. from NCKU,
                Taiwan, Dr. Barma has spent over a decade researching AI based
                intelligent systems design and their application in real-world
                healthcare. The{" "}
                <span style={{ color: "#FF7007", fontWeight: 800 }}>
                  tellyou
                </span>
                <span style={{ color: "#05AFA4", fontWeight: 800 }}>doc</span>{" "}
                platform was born out of his observation that many Indian
                patients struggle to express their medical problems clearly
                during consultation, and often fail to track their regular
                symptoms pre/post consultation or during medication, leading to
                delayed diagnosis and poor outcomes. He recognized the need for
                a solution that bridges this communication gap—empowering
                patients with easy-to-use tools and enabling doctors with
                structured data. Under his leadership, tellyoudoc combines
                technology, empathy, and clinical insight to make healthcare
                simpler, smarter, and more connected—for both patients and
                doctors.
              </p>
            </div>

            <div className="founder-card">
              <div className="home-founder-header">
                <div className="founder-image">
                  <img src={doctorImageUrl} alt="Dr. Soumen Das" />
                </div>
                <div
                  className="founder-title-group"
                  style={{ alignSelf: "flex-end" }}
                >
                  <h3>Dr. Soumen Das</h3>
                  <p className="founder-role">
                    Co-Founder,{" "}
                    <span style={{ color: "#FF7007", fontWeight: 800 }}>
                      tellyou
                    </span>
                    <span style={{ color: "#05AFA4", fontWeight: 800 }}>
                      doc
                    </span>
                  </p>
                  <p className="founder-affiliation">
                    Senior Consultant, Surgical Oncology
                  </p>
                </div>
              </div>
              <p className="founder-summary">
                Dr. Soumen Das is a nationally acclaimed breast cancer surgeon
                and co-founder of TellyouDoc, a digital health platform created
                to transform how breast cancer patients are diagnosed,
                monitored, and treated. He currently serves as a Senior
                Consultant in Surgical Oncology and is the founder of the
                Institute of Breast Diseases, Kolkata—India's first dedicated
                breast care center. An alumnus of Medical College, Kolkata, Dr.
                Das topped the university in surgery and went on to complete his
                MS in General Surgery. He later trained at Tata Memorial
                Hospital, Mumbai, and earned prestigious fellowships including
                FRCS (Glasgow), FACS (USA), and European Breast Surgical
                Oncology Certification, becoming the first Indian surgeon to
                hold this distinction. The{" "}
                <span style={{ color: "#FF7007", fontWeight: 800 }}>
                  tellyou
                </span>
                <span style={{ color: "#05AFA4", fontWeight: 800 }}>doc</span>{" "}
                platform was co-founded by Dr. Das after years of witnessing
                patients struggle to explain symptoms clearly during
                consultations, and the lack of tools to track symptoms regularly
                throughout treatment. These gaps often led to delayed diagnoses
                and compromised outcomes. often led to delayed diagnoses and
                compromised outcomes. He envisioned a system where structured
                symptom tracking and clinical clarity come together—helping
                doctors make timely decisions and patients stay engaged in their
                care. Through his clinical leadership, TellyouDoc brings deep
                medical insight to its mission of making breast cancer care more
                responsive, personalized, and data-driven.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="bubble-1"></div>
          <div className="bubble-2"></div>
          <div className="bubble-3"></div>
          <div className="home-section-header">
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Contact Us
            </h2>
          </div>

          {/* Map and Form Section */}
          <div className="contact-main-section">
            <div className="contact-form">
              <h3>Send us a Message</h3>

              {/* Display success message if form is submitted successfully */}
              {formStatus.isSubmitted && (
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#e7f4e4",
                    borderRadius: "10px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                    ✅
                  </div>
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "#2c3e50",
                      marginBottom: "10px",
                    }}
                  >
                    Thank You for Your Message!
                  </h3>
                  <p style={{ color: "#5a6a7e", lineHeight: "1.6" }}>
                    We've received your inquiry and will get back to you
                    shortly.
                  </p>
                </div>
              )}

              {/* Display error message if there was an error submitting the form */}
              {formStatus.isError && (
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f4e4e4",
                    borderRadius: "10px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                    ❌
                  </div>
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "#2c3e50",
                      marginBottom: "10px",
                    }}
                  >
                    Something went wrong
                  </h3>
                  <p style={{ color: "#5a6a7e", lineHeight: "1.6" }}>
                    There was an error sending your message. Please try again
                    later.
                  </p>
                </div>
              )}

              {/* Show the form if it hasn't been submitted successfully */}
              {!formStatus.isSubmitted && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="name">Full Name</label>
                    {errors.name && (
                      <div style={errorMessageStyle}>{errors.name}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="email">Email Address</label>
                    {errors.email && (
                      <div style={errorMessageStyle}>{errors.email}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=" "
                      pattern="[0-9]{10}"
                      maxLength="10"
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                    {errors.phone && (
                      <div style={errorMessageStyle}>{errors.phone}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    ></textarea>
                    <label htmlFor="message">Message</label>
                    {errors.message && (
                      <div style={errorMessageStyle}>{errors.message}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={formStatus.isSubmitting}
                  >
                    {formStatus.isSubmitting
                      ? "Sending..."
                      : "Click to contact us"}
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="home-supported-content">
            <div className="home-supported-card">
              <div className="home-supported-logo">
                <img
                  src={iiitgLogo}
                  alt="IIIT Guwahati Logo"
                  className="home-supported-image"
                />
              </div>
            </div>
            <div className="home-supported-card">
              <div className="home-supported-logo">
                <img
                  src={drishtiLogo}
                  alt="Drishti CPS Logo"
                  className="home-supported-image"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="bottom-line"></div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="scroll-to-top-button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 8L6 16H18L12 8Z" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* WhatsApp Modal */}
      <Modal
        title="Get the App Free"
        open={whatsappModalVisible}
        onCancel={handleWhatsappModalClose}
        footer={null}
        centered
        width={450}
        className="whatsapp-modal"
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h4 style={{ color: "#2a7d73", margin: "0 0 10px 0" }}>
            Connect with us on WhatsApp
          </h4>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 20px 0" }}>
            Choose how you'd like to get in touch
          </p>
        </div>

        {/* Direct WhatsApp Link */}
        <div style={{ marginBottom: "25px", textAlign: "center" }}>
          <a
            href="https://wa.me/918099002939?text=Hi! I'm interested in getting the tellyoudoc app. Can you please provide me with more information?"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#25D366",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(37, 211, 102, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(37, 211, 102, 0.3)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            Chat on WhatsApp
          </a>
          <p style={{ color: "#666", fontSize: "12px", margin: "8px 0 0 0" }}>
            +91 8099002939
          </p>
        </div>
      </Modal>

      {/* Patient Modal */}
      <Modal
        open={patientModalVisible}
        onCancel={handlePatientModalClose}
        footer={null}
        centered
        width={500}
        className="patient-modal"
      >
        <div style={{ textAlign: "center", padding: "20px 0 0 0" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              border: "2px solid #3b6baa",
              borderRadius: "12px",
              padding: "25px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#3b6baa",
                color: "white",
                padding: "5px 15px",
                borderRadius: "15px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              DOWNLOAD NOW
            </div>

            <p
              style={{
                color: "#333",
                fontSize: "16px",
                margin: "15px 0 25px 0",
                lineHeight: "1.6",
              }}
            >
              Get the TellYouDoc Patient App for seamless healthcare management
            </p>

            {/* Download Link Button */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                color: "white",
                padding: "15px 30px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease",
                boxShadow: "0 6px 20px rgba(42, 125, 115, 0.3)",
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(42, 125, 115, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(42, 125, 115, 0.3)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Download APK
            </a>
          </div>

          {/* Approved by Doctors Badge */}
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(42, 125, 115, 0.3)",
              marginTop: "20px",
            }}
          >
            ✓ Approved by Doctors
          </div>

          {/* Store Information */}
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              padding: "15px",
              margin: "20px 0",
              textAlign: "left",
            }}
          >
            <h4
              style={{
                color: "#856404",
                margin: "0 0 10px 0",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Coming Soon to Google Play Store
            </h4>
            <p
              style={{
                color: "#856404",
                fontSize: "14px",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              The app will soon be available for download on the Google Play
              Store for easier access.
            </p>
          </div>

          {/* Platform Information */}
          <div
            style={{
              background: "#d1ecf1",
              border: "1px solid #bee5eb",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "left",
            }}
          >
            <h4
              style={{
                color: "#0c5460",
                margin: "0 0 10px 0",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 21H5V3H13V9H19V21Z" />
              </svg>
              Platform Compatibility
            </h4>
            <p
              style={{
                color: "#0c5460",
                fontSize: "14px",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              <strong>Android:</strong> Available now for download
              <br />
              <strong>iOS:</strong> Coming soon - will be available in the near
              future
            </p>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
};

export default Home;
