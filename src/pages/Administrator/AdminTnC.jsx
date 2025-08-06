import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/Administrator/ContentEditor.css';
import { FaSave, FaArrowLeft, FaEye, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { apiService } from '../../services/api';

// Default structured content
const DEFAULT_TERMS_STRUCTURE = {
  title: "Terms and Conditions for TellYouDoc",
  sections: [
    {
      id: "introduction",
      heading: "Introduction",
      content: "These Terms and Conditions (\"Terms\") govern your access to and use of the TellYouDoc mobile application and website (collectively, the \"Platform\"), provided by Precise Medication Research Private Limited, an Indian company with its registered office at Indian Institute of Information Technology Guwahati (IIITG), Bongora, Guwahati, Assam - 781015. By accessing or using the Platform, you agree to be bound by these Terms, our Privacy Policy, and all applicable laws and regulations in India. If you do not agree with any part of these Terms, you must not use the Platform."
    },
    {
      id: "nature-of-platform",
      heading: "1. Nature of the Platform and Services",
      content: "TellYouDoc is a digital healthcare platform designed to facilitate communication and interaction between patients, caregivers, and healthcare professionals (doctors). The Platform aims to provide a convenient and accessible means for users to manage their health-related needs, including but not limited to, booking appointments, accessing health information, and communicating with doctors. The Platform is currently focused on breast cancer care but will expand to include other medical conditions and services, such as pill management, chemotherapy management, and general diseases. The Platform is provided free of charge to both doctors and patients.",
      disclaimer: {
        title: "Important Disclaimer:",
        content: "TellYouDoc is a technology platform and does not provide medical advice, diagnosis, or treatment. The information provided on the Platform is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Platform. TellYouDoc does not endorse any specific doctor, product, procedure, opinion, or other information that may be mentioned on the Platform. Reliance on any information appearing on the Platform, whether provided by TellYouDoc, its content providers, or other users, is solely at your own risk."
      }
    },
    {
      id: "acceptance",
      heading: "2. Acceptance of Terms",
      content: "By downloading, accessing, or using the Platform, you irrevocably accept and agree to be bound by these Terms, our Privacy Policy, and any other terms and conditions that may be applicable to specific services offered on the Platform. This Agreement supersedes all previous oral and written terms and conditions (if any) communicated to you relating to your use of the Platform. If you do not agree with any of these terms, you may not use the Platform and the Services."
    }
  ],
  lastUpdated: new Date().toISOString()
};

// API endpoints configuration
const API_ENDPOINTS = {
  GET_TERMS: () => apiService.AdministratorService.getTermsAndConditions(),
  UPDATE_TERMS: (data) => apiService.AdministratorService.updateTermsAndConditions(data),
};

// Content state management
const useTermsContent = () => {
  const [content, setContent] = useState(DEFAULT_TERMS_STRUCTURE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API_ENDPOINTS.GET_TERMS();

      if (response.data && response.data.content) {
        setContent(response.data.content);
        setLastSaved(new Date(response.data.lastUpdated || Date.now()));
      } else {
        setContent(DEFAULT_TERMS_STRUCTURE);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      setError('Failed to load content. Using default content.');
      setContent(DEFAULT_TERMS_STRUCTURE);
      setLastSaved(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await API_ENDPOINTS.UPDATE_TERMS({
        content: content,
        lastUpdated: new Date().toISOString()
      });

      if (response.data && response.data.success) {
        setLastSaved(new Date());
        console.log('Terms and conditions saved successfully');
        return { success: true };
      } else {
        throw new Error('Failed to save terms and conditions');
      }
    } catch (error) {
      console.error('Error saving terms and conditions:', error);
      setError('Failed to save content. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = (sectionId, updates) => {
    setContent(prevContent => ({
      ...prevContent,
      sections: prevContent.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      heading: "New Section",
      content: "Enter content here..."
    };

    setContent(prevContent => ({
      ...prevContent,
      sections: [...prevContent.sections, newSection]
    }));
  };

  const removeSection = (sectionId) => {
    setContent(prevContent => ({
      ...prevContent,
      sections: prevContent.sections.filter(section => section.id !== sectionId)
    }));
  };

  return {
    content,
    setContent,
    isLoading,
    isSaving,
    lastSaved,
    error,
    fetchContent,
    saveContent,
    updateSection,
    addSection,
    removeSection,
  };
};

// Render structured content as HTML
const renderStructuredContent = (content) => {
  return {
    __html: `
      <div class="terms-header">
        <h1>${content.title}</h1>
      </div>
      ${content.sections.map(section => `
        <section class="terms-section">
          <h2>${section.heading}</h2>
          <p>${section.content}</p>
          ${section.disclaimer ? `
            <div class="disclaimer">
              <h3>${section.disclaimer.title}</h3>
              <p>${section.disclaimer.content}</p>
            </div>
          ` : ''}
        </section>
      `).join('')}
    `
  };
};

const AdminTnC = () => {
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const {
    content,
    setContent,
    isLoading,
    isSaving,
    lastSaved,
    error,
    fetchContent,
    saveContent,
    updateSection,
    addSection,
    removeSection,
  } = useTermsContent();

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    const result = await saveContent();
    if (result.success) {
      console.log('Content saved successfully!');
    }
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const handleBackToContent = () => {
    navigate('/admin/content');
  };

  const handleEditSection = (sectionId) => {
    setEditingSection(sectionId);
  };

  const handleSaveSection = (sectionId, updates) => {
    updateSection(sectionId, updates);
    setEditingSection(null);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
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
              onClick={handleBackToContent}
            >
              <FaArrowLeft /> Back to Content Management
            </button>
            <h1>Edit Terms and Conditions</h1>
          </div>
          <div className="content-editor-actions">
            <button
              className="content-preview-toggle"
              onClick={handlePreviewToggle}
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
              <div dangerouslySetInnerHTML={renderStructuredContent(content)} />
            </div>
          ) : (
            <div className="structured-content-editor">
              {/* Title Editor */}
              <div className="title-editor" style={{ marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '10px', marginLeft: '10px' }}>Page Title</h2>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                  placeholder="Enter page title..."
                />
              </div>

              {/* Sections Editor */}
              <div className="sections-editor">
                <h2 style={{ marginBottom: '10px', marginLeft: '10px' }}>Sections</h2>
                {content.sections.map((section) => (
                  <div key={section.id} className="section-editor" style={{ marginBottom: '20px' }}>
                    {editingSection === section.id ? (
                      <SectionEditForm
                        section={section}
                        onSave={(updates) => handleSaveSection(section.id, updates)}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <SectionDisplay
                        section={section}
                        onEdit={() => handleEditSection(section.id)}
                        onDelete={() => removeSection(section.id)}
                      />
                    )}
                  </div>
                ))}

                <button
                  className="add-section-button"
                  onClick={addSection}
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <FaPlus /> Add New Section
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Section Display Component
const SectionDisplay = ({ section, onEdit, onDelete }) => {
  return (
    <div className="section-display" style={{
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>{section.heading}</h3>
        <div className="section-actions">
          <button onClick={onEdit} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            <FaEdit />
          </button>
          <button onClick={onDelete} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="section-content">
        <p><strong>Content:</strong> {section.content.substring(0, 100)}...</p>
        {section.disclaimer && (
          <p><strong>Disclaimer:</strong> Present</p>
        )}
      </div>
    </div>
  );
};

// Section Edit Form Component
const SectionEditForm = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    heading: section.heading,
    content: section.content,
    disclaimer: section.disclaimer || { title: '', content: '' }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = { ...formData };

    if (!updates.disclaimer.title && !updates.disclaimer.content) {
      delete updates.disclaimer;
    }

    onSave(updates);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      border: '2px solid #007bff',
      padding: '20px',
      borderRadius: '4px',
      backgroundColor: '#f8f9fa'
    }}>
      <div>
        <label><strong>Heading:</strong></label>
        <input
          type="text"
          value={formData.heading}
          onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          required
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label><strong>Content:</strong></label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
          required
        />
      </div>

      <div style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
        <label><strong>Disclaimer (optional):</strong></label>
        <input
          type="text"
          placeholder="Disclaimer title"
          value={formData.disclaimer.title}
          onChange={(e) => setFormData({ ...formData, disclaimer: { ...formData.disclaimer, title: e.target.value } })}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
        <textarea
          placeholder="Disclaimer content"
          value={formData.disclaimer.content}
          onChange={(e) => setFormData({ ...formData, disclaimer: { ...formData.disclaimer, content: e.target.value } })}
          style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '60px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Save Section
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminTnC;