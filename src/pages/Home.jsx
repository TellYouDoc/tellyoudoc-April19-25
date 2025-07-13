import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Input, Button, message } from "antd";

// Importing styles
import "../styles/Home.css";

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
  const [whatsappForm] = Form.useForm();
  const [whatsappSubmitting, setWhatsappSubmitting] = useState(false);

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
    whatsappForm.resetFields();
  };

  const handleWhatsappSubmit = async (values) => {
    setWhatsappSubmitting(true);
    try {
      // You can add API call here if needed to store the WhatsApp number
      // For now, just show success message
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      message.success("Thank you! We will get back to you on WhatsApp soon.");
      setWhatsappModalVisible(false);
      whatsappForm.resetFields();
    } catch (error) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setWhatsappSubmitting(false);
    }
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
                      color: "#1a1a1a",
                      marginBottom: "1.5rem",
                      fontWeight: 800,
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
            <h2>About Us</h2>
          </div>
          <div className="home-about-section-content">
            <div className="home-about-section-about-content">
              <div className="home-about-section-about-info about-beautiful-flex">
                <div className="home-about-section-about-item about-beautiful-item">
                  <div className="home-about-section-about-item-label">
                    Vision
                  </div>
                  <p>
                    To become India’s most trusted digital companion for every
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
                <div className="home-about-section-about-item about-beautiful-item">
                  <div className="home-about-section-about-item-label">
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
            <p
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                textAlign: "center",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "2rem",
              }}
            >
              Everything You Need, Nothing You Don't
            </p>
            <div
              style={{
                width: "100px",
                height: "4px",
                background: "linear-gradient(90deg, #2a7d73, #3b6baa)",
                margin: "0 auto 4rem auto",
                borderRadius: "2px",
                boxShadow: "0 2px 10px rgba(42, 125, 115, 0.3)",
              }}
            ></div>
          </div>

          <div
            className="product-content tellyoudoc-offers-content home-product-section-content"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Features Layout - Two Column Design */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "4rem",
                marginBottom: "4rem",
                alignItems: "start",
              }}
            >
              {/* Left Column - 4 Compact Feature Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                {/* Feature 1 */}
                <div
                  className="feature-card"
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                    borderRadius: "15px",
                    padding: "1.8rem",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(42, 125, 115, 0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(42, 125, 115, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.06)";
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M3 5h12v2H3V5zm0 4h12v2H3V9zm0 4h8v2H3v-2zm16-1.5L17 13l-2-2 1.5-1.5L18 11l3-3 1.5 1.5L19 13z" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Personalized Practice QR
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.5",
                    }}
                  >
                    Generate unique QR codes for instant patient connections.
                  </p>
                </div>

                {/* Feature 2 */}
                <div
                  className="feature-card"
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                    borderRadius: "15px",
                    padding: "1.8rem",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(42, 125, 115, 0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(42, 125, 115, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.06)";
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
                      marginBottom: "1rem",
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
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Patient Visit Requests
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.5",
                    }}
                  >
                    Manage consultation requests and patient queue efficiently.
                  </p>
                </div>

                {/* Feature 3 */}
                <div
                  className="feature-card"
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                    borderRadius: "15px",
                    padding: "1.8rem",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(42, 125, 115, 0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(42, 125, 115, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.06)";
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
                      marginBottom: "1rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Symptom Pre-screening
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.5",
                    }}
                  >
                    Review symptoms before appointments for better preparation.
                  </p>
                </div>

                {/* Feature 4 */}
                <div
                  className="feature-card"
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                    borderRadius: "15px",
                    padding: "1.8rem",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(42, 125, 115, 0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(42, 125, 115, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.06)";
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
                      marginBottom: "1rem",
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h7c-.63-.84-1-1.87-1-3 0-2.76 2.24-5 5-5 .34 0 .68.03 1 .09V8l-6-6zm4 18c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                      <circle cx="18" cy="17" r="1" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                    }}
                  >
                    Digital Treatment Notes
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      lineHeight: "1.5",
                    }}
                  >
                    Share prescriptions and follow-up instructions digitally.
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
            <h3
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                textAlign: "center",
                color: "#333",
                marginBottom: "2rem",
              }}
            >
              Know Every Patient Who Is Looking for You
            </h3>
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
                marginBottom: "2rem",
              }}
            >
              How it Works
            </h2>
            <div
              style={{
                width: "100px",
                height: "4px",
                margin: "0 auto 4rem auto",
              }}
            ></div>
          </div>

          <div
            className="how-it-works-content"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Steps Container */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                marginBottom: "2rem",
                alignItems: "center",
              }}
            >
              {/* Step 1 */}
              <div
                className="step-card"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "600px",
                  width: "100%",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(42, 125, 115, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    1
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    Put Your QR in the Clinic
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                    marginLeft: "56px",
                  }}
                >
                  Get a printed and Shareable QR that patients can scan (You
                  will see every patient who searched you.)
                </p>
              </div>

              {/* Step 2 */}
              <div
                className="step-card"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "600px",
                  width: "100%",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(42, 125, 115, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "linear-gradient(135deg, #3b6baa, #2a7d73)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    2
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    Patient Sends Visit Request
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                    marginLeft: "56px",
                  }}
                >
                  Patients scan and describe symptoms before meeting you.
                </p>
              </div>

              {/* Step 3 */}
              <div
                className="step-card"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "600px",
                  width: "100%",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(42, 125, 115, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "linear-gradient(135deg, #05A1A4, #2a7d73)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    3
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    You Accept or Decline
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                    marginLeft: "56px",
                  }}
                >
                  You decide who to treat, when, and where.
                </p>
              </div>

              {/* Step 4 */}
              <div
                className="step-card"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(42, 125, 115, 0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "600px",
                  width: "100%",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(42, 125, 115, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "linear-gradient(135deg, #4CAF50, #05A1A4)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    4
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    Track Ongoing Cases
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                    marginLeft: "56px",
                  }}
                >
                  See new symptoms, reply with treatment notes, send follow-up
                  instructions.
                </p>
              </div>
            </div>

            {/* Bottom Message */}
            <div
              style={{
                textAlign: "center",
                padding: "1.8rem",
                background: "linear-gradient(135deg, #2a7d73, #3b6baa)",
                borderRadius: "15px",
                color: "white",
                boxShadow: "0 10px 25px rgba(42, 125, 115, 0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background overlay for better text contrast */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.1)",
                  zIndex: 0,
                }}
              ></div>
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  margin: 0,
                  lineHeight: "1.5",
                  textShadow: "0 3px 15px rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                No website, no listing, no tech clutter. Just your offline
                practice —made smarter.
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
                marginBottom: "2rem",
              }}
            >
              Frequently Asked Questions
            </h2>
            <div
              style={{
                width: "100px",
                height: "4px",
                background: "linear-gradient(90deg, #2a7d73, #3b6baa)",
                margin: "0 auto 4rem auto",
                borderRadius: "2px",
                boxShadow: "0 2px 10px rgba(42, 125, 115, 0.3)",
              }}
            ></div>
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
                    }}
                  >
                    +
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid rgba(42, 125, 115, 0.1)",
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
                    }}
                  >
                    +
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid rgba(42, 125, 115, 0.1)",
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
                    }}
                  >
                    +
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid rgba(42, 125, 115, 0.1)",
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
                    }}
                  >
                    +
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid rgba(42, 125, 115, 0.1)",
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
                    }}
                  >
                    +
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid rgba(42, 125, 115, 0.1)",
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
                    }}
                  >
                    +
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid rgba(42, 125, 115, 0.1)",
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
            <h2>Who Can Use</h2>
          </div>
          <div className="who-can-use-container">
            <div className="who-can-use-content">
              <div className="who-can-use-intro">
                <p>
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
            <h2>Core Team</h2>
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
            <h2>Contact Us</h2>
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
        </section>

        {/* Supported By Section */}
        <section className="home-supported-section">
          <div className="home-section-header">
            <h2>Supported By</h2>
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
        width={400}
        className="whatsapp-modal"
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h4 style={{ color: "#2a7d73", margin: "0 0 10px 0" }}>
            Give your WhatsApp number, we will get back to you!
          </h4>
        </div>

        <Form
          form={whatsappForm}
          onFinish={handleWhatsappSubmit}
          layout="vertical"
        >
          <Form.Item
            label="WhatsApp Number"
            name="whatsappNumber"
            rules={[
              { required: true, message: "Please enter your WhatsApp number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number!",
              },
            ]}
          >
            <Input
              placeholder="Enter your 10-digit WhatsApp number"
              maxLength={10}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, "");
                whatsappForm.setFieldsValue({ whatsappNumber: value });
              }}
              style={{ padding: "10px" }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={whatsappSubmitting}
              style={{
                backgroundColor: "#2a7d73",
                borderColor: "#2a7d73",
                width: "100%",
                padding: "10px",
                height: "auto",
              }}
            >
              {whatsappSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </>
  );
};

export default Home;
