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

  // State for doctor form data in WhatsApp modal
  const [doctorFormData, setDoctorFormData] = useState({
    doctorName: "Dr. ",
    licenseNumber: "",
    whatsappNumber: "",
  });

  // State for doctor form validation errors
  const [doctorFormErrors, setDoctorFormErrors] = useState({});

  // State for doctor form submission
  const [doctorFormStatus, setDoctorFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
  });

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
    // Reset form when modal closes
    setDoctorFormData({
      doctorName: "",
      licenseNumber: "",
      whatsappNumber: "",
    });
    setDoctorFormErrors({});
    setDoctorFormStatus({
      isSubmitting: false,
      isSubmitted: false,
      isError: false,
    });
  };

  // Patient modal functions
  const handlePatientModalOpen = () => {
    setPatientModalVisible(true);
  };

  const handlePatientModalClose = () => {
    setPatientModalVisible(false);
  };

  // Doctor form handling functions
  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;

    // Special handling for WhatsApp number to only allow digits
    if (name === "whatsappNumber") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      setDoctorFormData({
        ...doctorFormData,
        [name]: limitedDigits,
      });
    }
    // Special handling for doctor name to replace multiple spaces with single space
    else if (name === "doctorName") {
      const cleanedText = value.replace(/\s+/g, " ");
      setDoctorFormData({
        ...doctorFormData,
        [name]: cleanedText,
      });
    }
    // License number handling - convert to uppercase and remove extra spaces
    else if (name === "licenseNumber") {
      const cleanedLicense = value.replace(/\s+/g, " ").toUpperCase();
      setDoctorFormData({
        ...doctorFormData,
        [name]: cleanedLicense,
      });
    } else {
      setDoctorFormData({
        ...doctorFormData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (doctorFormErrors[name]) {
      setDoctorFormErrors({
        ...doctorFormErrors,
        [name]: null,
      });
    }
  };

  // Validate doctor form data
  const validateDoctorForm = () => {
    const newErrors = {};

    // Doctor name validation
    if (!doctorFormData.doctorName.trim()) {
      newErrors.doctorName = "Doctor name is required";
    } else if (doctorFormData.doctorName.trim().length < 2) {
      newErrors.doctorName = "Doctor name must be at least 2 characters";
    }

    // License number validation
    if (!doctorFormData.licenseNumber.trim()) {
      newErrors.licenseNumber = "Medical license number is required";
    } else if (doctorFormData.licenseNumber.trim().length < 3) {
      newErrors.licenseNumber = "Please enter a valid license number";
    }

    // WhatsApp number validation
    if (!doctorFormData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(doctorFormData.whatsappNumber.trim())) {
      newErrors.whatsappNumber =
        "Please enter a valid 10-digit WhatsApp number";
    }

    setDoctorFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDoctorFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateDoctorForm()) {
      return;
    }

    setDoctorFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
    });

    try {
      // TODO: Implement API call to backend
      const response = await apiService.doctorService.requestApp({
        doctorName: doctorFormData.doctorName.trim(),
        licenseNumber: doctorFormData.licenseNumber.trim(),
        whatsappNumber: doctorFormData.whatsappNumber.trim(),
      });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDoctorFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: false,
      });

      message.success(
        "Thank you! We'll contact you soon with app download details."
      );

      // Close modal after successful submission
      setTimeout(() => {
        handleWhatsappModalClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting doctor form:", error);
      setDoctorFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
      });
      message.error(
        "There was an error submitting your request. Please try again."
      );
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
                  <h5 className="home-hero-title">
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
                  <p className="home-hero-description">
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
                    {/* <button
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
                    </button> */}
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
        <section
          id="about"
          className="about-section"
          style={{ padding: "2rem 0" }}
        >
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
            padding: "2rem 0",
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
                // Orange color
                color: "#3b6baa",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontStyle: "italic",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "600",
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
                gap: "3rem",
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
                    <path d="M3,3 L3,9 L9,9 L9,3 L3,3 M5,5 L7,5 L7,7 L5,7 L5,5 M15,3 L15,9 L21,9 L21,3 L15,3 M17,5 L19,5 L19,7 L17,7 L17,5 M3,15 L3,21 L9,21 L9,15 L3,15 M5,17 L7,17 L7,19 L5,19 L5,17 M11,3 L11,5 L13,5 L13,7 L11,7 L11,9 L13,9 L13,11 L15,11 L15,13 L17,13 L17,11 L19,11 L19,9 L21,9 L21,11 L19,11 L19,13 L21,13 L21,15 L19,15 L19,17 L17,17 L17,15 L15,15 L15,13 L13,13 L13,15 L11,15 L11,13 L13,13 L13,11 L11,11 L11,9 L13,9 L13,7 L15,7 L15,5 L13,5 L13,3 L11,3 M11,17 L11,19 L13,19 L13,21 L15,21 L15,19 L17,19 L17,21 L19,21 L19,19 L21,19 L21,17 L19,17 L19,15 L17,15 L17,17 L15,17 L15,15 L13,15 L13,17 L11,17 Z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
            padding: "2rem 0 0 0",
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
                color: "#3b6baa",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              Know Every Patient Who Is Looking for You
            </p>
          </div>

          <div
            className="benefits-content"
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Benefits Layout - Simple Grid Design (like Features) */}
            <div className="features-grid">
              {/* Benefit 1 */}
              <div className="simple-feature">
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
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Expand Reach Through Social Media
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Leverage digital platforms to extend your practice's
                    visibility and connect with more patients in your community.
                  </p>
                </div>
              </div>
              {/* Benefit 2 */}
              <div className="simple-feature">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #05A1A4, #2a7d73)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(5, 161, 164, 0.2)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Reduce No-Shows & Improve Patient Retention
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Minimize missed appointments and keep patients engaged with
                    your practice for better continuity of care.
                  </p>
                </div>
              </div>
              {/* Benefit 3 */}
              <div className="simple-feature">
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
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Improve Patient Satisfaction & Gain Loyalty
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Enhance patient experience through better communication and
                    care, building lasting relationships and trust.
                  </p>
                </div>
              </div>
              {/* Benefit 4 */}
              <div className="simple-feature">
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
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Gain Patient Engagement Deeper Insights
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
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
            padding: "2rem 0 0 0",
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
                color: "#3b6baa",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              Simple 4-step process to connect the patient with you
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
                      marginBottom: "0.8rem",
                      lineHeight: "1.3",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Show Your QR to Patients
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    Get a printed & shareable QR that patients can scan.
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
                    Patients scan the QR & describe their symptoms before
                    meeting you.
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
                    You decide who, when & where to treat as per over your
                    schedule.
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
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "rgba(0, 0, 0, 0.65)",
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
                    See & reply with treatment notes, and send follow-up
                    instructions.
                  </p>
                </div>
              </div>
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
            padding: "2rem 0",
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
              FAQ
            </h2>
            <p
              style={{
                fontSize: "1.4rem",
                color: "#666",
                textAlign: "center",
                maxWidth: "600px",
                margin: "1rem auto 3rem auto",
                lineHeight: "1.6",
                fontFamily: "Montserrat, sans-serif",
                color: "#3b6baa",
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              Answers to common asks about our platform
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
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "rgba(0, 0, 0, 0.65)",
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
                        fontSize: "1.2rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      Patients scan your QR and get connected.
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
                  onClick={() => toggleFAQ(6)}
                >
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "rgba(0, 0, 0, 0.65)",
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
                        fontSize: "1.2rem",
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
                  onClick={() => toggleFAQ(2)}
                >
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "rgba(0, 0, 0, 0.65)",
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
                        fontSize: "1.2rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      Yes. You will know if anyone new scans your QR.
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
                  onClick={() => toggleFAQ(3)}
                >
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "rgba(0, 0, 0, 0.65)",
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
                        fontSize: "1.2rem",
                        color: "#666",
                        lineHeight: "1.6",
                        margin: 0,
                        paddingTop: "1rem",
                      }}
                    >
                      No, the app is self-explanatory.
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
                  onClick={() => toggleFAQ(4)}
                >
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "rgba(0, 0, 0, 0.65)",
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
                        fontSize: "1.2rem",
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
                  onClick={() => toggleFAQ(5)}
                >
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "rgba(0, 0, 0, 0.65)",
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
                        fontSize: "1.2rem",
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
            </div>
          </div>
        </section>

        {/* Who can use */}
        <section
          id="who-can-use"
          className="home-who-can-use-section"
          style={{ padding: "2rem 0" }}
        >
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
                    fontSize: "1.4rem",
                    color: "#666",
                    textAlign: "center",
                    fontWeight: "400",
                    lineHeight: "1.6",
                    marginTop: "1rem",
                    marginBottom: "-2.8rem",
                    fontFamily: "Montserrat, sans-serif",
                    fontStyle: "italic",
                    color: "#3b6baa",
                    fontWeight: "600",
                  }}
                >
                  Built for doctors consulting one patient at a time in clinics,
                  whether working alone, running a chamber.
                </p>
              </div>
              <div className="who-can-use-list">
                <div
                  className="who-can-use-item"
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div className="who-can-use-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 21h18" />
                      <path d="M5 21V7l8-4v18" />
                      <path d="M19 21V11l-4-2" />
                      <circle cx="9" cy="9" r="1" />
                      <circle cx="15" cy="15" r="1" />
                    </svg>
                  </div>
                  <p style={{ margin: 0, flex: 1 }}>
                    Run a physical clinic or practice in semi-urban, towns, or
                    rural areas across India.
                  </p>
                </div>
                <div
                  className="who-can-use-item"
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div className="who-can-use-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p style={{ margin: 0, flex: 1 }}>
                    Wish to connect easily with their patients who prefer
                    in-person interactions.
                  </p>
                </div>
                <div
                  className="who-can-use-item"
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div className="who-can-use-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                    </svg>
                  </div>
                  <p style={{ margin: 0, flex: 1 }}>
                    Want to grow their practice ensuring patients' easy reach
                    without complex apps.
                  </p>
                </div>
                <div
                  className="who-can-use-item"
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div className="who-can-use-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                  </div>
                  <p style={{ margin: 0, flex: 1 }}>
                    Find challenging to keep track of patient visits, follow-up
                    and retention.
                  </p>
                </div>
                <div
                  className="who-can-use-item"
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div className="who-can-use-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <p style={{ margin: 0, flex: 1 }}>
                    Looking for a reliable, easy-to-use application that
                    respects the traditional doctor-patient relationship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section
          id="founders"
          className="home-founders-section"
          style={{ padding: "2rem 0" }}
        >
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
        <section
          id="contact"
          className="contact-section"
          style={{ padding: "2rem 0 0 0" }}
        >
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
        </section>

        {/* Supported By Section */}
        <section
          className="supported-by-section"
          style={{
            backgroundColor: "#ffffff",
            padding: "2rem 0",
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
              Supported by
            </h2>
          </div>
          <div
            className="home-supported-content"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div
              className="home-supported-card"
              style={{
                boxShadow:
                  "0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
              }}
            >
              <div className="home-supported-logo">
                <img
                  src={iiitgLogo}
                  alt="IIIT Guwahati Logo"
                  className="home-supported-image"
                />
              </div>
            </div>
            <div
              className="home-supported-card"
              style={{
                boxShadow:
                  "0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
              }}
            >
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
        open={whatsappModalVisible}
        onCancel={handleWhatsappModalClose}
        footer={null}
        centered
        width={500}
        className="whatsapp-modal"
      >
        <div style={{ padding: "10px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h4
              style={{
                color: "#2a7d73",
                margin: "0 0 5px 0",
                fontSize: "18px",
              }}
            >
              Request Doctor App Access
            </h4>
            <p
              style={{
                color: "#555",
                fontSize: "15px",
                margin: "8px 0",
                lineHeight: "1.4",
                fontWeight: "400",
              }}
            >
              Fill in your details and we'll send you the app download link
            </p>
            <p
              style={{
                color: "#777",
                fontSize: "15px",
                margin: "6px 0",
                lineHeight: "1.3",
                fontStyle: "italic",
                opacity: "0.9",
              }}
            >
              🔒 Your information is secure and will only be used to provide you
              with app access.
            </p>
            <p
              style={{
                color: "#2E7D32",
                fontSize: "14px",
                margin: "10px 0 0 0",
                fontWeight: "600",
                backgroundColor: "#E8F5E8",
                padding: "6px 12px",
                borderRadius: "16px",
                display: "inline-block",
                border: "1px solid #A5D6A7",
              }}
            >
              📱 Android version available now!
            </p>
          </div>

          {!doctorFormStatus.isSubmitted ? (
            <form onSubmit={handleDoctorFormSubmit}>
              {/* Doctor Name Field */}
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="doctorName"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  Doctor Name *
                </label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={doctorFormData.doctorName}
                  onChange={handleDoctorFormChange}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: doctorFormErrors.doctorName
                      ? "2px solid #e74c3c"
                      : "2px solid #e1e8ed",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!doctorFormErrors.doctorName) {
                      e.target.style.borderColor = "#2a7d73";
                    }
                  }}
                  onBlur={(e) => {
                    if (!doctorFormErrors.doctorName) {
                      e.target.style.borderColor = "#e1e8ed";
                    }
                  }}
                />
                {doctorFormErrors.doctorName && (
                  <div style={errorMessageStyle}>
                    {doctorFormErrors.doctorName}
                  </div>
                )}
              </div>

              {/* Medical License Number Field */}
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="licenseNumber"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  Medical License Number *
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={doctorFormData.licenseNumber}
                  onChange={handleDoctorFormChange}
                  placeholder="Enter your medical license number"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: doctorFormErrors.licenseNumber
                      ? "2px solid #e74c3c"
                      : "2px solid #e1e8ed",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!doctorFormErrors.licenseNumber) {
                      e.target.style.borderColor = "#2a7d73";
                    }
                  }}
                  onBlur={(e) => {
                    if (!doctorFormErrors.licenseNumber) {
                      e.target.style.borderColor = "#e1e8ed";
                    }
                  }}
                />
                {doctorFormErrors.licenseNumber && (
                  <div style={errorMessageStyle}>
                    {doctorFormErrors.licenseNumber}
                  </div>
                )}
              </div>

              {/* WhatsApp Number Field */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="whatsappNumber"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={doctorFormData.whatsappNumber}
                  onChange={handleDoctorFormChange}
                  placeholder="Enter 10-digit WhatsApp number"
                  maxLength="10"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: doctorFormErrors.whatsappNumber
                      ? "2px solid #e74c3c"
                      : "2px solid #e1e8ed",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!doctorFormErrors.whatsappNumber) {
                      e.target.style.borderColor = "#2a7d73";
                    }
                  }}
                  onBlur={(e) => {
                    if (!doctorFormErrors.whatsappNumber) {
                      e.target.style.borderColor = "#e1e8ed";
                    }
                  }}
                />
                {doctorFormErrors.whatsappNumber && (
                  <div style={errorMessageStyle}>
                    {doctorFormErrors.whatsappNumber}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  disabled={doctorFormStatus.isSubmitting}
                  style={{
                    background: doctorFormStatus.isSubmitting
                      ? "#cccccc"
                      : "linear-gradient(135deg, #2a7d73, #3b6baa)",
                    color: "white",
                    padding: "12px 35px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: doctorFormStatus.isSubmitting
                      ? "not-allowed"
                      : "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: doctorFormStatus.isSubmitting
                      ? "none"
                      : "0 4px 12px rgba(42, 125, 115, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    if (!doctorFormStatus.isSubmitting) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(42, 125, 115, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!doctorFormStatus.isSubmitting) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(42, 125, 115, 0.3)";
                    }
                  }}
                >
                  {doctorFormStatus.isSubmitting ? (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray="32"
                          strokeDashoffset="32"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                      Request App Access
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "25px 15px" }}>
              <div
                style={{
                  background: "#d4edda",
                  border: "1px solid #c3e6cb",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "15px",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="#155724"
                  style={{ marginBottom: "10px" }}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <h4
                  style={{
                    color: "#155724",
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                  }}
                >
                  Request Submitted Successfully!
                </h4>
                <p
                  style={{
                    color: "#155724",
                    fontSize: "13px",
                    margin: "0",
                    lineHeight: "1.4",
                  }}
                >
                  Thank you for your interest! We'll contact you on WhatsApp
                  with the app download details within 24 hours.
                </p>
              </div>
            </div>
          )}
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
