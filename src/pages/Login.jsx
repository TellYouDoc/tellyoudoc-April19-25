import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Welcome_Navbar from '../components/Welcome_Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/Auth.css';
import '../styles/login-methods.css';
import '../styles/otp-input.css';
import apiService from '../services/api';
import tellyouDocLogo from '../assets/tellyoudoc.png';
import MeLogo from '../assets/images/ribon.png';

function Login() {
  const [formData, setFormData] = useState({
    // Contact info
    mobile: '',
    // Registration fields
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    specialization: '',
    termsAccepted: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: ''
  });
  const navigate = useNavigate();

  // OTP input references
  const otpRefs = Array(6).fill(0).map(() => useRef(null));

  useEffect(() => {
    // Add subtle background animation
    document.body.classList.add('login-bg-animation');
    
    // Trigger animations when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('login-bg-animation');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Validation for name fields
    if (['firstName', 'middleName', 'lastName'].includes(name)) {
      const nameRegex = /^[a-zA-Z]+$/;
      if (value && !nameRegex.test(value)) {
        setError('Name fields can only contain alphabetic characters without spaces or special characters.');
        return;
      } else {
        setError('');
      }
    }

    // Mobile validation - only numeric input
    if (name === 'mobile') {
      if (value && !/^\d*$/.test(value)) {
        // Don't update state if non-numeric characters are entered
        return;
      }

      // Only show error if they've entered a complete number (10 digits)
      if (value && value.length === 10) {
        if (!/^\d{10}$/.test(value)) {
          setError('Please enter a valid 10-digit mobile number.');
        } else {
          setError('');
        }
      } else {
        // Clear error while typing
        setError('');
      }
    }

    // Password strength check
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Age validation (minimum 18 years)
    if (name === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        if (age - 1 < 18) {
          setError('You must be at least 18 years old to register.');
          return;
        }
      } else {
        if (age < 18) {
          setError('You must be at least 18 years old to register.');
          return;
        }
      }
      setError('');
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';
    let color = '';

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
        message = 'Very Weak';
        color = '#ff4d4f';
        break;
      case 1:
        message = 'Weak';
        color = '#ff7a45';
        break;
      case 2:
        message = 'Fair';
        color = '#ffc53d';
        break;
      case 3:
        message = 'Good';
        color = '#73d13d';
        break;
      case 4:
        message = 'Strong';
        color = '#52c41a';
        break;
      default:
        message = '';
        color = '';
    }

    return { score, message, color };
  };

  // Handle OTP input change with auto-focus on next field
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  // Handle OTP keydown for backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // First step: Send OTP to mobile number
  const handleSendOTP = (e) => {
    e.preventDefault();

    // Validate mobile number
    if (!formData.mobile) {
      setError('Please enter your mobile number');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setIsLoading(true);

    // Call API to generate OTP
    apiService.authService.generateOTP({
      phoneNumber: formData.mobile,
      countryCode: '+91',
    })
      .then(() => {
        setSuccessMessage('OTP sent successfully!');
        setShowOtpVerification(true);
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    // Call API to verify OTP
    apiService.authService.verifyOTP({
      phoneNumber: `+91${formData.mobile}`,
      otp: otpValue
    })
      .then(response => {
        console.log('OTP verification response:', response);

        // Save tokens to cookies
        if (response.data && response.data.AccessToken) {
          document.cookie = `AccessToken=${response.data.AccessToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
          // Also store in localStorage as fallback
          localStorage.setItem('AccessToken', response.data.AccessToken);
        }

        if (response.data && response.data.RefreshToken) {
          document.cookie = `RefreshToken=${response.data.RefreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
          // Also store in localStorage as fallback
          localStorage.setItem('RefreshToken', response.data.RefreshToken);
        }

        if (response.data && response.data.UserData) {
          localStorage.setItem('UserData', JSON.stringify(response.data.UserData));
        }

        // Handle response based on status code
        if (response.status === 201 || response.status === 200) {
          // New user - Show registration form
          setSuccessMessage('OTP verified successfully! Please complete registration.');
          setShowFullForm(true);
        } else if (response.status === 202) {
          // Existing user - Navigate directly to dashboard
          setSuccessMessage('Login successful! Redirecting to dashboard...');

          // Redirect to dashboard with a delay to ensure cookies are properly set
          setTimeout(() => {
            window.location.replace('/dashboard');
          }, 1000);
        } else {
          // Unexpected status code
          setError('Unknown response from server. Please try again.');
        }
      })
      .catch(error => {
        console.error('OTP verification error:', error);
        setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle resending OTP
  const handleResendOTP = () => {
    setIsLoading(true);

    // Call API to resend OTP
    apiService.authService.generateOTP({
      phoneNumber: formData.mobile,
      countryCode: '+91',
    })
      .then(() => {
        setSuccessMessage('OTP resent successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Submit registration form
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.dateOfBirth || !formData.specialization) {
      setError('Please fill in all required fields');
      return;
    }

    // Password validation
    // if (formData.password !== formData.confirmPassword) {
    //   setError('Passwords do not match');
    //   return;
    // }

    // if (formData.password.length < 8) {
    //   setError('Password must be at least 8 characters long');
    //   return;
    // }

    // Terms acceptance validation
    if (!formData.termsAccepted) {
      setError('You must accept the Terms and Conditions to register');
      return;
    }

    setIsLoading(true);
    setError('');

    // Create profile data object according to API requirements
    const profileData = {
      firstName: formData.firstName,
      middleName: formData.middleName || '',
      lastName: formData.lastName,
      phoneNumber: formData.mobile,
      email: formData.email || '',
      password: formData.password,
      gender: formData.gender,
      dob: formData.dateOfBirth,
      specialization: formData.specialization,
      countryCode: '+91'
    };

    // Use doctorService.createProfile API to create the user account
    apiService.doctorService.createProfile(profileData)
      .then(response => {
        console.log('Profile created successfully:', response.data);

        // Store user data if available
        if (response.data.userData) {
          localStorage.setItem('UserData', JSON.stringify(response.data.userData));
        }

        setSuccessMessage('Your account has been created successfully! Redirecting to dashboard...');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      })
      .catch(error => {
        console.error('Profile creation failed:', error);
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <Welcome_Navbar />
      <LoadingScreen show={isLoading} message={showOtpVerification ? "Verifying OTP..." : (showFullForm ? "Creating your account..." : "Sending OTP...")} />


      <div className="auth-container">
        <div className={`auth-card ${isVisible ? 'visible' : ''} ${showFullForm ? 'register' : ''}`}>
          <div className="auth-header">
            <h2 className="animated-item fade-in">Welcome to</h2>
            <img src={tellyouDocLogo} alt="tellyouDoc" className="logo-icon" />
            <div className="beta-warning animated-item fade-in delay-1" style={{
              border: '2px solid rgba(46, 43, 167, 0.15)',
              borderRadius: '10px',
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(46, 43, 167, 0.03) 0%, rgba(73, 69, 228, 0.08) 100%)',
              boxShadow: '0 6px 16px rgba(46, 43, 167, 0.08), 0 2px 4px rgba(46, 43, 167, 0.04)',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'row', /* Changed from column to row for more compact layout */
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, rgba(46, 43, 167, 0.92) 0%, rgba(73, 69, 228, 0.92) 100%)'
              }}></div>

              <p style={{
                fontSize: '1.25rem',
                color: 'rgba(46, 43, 167, 0.92)',
                fontWeight: '700',
                margin: '0',
                textAlign: 'left',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}>Restricted to Beta Users only</p>

              <button
                className="animated-item fade-in delay-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(46, 43, 167, 0.92) 0%, rgba(73, 69, 228, 0.92) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 10px rgba(46, 43, 167, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  marginLeft: '10px'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                onClick={() => navigate('/partner')}
              >
                <span style={{ marginRight: '8px' }}>Join Beta</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '4px' }}>
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <img src={MeLogo} alt="MeLogo" className="logo-icon-me" />
            {!showOtpVerification && !showFullForm && (
              <p className="animated-item fade-in delay-1">Enter your mobile number to get started</p>
            )}
            {showOtpVerification && !showFullForm && (
              <p className="animated-item fade-in delay-1">
                We've sent a verification code to your mobile number
                <br />
                <strong>+91 {formData.mobile}</strong>
              </p>
            )}
            {showFullForm && (
              <p className="animated-item fade-in delay-1">Complete your registration to access breast cancer patient management</p>
            )}
          </div>

          {error && <div className="auth-error animated-item fade-in">{error}</div>}
          {successMessage && <div className="auth-success animated-item fade-in">{successMessage}</div>}

          {/* Mobile Input Form */}
          {!showOtpVerification && !showFullForm && (
            <form className="auth-form" onSubmit={handleSendOTP}>
              <div className="form-group animated-item fade-in slide-up delay-2">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit mobile number"
                  required
                  className="input-animated"
                  maxLength={10}
                />
              </div>

              <div className="form-footer animated-item fade-in delay-3">
                <button type="submit" className="auth-button">Send OTP</button>
              </div>
            </form>
          )}

          {/* OTP Verification Form */}
          {showOtpVerification && !showFullForm && (
            <form className="auth-form" onSubmit={handleVerifyOTP}>
              <div className="otp-container">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="form-group animated-item fade-in slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                    <input
                      type="text"
                      id={`otp-${index}`}
                      name={`otp-${index}`}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      required
                      className="input-animated otp-input"
                      maxLength={1}
                      ref={otpRefs[index]}
                    />
                  </div>
                ))}
              </div>

              <div className="form-footer animated-item fade-in delay-8">
                <button type="submit" className="auth-button">Verify</button>
              </div>

              <div className="resend-otp animated-item fade-in delay-9">
                <p>Didn't receive the code? <button type="button" onClick={handleResendOTP} className="resend-link">Resend</button></p>
              </div>

              <div className="auth-links animated-item fade-in delay-10">
                <button
                  type="button"
                  className="back-link"
                  onClick={() => {
                    setShowOtpVerification(false);
                    setOtp(['', '', '', '', '', '']);
                  }}
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}

          {/* Registration Form - Only shown for new users after OTP verification */}
          {showFullForm && (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-row">
                <div className="form-group animated-item fade-in slide-up delay-2">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="input-animated"
                  />
                </div>

                <div className="form-group animated-item fade-in slide-up delay-3">
                  <label htmlFor="middleName">Middle Name (Optional)</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Enter your middle name"
                    className="input-animated"
                  />
                </div>

                <div class="form-group animated-item fade-in slide-up delay-4">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="input-animated"
                  />
                </div>
              </div>

              <div className="form-group animated-item fade-in slide-up delay-5">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  disabled
                  className="input-animated verified-contact"
                />
                <span className="verified-badge">✓ Verified</span>
              </div>

              {/* <div className="form-group animated-item fade-in slide-up delay-6">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input-animated"
                />
              </div>

              <div className="form-row">
                <div className="form-group animated-item fade-in slide-up delay-7">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="input-animated"
                  />
                  {formData.password && (
                    <div className="password-strength" style={{ color: passwordStrength.color }}>
                      {passwordStrength.message}
                    </div>
                  )}
                </div>

                <div className="form-group animated-item fade-in slide-up delay-8">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="input-animated"
                  />
                </div>
              </div> */}

              <div className="form-group animated-item fade-in slide-up delay-9">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="input-animated"
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group animated-item fade-in slide-up delay-10">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="input-animated"
                />
              </div>

              <div className="form-group animated-item fade-in slide-up delay-11">
                <label htmlFor="specialization">Specialization</label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="input-animated"
                >
                  <option value="">Select your specialization</option>
                  <option value="oncology">Oncology</option>
                  <option value="surgical-oncology">Surgical Oncology</option>
                  <option value="radiation-oncology">Radiation Oncology</option>
                  <option value="medical-oncology">Medical Oncology</option>
                  <option value="gynecologic-oncology">Gynecologic Oncology</option>
                </select>
              </div>

              <div className="form-group animated-item fade-in slide-up delay-12">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  I have read and accept the Terms and Conditions
                </label>
              </div>

              <div className="form-footer animated-item fade-in delay-13">
                <button type="submit" className="auth-button">Create Account</button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;