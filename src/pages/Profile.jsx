import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaGraduationCap, FaHospital, FaEdit, FaSave, FaCamera, FaTimes } from 'react-icons/fa';
import '../styles/Profile.css';
import { fetchAddressByPincode } from '../utils/pincodeApi';
import apiService from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track changes in practice details
  const [practiceChanges, setPracticeChanges] = useState({});
  // Track changes in overall profile
  const [hasProfileChanges, setHasProfileChanges] = useState(false);

  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ unit: '%', width: 80, aspect: 1 });
  const [tempImage, setTempImage] = useState(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const cropImageRef = useRef(null);

  const [profileData, setProfileData] = useState({
    basicDetails: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      bio: '',
      indianLanguages: {
        understand: [],
        speak: [],
        readWrite: []
      },
      socialMedia: {}
    },
    contactAddress: {
      primaryNumber: '',
      alternateNumber: '',
      whatsappNumber: '',
      email: '',
      currentAddress: {
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        state: '',
        district: '',
        postOffice: ''
      },
      permanentAddress: {
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        state: '',
        district: '',
        postOffice: ''
      }
    },
    medicalCertification: {
      degree: '',
      university: '',
      graduationYear: '',
      licenseNumber: '',
      registrationNumber: '',
      medicalCouncil: '',
      yearOfRegistration: '',
      yearsOfExperience: '',
      certifications: []
    },
    qualificationExpertise: {
      areaOfExpertise: [],
      qualification: [],
      specializations: []
    },
    practiceDetails: []
  });

  const indianLanguages = [
    // Official languages recognized in the 8th Schedule of the Indian Constitution
    'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati',
    'Hindi', 'Kannada', 'Kashmiri', 'Konkani', 'Maithili',
    'Malayalam', 'Manipuri (Meitei)', 'Marathi', 'Nepali',
    'Odia', 'Punjabi', 'Sanskrit', 'Santali', 'Sindhi',
    'Tamil', 'Telugu', 'Urdu',

    // Other major languages and dialects
    'Angika', 'Arunachali', 'Awadhi', 'Badaga', 'Bagri',
    'Bajjika', 'Balti', 'Bhili', 'Bhojpuri', 'Bhotia',
    'Braj Bhasha', 'Bundeli', 'Chhattisgarhi', 'Chakma',
    'Chambeali', 'Changthang', 'Coorgi', 'Dakhini', 'Dhivehi',
    'Garhwali', 'Garo', 'Gondi', 'Gujjari', 'Halabi',
    'Haryanvi', 'Ho', 'Jaunsari', 'Karbi', 'Khasi',
    'Kodava', 'Kokborok', 'Khandeshi', 'Kumaoni', 'Kurukh',
    'Kuvi', 'Ladakhi', 'Lambadi', 'Lepcha', 'Limbu',
    'Lushai', 'Magahi', 'Malvani', 'Mizo', 'Mundari',
    'Nagpuri', 'Nicobarese', 'Nimadi', 'Pahari', 'Pali',
    'Rajasthani', 'Sambalpuri', 'Saurashtra', 'Sherpa', 'Sikkimese',
    'Sinhala', 'Sourashtra', 'Spiti', 'Surgujia', 'Surjapuri',
    'Sylheti', 'Tenyidie', 'Tulu', 'Wadari', 'Wagdi',

    // Additional languages and dialects
    'Andamanese', 'Ao', 'Banjari', 'Bastar', 'Biate',
    'Chin', 'Dimasa', 'Idu Mishmi', 'Jaintia', 'Jatapu',
    'Kabui', 'Kharia', 'Kisan', 'Konyak', 'Koraga',
    'Korku', 'Koya', 'Kui', 'Kutchi', 'Lakher',
    'Lotha', 'Malto', 'Maria', 'Mewari', 'Munda',
    'Nihal', 'Phom', 'Rabha', 'Rai', 'Rengma',
    'Sema', 'Sherdukpen', 'Sora', 'Tangkhul', 'Thado',
    'Toda', 'Torwali', 'Tripuri', 'Varli', 'Zemi'
  ];

  const socialMediaPlatforms = [
    'Facebook', 'Twitter/X', 'Instagram', 'LinkedIn',
    'Discord', 'YouTube', 'Telegram', 'Other'
  ];

  // Medical Councils in India
  const medicalCouncils = [
    'Medical Council of India (MCI)',
    'National Medical Commission (NMC)',
    'Delhi Medical Council',
    'Maharashtra Medical Council',
    'Karnataka Medical Council',
    'Tamil Nadu Medical Council',
    'Andhra Pradesh Medical Council',
    'Telangana State Medical Council',
    'Kerala Medical Council',
    'West Bengal Medical Council',
    'Gujarat Medical Council',
    'Rajasthan Medical Council',
    'Punjab Medical Council',
    'Haryana Medical Council',
    'Uttar Pradesh Medical Council',
    'Bihar Medical Council',
    'Madhya Pradesh Medical Council',
    'Odisha Medical Council',
    'Assam Medical Council',
    'Other'
  ];

  // Specializations related to oncology and cancer treatment
  const specializations = [
    'Surgical Oncology',
    'Medical Oncology',
    'Radiation Oncology',
    'Gynecologic Oncology',
    'Hematology-Oncology',
    'Breast Cancer Specialist',
    'Neuro-Oncology',
    'Pediatric Oncology',
    'Urologic Oncology',
    'Head and Neck Oncology',
    'Thoracic Oncology',
    'Orthopedic Oncology',
    'Nuclear Medicine',
    'Interventional Radiology',
    'Oncologic Pathology',
    'Palliative Care',
    'Cancer Genetics',
    'Other'
  ];

  // Initialize the languages display settings
  const [languageDisplaySettings, setLanguageDisplaySettings] = useState({
    understand: { showAll: false },
    speak: { showAll: false },
    readWrite: { showAll: false }
  });

  // Fetch doctor profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.doctorService.getProfile();

        if (response.data && response.status === 200) {

          // Map the API response to our profileData structure
          const apiData = response.data.data;

          // Process specializations from API
          let formattedSpecializations = [];
          if (apiData.professionalDetails?.specialization && apiData.professionalDetails.specialization.length > 0) {
            formattedSpecializations = apiData.professionalDetails.specialization.map(spec => {
              // Check if the specialization exists in our predefined list
              const specName = typeof spec === 'string' ? spec : spec.name;

              // If it exists in our predefined list, use it
              if (specializations.includes(specName)) {
                return { name: specName, isCustom: false };
              }
              // Special case for "Surgical Oncologist" which is similar to "Surgical Oncology"
              else if (specName === 'Surgical Oncologist') {
                return { name: 'Surgical Oncology', isCustom: false };
              }
              // Otherwise, set it as a custom "Other" specialization
              else {
                return {
                  name: 'Other',
                  isCustom: true,
                  customName: specName
                };
              }
            });
          }

          // Create a properly formatted profile data object from API response
          const formattedProfileData = {
            basicDetails: {
              firstName: apiData.firstName || '',
              middleName: apiData.middleName || '',
              lastName: apiData.lastName || '',
              gender: apiData.gender || '',
              dateOfBirth: apiData.dob ? formatDateForInput(apiData.dob) : '',
              bio: apiData.bio || '',
              indianLanguages: {
                understand: apiData.languages?.understand || [],
                speak: apiData.languages?.speak || [],
                readWrite: apiData.languages?.readWrite || []
              },
              socialMedia: apiData.socialMedia || {}
            },
            contactAddress: {
              primaryNumber: apiData.contactAddress?.primaryNumber || '',
              alternateNumber: apiData.contactAddress?.alternateNumber || '',
              whatsappNumber: apiData.contactAddress?.whatsappNumber || '',
              email: apiData.contactAddress?.email || '',
              currentAddress: apiData?.currentAddress || {
                addressLine1: '',
                addressLine2: '',
                pincode: '',
                state: '',
                district: '',
                postOffice: ''
              },
              permanentAddress: apiData?.permanentAddress || {
                addressLine1: '',
                addressLine2: '',
                pincode: '',
                state: '',
                district: '',
                postOffice: ''
              }
            },
            medicalCertification: {
              registrationNumber: apiData.professionalDetails?.registrationNumber || '',
              medicalCouncil: apiData.professionalDetails?.medicalCouncil || '',
              yearOfRegistration: apiData.professionalDetails?.yearOfRegistration || '',
              yearsOfExperience: apiData.professionalDetails?.yearsOfExperience || '',
            },
            qualificationExpertise: {
              areaOfExpertise: apiData.professionalDetails?.areaOfExpertise || [],
              qualification: apiData.professionalDetails?.qualification || [],
              specializations: formattedSpecializations
            },
            practiceDetails: apiData.practiceInfo || []
          };

          setProfileData(formattedProfileData);

          // Set profile image if available
          if (apiData.profileImage) {
            setPreviewImage(apiData.profileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Could display an error message to the user here
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const INITIAL_LANGUAGES_TO_SHOW = 40;

  const toggleLanguageDisplay = (category) => {
    setLanguageDisplaySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        showAll: !prev[category].showAll
      }
    }));
  };

  const handleLanguageChange = (category, language, isChecked) => {
    setProfileData(prev => {
      const updatedLanguages = { ...prev.basicDetails.indianLanguages };

      if (isChecked) {
        // Add language if not already in the array
        if (!updatedLanguages[category].includes(language)) {
          updatedLanguages[category] = [...updatedLanguages[category], language];
        }
      } else {
        // Remove language from the array
        updatedLanguages[category] = updatedLanguages[category].filter(lang => lang !== language);
      }

      return {
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          indianLanguages: updatedLanguages
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleAddSocialMedia = () => {
    setProfileData(prev => {
      // Create a new social media platform entry
      const platform = '';
      const url = '';

      return {
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          socialMedia: {
            ...prev.basicDetails.socialMedia,
            [platform]: url
          }
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleRemoveSocialMedia = (platform) => {
    setProfileData(prev => {
      const updatedSocialMedia = { ...prev.basicDetails.socialMedia };
      delete updatedSocialMedia[platform];
      return {
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          socialMedia: updatedSocialMedia
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleSocialMediaChange = (oldPlatform, field, value) => {
    setProfileData(prev => {
      const updatedSocialMedia = { ...prev.basicDetails.socialMedia };

      if (field === 'platform') {
        // If platform name changed, we need to create a new entry and delete the old one
        const url = updatedSocialMedia[oldPlatform] || '';
        delete updatedSocialMedia[oldPlatform];
        updatedSocialMedia[value] = url;
      } else if (field === 'url') {
        // Just update the URL for the platform
        updatedSocialMedia[oldPlatform] = value;
      }

      return {
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          socialMedia: updatedSocialMedia
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handlePracticeChange = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      practiceDetails: prev.practiceDetails.map((practice, i) =>
        i === index ? { ...practice, [field]: value } : practice
      )
    }));

    // Mark this practice location as having changes
    setPracticeChanges(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Instead of directly setting the image, show the crop modal
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle the crop completion
  const handleCropComplete = async (crop, percentageCrop) => {
    if (cropImageRef.current && crop.width && crop.height) {
      try {
        const croppedImageData = await getCroppedImg(
          cropImageRef.current,
          crop
        );
        setCroppedImageBlob(croppedImageData.blob);
        setPreviewImage(croppedImageData.url);
      } catch (err) {
        console.error("Error creating cropped image:", err);
      }
    }
  };

  // Function to create cropped image
  const getCroppedImg = (image, crop) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("No 2d context"));
        return;
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpg';
        const fileUrl = window.URL.createObjectURL(blob);
        resolve({ blob, url: fileUrl });
      }, 'image/jpeg');
    });
  };

  // Function to confirm and upload the cropped image
  const handleConfirmCrop = async () => {
    if (croppedImageBlob) {
      // Set the profile image to the cropped blob
      setProfileImage(croppedImageBlob);
      setHasProfileChanges(true);
      setShowCropModal(false);

      // Upload the cropped image immediately
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('profileImage', croppedImageBlob);

        const response = await apiService.doctorService.updateProfileImage(formData);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          console.log('Profile image updated successfully');
          // You could display a success message here
          alert('Profile image updated successfully');
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        // Display error message to user
        alert('Failed to update profile image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Function to cancel crop
  const handleCancelCrop = () => {
    setShowCropModal(false);
    setTempImage(null);
    setCroppedImageBlob(null);
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setProfileImage(null);
    setPreviewImage(null);
  };

  // Function to handle address changes
  const handleAddressChange = (addressType, field, value) => {
    setProfileData(prev => ({
      ...prev,
      contactAddress: {
        ...prev.contactAddress,
        [addressType]: {
          ...prev.contactAddress[addressType],
          [field]: value
        }
      }
    }));

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  // Function to copy current address to permanent address
  const handleCopyCurrentAddress = () => {
    if (!isEditing) return;

    setProfileData(prev => ({
      ...prev,
      contactAddress: {
        ...prev.contactAddress,
        permanentAddress: { ...prev.contactAddress.currentAddress },
        isPermanentAddressSame: true
      }
    }));
  };

  // Function to fetch address details based on pincode
  const handlePincodeChange = async (addressType, pincode) => {
    if (pincode.length === 6) {
      try {
        // Show loading indicator or message here if desired

        // Fetch address details from API
        const addressDetails = await fetchAddressByPincode(pincode);

        // Update state with fetched data
        setProfileData(prev => ({
          ...prev,
          contactAddress: {
            ...prev.contactAddress,
            [addressType]: {
              state: addressDetails.state,
              district: addressDetails.district,
              postOffice: addressDetails.postOffice
            }
          }
        }));
      } catch (error) {
        console.error('Error fetching pincode data:', error.message);

        // You could show an error message to the user here
        // For example with a toast notification or error state
      }
    }
  };

  // Functions for handling qualification and expertise fields
  const handleAddExpertise = () => {
    setProfileData(prev => ({
      ...prev,
      qualificationExpertise: {
        ...prev.qualificationExpertise,
        areaOfExpertise: [...prev.qualificationExpertise.areaOfExpertise, '']
      }
    }));

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleRemoveExpertise = (index) => {
    setProfileData(prev => {
      const newExpertise = [...prev.qualificationExpertise.areaOfExpertise];
      newExpertise.splice(index, 1);
      return {
        ...prev,
        qualificationExpertise: {
          ...prev.qualificationExpertise,
          areaOfExpertise: newExpertise
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleAddQualification = () => {
    setProfileData(prev => ({
      ...prev,
      qualificationExpertise: {
        ...prev.qualificationExpertise,
        qualification: [...prev.qualificationExpertise.qualification, '']
      }
    }));

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleRemoveQualification = (index) => {
    setProfileData(prev => {
      const newqualification
        = [...prev.qualificationExpertise.qualification
        ];
      newqualification
        .splice(index, 1);
      return {
        ...prev,
        qualificationExpertise: {
          ...prev.qualificationExpertise,
          qualification
            : newqualification

        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleQualificationChange = (index, value) => {
    setProfileData(prev => {
      const newqualification = [...prev.qualificationExpertise.qualification];
      newqualification[index] = value;
      return {
        ...prev,
        qualificationExpertise: {
          ...prev.qualificationExpertise,
          qualification: newqualification
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleAddSpecialization = () => {
    setProfileData(prev => ({
      ...prev,
      qualificationExpertise: {
        ...prev.qualificationExpertise,
        specializations: [...prev.qualificationExpertise.specializations, { name: '', isCustom: false, customName: '' }]
      }
    }));

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleRemoveSpecialization = (index) => {
    setProfileData(prev => {
      const newSpecializations = [...prev.qualificationExpertise.specializations];
      newSpecializations.splice(index, 1);
      return {
        ...prev,
        qualificationExpertise: {
          ...prev.qualificationExpertise,
          specializations: newSpecializations
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleSpecializationChange = (index, value) => {
    setProfileData(prev => {
      const newSpecializations = [...prev.qualificationExpertise.specializations];
      if (value === 'Other') {
        newSpecializations[index] = {
          name: value,
          isCustom: true,
          customName: newSpecializations[index].customName || ''
        };
      } else {
        newSpecializations[index] = { name: value, isCustom: false };
      }
      return {
        ...prev,
        qualificationExpertise: {
          ...prev.qualificationExpertise,
          specializations: newSpecializations
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  const handleCustomSpecializationChange = (index, value) => {
    setProfileData(prev => {
      const newSpecializations = [...prev.qualificationExpertise.specializations];
      newSpecializations[index] = {
        ...newSpecializations[index],
        customName: value
      };
      return {
        ...prev,
        qualificationExpertise: {
          ...prev.qualificationExpertise,
          specializations: newSpecializations
        }
      };
    });

    // Mark that profile has changes
    setHasProfileChanges(true);
  };

  // Function to handle practice pincode changes and auto-fetch address details
  const handlePracticePincodeChange = async (index, pincode) => {
    if (pincode.length === 6) {
      try {
        // Fetch address details from API
        const addressDetails = await fetchAddressByPincode(pincode);

        // Update the specific practice location with the fetched data
        setProfileData(prev => ({
          ...prev,
          practiceDetails: prev.practiceDetails.map((practice, i) =>
            i === index ? {
              ...practice,
              practiceState: addressDetails.state,
              practiceDistrict: addressDetails.district,
              practicePostOffice: addressDetails.postOffice
            } : practice
          )
        }));
      } catch (error) {
        console.error('Error fetching pincode data for practice:', error.message);
      }
    }
  };
  // Function to add a new practice location
  const handleAddPractice = async () => {
    // First add to local state for immediate UI feedback
    const newPractice = {
      hospitalName: '',
      designation: '',
      departmentName: '',
      practiceAddress: '',
      practicePincode: '',
      practiceState: '',
      practiceDistrict: '',
      practicePincode: ''
    };

    setProfileData(prev => ({
      ...prev,
      practiceDetails: [
        ...prev.practiceDetails,
        newPractice
      ]
    }));

    // Only call API if editing mode and not just displaying the form
    if (isEditing) {
      try {
        // Don't call API for completely empty practice items
        // User can fill out the form and it will be saved with handleSavePractice
      } catch (error) {
        console.error('Error adding practice:', error);
        alert('Failed to add practice location. Please try again.');
      }
    }
  };

  // Function to remove a practice location
  const handleRemovePractice = async (index) => {
    // Get the practice id before removing from state
    const practiceToRemove = profileData.practiceDetails[index];

    // If the practice has an id, it exists on the server and needs to be deleted via API
    const existsOnServer = practiceToRemove && practiceToRemove.id;

    // Update local state for immediate UI feedback
    setProfileData(prev => ({
      ...prev,
      practiceDetails: prev.practiceDetails.filter((_, i) => i !== index)
    }));

    // Only call API if the practice exists on the server and we're in edit mode
    if (existsOnServer && isEditing) {
      try {
        await apiService.doctorService.deletePracticeInfo(practiceToRemove.id);
        console.log('Practice location deleted successfully');
      } catch (error) {
        console.error('Error deleting practice:', error);
        alert('Failed to delete practice location. Please try again.');

        // Revert the state change if API call fails
        setProfileData(prev => ({
          ...prev,
          practiceDetails: [
            ...prev.practiceDetails.slice(0, index),
            practiceToRemove,
            ...prev.practiceDetails.slice(index)
          ]
        }));
      }
    }
  };
  // Function to save practice details
  const handleSavePractice = async (index) => {
    if (!isEditing) return;

    const practice = profileData.practiceDetails[index];

    // Validate required fields
    if (!practice.hospitalName || !practice.practiceAddress || !practice.practicePincode) {
      alert('Please fill all required fields (Hospital/Clinic Name, Address, and Pincode)');
      return;
    }

    try {
      // Format practice data according to API requirements
      const practiceInfo = {
        hospitalName: practice.hospitalName,
        designation: practice.designation,
        departmentName: practice.departmentName,
        practiceAddress: practice.practiceAddress,
        practicePincode: practice.practicePincode,
        practiceState: practice.practiceState,
        practiceDistrict: practice.practiceDistrict,
        practicePostOffice: practice.practicePostOffice
      }; let response;

      // Check for MongoDB _id or regular id field
      const practiceId = practice._id || practice.id;

      if (practiceId) {
        // Update existing practice
        response = await apiService.doctorService.updatePracticeInfo(practiceId, practiceInfo);
        console.log('Practice location updated successfully:', response.data);

        if (response.status === 200) {
          alert('Practice information updated successfully');
        }
      } else {
        // Add new practice
        response = await apiService.doctorService.addPracticeInfo(practiceInfo);
        console.log('Practice location added successfully:', response.data);
        if (response.status === 201) {
          alert('New practice location added successfully');
        }

        // Update the state with the id from the server
        if (response.data) {
          // Handle both potential ID formats (id or _id)
          const newId = response.data._id || response.data.id;
          if (newId) {
            setProfileData(prev => ({
              ...prev,
              practiceDetails: prev.practiceDetails.map((p, i) =>
                i === index ? { ...p, _id: newId } : p
              )
            }));
          }
        }
      }

      // Reset change tracking for this practice location
      setPracticeChanges(prev => ({
        ...prev,
        [index]: false
      }));

      // Refresh the profile data - could be implemented via a callback or context/redux
      // await dispatch(fetchDoctorProfile());
    } catch (error) {
      console.error('Error saving practice details:', error);
      alert(practice.id ? 'Update failed. Please try again.' : 'Add failed. Please try again.');
    }
  };
  // Function to save profile changes
  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      // Check if permanent address is same as current
      const isPermanentAddressSame = profileData.isPermanentAddressSame || false;

      // Prepare profile data for API submission
      const updatedProfileData = {
        firstName: profileData.basicDetails.firstName,
        middleName: profileData.basicDetails.middleName || '',
        lastName: profileData.basicDetails.lastName,
        gender: profileData.basicDetails.gender,
        dob: formatDateForApi(profileData.basicDetails.dateOfBirth),
        // bio: profileData.basicDetails.bio,
        currentAddress: profileData.contactAddress.currentAddress,
        isPermanentAddressSame: isPermanentAddressSame,

        // Only include permanentAddress if addresses are different
        ...(isPermanentAddressSame ? {} : {
          permanentAddress: profileData.contactAddress.permanentAddress
        }),

        professionalDetails: {
          registrationNumber: profileData.medicalCertification.registrationNumber,
          medicalCouncil: profileData.medicalCertification.medicalCouncil,
          yearOfRegistration: profileData.medicalCertification.yearOfRegistration,
          yearsOfExperience: profileData.medicalCertification.yearsOfExperience,
          areaOfExpertise: profileData.qualificationExpertise.areaOfExpertise,
          qualification: profileData.qualificationExpertise.qualification,
          specialization: profileData.qualificationExpertise.specializations.map(spec => {
            if (spec.isCustom) {
              return spec.customName;
            } else {
              return spec.name;
            }
          }),
        },
        languages: profileData.basicDetails.indianLanguages,
        socialMedia: profileData.basicDetails.socialMedia
      };

      // Call the API to update profile
      const response = await apiService.doctorService.updateProfile(updatedProfileData);
      console.log('Profile update response:', response);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        // If profile picture was changed, upload it separately
        if (profileImage) {
          const formData = new FormData();
          formData.append('profileImage', profileImage);

          try {
            await apiService.doctorService.updateProfileImage(formData);
            console.log('Profile image updated successfully');
          } catch (imageError) {
            console.error('Error updating profile image:', imageError);
            alert('Profile saved but failed to update profile image. Please try again.');
          }
        }

        // Exit edit mode
        setIsEditing(false);
        setHasProfileChanges(false); // Reset changes flag after saving
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Response details:', error.response?.data);
      console.error('Status code:', error.response?.status);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Date formatting helper function
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    // Parse the ISO date string (like "1997-02-28T00:00:00.000Z")
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    // Format as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Format date for API submission (convert DD-MM-YYYY back to YYYY-MM-DD)
  const formatDateForApi = (dateString) => {
    if (!dateString) return null;

    try {
      // Parse DD-MM-YYYY format
      const [day, month, year] = dateString.split('-');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('Error formatting date for API:', e);
      return dateString;
    }
  };
  return (
    <div className={`profile-container ${isEditing ? 'edit-mode-active' : 'edit-mode-inactive'}`}>
      {isLoading ? (
        <LoadingScreen show={isLoading} message='Updating Profile' />
      ) : (
        <>
          {/* Crop Modal */}
          {showCropModal && (
            <div className="crop-modal-overlay">
              <div className="crop-modal">
                <h3>Crop Profile Image</h3>
                <div className="crop-container">
                  <ReactCrop
                    src={tempImage}
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onComplete={handleCropComplete}
                    circularCrop
                    aspect={1}
                  >
                    <img
                      ref={cropImageRef}
                      src={tempImage}
                      alt="Crop preview"
                      style={{ maxHeight: '60vh' }}
                      onLoad={() => {
                        // Set initial crop when image loads
                        setCrop(prev => ({ ...prev, height: prev.width }));
                      }}
                    />
                  </ReactCrop>
                </div>
                <div className="crop-actions">
                  <button onClick={handleCancelCrop} className="btn-cancel-crop">
                    Cancel
                  </button>
                  <button onClick={handleConfirmCrop} className="btn-confirm-crop">
                    Confirm & Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="profile-header">
            <div className="profile-image-container">
              <div
                className={`profile-image-wrapper ${isEditing ? 'editable' : ''} ${!previewImage ? 'with-initials' : ''}`}
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="initials-display">
                    {getInitials(`${profileData.basicDetails.firstName} ${profileData.basicDetails.lastName}`)}
                  </div>
                )}
                {isEditing && (
                  <>
                    <div className="image-overlay">
                      <FaCamera className="camera-icon" />
                      <span>Change Photo</span>
                    </div>
                    {previewImage && (
                      <button
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-header-content">
              <h1>{profileData.basicDetails.firstName}{profileData.basicDetails.middleName ? ' ' + profileData.basicDetails.middleName : ''} {profileData.basicDetails.lastName}</h1>
            </div>
          </div>

          {/* Floating action buttons - fixed at bottom right */}
          <div className="floating-action-buttons">
            {isEditing && (
              <button
                className="cancel-button"
                onClick={() => {
                  // Cancel edit mode without saving
                  setIsEditing(false);
                  setHasProfileChanges(false); // Reset changes flag

                  // Reload the page to revert changes without triggering the loading screen
                  window.location.reload();
                }}
              >
                <FaTimes /> Cancel
              </button>
            )}
            <button
              className={`edit-button ${isEditing && (!hasProfileChanges && !profileImage) ? 'disabled' : ''}`}
              onClick={() => {
                if (isEditing) {
                  // Only save if there are actual changes
                  if (hasProfileChanges) {
                    handleSaveChanges();
                  } else {
                    // If no changes, just exit edit mode
                    setIsEditing(false);
                  }
                } else {
                  // If not in edit mode, just enable editing
                  setIsEditing(true);
                }
              }}
              disabled={isEditing && !hasProfileChanges && !profileImage}
              title={isEditing && !hasProfileChanges && !profileImage ? "No changes to save" : ""}
            >
              {isEditing ? <FaSave /> : <FaEdit />}
              {isEditing ? ' Save' : ' Edit'}
            </button>
          </div>

          <div className="profile-sections">

            {/* Basic Details Section */}
            <section className="profile-section">
              <div className="section-header">
                <FaUser className="section-icon" />
                <h2>Personal Details</h2>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={profileData.basicDetails.firstName}
                    onChange={(e) => handleInputChange('basicDetails', 'firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    value={profileData.basicDetails.middleName}
                    onChange={(e) => handleInputChange('basicDetails', 'middleName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profileData.basicDetails.lastName}
                    onChange={(e) => handleInputChange('basicDetails', 'lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={profileData.basicDetails.gender}
                    onChange={(e) => handleInputChange('basicDetails', 'gender', e.target.value)}
                    disabled={!isEditing}
                    className="profile-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="text"
                    value={profileData.basicDetails.dateOfBirth}
                    onChange={(e) => handleInputChange('basicDetails', 'dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    placeholder="DD-MM-YYYY"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profileData.basicDetails.bio}
                    onChange={(e) => handleInputChange('basicDetails', 'bio', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Indian Languages</label>
                  <div className="languages-container">
                    <div className="language-category">
                      <h3>Languages I Understand</h3>
                      {isEditing ? (
                        <>
                          <div className="language-options">
                            {indianLanguages.map((language, index) => (
                              <div key={`understand-${language}`} className="language-checkbox">
                                {languageDisplaySettings.understand.showAll || index < INITIAL_LANGUAGES_TO_SHOW ? (
                                  <>
                                    <input
                                      type="checkbox"
                                      id={`understand-${language}`}
                                      checked={profileData.basicDetails.indianLanguages.understand.includes(language)}
                                      onChange={(e) => handleLanguageChange('understand', language, e.target.checked)}
                                    />
                                    <label htmlFor={`understand-${language}`}>{language}</label>
                                  </>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          <button
                            className="toggle-language-display-btn"
                            onClick={() => toggleLanguageDisplay('understand')}
                            data-expanded={languageDisplaySettings.understand.showAll}
                          >
                            {languageDisplaySettings.understand.showAll ? 'Show Less' : 'Show More'}
                          </button>
                        </>
                      ) : (
                        <div className="language-badge-container">
                          {profileData.basicDetails.indianLanguages.understand.length > 0 ? (
                            <div className="language-badge-text">
                              {profileData.basicDetails.indianLanguages.understand.join(", ")}
                            </div>
                          ) : (
                            <span className="text-muted">No languages selected</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="language-category">
                      <h3>Languages I Speak</h3>
                      {isEditing ? (
                        <>
                          <div className="language-options">
                            {indianLanguages.map((language, index) => (
                              <div key={`speak-${language}`} className="language-checkbox">
                                {languageDisplaySettings.speak.showAll || index < INITIAL_LANGUAGES_TO_SHOW ? (
                                  <>
                                    <input
                                      type="checkbox"
                                      id={`speak-${language}`}
                                      checked={profileData.basicDetails.indianLanguages.speak.includes(language)}
                                      onChange={(e) => handleLanguageChange('speak', language, e.target.checked)}
                                    />
                                    <label htmlFor={`speak-${language}`}>{language}</label>
                                  </>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          <button
                            className="toggle-language-display-btn"
                            onClick={() => toggleLanguageDisplay('speak')}
                            data-expanded={languageDisplaySettings.speak.showAll}
                          >
                            {languageDisplaySettings.speak.showAll ? 'Show Less' : 'Show More'}
                          </button>
                        </>
                      ) : (
                        <div className="language-badge-container">
                          {profileData.basicDetails.indianLanguages.speak.length > 0 ? (
                            <div className="language-badge-text">
                              {profileData.basicDetails.indianLanguages.speak.join(", ")}
                            </div>
                          ) : (
                            <span className="text-muted">No languages selected</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="language-category">
                      <h3>Languages I Read/Write</h3>
                      {isEditing ? (
                        <>
                          <div className="language-options">
                            {indianLanguages.map((language, index) => (
                              <div key={`readWrite-${language}`} className="language-checkbox">
                                {languageDisplaySettings.readWrite.showAll || index < INITIAL_LANGUAGES_TO_SHOW ? (
                                  <>
                                    <input
                                      type="checkbox"
                                      id={`readWrite-${language}`}
                                      checked={profileData.basicDetails.indianLanguages.readWrite.includes(language)}
                                      onChange={(e) => handleLanguageChange('readWrite', language, e.target.checked)}
                                    />
                                    <label htmlFor={`readWrite-${language}`}>{language}</label>
                                  </>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          <button
                            className="toggle-language-display-btn"
                            onClick={() => toggleLanguageDisplay('readWrite')}
                            data-expanded={languageDisplaySettings.readWrite.showAll}
                          >
                            {languageDisplaySettings.readWrite.showAll ? 'Show Less' : 'Show More'}
                          </button>
                        </>
                      ) : (
                        <div className="language-badge-container">
                          {profileData.basicDetails.indianLanguages.readWrite.length > 0 ? (
                            <div className="language-badge-text">
                              {profileData.basicDetails.indianLanguages.readWrite.join(", ")}
                            </div>
                          ) : (
                            <span className="text-muted">No languages selected</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Social Media Profiles</label>
                  <div className="social-media-list">
                    {Object.entries(profileData.basicDetails?.socialMedia || {}).length > 0 ? (
                      // Show social media list if there are entries
                      Object.entries(profileData.basicDetails?.socialMedia || {}).map(([platform, url]) => (
                        <div key={platform} className="social-media-item">
                          {isEditing ? (
                            <select
                              className="social-media-platform-input profile-select"
                              value={platform}
                              onChange={(e) => handleSocialMediaChange(platform, 'platform', e.target.value)}
                            >
                              <option value="">Select Platform</option>
                              {socialMediaPlatforms.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="social-media-platform">{platform}</div>
                          )}

                          <input
                            type="url"
                            placeholder="https://..."
                            value={url}
                            onChange={(e) => handleSocialMediaChange(platform, 'url', e.target.value)}
                            disabled={!isEditing}
                            className="social-media-url"
                          />

                          {isEditing && (
                            <button
                              className="btn-remove-social"
                              onClick={() => handleRemoveSocialMedia(platform)}
                              type="button"
                            >
                              <FaTimes /> Remove
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      // Show "not added" message when no social media profiles exist
                      !isEditing && <div className="no-social-media">No social media profiles added</div>
                    )}

                    {isEditing && (
                      <button
                        className="btn-add-social"
                        onClick={handleAddSocialMedia}
                        type="button"
                      >
                        + Add Social Media
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact & Address Section */}
            <section className="profile-section">
              <div className="section-header">
                <FaUser className="section-icon" />
                <h2>Contact & Address</h2>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label>Primary Number</label>
                  <input
                    type="tel"
                    value={profileData.contactAddress.primaryNumber}
                    onChange={(e) => handleInputChange('contactAddress', 'primaryNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Alternate Number</label>
                  <input
                    type="tel"
                    value={profileData.contactAddress.alternateNumber}
                    onChange={(e) => handleInputChange('contactAddress', 'alternateNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="tel"
                    value={profileData.contactAddress.whatsappNumber}
                    onChange={(e) => handleInputChange('contactAddress', 'whatsappNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.contactAddress.email}
                    onChange={(e) => handleInputChange('contactAddress', 'email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                {/* Current Address */}
                <div className="address-section" style={{ gridColumn: '1 / -1' }}>
                  <h3 className="address-title">Current Address</h3>
                  <div className="address-fields">
                    <div className="form-group">
                      <label>Address Line 1</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.currentAddress.addressLine1}
                        onChange={(e) => handleAddressChange('currentAddress', 'addressLine1', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.currentAddress.addressLine2}
                        onChange={(e) => handleAddressChange('currentAddress', 'addressLine2', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.currentAddress.pincode}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleAddressChange('currentAddress', 'pincode', value);
                          if (isEditing) {
                            handlePincodeChange('currentAddress', value);
                          }
                        }}
                        maxLength={6}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.currentAddress.state}
                        onChange={(e) => handleAddressChange('currentAddress', 'state', e.target.value)}
                        disabled={true} // Always disabled as it's auto-filled based on pincode
                      />
                    </div>
                    <div className="form-group">
                      <label>District</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.currentAddress.district}
                        onChange={(e) => handleAddressChange('currentAddress', 'district', e.target.value)}
                        disabled={true} // Always disabled as it's auto-filled based on pincode
                      />
                    </div>
                    <div className="form-group">
                      <label>Post Office</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.currentAddress.postOffice}
                        onChange={(e) => handleAddressChange('currentAddress', 'postOffice', e.target.value)}
                        disabled={true} // Always disabled as it's auto-filled based on pincode
                      />
                    </div>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="address-section" style={{ gridColumn: '1 / -1' }}>
                  <div className="address-header">
                    <h3 className="address-title">Permanent Address</h3>
                    {isEditing && (
                      <button
                        type="button"
                        className="same-as-current-btn"
                        onClick={handleCopyCurrentAddress}
                      >
                        Same as Current Address
                      </button>
                    )}
                  </div>
                  <div className="address-fields">
                    <div className="form-group">
                      <label>Address Line 1</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.permanentAddress.addressLine1}
                        onChange={(e) => handleAddressChange('permanentAddress', 'addressLine1', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.permanentAddress.addressLine2}
                        onChange={(e) => handleAddressChange('permanentAddress', 'addressLine2', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.permanentAddress.pincode}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleAddressChange('permanentAddress', 'pincode', value);
                          if (isEditing) {
                            handlePincodeChange('permanentAddress', value);
                          }
                        }}
                        maxLength={6}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.permanentAddress.state}
                        onChange={(e) => handleAddressChange('permanentAddress', 'state', e.target.value)}
                        disabled={true} // Always disabled as it's auto-filled based on pincode
                      />
                    </div>
                    <div className="form-group">
                      <label>District</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.permanentAddress.district}
                        onChange={(e) => handleAddressChange('permanentAddress', 'district', e.target.value)}
                        disabled={true} // Always disabled as it's auto-filled based on pincode
                      />
                    </div>
                    <div className="form-group">
                      <label>Post Office</label>
                      <input
                        type="text"
                        value={profileData.contactAddress.permanentAddress.postOffice}
                        onChange={(e) => handleAddressChange('permanentAddress', 'postOffice', e.target.value)}
                        disabled={true} // Always disabled as it's auto-filled based on pincode
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Medical Certification Section */}
            <section className="profile-section">
              <div className="section-header">
                <FaGraduationCap className="section-icon" />
                <h2>Medical Certification</h2>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    value={profileData.medicalCertification.registrationNumber}
                    onChange={(e) => handleInputChange('medicalCertification', 'registrationNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your registration number"
                  />
                </div>
                <div className="form-group">
                  <label>Medical Council</label>
                  <select
                    className="profile-select"
                    value={profileData.medicalCertification.medicalCouncil}
                    onChange={(e) => handleInputChange('medicalCertification', 'medicalCouncil', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select Medical Council</option>
                    {medicalCouncils.map(council => (
                      <option key={council} value={council}>{council}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year of Registration</label>
                  <input
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={profileData.medicalCertification.yearOfRegistration}
                    onChange={(e) => handleInputChange('medicalCertification', 'yearOfRegistration', e.target.value)}
                    disabled={!isEditing}
                    placeholder="YYYY"
                  />
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    value={profileData.medicalCertification.yearsOfExperience}
                    onChange={(e) => handleInputChange('medicalCertification', 'yearsOfExperience', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>
            </section>

            {/* Qualification & Expertise Section */}
            <section className="profile-section">
              <div className="section-header">
                <FaGraduationCap className="section-icon" />
                <h2>Qualification & Expertise</h2>
              </div>
              <div className="qualification-expertise-wrapper">
                <div className="form-group">
                  <h3 className="section-subheader">Areas of Expertise</h3>
                  <div className="expertise-list">
                    {profileData.qualificationExpertise.areaOfExpertise.map((expertise, index) => (
                      <div key={index} className="expertise-item">
                        <input
                          type="text"
                          value={expertise}
                          onChange={(e) => {
                            const newExpertise = [...profileData.qualificationExpertise.areaOfExpertise];
                            newExpertise[index] = e.target.value;
                            setProfileData(prev => ({
                              ...prev,
                              qualificationExpertise: {
                                ...prev.qualificationExpertise,
                                areaOfExpertise: newExpertise
                              }
                            }));
                          }}
                          placeholder="Enter area of expertise"
                          disabled={!isEditing}
                        />
                        {isEditing && (
                          <button
                            className="btn-remove-expertise"
                            onClick={() => handleRemoveExpertise(index)}
                            type="button"
                          >
                            <FaTimes /> Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        className="btn-add-expertise"
                        onClick={handleAddExpertise}
                        type="button"
                      >
                        + Add Expertise
                      </button>
                    )}
                  </div>
                </div>                <div className="form-group">
                  <h3 className="section-subheader">Qualification
                  </h3>
                  <div className="qualification
-list">
                    {profileData.qualificationExpertise.qualification
                      .map((qualification, index) => (
                        <div key={index} className="qualification-item">
                          <div className="qualification-field-wrapper" style={{ flexGrow: 1 }}>
                            <span className="qualification-field-label">Qualification</span>
                            <input
                              type="text"
                              value={qualification}
                              onChange={(e) => handleQualificationChange(index, e.target.value)}
                              placeholder="Enter your qualification"
                              disabled={!isEditing}
                            />
                          </div>
                          {isEditing && (
                            <button
                              className="btn-remove-qualification"
                              onClick={() => handleRemoveQualification(index)}
                              type="button"
                            >
                              <FaTimes /> Remove
                            </button>
                          )}
                        </div>
                      ))}
                    {isEditing && (
                      <button
                        className="btn-add-qualification"
                        onClick={handleAddQualification}
                        type="button"
                      >
                        + Add Qualification
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <h3 className="section-subheader">Specializations</h3>
                  <div className="specializations-list">
                    {profileData.qualificationExpertise.specializations.map((specialization, index) => (
                      <div key={index} className="specialization-item">
                        {isEditing ? (
                          <select
                            className="specialization-select profile-select"
                            value={specialization.name}
                            onChange={(e) => handleSpecializationChange(index, e.target.value)}
                            aria-label="Specialization"
                          >
                            <option value="">Select Specialization</option>
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="specialization-name">
                            {specialization.isCustom ? specialization.customName : specialization.name}
                          </div>
                        )}

                        {specialization.isCustom && isEditing && (
                          <input
                            type="text"
                            placeholder="Enter specialization name"
                            value={specialization.customName || ''}
                            onChange={(e) => handleCustomSpecializationChange(index, e.target.value)}
                            className="specialization-custom-input"
                          />
                        )}

                        {isEditing && (
                          <button
                            className="btn-remove-specialization"
                            onClick={() => handleRemoveSpecialization(index)}
                            type="button"
                          >
                            <FaTimes /> Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        className="btn-add-specialization"
                        onClick={handleAddSpecialization}
                        type="button"
                      >
                        + Add Specialization
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Practice Details Section */}
            <section className="profile-section">
              <div className="section-header">
                <FaHospital className="section-icon" />
                <h2>Practice Details</h2>
              </div>
              <div className="practice-details-content">
                {profileData.practiceDetails.map((practice, index) => (
                  <div key={index} className="practice-card">                    <div className="practice-card-header">
                    <h3 className="practice-card-title">
                      {practice.hospitalName || 'New Practice Location'}
                    </h3>                    <div className="practice-card-actions">
                      {isEditing ? (
                        <>
                          <button
                            className={`${practice._id || practice.id ? 'btn-update-practice' : 'btn-save-practice'} ${!practiceChanges[index] ? 'disabled' : ''}`}
                            onClick={() => handleSavePractice(index)}
                            type="button"
                            disabled={!practiceChanges[index]}
                            title={!practiceChanges[index] ? "No changes to save" : (practice._id || practice.id) ? "Update changes" : "Save new practice"}
                          >
                            <FaSave /> {(practice._id || practice.id) ? 'Update' : 'Save'}
                          </button>
                          <button
                            className="btn-remove-practice"
                            onClick={() => handleRemovePractice(index)}
                            type="button"
                          >
                            <FaTimes /> Remove
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-edit-practice"
                          onClick={() => {
                            setIsEditing(true);
                            // Mark this practice location for changes
                            setPracticeChanges(prev => ({
                              ...prev,
                              [index]: true
                            }));
                          }}
                          type="button"
                        >
                          <FaEdit /> Edit
                        </button>
                      )}
                    </div>
                  </div>

                    <div className="practice-info-grid">
                      <div className="form-group">
                        <label>Hospital/Clinic Name</label>
                        <input
                          type="text"
                          value={practice.hospitalName}
                          onChange={(e) => handlePracticeChange(index, 'hospitalName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter hospital/clinic name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          value={practice.practiceAddress}
                          onChange={(e) => handlePracticeChange(index, 'practiceAddress', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="form-group">
                        <label>Designation</label>
                        <input
                          type="text"
                          value={practice.designation}
                          onChange={(e) => handlePracticeChange(index, 'designation', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Your designation"
                        />
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <input
                          type="text"
                          value={practice.departmentName}
                          onChange={(e) => handlePracticeChange(index, 'departmentName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Your department"
                        />
                      </div>

                      <div className="practice-pincode-section">
                        <div className="form-group">
                          <label>Pincode</label>
                          <input
                            type="text"
                            value={practice.practicePincode}
                            onChange={(e) => {
                              const value = e.target.value;
                              handlePracticeChange(index, 'practicePincode', value);
                              if (isEditing && value.length === 6) {
                                handlePracticePincodeChange(index, value);
                              }
                            }}
                            maxLength={6}
                            disabled={!isEditing}
                            placeholder="6-digit pincode"
                          />
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input
                            type="text"
                            value={practice.practiceState}
                            onChange={(e) => handlePracticeChange(index, 'practiceState', e.target.value)}
                            disabled={true}
                            placeholder="Auto-filled from pincode"
                          />
                        </div>
                        <div className="form-group">
                          <label>District</label>
                          <input
                            type="text"
                            value={practice.practiceDistrict}
                            onChange={(e) => handlePracticeChange(index, 'practiceDistrict', e.target.value)}
                            disabled={true}
                            placeholder="Auto-filled from pincode"
                          />
                        </div>
                        <div className="form-group">
                          <label>Post Office</label>
                          <input
                            type="text"
                            value={practice.practicePostOffice}
                            onChange={(e) => handlePracticeChange(index, 'practicePostOffice', e.target.value)}
                            disabled={true}
                            placeholder="Auto-filled from pincode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <button
                    className="btn-add-practice"
                    onClick={handleAddPractice}
                    type="button"
                  >
                    + Add Practice Location
                  </button>
                )}
              </div>
            </section>


          </div>
        </>
      )}
    </div>
  );
};

export default Profile;