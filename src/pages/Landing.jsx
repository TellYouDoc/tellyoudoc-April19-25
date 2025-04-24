import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Landing.css';
import { FaLeaf, FaCalendarCheck, FaChartLine, FaUsers } from 'react-icons/fa';

function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);
  const featureRefs = useRef([]);
  const testimonialRef = useRef(null);

  useEffect(() => {
    // Trigger the initial animations
    setIsLoaded(true);

    // Add intersection observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe feature cards
    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    // Observe testimonial
    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      // Cleanup
      featureRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);

  return (
    <div className="landing-container">
      <Navbar />
      <main className="landing-main">
        <div className={`hero-section ${isLoaded ? 'loaded' : ''}`}>
          <div className="hero-content">
            <h1 className="animate-item animate-1">Compassionate tellyouDoc for Breast Cancer Patients</h1>
            <p className="animate-item animate-2">A comprehensive solution designed to provide personalized care and support throughout your breast cancer journey</p>
            <div className="cta-buttons animate-item animate-3">
              <Link to="/register" className="cta-button primary">Get Started</Link>
              <Link to="/login" className="cta-button secondary">Sign In</Link>
            </div>          </div>          <div className="hero-image animate-item animate-4">
            <img 
              src="/src/assets/ribon.png" 
              alt="Breast cancer awareness ribbon"
              className="responsive-ribbon"
            />
          </div>
        </div>

        <section className="features-section">
          <h2 className="stagger-item" ref={el => featureRefs.current.push(el)}>Compassionate Care at Every Step</h2>
          <p className="stagger-item stagger-delay-1" ref={el => featureRefs.current.push(el)}>Our platform offers specialized tools to support breast cancer patients, healthcare providers, and care teams throughout the treatment journey.</p>
          <div className="features-grid">
            <div className="feature-card stagger-item stagger-delay-1" ref={el => featureRefs.current.push(el)}>
              <FaLeaf className="feature-icon" />
              <h3>Personalized Treatment Plans</h3>
              <p>Track and manage individualized treatment plans tailored to each patient's specific diagnosis and needs</p>
            </div>
            <div className="feature-card stagger-item stagger-delay-2" ref={el => featureRefs.current.push(el)}>
              <FaCalendarCheck className="feature-icon" />
              <h3>Appointment Management</h3>
              <p>Schedule and coordinate appointments with oncologists, surgeons, radiologists, and support staff</p>
            </div>
            <div className="feature-card stagger-item stagger-delay-3" ref={el => featureRefs.current.push(el)}>
              <FaChartLine className="feature-icon" />
              <h3>Symptom Monitoring</h3>
              <p>Track symptoms, side effects, and recovery progress to inform better care decisions</p>
            </div>
            <div className="feature-card stagger-item stagger-delay-4" ref={el => featureRefs.current.push(el)}>
              <FaUsers className="feature-icon" />
              <h3>Support Resources</h3>
              <p>Access to educational materials, support groups, and specialized breast cancer resources</p>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <h2 className="stagger-item" ref={el => featureRefs.current.push(el)}>What Our Patients Say</h2>
          <div className="testimonial-container stagger-item" ref={testimonialRef}>
            <p className="testimonial-content">
              "tellyouDoc transformed my breast cancer treatment experience. Having all my appointments, treatment plans, and resources in one place made a difficult time more manageable. The care team's ability to monitor my symptoms remotely was invaluable."
            </p>
            <p className="testimonial-author">— Sarah Mitchell, Breast Cancer Survivor</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-column stagger-item" ref={el => featureRefs.current.push(el)}>
            <h3>About tellyouDoc</h3>
            <ul>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-column stagger-item stagger-delay-1" ref={el => featureRefs.current.push(el)}>
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Patient Guide</a></li>
              <li><a href="#">Breast Cancer FAQ</a></li>
              <li><a href="#">Support Network</a></li>
              <li><a href="#">Research News</a></li>
            </ul>
          </div>
          <div className="footer-column stagger-item stagger-delay-2" ref={el => featureRefs.current.push(el)}>
            <h3>Contact</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Support Email</a></li>
              <li><a href="#">Phone Support</a></li>
              <li><a href="#">Request Demo</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom stagger-item stagger-delay-3" ref={el => featureRefs.current.push(el)}>
          <p>&copy; 2025 tellyouDoc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;