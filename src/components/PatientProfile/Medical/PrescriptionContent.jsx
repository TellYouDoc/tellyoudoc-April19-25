import React, { useState } from 'react';
import { BsFillFileEarmarkMedicalFill } from 'react-icons/bs';
import { SectionLoading, NoDataMessage } from '../../LoadingStates';

const PrescriptionContent = ({ patient, getFileIcon, formatFileSize, viewFile, downloadFile }) => {
  // Add section-specific loading states
  const [loadingStates, setLoadingStates] = useState({
    currentMedications: false,
    prescriptionHistory: false,
    files: false
  });

  // Function to set loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  // Handle filtering with loading state
  const handleFilterChange = (section, filterValue) => {
    setLoading(section, true);
    
    // Your filter logic here
    // ...
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(section, false);
    }, 500);
  };

  // Render current medications with loading and no-data states
  const renderCurrentMedications = () => {
    if (loadingStates.currentMedications) {
      return <SectionLoading message="Loading medications..." />;
    }
    
    if (!patient.medications || patient.medications.length === 0) {
      return (
        <NoDataMessage 
          icon="💊" 
          title="No Current Medications"
          subtitle="Your current medications will appear here once they're added to your record."
        />
      );
    }
    
    return (
      <div className="current-medications">
        {/* ...existing medications rendering code... */}
      </div>
    );
  };

  // Render prescription history with loading and no-data states
  const renderPrescriptionHistory = () => {
    if (loadingStates.prescriptionHistory) {
      return <SectionLoading message="Loading prescription history..." />;
    }
    
    if (!patient.prescriptionHistory || patient.prescriptionHistory.length === 0) {
      return (
        <NoDataMessage 
          icon="📃" 
          title="No Prescription History"
          subtitle="Your prescription history will appear here once prescriptions are added."
        />
      );
    }
    
    return (
      <div className="prescription-history">
        {/* ...existing prescription history rendering code... */}
      </div>
    );
  };

  // Render prescription files with loading and no-data states
  const renderPrescriptionFiles = () => {
    if (loadingStates.files) {
      return <SectionLoading message="Loading prescription files..." />;
    }
    
    if (!patient.prescriptionFiles || patient.prescriptionFiles.length === 0) {
      return (
        <NoDataMessage 
          icon="📁" 
          title="No Prescription Files"
          subtitle="Prescription files will appear here once they're uploaded."
        />
      );
    }
    
    return (
      <div className="prescription-files">
        {patient.prescriptionFiles.map((file, index) => (
          <div key={index} className="prescription-file-card">
            <div className="file-icon">
              {getFileIcon(file.name.split('.').pop().toLowerCase())}
            </div>
            <div className="file-details">
              <h3>{file.name}</h3>
              <p className="file-meta">
                <span className="file-type">{file.name.split('.').pop().toUpperCase() || 'DOCUMENT'}</span>
              </p>
              <p className="upload-date">Uploaded on {new Date(file.uploadDate).toLocaleDateString()}</p>
            </div>
            <div className="file-actions">
              <button className="view-file-btn" onClick={() => viewFile(file)}>
                View
              </button>
              <button className="download-file-btn" onClick={() => downloadFile(file)}>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="prescription-content">
      <div className="details-section">
        <h2><BsFillFileEarmarkMedicalFill className="icon-margin-right" /> Uploaded Prescriptions</h2>
        {renderPrescriptionFiles()}
      </div>
    </div>
  );
};

export default PrescriptionContent;
