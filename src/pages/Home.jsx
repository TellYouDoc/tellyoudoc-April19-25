import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import axios from "axios";

import Welcome_Navbar from "../components/Welcome_Navbar";
import Footer from "../components/Footer";

// About Us Background
import aboutImageUrl from "../assets/images/about-1.jpg";
import aboutImageUrl2 from "../assets/images/about-2.jpg";
import aboutImageUrl3 from "../assets/images/about-3.jpg";
import aboutImageUrl4 from "../assets/images/about-4.jpg";
import aboutImageUrl5 from "../assets/images/about-5.jpg";
import aboutImageUrl6 from "../assets/images/about-6.jpg";
import aboutImageUrl7 from "../assets/images/about-7.jpg";
import aboutImageUrl8 from "../assets/images/about-8.jpg";
import aboutImageUrl9 from "../assets/images/about-9.jpg";
import aboutImageUrl10 from "../assets/images/about-10.jpg";
import aboutImageUrl11 from "../assets/images/about-11.jpg";
import aboutImageUrl12 from "../assets/images/about-12.jpg";

// Product Images
import productImageUrl from "../assets/images/product/pr1.jpg";
import productImageUrl2 from "../assets/images/product/pr2.jpg";
import productImageUrl3 from "../assets/images/product/pr3.jpg";
import productImageUrl4 from "../assets/images/product/pr4.jpg";
import productImageUrl5 from "../assets/images/product/pr5.jpg";
import productImageUrl6 from "../assets/images/product/pr6.jpg";
import productImageUrl7 from "../assets/images/product/pr7.jpg";
import productImageUrl8 from "../assets/images/product/pr8.jpg";

// Doctor Image
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

  // State to track which inputs have focus
  const [focusedInput, setFocusedInput] = useState(null);

  // Simple states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [patientSlide, setPatientSlide] = useState(0);
  const [doctorSlide, setDoctorSlide] = useState(0);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [previousBgImage, setPreviousBgImage] = useState(null);
  const [currentDocBgImage, setCurrentDocBgImage] = useState(0);
  const [previousDocBgImage, setPreviousDocBgImage] = useState(null);
  const [isProductSectionVisible, setIsProductSectionVisible] = useState(false);

  // About section image carousel states
  const [aboutImagePositions, setAboutImagePositions] = useState([0, 1, 2, 3]);
  const [productImagePositions, setProductImagePositions] = useState([
    0, 1, 2, 3,
  ]);
  // Separate state variables for About and Product sections
  const [slidingImages, setSlidingImages] = useState({});
  const [newImages, setNewImages] = useState({});
  const [animationTypes, setAnimationTypes] = useState({});
  // Add new state variables for product section animations
  const [productSlidingImages, setProductSlidingImages] = useState({});
  const [productNewImages, setProductNewImages] = useState({});
  const [productAnimationTypes, setProductAnimationTypes] = useState({});

  const aboutImages = [
    aboutImageUrl,
    aboutImageUrl2,
    aboutImageUrl3,
    aboutImageUrl4,
    aboutImageUrl5,
    aboutImageUrl6,
    aboutImageUrl7,
    aboutImageUrl8,
    aboutImageUrl9,
    aboutImageUrl10,
    aboutImageUrl11,
    aboutImageUrl12,
  ];

  const productImages = [
    productImageUrl,
    productImageUrl2,
    productImageUrl3,
    productImageUrl4,
    productImageUrl5,
    productImageUrl6,
    productImageUrl7,
    productImageUrl8,
  ];

  // Animation types array
  const animationOptions = [
    "left", // slide-in-left, slide-out-right
    "right", // slide-in-right, slide-out-left
    "top", // slide-in-top, slide-out-bottom
    "bottom", // slide-in-bottom, slide-out-top
    "fade", // fade-in, fade-out
  ];

  // Slide definitions - moved up to be defined before useEffect calls
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
      alt: "Doctor using digital platform",
    },
    {
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
      alt: "Patient using mobile app",
    },
    {
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
      alt: "Healthcare technology",
    },
  ];

  const patientSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Patient reporting symptoms",
    },
    {
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Patient choosing doctor",
    },
    {
      image:
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Patient accessing health records",
    },
  ];

  const doctorSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
      alt: "Doctor using dashboard",
    },
    {
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
      alt: "Doctor reviewing patient data",
    },
    {
      image:
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Remote consultation",
    },
  ];

  // Feature animation states
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [featureSubFeatures, setFeatureSubFeatures] = useState({});
  const [isFeatureSectionVisible, setIsFeatureSectionVisible] = useState(false);
  const [currentCarouselItem, setCurrentCarouselItem] = useState(null);
  const [isCarouselItemActive, setIsCarouselItemActive] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);

  // Patient workflow animation states
  const [visiblePatientFeatures, setVisiblePatientFeatures] = useState([]);
  const [patientFeatureSubFeatures, setPatientFeatureSubFeatures] = useState(
    {}
  );
  const [isPatientSectionVisible, setIsPatientSectionVisible] = useState(false);

  // Doctor workflow animation states
  const [visibleDoctorFeatures, setVisibleDoctorFeatures] = useState([]);
  const [doctorFeatureSubFeatures, setDoctorFeatureSubFeatures] = useState({});
  const [isDoctorSectionVisible, setIsDoctorSectionVisible] = useState(false);

  // Refs
  const carouselTimerRef = useRef(null);
  const patientAnimationTimerRef = useRef(null);
  const doctorAnimationTimerRef = useRef(null);
  const productSectionRef = useRef(null);
  const aboutImagesTimerRef = useRef(null);
  const productImagesTimerRef = useRef(null);

  // Add a new state to track exit animations
  const [isExiting, setIsExiting] = useState(false);
  // Features data
  const features = [
    {
      name: "Breast Cancer Treatment",
      icon: "https://img.freepik.com/free-vector/hand-drawn-epidemiology-illustration_23-2149707548.jpg",
      subFeatures: [
        "Review and track breast health, mastalgia patterns, and patient-reported outcomes.",
      ],
      carouselImage:
        "https://placehold.co/280x580/2a7d73/ffffff?text=Symptom+Explorer",
    },
    {
      name: "Chemotherapy Management",
      icon: "https://img.freepik.com/free-vector/information-tab-concept-illustration_114360-4868.jpg",
      subFeatures: [
        "Review daily vitals, side effects, adjust medication schedules throughout chemo cycles.",
      ],
      carouselImage:
        "https://placehold.co/280x580/2a7d73/ffffff?text=Dashboard",
    },
    {
      name: "OPD & Appointment Management",
      icon: "https://img.freepik.com/free-photo/female-patients-talking-hospital-indoors_23-2148981280.jpg",
      subFeatures: [
        "Manage and review consultation management, patient flow insight, and more ",
      ],
      carouselImage:
        "https://placehold.co/280x580/2a7d73/ffffff?text=Cancer+Care",
    },
    {
      name: "Doctor's Assistance Hub",
      icon: "https://img.freepik.com/free-vector/lovely-flat-characters-speaking-different-languages_23-2147872797.jpg",
      subFeatures: [
        "Add RMOs nurses, or clinic staff  to manage patients, schedules etc. in sync with doctor.",
      ],
      carouselImage: "https://placehold.co/280x580/2a7d73/ffffff?text=Language",
    },
  ];

  // Effect for about section image rotation
  useEffect(() => {
    const rotateAboutImages = () => {
      // Get currently visible image indices
      const currentlyVisibleImages = [...aboutImagePositions];

      // Prepare new image indices and animation types for all positions
      const newImagesCandidates = {};
      const newAnimationTypes = {};
      const newSlidingImages = {};

      // For each position (0-3), choose a new image and animation
      for (let position = 0; position < 4; position++) {
        // Find a new image that's not currently visible
        let newImageCandidate;
        do {
          newImageCandidate = Math.floor(Math.random() * aboutImages.length);
        } while (
          currentlyVisibleImages.includes(newImageCandidate) ||
          Object.values(newImagesCandidates).includes(newImageCandidate)
        );

        // Store the new image candidate
        newImagesCandidates[position] = newImageCandidate;

        // Choose a random animation type for this position
        newAnimationTypes[position] =
          animationOptions[Math.floor(Math.random() * animationOptions.length)];

        // Mark this position as sliding
        newSlidingImages[position] = true;
      }

      // Update all state at once
      setSlidingImages(newSlidingImages);
      setNewImages(newImagesCandidates);
      setAnimationTypes(newAnimationTypes);

      // After animation completes, update the positions array
      setTimeout(() => {
        setAboutImagePositions((prev) => {
          return prev.map((_, index) => newImagesCandidates[index]);
        });

        // Reset sliding states
        setSlidingImages({});
        setNewImages({});
      }, 1250); // Match this with CSS transition duration
    };

    // Set up interval for rotating images
    aboutImagesTimerRef.current = setInterval(rotateAboutImages, 5000);

    return () => {
      if (aboutImagesTimerRef.current) {
        clearInterval(aboutImagesTimerRef.current);
      }
    };
  }, [aboutImagePositions, aboutImages.length]);

  // Effect for product section image rotation - update to use product-specific state variables
  useEffect(() => {
    const rotateProductImages = () => {
      // Get currently visible image indices
      const currentlyVisibleImages = [...productImagePositions];

      // Prepare new image indices and animation types for all positions
      const newImagesCandidates = {};
      const newAnimationTypes = {};
      const newSlidingImages = {};

      // For each position (0-3), choose a new image and animation
      for (let position = 0; position < 4; position++) {
        // Find a new image that's not currently visible
        let newImageCandidate;
        do {
          newImageCandidate = Math.floor(Math.random() * productImages.length);
        } while (
          currentlyVisibleImages.includes(newImageCandidate) ||
          Object.values(newImagesCandidates).includes(newImageCandidate)
        );

        // Store the new image candidate
        newImagesCandidates[position] = newImageCandidate;

        // Choose a random animation type for this position
        newAnimationTypes[position] =
          animationOptions[Math.floor(Math.random() * animationOptions.length)];

        // Mark this position as sliding
        newSlidingImages[position] = true;
      }

      // Update all state at once - using product-specific state variables
      setProductSlidingImages(newSlidingImages);
      setProductNewImages(newImagesCandidates);
      setProductAnimationTypes(newAnimationTypes);

      // After animation completes, update the positions array
      setTimeout(() => {
        setProductImagePositions((prev) => {
          return prev.map((_, index) => newImagesCandidates[index]);
        });

        // Reset sliding states
        setProductSlidingImages({});
        setProductNewImages({});
      }, 1300); // Slightly longer animation duration
    };

    // Start rotation only when the section is visible
    if (isProductSectionVisible) {
      // Set up interval for rotating images
      productImagesTimerRef.current = setInterval(rotateProductImages, 5000);
    }

    return () => {
      if (productImagesTimerRef.current) {
        clearInterval(productImagesTimerRef.current);
      }
    };
  }, [productImagePositions, productImages.length, isProductSectionVisible]);

  // Helper to determine animation classes based on type - update to check for section type
  const getAnimationClasses = (position, isProductSection = false) => {
    // Use the appropriate state variables based on section type
    const sectionSlidingImages = isProductSection
      ? productSlidingImages
      : slidingImages;
    const sectionAnimationTypes = isProductSection
      ? productAnimationTypes
      : animationTypes;

    if (!sectionSlidingImages[position]) return { out: "", in: "" };

    const animationType = sectionAnimationTypes[position];
    switch (animationType) {
      case "left":
        return { out: "sliding-out-right", in: "sliding-in-left" };
      case "right":
        return { out: "sliding-out-left", in: "sliding-in-right" };
      case "top":
        return { out: "sliding-out-bottom", in: "sliding-in-top" };
      case "bottom":
        return { out: "sliding-out-top", in: "sliding-in-bottom" };
      case "fade":
        return { out: "fading-out", in: "fading-in" };
      default:
        return { out: "sliding-out-right", in: "sliding-in-left" };
    }
  };

  // Simple slide interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPatientSlide((prev) => (prev + 1) % patientSlides.length);
    }, 4000); // Change patient slides every 4 seconds

    return () => clearInterval(interval);
  }, [patientSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDoctorSlide((prev) => (prev + 1) % doctorSlides.length);
    }, 4500); // Change doctor slides every 4.5 seconds

    return () => clearInterval(interval);
  }, [doctorSlides.length]);

  // Patient workflow feature animation effect
  useEffect(() => {
    const bgImageInterval = setInterval(() => {
      // First set previous to be the current image
      setPreviousBgImage(currentBgImage);

      // After a short delay to allow for fade out, set the new current image
      setTimeout(() => {
        const nextImage = (currentBgImage + 1) % 4;
        setCurrentBgImage(nextImage);

        // Add the next feature to visible features (don't remove previous ones)
        setVisiblePatientFeatures((prev) => {
          // If we're back to the first image (nextImage === 0), reset the array
          if (nextImage === 0) {
            return [0]; // Start fresh with just feature 0
          }
          // Otherwise add the new feature to the existing array
          return [...new Set([...prev, nextImage])];
        });

        // Clear sub-features for this feature before starting animation
        setPatientFeatureSubFeatures((prev) => ({
          ...prev,
          [nextImage]: [],
        }));

        // Show sub-features one by one with staggered timing
        const subFeatureCount = 4; // Each feature has 4 sub-features

        // Function to show sub-features sequentially
        const showSubFeatures = (subIndex) => {
          if (subIndex < subFeatureCount) {
            setTimeout(() => {
              setPatientFeatureSubFeatures((prev) => {
                const currentSubFeatures = [...(prev[nextImage] || [])];
                if (!currentSubFeatures.includes(subIndex)) {
                  currentSubFeatures.push(subIndex);
                }
                return {
                  ...prev,
                  [nextImage]: currentSubFeatures,
                };
              });

              // Call recursively for next sub-feature
              showSubFeatures(subIndex + 1);
            }, 400); // Show each sub-feature with a 400ms delay (increased from 300ms)
          }
        };

        // Start showing sub-features
        setTimeout(() => {
          showSubFeatures(0);
        }, 600); // Wait after feature appears before starting sub-features (increased from 400ms)
      }, 1200); // This delay should match the transition time in CSS (increased from 800ms)
    }, 5000); // Keep rotation interval at 5 seconds

    return () => clearInterval(bgImageInterval);
  }, [currentBgImage]);

  // Patient workflow feature animation - initial setup when section becomes visible
  useEffect(() => {
    // Show only the first feature initially
    setVisiblePatientFeatures([0]);

    // Initialize sub-features for this feature
    setPatientFeatureSubFeatures({
      [0]: [],
    });

    // Show sub-features one by one with staggered timing
    const subFeatureCount = 4; // Each feature has 4 sub-features

    // Function to show sub-features sequentially
    const showSubFeatures = (subIndex) => {
      if (subIndex < subFeatureCount) {
        setTimeout(() => {
          setPatientFeatureSubFeatures((prev) => {
            const currentSubFeatures = [...(prev[0] || [])];
            if (!currentSubFeatures.includes(subIndex)) {
              currentSubFeatures.push(subIndex);
            }
            return {
              ...prev,
              [0]: currentSubFeatures,
            };
          });

          // Call recursively for next sub-feature
          showSubFeatures(subIndex + 1);
        }, 300); // Show each sub-feature with a 300ms delay
      }
    };

    // Start showing sub-features after a delay
    setTimeout(() => {
      showSubFeatures(0);
    }, 400); // Wait after feature appears before starting sub-features
  }, []); // Only run once on mount

  // Show active carousel item based on visible features
  const getActiveCarouselItem = (index) => {
    // If this is the active item
    if (currentCarouselItem === index && isCarouselItemActive) {
      return true;
    }

    // If this is the next item that should be shown waiting on the right
    if (currentCarouselItem !== null && index === currentCarouselItem + 1) {
      return false; // Not active but should be visible on the right
    }

    // Special case for the first item when starting
    if (currentCarouselItem === null && index === 0) {
      return false; // Make first item visible but not active yet
    }

    // Hide all other items
    return false;
  };

  // Helper functions
  const isFeatureVisible = (featureIndex) => {
    return visibleFeatures.includes(featureIndex);
  };

  const isSubFeatureVisible = (featureIndex, subFeatureIndex) => {
    const subFeatures = featureSubFeatures[featureIndex] || [];
    return subFeatures.includes(subFeatureIndex);
  };

  // Feature section animation handler - no scroll dependency
  useEffect(() => {
    // Start with empty arrays of visible features
    setVisibleFeatures([]);
    setFeatureSubFeatures({});
    setCurrentCarouselItem(null);
    setIsCarouselItemActive(false);
    setIsExiting(false);

    // Short delay before starting the animation sequence
    setTimeout(() => {
      showFeatures();
    }, 800); // Increased from 500ms to give a more relaxed start

    // Function to show all features one by one and then hide them all together
    const showFeatures = () => {
      // Clear any previous timeouts
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }

      // Reset exiting state to ensure no exit animations are active
      setIsExiting(false);

      // Function to show a single feature and its sub-features
      const showFeature = (featureIndex) => {
        // Show the feature
        setVisibleFeatures((prev) => {
          const newFeatures = [...prev];
          if (!newFeatures.includes(featureIndex)) {
            newFeatures.push(featureIndex);
          }
          return newFeatures;
        });

        // Initialize sub-features array for this feature
        setFeatureSubFeatures((prev) => ({
          ...prev,
          [featureIndex]: [],
        }));

        // Animate sub-features one by one
        const subFeatureCount = features[featureIndex].subFeatures.length;

        // Function to show sub-features sequentially
        const showSubFeatures = (subIndex) => {
          if (subIndex < subFeatureCount) {
            setTimeout(() => {
              setFeatureSubFeatures((prev) => {
                const currentFeatureSubFeatures = [
                  ...(prev[featureIndex] || []),
                ];
                if (!currentFeatureSubFeatures.includes(subIndex)) {
                  currentFeatureSubFeatures.push(subIndex);
                }
                return {
                  ...prev,
                  [featureIndex]: currentFeatureSubFeatures,
                };
              });

              // Call recursively for next sub-feature
              showSubFeatures(subIndex + 1);
            }, 600); // Show each sub-feature with a 300ms delayW
          }
        };

        // Start showing sub-features
        showSubFeatures(0);

        // If there are more features to show, schedule the next one
        if (featureIndex < features.length - 1) {
          setTimeout(() => {
            showFeature(featureIndex + 1);
          }, 1000); // Show next feature after 2 seconds
        } else {
          // All features have been shown
          // Wait a longer time before restarting the cycle
          carouselTimerRef.current = setTimeout(() => {
            // Set exiting state to true for all features
            setIsExiting(true);

            // Wait for exit animation, then reset everything
            setTimeout(() => {
              // Reset all state variables
              setVisibleFeatures([]);
              setFeatureSubFeatures({});

              // Restart animation sequence after a delay
              setTimeout(() => {
                setIsExiting(false);
                showFeatures(); // Restart the animation cycle
              }, 1000);
            }, 2000); // Longer time for exit animation
          }, 6000); // Show all features for 10 seconds before restarting
        }
      };

      // Start with the first feature
      showFeature(0);

      // Also show the first carousel item
      setCurrentCarouselItem(0);
      setIsCarouselItemActive(true);
    };

    return () => {
      // Clear any running intervals on unmount
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
        carouselTimerRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Helper functions for patient workflow animations
  const isPatientFeatureVisible = (featureIndex) => {
    return visiblePatientFeatures.includes(featureIndex);
  };

  const isPatientSubFeatureVisible = (featureIndex, subFeatureIndex) => {
    const subFeatures = patientFeatureSubFeatures[featureIndex] || [];
    return subFeatures.includes(subFeatureIndex);
  };

  const handlePatientIndicatorClick = (index) => {
    setPatientSlide(index);
  };

  const handleDoctorIndicatorClick = (index) => {
    setDoctorSlide(index);
  };

  // Doctor workflow feature animation effect
  useEffect(() => {
    const docBgImageInterval = setInterval(() => {
      // First set previous to be the current image
      setPreviousDocBgImage(currentDocBgImage);

      // After a short delay to allow for fade out, set the new current image
      setTimeout(() => {
        const nextImage = (currentDocBgImage + 1) % 4;
        setCurrentDocBgImage(nextImage);

        // Add the next feature to visible features (don't remove previous ones)
        setVisibleDoctorFeatures((prev) => {
          // If we're back to the first image (nextImage === 0), reset the array
          if (nextImage === 0) {
            return [0]; // Start fresh with just feature 0
          }
          // Otherwise add the new feature to the existing array
          return [...new Set([...prev, nextImage])];
        });

        // Clear sub-features for this feature before starting animation
        setDoctorFeatureSubFeatures((prev) => ({
          ...prev,
          [nextImage]: [],
        }));

        // Show sub-features one by one with staggered timing
        const subFeatureCount = 4; // Each feature has 4 sub-features

        // Function to show sub-features sequentially
        const showSubFeatures = (subIndex) => {
          if (subIndex < subFeatureCount) {
            setTimeout(() => {
              setDoctorFeatureSubFeatures((prev) => {
                const currentSubFeatures = [...(prev[nextImage] || [])];
                if (!currentSubFeatures.includes(subIndex)) {
                  currentSubFeatures.push(subIndex);
                }
                return {
                  ...prev,
                  [nextImage]: currentSubFeatures,
                };
              });

              // Call recursively for next sub-feature
              showSubFeatures(subIndex + 1);
            }, 400); // Show each sub-feature with a 400ms delay (increased from 300ms)
          }
        };

        // Start showing sub-features
        setTimeout(() => {
          showSubFeatures(0);
        }, 600); // Wait after feature appears before starting sub-features (increased from 400ms)
      }, 1200); // This delay should match the transition time in CSS (increased from 800ms)
    }, 5000); // Keep rotation interval at 5 seconds

    return () => clearInterval(docBgImageInterval);
  }, [currentDocBgImage]);

  // Doctor workflow feature animation - initial setup when section becomes visible
  useEffect(() => {
    // Show only the first feature initially
    setVisibleDoctorFeatures([0]);

    // Initialize sub-features for this feature
    setDoctorFeatureSubFeatures({
      [0]: [],
    });

    // Show sub-features one by one with staggered timing
    const subFeatureCount = 4; // Each feature has 4 sub-features

    // Function to show sub-features sequentially
    const showSubFeatures = (subIndex) => {
      if (subIndex < subFeatureCount) {
        setTimeout(() => {
          setDoctorFeatureSubFeatures((prev) => {
            const currentSubFeatures = [...(prev[0] || [])];
            if (!currentSubFeatures.includes(subIndex)) {
              currentSubFeatures.push(subIndex);
            }
            return {
              ...prev,
              [0]: currentSubFeatures,
            };
          });

          // Call recursively for next sub-feature
          showSubFeatures(subIndex + 1);
        }, 300); // Show each sub-feature with a 300ms delay
      }
    };

    // Start showing sub-features after a delay
    setTimeout(() => {
      showSubFeatures(0);
    }, 400); // Wait after feature appears before starting sub-features
  }, []); // Only run once on mount

  // Helper functions for doctor workflow animations
  const isDoctorFeatureVisible = (featureIndex) => {
    return visibleDoctorFeatures.includes(featureIndex);
  };

  const isDoctorSubFeatureVisible = (featureIndex, subFeatureIndex) => {
    const subFeatures = doctorFeatureSubFeatures[featureIndex] || [];
    return subFeatures.includes(subFeatureIndex);
  };

  // Add Intersection Observer for Product section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsProductSectionVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (productSectionRef.current) {
      observer.observe(productSectionRef.current);
    }

    return () => {
      if (productSectionRef.current) {
        observer.unobserve(productSectionRef.current);
      }
    };
  }, []);

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

  // Form handling functions
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
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
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
      const response = await axios.post(
        "https://api.tellyoudoc.com/api/v1/contact-us",
        formData
      );

      console.log(response);

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
                    Reimagine Cancer Care with{" "}
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
                    </span>
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
                    Smart tools for breast cancer screening, chemo management,
                    OPD workflows, and assistant-led care — all in one app.
                    Built for doctors. Backed by clinical expertise.
                  </p>
                  <div className="home-hero-cta">
                    <Link
                      to="/partner"
                      className="home-cta-button"
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
                      Be Beta Partner
                    </Link>
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
            <div className="home-about-images-grid">
              <img
                src={aboutImageUrl}
                alt="About Us"
                className="home-about-section-image"
              />
            </div>
            <div className="home-about-section-about-content">
              <div className="home-about-section-about-info">
                <div className="home-about-section-about-item">
                  <div className="home-about-section-about-item-label">
                    Vision
                  </div>
                  <p>
                    To revolutionize healthcare accessibility by bridging the
                    gap between patients and doctors, empowering individuals
                    with seamless, digital access to quality medical
                    consultations, and building healthier communities across
                    India.
                  </p>
                </div>

                <div className="home-about-section-about-item">
                  <div className="home-about-section-about-item-label">
                    Mission
                  </div>
                  <p>
                    Our mission is to simplify healthcare access for everyone
                    through a user-friendly platform where patients can connect
                    with trusted doctors, track and communicate symptoms, and
                    receive expert medical guidance. We are committed to
                    leveraging technology to enhance patient outcomes, support
                    doctors in expanding their reach, and prioritize secure,
                    efficient, and compassionate healthcare for all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section with Carousel */}
        <section
          id="product"
          className="product-section"
          ref={productSectionRef}
        >
          <div className="home-section-header">
            <h2>Our Offerings</h2>
          </div>
          <div
            className={`
            product-content tellyoudoc-offers-content ${
              isProductSectionVisible ? "animate-section" : ""
            } home-product-section-content`}
          >
            <div className="about-content feature-content">
              <div className="about-text">
                <div className="about-header"></div>
                <div className="about-info">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={`feature-animation about-item ${
                        isFeatureVisible(featureIndex) ? "active" : "hidden"
                      }`}
                      style={{ marginBottom: "45px" }}
                    >
                      <span
                        className="about-item-label feature-item-heading"
                        style={{ color: "#05A1A4" }}
                      >
                        {feature.name}
                      </span>
                      <div className="about-item-content">
                        {feature.subFeatures.map((subFeature, subIndex) => (
                          <div
                            key={subIndex}
                            className={`subfeature-animation ${
                              isSubFeatureVisible(featureIndex, subIndex)
                                ? "subfeature-in"
                                : "hidden"
                            }`}
                          >
                            {subFeature}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="product-images-grid">
              {[0, 1, 2, 3].map((position) => (
                <div key={position} className="about-image-wrapper">
                  {productSlidingImages[position] ? (
                    <>
                      <img
                        src={productImages[productImagePositions[position]]}
                        alt={`Healthcare Innovation ${position + 1}`}
                        className={`about-image product-image ${
                          getAnimationClasses(position, true).out
                        }`}
                      />
                      <img
                        src={productImages[productNewImages[position]]}
                        alt={`Healthcare Innovation new`}
                        className={`about-image product-image ${
                          getAnimationClasses(position, true).in
                        }`}
                      />
                    </>
                  ) : (
                    <img
                      src={productImages[productImagePositions[position]]}
                      alt={`Healthcare Innovation ${position + 1}`}
                      className="about-image product-image"
                    />
                  )}
                </div>
              ))}
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
                      onFocus={() => handleFocus("name")}
                      onBlur={handleBlur}
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
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
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
                      onFocus={() => handleFocus("phone")}
                      onBlur={handleBlur}
                      placeholder=" "
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
                      onFocus={() => handleFocus("message")}
                      onBlur={handleBlur}
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
            <div className="home-supported-item">
              <div className="home-supported-logo">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/2/22/Indian_Institute_of_Information_Technology%2C_Guwahati_Logo.svg"
                  alt="IIIT Guwahati Logo"
                  className="home-supported-image"
                />
              </div>
              <div className="home-supported-info">
                <h3>Indian Institute of Information Technology, Guwahati</h3>
                <p>
                  We would like to express our heartfelt thanks to IIIT Guwahati
                  for their support and guidance throughout the development of
                  the TellyouDoc platform. Their involvement has been vital in
                  helping us move forward with our vision of creating a
                  meaningful and impactful healthcare solution.
                </p>
                <p>
                  This collaboration exemplifies how academic institutions and
                  healthcare initiatives can work together to create meaningful
                  technological solutions that address critical healthcare
                  challenges and improve patient outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="bottom-line"></div>
      <Footer />
    </>
  );
};

export default Home;
