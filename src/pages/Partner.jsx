import { useState, useEffect } from "react";
import "../styles/Partner.css";

import Ribbon from "../assets/images/ribon.png";
import { useLocation } from "react-router-dom";
import Welcome_Navbar from "../components/Welcome_Navbar";
import Footer from "../components/Footer";
import whoisin from "../assets/images/who-can-join-1.png";
import whoisin2 from "../assets/images/who-can-join-2.png";
import whoisin3 from "../assets/images/who-can-join-3.png";
import whoisin4 from "../assets/images/who-can-join-4.png";
import whoisin5 from "../assets/images/who-can-join-5.png";

import logo1 from "../assets/images/logos/symptom-logging-mastalgia-chart.png";
import logo2 from "../assets/images/logos/breast-logo.png";
import logo3 from "../assets/images/logos/doctor-logo.png";

import axios from "axios";
import apiService from "../services/api";

const Partner = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
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

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [formStep, setFormStep] = useState(1); // Track form step: 1 for basic info, 2 for full form
  const [otpSent, setOtpSent] = useState({ mobile: false, email: false });
  const [otpVerified, setOtpVerified] = useState({
    mobile: false,
    email: false,
  });
  const [otpValues, setOtpValues] = useState({ mobile: "", email: "" });
  const [otpErrors, setOtpErrors] = useState({ mobile: "", email: "" });

  // Loaders states
  const [otpLoading, setOtpLoading] = useState({ mobile: false, email: false });
  const [verifyLoading, setVerifyLoading] = useState({
    mobile: false,
    email: false,
  });

  // State for form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // State for OTP resend cooldown timers (in seconds)
  const [otpTimers, setOtpTimers] = useState({ mobile: 0, email: 0 });
  const [timerActive, setTimerActive] = useState({
    mobile: false,
    email: false,
  });

  // State to track which inputs have focus
  const [focusedInput, setFocusedInput] = useState(null);

  // State to track window size for responsive styling
  const [isMobile, setIsMobile] = useState(false);

  // State to track if the form is showing
  const [showForm, setShowForm] = useState(false);
  // Get URL parameters
  const location = useLocation();

  // Init ID
  const [initId, setInitId] = useState(null);

  // Check URL parameters for openForm
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("openForm") === "true") {
      setShowForm(true);
    }
  }, [location]);
  // Update the useEffect for responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
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

  // Effect to handle countdown timers for OTP resend
  useEffect(() => {
    // Start countdown for mobile OTP
    let mobileInterval;
    let emailInterval;

    if (timerActive.mobile && otpTimers.mobile > 0) {
      mobileInterval = setInterval(() => {
        setOtpTimers((prevTimers) => ({
          ...prevTimers,
          mobile: prevTimers.mobile - 1,
        }));
      }, 1000);
    }

    // Start countdown for email OTP
    if (timerActive.email && otpTimers.email > 0) {
      emailInterval = setInterval(() => {
        setOtpTimers((prevTimers) => ({
          ...prevTimers,
          email: prevTimers.email - 1,
        }));
      }, 1000);
    }

    // Clear intervals and set timer to inactive when countdown reaches zero
    if (otpTimers.mobile === 0 && timerActive.mobile) {
      setTimerActive((prev) => ({ ...prev, mobile: false }));
    }

    if (otpTimers.email === 0 && timerActive.email) {
      setTimerActive((prev) => ({ ...prev, email: false }));
    }

    // Clean up intervals on component unmount or when timer reaches 0
    return () => {
      if (mobileInterval) clearInterval(mobileInterval);
      if (emailInterval) clearInterval(emailInterval);
    };
  }, [otpTimers, timerActive]);

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

  // Theme color for the form
  const themeColor = "#e83e8c";

  // Input style with error handling
  // Modified inputStyle function with responsiveness
  const inputStyle = (name) => {
    // Base styles
    const baseStyle = {
      ...interactiveStyle,
      width: "100%",
      padding: isMobile ? "6px 12px" : "8px 15px",
      fontSize: isMobile ? "14px" : "16px",
      border: `1px solid ${
        errors[name]
          ? "#ff4d4f"
          : focusedInput === name || formData[name]
          ? themeColor
          : "#ddd"
      }`,
      borderRadius: "5px",
      backgroundColor: "white",
      outline: "none",
      height: isMobile ? "40px" : "45px",
      boxSizing: "border-box",
      lineHeight: "normal",
    };

    // Apply additional styles for extremely small screens
    if (window.innerWidth <= 375) {
      baseStyle.padding = "5px 10px";
      baseStyle.fontSize = "13px";
      baseStyle.height = "36px";
    }

    return baseStyle;
  };

  // Modified labelStyle function with responsiveness
  const labelStyle = (name) => {
    // Determine font size based on screen size and field state
    let fontSize;
    if (window.innerWidth <= 375) {
      fontSize = formData[name] || focusedInput === name ? "10px" : "13px";
    } else if (window.innerWidth <= 320) {
      fontSize = formData[name] || focusedInput === name ? "11px" : "10px";
    } else if (isMobile) {
      fontSize = formData[name] || focusedInput === name ? "11px" : "12px";
    } else {
      fontSize = formData[name] || focusedInput === name ? "12px" : "14px";
    }

    // Base styles
    return {
      ...interactiveStyle,
      position: "absolute",
      left: isMobile ? "12px" : "15px",
      top:
        formData[name] || focusedInput === name
          ? isMobile
            ? "-8px"
            : "-10px"
          : "50%",
      transform:
        formData[name] || focusedInput === name
          ? "translateY(0)"
          : "translateY(-50%)",
      fontSize: fontSize,
      color: errors[name]
        ? "#ff4d4f"
        : formData[name] || focusedInput === name
        ? themeColor
        : "#666",
      pointerEvents: "none",
      backgroundColor:
        formData[name] || focusedInput === name ? "white" : "transparent",
      padding:
        formData[name] || focusedInput === name
          ? isMobile
            ? "0 3px"
            : "0 5px"
          : "0",
      zIndex: "1",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "90%",
    };
  };

  // Update textarea style to align content to the top
  const textareaStyle = (name) => {
    const baseStyle = {
      ...inputStyle(name),
      height: window.innerWidth <= 375 ? "60px" : "120px", // Fixed height based on screen size
      resize: "none", // Prevent any resizing
      paddingTop: "12px",
      paddingBottom: "10px",
      verticalAlign: "top",
      lineHeight: "1.5",
      textAlign: "left",
      overflow: "auto", // Add scrolling if content exceeds the fixed height
    };

    return baseStyle;
  };

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

  // Form validation function
  const validateForm = () => {
    let formErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      formErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      formErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      formErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      formErrors.lastName = "Last name must be at least 2 characters";
    }

    // Middle name is optional, but if provided, validate it
    if (formData.middleName.trim() && formData.middleName.trim().length < 2) {
      formErrors.middleName = "Middle name must be at least 2 characters";
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
        // Prepare form data for submission
        const dataToSend = {
          id: initId,
          city: formData.city,
          state: formData.state,
          specialization: formData.specialization,
          hospitalName: formData.hospitalName,
          qualification: formData.qualification,
          experience: formData.experience,
          reason: formData.reason,
        };

        const response = await apiService.betaRegistration.registerBeta(
          dataToSend
        );

        console.log("Form submission response:", response);

        if (response.status === 200 || response.status === 201) {
          // Reset the form
          setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
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
      } finally {
        setShowForm(false);
        setFormStep(1);
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

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Then modify your function to use the state variable
  const getResponsiveLabel = (fullLabel, shortLabel) => {
    return screenWidth <= 425 ? shortLabel : fullLabel;
  };

  // Function to handle showing the form with slide animation
  const handleShowForm = (e) => {
    e.preventDefault();

    if (showForm) {
      setShowForm(false);
      return;
    }

    setShowForm(true);
    setFormStep(1); // Reset to step 1 when showing form
  };

  // Validate first step of the form
  const validateFirstStep = () => {
    const errors = {};
    const fields = {
      firstName: {
        required: true,
        minLength: 2,
        message: "First name must be at least 2 characters",
      },
      lastName: {
        required: true,
        minLength: 2,
        message: "Last name must be at least 2 characters",
      },
      middleName: {
        required: false,
        minLength: 2,
        message: "Middle name must be at least 2 characters",
      },
      mobileNumber: {
        required: true,
        pattern: /^[0-9]{10}$/,
        message: "Enter a valid 10-digit mobile number",
      },
      email: {
        required: true,
        pattern: /\S+@\S+\.\S+/,
        message: "Enter a valid email address",
      },
    };

    Object.entries(fields).forEach(([field, rules]) => {
      const value = formData[field].trim();
      if (rules.required && !value) {
        errors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      } else if (value && rules.minLength && value.length < rules.minLength) {
        errors[field] = rules.message;
      } else if (value && rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message;
      }
    });

    return errors;
  };

  // Handle OTP success
  const handleOTPSuccess = (response) => {
    const { id } = response.data.data;

    // Batch update states
    setInitId(id);
    setFormStep(2);
    setOtpSent({ mobile: true, email: true });
    setOtpTimers({ mobile: 60, email: 60 });
    setTimerActive({ mobile: true, email: true });

    setFeedback({
      type: "success",
      message: "OTP sent to your mobile number and email.",
    });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 3000);
  };

  // Handle API errors
  const handleAPIError = (error) => {
    const errorMessage = error.response?.data?.message;
    const errorMap = {
      "A registration with this mobile number already exists": {
        field: "mobileNumber",
        message:
          "The submitted Phone number already exists. Try with other credentials",
      },
      "A registration with this email already exists": {
        field: "email",
        message:
          "The submitted Email already exists. Try with other credentials",
      },
    };

    const errorInfo = errorMap[errorMessage] || {
      field: null,
      message: "An unexpected error occurred. Please try again later.",
    };

    if (errorInfo.field) {
      setErrors((prev) => ({
        ...prev,
        [errorInfo.field]:
          errorInfo.field === "mobileNumber"
            ? "Phone number already exists"
            : "Email already exists",
      }));
    }

    setFeedback({
      type: "error",
      message: errorInfo.message,
    });
  };

  // Function to handle next step in form
  const handleNextStep = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const firstStepErrors = validateFirstStep();
      setErrors(firstStepErrors);

      if (Object.keys(firstStepErrors).length === 0) {
        const response = await apiService.betaRegistration.initialRegistration({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          mobileNumber: `91${formData.mobileNumber}`,
          email: formData.email,
        });

        if (response.status === 200) {
          handleOTPSuccess(response);
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data);
      handleAPIError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to go back to step 1
  const handleBackStep = () => {
    // Reset form step
    setFormStep(1);

    // Reset all OTP related states
    setOtpSent({ mobile: false, email: false });
    setOtpVerified({ mobile: false, email: false });
    setOtpValues({ mobile: "", email: "" });
    setOtpErrors({ mobile: "", email: "" });
    setOtpLoading({ mobile: false, email: false });

    // Reset timer related states
    setOtpTimers({ mobile: 0, email: 0 });
    setTimerActive({ mobile: false, email: false });

    // Reset the initial ID value
    setInitId(null);

    // Clear any feedback messages
    setFeedback({ type: "", message: "" });

    scrollToTop();
  };

  // Function to handle OTP input
  const handleOtpChange = (e, type) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtpValues({
        ...otpValues,
        [type]: value,
      });

      if (otpErrors[type]) {
        setOtpErrors({
          ...otpErrors,
          [type]: "",
        });
      }
    }
  };

  // Function to verify OTP
  const verifyOtp = async (type) => {
    // Get the OTP value
    const otpValue = otpValues[type];

    if (otpValue.length !== 6) {
      setOtpErrors({
        ...otpErrors,
        [type]: "Please enter a valid 6-digit OTP",
      });
      return;
    }

    setVerifyLoading({
      ...verifyLoading,
      [type]: true,
    });

    // API call to verify OTP
    const dataToSend = {
      id: initId,
      otp: otpValue,
    };

    if (type === "email") {
      const verifyOTPresponse =
        await apiService.betaRegistration.verifyEmailOTP(dataToSend);

      console.log("OTP verification response:", verifyOTPresponse);

      if (verifyOTPresponse.status === 200) {
        // Mark as verified
        setOtpVerified({
          ...otpVerified,
          [type]: true,
        });

        // Show success message
        setFeedback({
          type: "success",
          message: `${
            type === "mobile" ? "Mobile number" : "Email"
          } verified successfully!`,
        });

        setOtpLoading({
          ...otpLoading,
          [type]: false,
        });
      }
    } else {
      const verifyOTPresponse =
        await apiService.betaRegistration.verifyPhoneOTP(dataToSend);

      console.log("OTP verification response:", verifyOTPresponse);

      if (verifyOTPresponse.status === 200) {
        // Mark as verified
        setOtpVerified({
          ...otpVerified,
          [type]: true,
        });

        // Show success message
        setFeedback({
          type: "success",
          message: `${
            type === "mobile" ? "Mobile number" : "Email"
          } verified successfully!`,
        });

        setOtpLoading({
          ...otpLoading,
          [type]: false,
        });
      }
    }
  };

  // Function to resend OTP
  const resendOtp = async (type) => {
    // If timer is active or loading, don't allow resending
    if (timerActive[type] || otpLoading[type]) {
      return;
    }

    // Set loading state for this type
    setOtpLoading({
      ...otpLoading,
      [type]: true,
    });

    // Create data to send
    const dataToSend = {
      id: initId,
    };

    try {
      // Call API to resend OTP
      let response;
      if (type === "mobile") {
        response = await apiService.betaRegistration.resendPhoneOTP(dataToSend);
      } else {
        response = await apiService.betaRegistration.resendEmailOTP(dataToSend);
      }

      if (response.status === 200) {
        // Reset OTP value
        setOtpValues({
          ...otpValues,
          [type]: "",
        });

        // Update OTP sent status
        setOtpSent({
          ...otpSent,
          [type]: true,
        });

        // Start the 60-second (1 minute) timer
        setOtpTimers({
          ...otpTimers,
          [type]: 60,
        });

        // Activate the timer
        setTimerActive({
          ...timerActive,
          [type]: true,
        });

        // Show success message
        setFeedback({
          type: "success",
          message: `OTP resent to your ${
            type === "mobile" ? "mobile number" : "email"
          }.`,
        });
        setTimerActive({
          ...timerActive,
          [type]: true,
        });
      }
    } catch (error) {
      console.error(`Error resending ${type} OTP:`, error);
      setFeedback({
        type: "error",
        message: `Failed to resend OTP. Please try again.`,
      });
    } finally {
      // Clear loading state
      setOtpLoading({
        ...otpLoading,
        [type]: false,
      });
    }
  };

  return (
    <>
      <Welcome_Navbar />
      <div className="partner-container">
        {/* Hero Section */}
        <section className="partner-hero">
          <div className="hero-content-wrapper">
            <div className={`hero-text ${showForm ? "slide-out-left" : ""}`}>
              <div className="hero-label">Partner Program</div>
              <h1 className="hero-title">
                Join the future of{" "}
                <span className="brand-orange" style={{ color: "#05AFA4" }}>
                  Oncology
                </span>{" "}
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
                management, and patient support. <br />
                <br /> Join the Beta program and help to shape the future of
                cancer care alongside leading oncologists.
              </p>
              <div className="hero-cta">
                <div className="cta-buttons">
                  <a href="#beta-launch-section" className="cta-button">
                    Beta Features
                  </a>
                </div>
                <div className="cta-buttons" id="cta-2">
                  <a href="#who-can-join-section" className="cta-button">
                    Who can join ?
                  </a>
                </div>
                <div className="cta-buttons">
                  <a
                    className="cta-button"
                    onClick={handleShowForm}
                    style={{ userSelect: "none", cursor: "pointer" }}
                  >
                    Join Us
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-space">
              <div
                className="benefits-container"
                style={{ marginTop: showForm ? "170px" : "20px" }}
              >
                <h2 className="benefits-heading">Beta Benefits</h2>

                {heroBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className={`benefit ${benefit.className}`}
                  >
                    <div className="benefit-header">
                      <div className="benefit-count" id="beta-benefit-count">
                        {benefit.id}
                      </div>
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
              className={`hero-form-container ${
                showForm ? "slide-in-left" : ""
              }`}
              style={{ borderRadius: "10px" }}
            >
              <div className="hero-form-wrapper">
                <div className="hero-form-header">
                  <h2 className="hero-form-title">Join the Beta Program</h2>
                  <button
                    className="hero-form-close"
                    onClick={() => setShowForm(false)}
                    style={{
                      color: themeColor,
                      fontSize: "28px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div className="eligibility-note">
                  <span className="asterisk">*</span> Only professionals and
                  institutions working in India having valid registration.
                </div>

                <div className="hero-form-content">
                  {formStep === 1 ? (
                    <form onSubmit={handleNextStep} className="form-container">
                      <FeedbackMessage />

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onFocus={() => handleFocus("firstName")}
                            onBlur={handleBlur}
                            style={{
                              ...inputStyle("firstName"),
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                            }}
                            required
                          />
                          <label
                            htmlFor="firstName"
                            style={labelStyle("firstName")}
                          >
                            {getResponsiveLabel("First Name", "First")}
                          </label>
                          {errors.firstName && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.firstName}
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            onFocus={() => handleFocus("middleName")}
                            onBlur={handleBlur}
                            style={{
                              ...inputStyle("middleName"),
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                            }}
                          />
                          <label
                            htmlFor="middleName"
                            style={labelStyle("middleName")}
                          >
                            {getResponsiveLabel("Middle Name", "Middle")}
                          </label>
                          {errors.middleName && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.middleName}
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onFocus={() => handleFocus("lastName")}
                            onBlur={handleBlur}
                            style={{
                              ...inputStyle("lastName"),
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                            }}
                            required
                          />
                          <label
                            htmlFor="lastName"
                            style={labelStyle("lastName")}
                          >
                            {getResponsiveLabel("Last Name", "Last")}
                          </label>
                          {errors.lastName && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ ...formGroupStyle, marginBottom: "12px" }}>
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          onFocus={() => handleFocus("mobileNumber")}
                          onBlur={handleBlur}
                          style={{
                            ...inputStyle("mobileNumber"),
                            backgroundColor: "#f0f0f0",
                            width: "100%",
                            border: "1px solid #ddd",
                          }}
                          required
                          maxLength="10"
                        />
                        <label
                          htmlFor="mobileNumber"
                          style={labelStyle("mobileNumber")}
                        >
                          {getResponsiveLabel("Mobile Number", "Mobile")}
                        </label>
                        {errors.mobileNumber && (
                          <div style={{ ...errorStyle, marginTop: "2px" }}>
                            {errors.mobileNumber}
                          </div>
                        )}
                      </div>

                      <div style={{ ...formGroupStyle, marginBottom: "12px" }}>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={handleBlur}
                          style={{
                            ...inputStyle("email"),
                            backgroundColor: "#f0f0f0",
                            width: "100%",
                            border: "1px solid #ddd",
                          }}
                          required
                        />
                        <label htmlFor="email" style={labelStyle("email")}>
                          {getResponsiveLabel("Email Address", "Email")}
                        </label>
                        {errors.email && (
                          <div style={{ ...errorStyle, marginTop: "2px" }}>
                            {errors.email}
                          </div>
                        )}
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
                          padding:
                            window.innerWidth <= 375 ? "8px 15px" : "10px 20px",
                          marginTop: "15px",
                          fontSize: window.innerWidth <= 375 ? "14px" : "16px",
                          backgroundColor: themeColor,
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          opacity: isSubmitting ? 0.7 : 1,
                          fontWeight: "500",
                        }}
                      >
                        {isSubmitting ? "Processing..." : "Next"}
                      </button>

                      <div
                        style={{
                          fontSize:
                            window.innerWidth <= 375 ? "0.75rem" : "0.85rem",
                          marginTop: "8px",
                          color: "#666",
                          textAlign: "left",
                        }}
                      >
                        <small
                          style={{
                            fontSize:
                              window.innerWidth <= 375 ? "0.75rem" : "0.85rem",
                            lineHeight: "1.4",
                          }}
                        >
                          <span style={{ color: themeColor }}>*</span>
                          <strong>
                            {getResponsiveLabel(
                              "Assurance of Privacy:",
                              "Privacy:"
                            )}
                          </strong>
                          {getResponsiveLabel(
                            " We value your trust. All your details will be kept confidential and used only for internal beta coordination.",
                            " Your details will be kept confidential."
                          )}
                        </small>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="form-container">
                      <FeedbackMessage />

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onFocus={() => handleFocus("firstName")}
                            onBlur={handleBlur}
                            style={{
                              ...inputStyle("firstName"),
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                            }}
                            required
                            readOnly
                          />
                          <label
                            htmlFor="firstName"
                            style={labelStyle("firstName")}
                          >
                            {getResponsiveLabel("First Name", "First")}
                          </label>
                          {errors.firstName && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.firstName}
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            onFocus={() => handleFocus("middleName")}
                            onBlur={handleBlur}
                            style={{
                              ...inputStyle("middleName"),
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                            }}
                            readOnly
                          />
                          <label
                            htmlFor="middleName"
                            style={labelStyle("middleName")}
                          >
                            {getResponsiveLabel("Middle Name", "Middle")}
                          </label>
                          {errors.middleName && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.middleName}
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onFocus={() => handleFocus("lastName")}
                            onBlur={handleBlur}
                            style={{
                              ...inputStyle("lastName"),
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                            }}
                            required
                            readOnly
                          />
                          <label
                            htmlFor="lastName"
                            style={labelStyle("lastName")}
                          >
                            {getResponsiveLabel("Last Name", "Last")}
                          </label>
                          {errors.lastName && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mobile Number Verification Row */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ marginBottom: "6px" }}>
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#444",
                            }}
                          >
                            Mobile Verification
                          </label>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              flex: isMobile ? "1" : "0.4",
                              position: "relative",
                              width: isMobile ? "100%" : "auto",
                            }}
                          >
                            <input
                              type="tel"
                              value={formData.mobileNumber}
                              style={{
                                ...inputStyle("mobileNumber"),
                                backgroundColor: "#f0f0f0",
                                width: "100%",
                                border: "1px solid #ddd",
                              }}
                              readOnly
                              disabled
                            />
                          </div>

                          {/* OTP Input */}
                          <div
                            style={{
                              flex: isMobile ? "1" : "0.3",
                              position: "relative",
                              width: isMobile ? "100%" : "auto",
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              value={otpValues.mobile}
                              onChange={(e) => handleOtpChange(e, "mobile")}
                              style={{
                                ...inputStyle("mobileOtp"),
                                textAlign: "center",
                                letterSpacing: "2px",
                                width: "100%",
                                fontSize: "15px",
                              }}
                              maxLength={6}
                              disabled={otpVerified.mobile}
                            />
                            {otpErrors.mobile && (
                              <div style={{ ...errorStyle, fontSize: "11px" }}>
                                {otpErrors.mobile}
                              </div>
                            )}
                            {!otpVerified.mobile && (
                              // Resend OTP section for Phone number
                              <div
                                style={{
                                  textAlign: "right",
                                  marginTop: "5px",
                                  fontSize: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* Resend / Sending with Loader */}
                                  <button
                                    type="button"
                                    onClick={() => resendOtp("mobile")}
                                    disabled={otpLoading.mobile}
                                    style={{
                                      display: "flex",
                                      background: "none",
                                      border: "none",
                                      color: timerActive.mobile
                                        ? "#999"
                                        : themeColor,
                                      cursor: timerActive.mobile
                                        ? "not-allowed"
                                        : "pointer",
                                      fontWeight: "500",
                                      padding: 0,
                                      textDecoration: "none",
                                    }}
                                  >
                                    {otpLoading.mobile
                                      ? "Sending"
                                      : "Resend OTP"}
                                    {otpLoading.mobile && (
                                      <div
                                        style={{
                                          margin: "3px 0 0 5px",
                                          marginLeft: "5px",
                                          width: "12px",
                                          height: "12px",
                                          border: "2px solid #999",
                                          borderTop: "2px solid transparent",
                                          borderRadius: "50%",
                                          animation: "spin 1s linear infinite",
                                        }}
                                      />
                                    )}
                                  </button>

                                  {/* Timer */}
                                  {otpTimers.mobile > 0 && (
                                    <span
                                      style={{
                                        marginLeft: "5px",
                                        fontSize: "12px",
                                        color: "#666",
                                        marginTop: "3px",
                                      }}
                                    >
                                      ({otpTimers.mobile}s)
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div
                            style={{
                              flex: isMobile ? "1" : "0.3",
                              display: "flex",
                              width: isMobile ? "100%" : "auto",
                            }}
                          >
                            {otpVerified.mobile ? (
                              <div
                                style={{
                                  flex: "1",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0 15px",
                                  height: "45px",
                                  backgroundColor: "#777777",
                                  color: "white",
                                  borderRadius: "5px",
                                  opacity: 0.85,
                                  fontWeight: "500",
                                  fontSize: "14px",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ marginRight: "6px" }}
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Verified
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => verifyOtp("mobile")}
                                disabled={
                                  verifyLoading.mobile || otpLoading.mobile
                                }
                                style={{
                                  flex: "1",
                                  padding: "0 15px",
                                  height: "45px",
                                  backgroundColor: themeColor,
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: verifyLoading.mobile
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: verifyLoading.mobile ? 0.7 : 1,
                                  fontWeight: "500",
                                  fontSize: "14px",
                                }}
                              >
                                {verifyLoading.mobile
                                  ? "Verifying..."
                                  : "Verify OTP"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Email Verification Row */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ marginBottom: "6px" }}>
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#444",
                            }}
                          >
                            Email Verification
                          </label>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              flex: isMobile ? "1" : "0.4",
                              position: "relative",
                              width: isMobile ? "100%" : "auto",
                            }}
                          >
                            <input
                              type="email"
                              value={formData.email}
                              style={{
                                ...inputStyle("email"),
                                backgroundColor: "#f0f0f0",
                                width: "100%",
                                border: "1px solid #ddd",
                              }}
                              readOnly
                              disabled
                            />
                          </div>

                          {/* OTP Input */}
                          <div
                            style={{
                              flex: isMobile ? "1" : "0.3",
                              position: "relative",
                              width: isMobile ? "100%" : "auto",
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              value={otpValues.email}
                              onChange={(e) => handleOtpChange(e, "email")}
                              style={{
                                ...inputStyle("emailOtp"),
                                textAlign: "center",
                                letterSpacing: "2px",
                                width: "100%",
                                fontSize: "15px",
                              }}
                              maxLength={6}
                              disabled={otpVerified.email}
                            />
                            {otpErrors.email && (
                              <div style={{ ...errorStyle, fontSize: "11px" }}>
                                {otpErrors.email}
                              </div>
                            )}
                            {!otpVerified.email && (
                              <div
                                style={{
                                  textAlign: "right",
                                  marginTop: "5px",
                                  fontSize: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* Button with Loader */}
                                  <button
                                    type="button"
                                    onClick={() => resendOtp("email")}
                                    disabled={
                                      timerActive.email || otpLoading.email
                                    }
                                    style={{
                                      display: "flex",
                                      background: "none",
                                      border: "none",
                                      color: timerActive.email
                                        ? "#999"
                                        : themeColor,
                                      cursor: timerActive.email
                                        ? "not-allowed"
                                        : "pointer",
                                      fontWeight: "500",
                                      padding: 0,
                                      textDecoration: "none",
                                    }}
                                  >
                                    {otpLoading.email
                                      ? "Sending"
                                      : "Resend OTP"}
                                    {otpLoading.email && (
                                      <div
                                        style={{
                                          margin: "3px 0 0 5px",
                                          marginLeft: "5px",
                                          width: "12px",
                                          height: "12px",
                                          border: "2px solid #999",
                                          borderTop: "2px solid transparent",
                                          borderRadius: "50%",
                                          animation: "spin 1s linear infinite",
                                        }}
                                      />
                                    )}
                                  </button>

                                  {/* Timer */}
                                  {otpTimers.email > 0 && (
                                    <span
                                      style={{
                                        marginLeft: "5px",
                                        fontSize: "12px",
                                        color: "#666",
                                        marginTop: "3px",
                                      }}
                                    >
                                      ({otpTimers.email}s)
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div
                            style={{
                              flex: isMobile ? "1" : "0.3",
                              display: "flex",
                              width: isMobile ? "100%" : "auto",
                            }}
                          >
                            {otpVerified.email ? (
                              <div
                                style={{
                                  flex: "1",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0 15px",
                                  height: "45px",
                                  backgroundColor: "#777777",
                                  color: "white",
                                  borderRadius: "5px",
                                  opacity: 0.85,
                                  fontWeight: "500",
                                  fontSize: "14px",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ marginRight: "6px" }}
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Verified
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => verifyOtp("email")}
                                disabled={
                                  verifyLoading.email || otpLoading.email
                                }
                                style={{
                                  flex: "1",
                                  padding: "0 15px",
                                  height: "45px",
                                  backgroundColor: themeColor,
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: verifyLoading.email
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: verifyLoading.email ? 0.7 : 1,
                                  fontWeight: "500",
                                  fontSize: "14px",
                                }}
                              >
                                {verifyLoading.email
                                  ? "Verifying..."
                                  : "Verify OTP"}
                              </button>
                            )}
                          </div>
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
                            {getResponsiveLabel("City", "City")}
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
                            {getResponsiveLabel("State", "State")}
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
                            {getResponsiveLabel(
                              "Medical Specialization",
                              "Specialization"
                            )}
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
                            {getResponsiveLabel(
                              "Medical Qualification",
                              "Qualification"
                            )}
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
                            {getResponsiveLabel(
                              "Hospital / Clinic Name",
                              "Hospital/Clinic"
                            )}
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
                            {getResponsiveLabel(
                              "Years of Experience",
                              "Experience"
                            )}
                          </label>
                          {errors.experience && (
                            <div style={{ ...errorStyle, marginTop: "2px" }}>
                              {errors.experience}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ ...formGroupStyle, marginBottom: "5px" }}>
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
                            minHeight:
                              window.innerWidth <= 375 ? "60px" : "80px", // Set fixed height based on screen size
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
                                ? window.innerWidth <= 375
                                  ? "10px"
                                  : "12px"
                                : window.innerWidth <= 375
                                ? "13px"
                                : "16px",
                            backgroundColor:
                              formData.reason || focusedInput === "reason"
                                ? "white"
                                : "transparent",
                            padding:
                              formData.reason || focusedInput === "reason"
                                ? window.innerWidth <= 375
                                  ? "0 3px"
                                  : "0 5px"
                                : "0",
                          }}
                        >
                          {getResponsiveLabel("Reason to Join", "Reason")}
                        </label>
                      </div>

                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          onClick={handleBackStep}
                          className={`form-submit-button ${
                            isSubmitting
                              ? "form-submit-button-submitting"
                              : "form-submit-button-active"
                          }`}
                          disabled={isSubmitting}
                          style={{
                            padding:
                              window.innerWidth <= 375
                                ? "8px 15px"
                                : "10px 20px",
                            fontSize:
                              window.innerWidth <= 375 ? "14px" : "16px",
                            width: "28%",
                            backgroundColor: themeColor,
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.7 : 1,
                            fontWeight: "500",
                          }}
                        >
                          {isSubmitting
                            ? "Processing..."
                            : getResponsiveLabel("Go Back", "Back")}
                        </button>
                        <button
                          type="submit"
                          className={`form-submit-button ${
                            isSubmitting
                              ? "form-submit-button-submitting"
                              : "form-submit-button-active"
                          }`}
                          disabled={isSubmitting}
                          style={{
                            padding:
                              window.innerWidth <= 375
                                ? "8px 15px"
                                : "10px 20px",
                            fontSize:
                              window.innerWidth <= 375 ? "14px" : "16px",
                            width: "70%",
                            backgroundColor: themeColor,
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.7 : 1,
                            fontWeight: "500",
                          }}
                        >
                          {isSubmitting
                            ? "Processing..."
                            : getResponsiveLabel("Click to Join", "Join")}
                        </button>
                      </div>

                      <div
                        style={{
                          fontSize:
                            window.innerWidth <= 375 ? "0.75rem" : "0.85rem",
                          marginTop: "8px",
                          color: "#666",
                          textAlign: "left",
                        }}
                      >
                        <small
                          style={{
                            fontSize:
                              window.innerWidth <= 375 ? "0.75rem" : "0.85rem",
                            lineHeight: "1.4",
                          }}
                        >
                          <span style={{ color: themeColor }}>*</span>
                          <strong>
                            {getResponsiveLabel(
                              "Assurance of Privacy:",
                              "Privacy:"
                            )}
                          </strong>
                          {getResponsiveLabel(
                            " We value your trust. All your details will be kept confidential and used only for internal beta coordination.",
                            " Your details will be kept confidential."
                          )}
                        </small>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

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

          {/* Container gets a special class based on screen size */}
          <div
            className={`beta-launch-boxes-container ${
              isMobile ? "mobile-layout" : ""
            }`}
          >
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
                <div
                  className="beta-launch-feature-icon"
                  style={
                    !isMobile
                      ? { width: "120px", height: "120px", borderWidth: "2px" }
                      : {}
                  }
                >
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    style={!isMobile ? { width: "110px", height: "110px" } : {}}
                  />
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
            <h2 className="who-can-join-main-heading">Who can Join ?</h2>
            <div className="who-can-join-heading-underline"></div>
          </div>

          {/* Bubble decorations */}
          <div className="who-can-join-bubble who-can-join-bubble-large"></div>
          <div className="who-can-join-bubble who-can-join-bubble-extra-large"></div>
          <div className="who-can-join-bubble who-can-join-bubble-small"></div>

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
      <div className="bottom-line"></div>
      <Footer />
    </>
  );
};

export default Partner;
