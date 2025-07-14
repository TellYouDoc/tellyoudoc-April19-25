import "../styles/Footer.css";
import logoImage from "../assets/tellyoudoc.png";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

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
      }
    } else {
      // If we're not on the homepage, we need to first navigate to the homepage
      // and then scroll to the section
      sessionStorage.setItem("scrollToSection", sectionId);
      window.location.href = "/";
    }
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
            const navbarHeight = 80; // Height of the navbar
            const sectionPosition =
              section.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = sectionPosition - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
          sessionStorage.removeItem("scrollToSection");
        }, 500);
      }
    }
  }, [isHomePage]);

  return (
    <footer className="footer light-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoImage} alt="tellYouDoc Logo" />
          <p className="footer-address">
            <i className="location-icon"></i>
            Precise Medication Research Private Limited
            <br />
            IIIT Guwahati, Bongora
            <br />
            Assam - 781015, India
            <br />
            <a href="mailto:info@tellyoudoc.com" className="footer-email">
              info@tellyoudoc.com
            </a>
          </p>
        </div>

        <div className="footer-links-container">
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a
                    href="/#home-container"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("home-container");
                    }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/#about"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("about");
                    }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#product"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("product");
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#benefits"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("benefits");
                    }}
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="/#how-it-works"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("how-it-works");
                    }}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/#who-can-use"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("who-can-use");
                    }}
                  >
                    Who can use?
                  </a>
                </li>
                <li>
                  <a
                    href="/#founders"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("founders");
                    }}
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("contact");
                    }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/login">Doctor Zone</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Precise Medication Research Private
          Limited. All rights reserved. Visuals on this website are AI
          generated.
        </p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
