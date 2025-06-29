import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/Administrator/ContentEditor.css';
import { FaSave, FaArrowLeft, FaEye } from 'react-icons/fa';

const AdminTnC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Fetch existing terms and conditions on component mount
  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      setIsLoading(true);
      try {
        // Implement API call to get terms and conditions here
        // For now using placeholder content
        setTimeout(() => {
          setContent(`# Terms and Conditions

## 1. Introduction

Welcome to TellYouDoc. These Terms and Conditions govern your use of our website and services.

## 2. Acceptance of Terms

By accessing and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.

## 3. Medical Disclaimer

The information provided on TellYouDoc is for general informational purposes only and is not intended as medical advice.

## 4. Privacy Policy

Our Privacy Policy, which explains how we collect, use, and share your personal information, is incorporated by reference into these Terms.

## 5. User Accounts

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

## 6. Intellectual Property

All content, features, and functionality on TellYouDoc are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.

## 7. Limitation of Liability

To the fullest extent permitted by law, TellYouDoc shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

## 8. Changes to Terms

We reserve the right to modify these Terms at any time. It is your responsibility to review these Terms periodically.

## 9. Governing Law

These Terms are governed by and construed in accordance with the laws of India.

Last updated: May 18, 2025`);
          setLastSaved(new Date('2025-05-18T09:00:00'));
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        setIsLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Implement API call to save terms and conditions here
      // For now just simulating an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving terms and conditions:', error);
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    // Convert markdown to HTML (very basic implementation)
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
            <h1>Edit Terms and Conditions</h1>
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
              placeholder="Enter terms and conditions content here... Markdown formatting is supported."
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

export default AdminTnC;