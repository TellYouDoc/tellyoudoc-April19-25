import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Welcome_Navbar from "../components/Welcome_Navbar";
import Footer from "../components/Footer";
import "../styles/Auth.css";

function DeleteAccount() {
  const [formData, setFormData] = useState({
    mobile: "",
    message: "",
    deleteOptions: {
      personalInfo: false,
      medicalRecords: false,
      appointments: false,
      prescriptions: false,
      reports: false,
      communications: false,
      accountData: false,
    },
    deleteAll: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Add background animation
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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "deleteAll") {
        // If "Delete All" is checked, select all options
        const allSelected = checked;
        setFormData({
          ...formData,
          deleteAll: allSelected,
          deleteOptions: {
            personalInfo: allSelected,
            medicalRecords: allSelected,
            appointments: allSelected,
            prescriptions: allSelected,
            reports: allSelected,
            communications: allSelected,
            accountData: allSelected,
          },
        });
      } else if (name.startsWith("deleteOptions.")) {
        // Handle individual checkbox changes
        const optionName = name.split(".")[1];
        const newDeleteOptions = {
          ...formData.deleteOptions,
          [optionName]: checked,
        };

        // Check if all options are selected to update "Delete All"
        const allOptionsSelected = Object.values(newDeleteOptions).every(
          (option) => option
        );

        setFormData({
          ...formData,
          deleteOptions: newDeleteOptions,
          deleteAll: allOptionsSelected,
        });
      }
    } else {
      // Mobile validation - only numeric input
      if (name === 'mobile') {
        if (value && !/^\d*$/.test(value)) {
          // Don't update state if non-numeric characters are entered
          return;
        }
      }
      
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number
    if (!formData.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!validateMobile(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate that at least one deletion option is selected
    const hasSelectedOptions = Object.values(formData.deleteOptions).some(
      (option) => option
    );
    if (!hasSelectedOptions) {
      setError("Please select at least one type of data to delete.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Backend Integration Point
      // Replace this simulation with actual API call to handle account deletion request
      // Example:
      // const response = await apiService.deleteAccount({
      //   mobile: formData.mobile,
      //   message: formData.message,
      //   deleteOptions: formData.deleteOptions
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Handle actual API response
      // if (response.success) {
      //   setIsSubmitted(true);
      // } else {
      //   setError(response.message || 'Failed to submit deletion request.');
      // }

      // For now, simulate success
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting deletion request:", error);
      setError("Failed to submit deletion request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="delete-account-page">
        <Welcome_Navbar />
        <div className="delete-account-container">
          <div
            className={`delete-account-content ${isVisible ? "visible" : ""}`}
          >
            <div className="delete-account-header">
              <h1>Request Received</h1>
              <div className="success-message">
                <p>
                  Your account deletion request has been received. We will
                  process your data deletion within 7 business days and send you
                  a confirmation email once completed.
                </p>
              </div>
            </div>

            <div className="action-links">
              <Link to="/" className="btn-primary">
                Return to Home
              </Link>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="delete-account-page">
      <Welcome_Navbar />
      <div className="delete-account-container">
        <div className={`delete-account-content ${isVisible ? "visible" : ""}`}>
          <div className="delete-account-header">
            <h1>Delete Your Account & Data</h1>
          </div>

          {/* Information Section */}
          <div className="deletion-info">
            <div className="info-section">
              <h2>What happens when you delete your account?</h2>
              <ul>
                <li>
                  <strong>Complete Data Removal:</strong> All your personal
                  data, medical records, appointments, and profile information
                  will be permanently deleted from our servers.
                </li>
                <li>
                  <strong>Irreversible Process:</strong> Once your account is
                  deleted, this action cannot be undone. You will not be able to
                  recover your data.
                </li>
                <li>
                  <strong>Processing Time:</strong> Your data will be completely
                  removed within 7 business days of request approval.
                </li>
                <li>
                  <strong>Account Access:</strong> Your account will be
                  immediately deactivated upon request submission.
                </li>
              </ul>
            </div>

            <div className="warning-section">
              <div className="warning-box">
                <h3>⚠️ Important Notice</h3>
                <p>
                  This action is <strong>permanent and irreversible</strong>.
                  Please ensure you have downloaded any important data before
                  proceeding. If you're having issues with your account,
                  consider contacting our support team first.
                </p>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="deletion-form">
            <div className="form-group">
              <label htmlFor="mobile">Registered Mobile Number *</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your registered mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            {/* Data Selection Section */}
            <div className="form-group">
              <label className="section-label">Select Data to Delete *</label>
              <div className="checkbox-section">
                <div className="checkbox-group master-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="deleteAll"
                      checked={formData.deleteAll}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <strong>Delete All Data (Complete Account Deletion)</strong>
                  </label>
                </div>

                <div className="checkbox-divider">
                  <span>OR select specific data types:</span>
                </div>

                <div className="checkbox-grid">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.personalInfo"
                        checked={formData.deleteOptions.personalInfo}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Personal Information</strong>
                        <small>Name, contact details, demographics</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.medicalRecords"
                        checked={formData.deleteOptions.medicalRecords}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Medical Records</strong>
                        <small>Health history, conditions, symptoms</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.appointments"
                        checked={formData.deleteOptions.appointments}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Appointments</strong>
                        <small>Scheduled visits, consultation history</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.prescriptions"
                        checked={formData.deleteOptions.prescriptions}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Prescriptions</strong>
                        <small>Medications, dosages, treatment plans</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.reports"
                        checked={formData.deleteOptions.reports}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Medical Reports</strong>
                        <small>Test results, imaging, lab reports</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.communications"
                        checked={formData.deleteOptions.communications}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Communications</strong>
                        <small>Messages, notifications, chat history</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deleteOptions.accountData"
                        checked={formData.deleteOptions.accountData}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <div className="checkbox-content">
                        <strong>Account Data</strong>
                        <small>Login credentials, preferences, settings</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please let us know why you're leaving or any feedback you'd like to share..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="delete-button"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Request Deletion"}
            </button>
          </form>

          <div className="action-links">
            <Link to="/dashboard" className="btn-secondary">
              Cancel & Return to Dashboard
            </Link>
            <Link to="/settings" className="btn-secondary">
              Account Settings
            </Link>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <p>
              Need help? Email us at{" "}
              <a href="mailto:support@tellyoudoc.com">support@tellyoudoc.com</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DeleteAccount;
