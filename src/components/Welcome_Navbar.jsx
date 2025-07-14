import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookieUtils";

import "../styles/welcome_Navbar.css";
import logoImage from "../assets/tellyoudoc.png";

const Welcome_Navbar = ({ showLinks = true, linksActive = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  const scrollToSection = (sectionId) => {
    // If we're on the homepage, just scroll to the section
    if (isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        const navbarHeight = 80; // Height of the navbar
        const sectionPosition =
          section.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = sectionPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        closeMenu();
      }
    } else {
      // If we're not on the homepage, we need to first navigate to the homepage
      // and then scroll to the section
      sessionStorage.setItem("scrollToSection", sectionId);
      window.location.href = "/";
      closeMenu();
    }
  };

  const isUserAuthenticated = () => {
    const accessToken = getCookie("AccessToken");
    const refreshToken = getCookie("RefreshToken");
    return !!(accessToken && refreshToken);
  };

  // Determine where the Doctors Zone link should go
  const doctorsZoneTarget = isUserAuthenticated() ? "/dashboard" : "/login";

  // Add this handling for the Doctor Zone link
  const handleDoctorZoneClick = (e) => {
    e.preventDefault();

    // If already on login page, don't open in new tab
    if (location.pathname === "/login" && !isUserAuthenticated()) {
      // Just close menu if we're already on login page
      closeMenu();
      return;
    }

    // Otherwise navigate normally
    if (isUserAuthenticated()) {
      window.open("/dashboard", "_blank", "noopener,noreferrer");
    } else {
      window.open("/login", "_blank", "noopener,noreferrer");
    }

    closeMenu();
  };

  // Handle scrolling to section after navigation to homepage
  useEffect(() => {
    if (isHomePage) {
      const sectionToScroll = sessionStorage.getItem("scrollToSection");
      if (sectionToScroll) {
        // Small delay to ensure the DOM is ready
        setTimeout(() => {
          const section = document.getElementById(sectionToScroll);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
          sessionStorage.removeItem("scrollToSection");
        }, 500);
      }
    }
  }, [isHomePage]);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Navigate to partner page with form open
  const handleJoinBeta = (e) => {
    e.preventDefault();
    navigate("/partner");
    closeMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        {linksActive ? (
          <Link to="/" onClick={closeMenu}>
            <img src={logoImage} alt="tellYouDoc Logo" className="logo-image" />
          </Link>
        ) : (
          <img src={logoImage} alt="tellYouDoc Logo" className="logo-image" />
        )}
      </div>

      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {showLinks && (
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          {/* Main Navigation */}
          <a
            href="/#home-container"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home-container");
            }}
          >
            Home
          </a>
          <a
            href="/#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
          >
            About Us
          </a>
          {/* Product Dropdown */}
          <div
            className={`dropdown ${productDropdownOpen ? "open" : ""}`}
            onMouseEnter={() => setProductDropdownOpen(true)}
            onMouseLeave={() => setProductDropdownOpen(false)}
          >
            <button
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                setProductDropdownOpen((open) => !open);
              }}
              aria-haspopup="true"
              aria-expanded={productDropdownOpen}
            >
              Product
              <span className={`caret${productDropdownOpen ? " open" : ""}`}>
                ▼
              </span>
            </button>
            <div
              className={`dropdown-menu${productDropdownOpen ? " show" : ""}`}
            >
              <a
                href="/#product"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("product");
                  setProductDropdownOpen(false);
                }}
              >
                Features
              </a>
              <a
                href="/#benefits"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("benefits");
                  setProductDropdownOpen(false);
                }}
              >
                Benefits
              </a>
              <a
                href="/#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                  setProductDropdownOpen(false);
                }}
              >
                How It Works
              </a>
              <a
                href="/#who-can-use"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("who-can-use");
                  setProductDropdownOpen(false);
                }}
              >
                Who can use?
              </a>
              <a
                href="/#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("faq");
                  setProductDropdownOpen(false);
                }}
              >
                FAQs
              </a>
            </div>
          </div>
          {/* End Product Dropdown */}
          <a
            href="/#founders"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("founders");
            }}
          >
            Team
          </a>
          <a
            href="/#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact Us
          </a>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Welcome_Navbar;
