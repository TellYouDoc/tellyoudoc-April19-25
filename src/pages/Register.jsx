import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import {apiService} from '../services/api';
import '../styles/Auth.css';
import '../styles/login-methods.css';
import '../styles/otp-input.css';

// List of specializations matching the mobile app
const SPECIALIZATIONS = [
  "Oncology",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Orthopedics",
  "Psychiatry",
  "General Medicine",
  "Other"
];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    specialization: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  
  // Clear form errors when fields are updated
  useEffect(() => {
    if (formData.firstName.trim() || formData.lastName.trim() || formData.gender || formData.dateOfBirth || formData.specialization) {
      setFormErrors({});
    }
  }, [formData.firstName, formData.lastName, formData.gender, formData.dateOfBirth, formData.specialization]);

  useEffect(() => {
    // Trigger animations when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for name fields
    if (['firstName', 'middleName', 'lastName'].includes(name)) {
      const nameRegex = /^[a-zA-Z]+$/;
      if (value && !nameRegex.test(value)) {
        setFormErrors({...formErrors, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} can only contain alphabetic characters`});
        return;
      } else {
        // Clear error for this field
        const newErrors = {...formErrors};
        delete newErrors[name];
        setFormErrors(newErrors);
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderSelect = (gender) => {
    setFormData({
      ...formData,
      gender
    });
    
    // Clear gender error
    const newErrors = {...formErrors};
    delete newErrors.gender;
    setFormErrors(newErrors);
  };

  const selectSpecialization = (specialization) => {
    setFormData({
      ...formData,
      specialization
    });
    setShowSpecializationDropdown(false);
    
    // Clear specialization error
    const newErrors = {...formErrors};
    delete newErrors.specialization;
    setFormErrors(newErrors);
  };
  
  const toggleSpecializationDropdown = () => {
    setShowSpecializationDropdown(!showSpecializationDropdown);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    } else {
      // Check if user is at least 21 years old (as in the mobile app)
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        if (age <= 21) {
          newErrors.dateOfBirth = "You must be at least 21 years old";
          isValid = false;
        }
      } else {
        if (age < 21) {
          newErrors.dateOfBirth = "You must be at least 21 years old";
          isValid = false;
        }
      }
    }

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Submit profile data
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    
    // Create profile data object according to API requirements
    const profileData = {
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim(),
      lastName: formData.lastName.trim(),
      gender: formData.gender,
      dob: new Date(formData.dateOfBirth).toISOString(),
      specialization: formData.specialization,
    };

    // Use doctorService.createProfile API to create the user account
    apiService.doctorService.createProfile(profileData)
      .then(response => {
        // Handle successful profile creation
        console.log('Profile created successfully:', response.data);
        
        // Store user data if available
        if (response.data.userData) {
          localStorage.setItem('UserData', JSON.stringify(response.data.userData));
        }
        
        setIsLoading(false);
        // Show success message and navigate to dashboard
        alert('Your profile has been created successfully!');
        navigate('/dashboard'); 
      })
      .catch(error => {
        // Handle errors
        console.error('Profile creation failed:', error);
        setFormErrors({
          submit: error.response?.data?.message || 'Registration failed. Please try again.'
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <LoadingScreen show={isLoading} message="Creating your profile..." />
      <Navbar />

      <div className="auth-container">
        <div className={`auth-card register ${isVisible ? 'visible' : ''}`}>
          <div className="auth-header">
            <h2 className="animated-item fade-in">Create Your Profile</h2>
            <p className="animated-item fade-in delay-1">Please fill in your details to get started</p>
          </div>

          {formErrors.submit && <div className="auth-error animated-item fade-in">{formErrors.submit}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-section animated-item fade-in slide-up delay-2">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className={`input-with-icon ${formErrors.firstName ? 'error' : ''}`}>
                  <i className="material-icons">person</i>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="input-animated"
                  />
                </div>
                {formErrors.firstName && <div className="error-text">{formErrors.firstName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name (Optional)</label>
                <div className="input-with-icon">
                  <i className="material-icons">person</i>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name (Optional)"
                    className="input-animated"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className={`input-with-icon ${formErrors.lastName ? 'error' : ''}`}>
                  <i className="material-icons">person</i>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="input-animated"
                  />
                </div>
                {formErrors.lastName && <div className="error-text">{formErrors.lastName}</div>}
              </div>

              <div className="form-group">
                <label className={formErrors.gender ? 'label-error' : ''}>Gender</label>
                <div className="gender-options">
                  {["Male", "Female", "Other"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`gender-option ${formData.gender === gender ? 'selected' : ''}`}
                      onClick={() => handleGenderSelect(gender)}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
                {formErrors.gender && <div className="error-text">{formErrors.gender}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth" className={formErrors.dateOfBirth ? 'label-error' : ''}>Date of Birth</label>
                <div className={`input-with-icon ${formErrors.dateOfBirth ? 'error' : ''}`}>
                  <i className="material-icons">calendar_today</i>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-animated"
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
                  />
                </div>
                {formErrors.dateOfBirth && <div className="error-text">{formErrors.dateOfBirth}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="specialization" className={formErrors.specialization ? 'label-error' : ''}>Specialization</label>
                <div className={`input-with-icon dropdown-container ${formErrors.specialization ? 'error' : ''}`}>
                  <i className="material-icons">medical_services</i>
                  <div 
                    className="dropdown-field" 
                    onClick={toggleSpecializationDropdown}
                  >
                    <span className={!formData.specialization ? 'placeholder' : ''}>
                      {formData.specialization || 'Select your specialization'}
                    </span>
                    <i className="material-icons">{showSpecializationDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                  </div>
                </div>
                {showSpecializationDropdown && (
                  <div className="dropdown-list">
                    {SPECIALIZATIONS.map((spec) => (
                      <div 
                        key={spec} 
                        className={`dropdown-item ${formData.specialization === spec ? 'selected' : ''}`}
                        onClick={() => selectSpecialization(spec)}
                      >
                        {spec}
                      </div>
                    ))}
                  </div>
                )}
                {formErrors.specialization && <div className="error-text">{formErrors.specialization}</div>}
              </div>
            </div>

            <div className="form-footer animated-item fade-in delay-6">
              <button 
                type="submit" 
                className={`auth-button ${Object.keys(formErrors).length > 0 ? 'disabled' : ''}`}
                disabled={isLoading}
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;