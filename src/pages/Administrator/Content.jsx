import { Link } from "react-router-dom";
import "../../styles/Administrator/Content.css";
import AdminLayout from "../../components/AdminLayout";
import {
  FaFileAlt,
  FaShieldAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const Content = () => {
  return (
    <AdminLayout>
      <div className="admin-content-container">        
        <div className="admin-content-header">
        <h1>Content Management</h1>
        <p>Manage website content pages and information</p>
      </div>
        <div className="content-boxes-wrapper">
          <div className="content-boxes">
            <Link to="/admin/terms-conditions" className="content-box">
              <div className="content-box-icon">
                <FaFileAlt />
              </div>
              <div className="content-box-info">
                <h2>Terms and Conditions</h2>
                <p>Manage the Terms and Conditions content for your website.</p>
              </div>
            </Link>

            <Link to="/admin/privacy-policy" className="content-box">
              <div className="content-box-icon">
                <FaShieldAlt />
              </div>
              <div className="content-box-info">
                <h2>Privacy Policy</h2>
                <p>Update the Privacy Policy information for your users.</p>
              </div>
            </Link>

            <Link to="/admin/faqs" className="content-box">
              <div className="content-box-icon">
                <FaQuestionCircle />
              </div>
              <div className="content-box-info">
                <h2>FAQs</h2>
                <p>Manage Frequently Asked Questions and their answers.</p>
              </div>
            </Link>          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Content;
