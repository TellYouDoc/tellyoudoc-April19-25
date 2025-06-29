// filepath: c:\Users\Ankan Chakraborty\OneDrive\Desktop\IIIT Guwahati\Website\live\tellyoudoc-April19-25\src\pages\Administrator\AdminPrivacyPolicy.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/Administrator/ContentEditor.css';
import { FaSave, FaArrowLeft, FaEye } from 'react-icons/fa';

const AdminPrivacyPolicy = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Fetch existing privacy policy on component mount
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      setIsLoading(true);
      try {
        // Implement API call to get privacy policy here
        // For now using placeholder content
        setTimeout(() => {
          setContent(`# Privacy Policy

## 1. Introduction

Welcome to TellYouDoc. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.

## 2. Information We Collect

### 2.1 Personal Information
We may collect personal information that you voluntarily provide to us when registering with us, using our services, or when you choose to contact us.

### 2.2 Health Information
We may collect health-related information necessary to provide our services. This information is protected under applicable healthcare privacy laws.

### 2.3 Technical Information
We automatically collect certain information when you visit our website, including IP address, browser type, device information, and cookies.

## 3. How We Use Your Information

- To provide and maintain our services
- To improve our website and user experience
- To communicate with you about our services
- To comply with legal obligations

## 4. Information Security

We implement appropriate technical and organizational measures to protect the information we collect and maintain.

## 5. Data Retention

We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.

## 6. Third-Party Services

We may employ third-party companies and individuals to facilitate our services, provide services on our behalf, or assist us in analyzing how our services are used.

## 7. Children's Privacy

Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.

## 8. Your Rights

Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, update, or delete your personal information.

## 9. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## 10. Contact Us

If you have any questions about this Privacy Policy, please contact us.

Last updated: May 18, 2025`);
          setLastSaved(new Date('2025-05-18T09:00:00'));
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Implement API call to save privacy policy here
      // For now just simulating an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    // Convert markdown to HTML (basic implementation)
    // In a real app, you'd use a proper markdown library like marked or react-markdown
    return { __html: content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      .replace(/\n/gm, '<br />')
    };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="content-editor-container">
          <div className="content-editor-loading">
            <div className="spinner"></div>
            <p>Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content-editor-container">
        <div className="content-editor-header">
          <div className="content-editor-title">
            <button
              className="content-back-button"
              onClick={() => navigate('/admin/content')}
            >
              <FaArrowLeft /> Back to Content Management
            </button>
            <h1>Edit Privacy Policy</h1>
          </div>
          <div className="content-editor-actions">
            <button
              className="content-preview-toggle"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <FaEye /> {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              className="content-save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              <FaSave /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {lastSaved && (
          <div className="content-last-saved">
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}

        <div className="content-editor-main">
          {previewMode ? (
            <div className="content-preview">
              <div dangerouslySetInnerHTML={renderPreview()} />
            </div>
          ) : (
            <textarea
              className="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter privacy policy content here... Markdown formatting is supported."
            />
          )}
        </div>

        <div className="content-editor-help">
          <h3>Markdown Tips</h3>
          <ul>
            <li><code># Heading 1</code> - Creates a large heading</li>
            <li><code>## Heading 2</code> - Creates a medium heading</li>
            <li><code>### Heading 3</code> - Creates a small heading</li>
            <li><code>**Bold text**</code> - Makes text bold</li>
            <li><code>*Italic text*</code> - Makes text italic</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPrivacyPolicy;