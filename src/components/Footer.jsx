import "../styles/Footer.css";
import logoImage from "../assets/tellyoudoc.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoImage} alt="tellYouDoc Logo" />
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/#home">Home</a>
              </li>
              <li>
                <a href="/#about">About Us</a>
              </li>
              <li>
                <a href="/#product">Offerings</a>
              </li>
              <li>
                <a href="/#founders">Team</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </div>

          {/* <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <i className="email-icon"></i>
                <a href="mailto:info@tellyoudoc.com">info@tellyoudoc.com</a>
              </li>
              <li>
                <i className="facebook-icon"></i>
                <a
                  href="https://www.facebook.com/people/Tellyou-Doc/pfbid0dBNAXpLe5Fg7kYkAfUNP2WWjw69pQvxCX7beiC1ULjXvs8mUgo5ddd3p4jwwiBw8l/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <i className="linkedin-icon"></i>
                <a
                  href="https://www.linkedin.com/in/tellyoudoc/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <i className="x-icon"></i>
                <a
                  href="https://x.com/tellyoudoc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          Precise Medication Private Limited. All
          rights reserved.
        </p>
        <div className="footer-bottom-links">
          {/* <a href="#">Privacy Policy</a> */}
          {/* <a href="#">Terms & Conditions</a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
