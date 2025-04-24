import React, { useState } from 'react';
import { BsFillFileEarmarkMedicalFill } from 'react-icons/bs';
import { FaFemale as FaBreast } from 'react-icons/fa';
import { SectionLoading, NoDataMessage } from '../../LoadingStates';

const ReportsContent = ({ patient, getFileIcon, formatFileSize, viewFile, downloadFile, reports = [], loading }) => {
  const [filterLoading, setFilterLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    recentReports: false,
    allReports: false
  });

  // Function to update loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  // Handler for changing report filter with loading state
  const handleFilterChange = (filter) => {
    setLoading('allReports', true);

    // Apply filter logic here (if needed in the future)
    // For now, just simulate loading
    // const filteredReports = patient.reportFiles.filter(report => { ... });
    // setFilteredReportFiles(filteredReports);

    setTimeout(() => {
      setLoading('allReports', false);
    }, 500);
  };

  // Render recent reports section with loading and no-data states
  const renderRecentReports = () => {
    if (loadingStates.recentReports) {
      return <SectionLoading message="Loading recent reports..." />;
    }

    // Assuming patient.recentReports is an array similar to patient.reportFiles
    const recentReports = patient.recentReports || [];

    if (recentReports.length === 0) {
      return (
        <NoDataMessage
          icon="📄"
          title="No Recent Reports"
          subtitle="Your most recent medical reports will appear here once they are uploaded."
        />
      );
    }

    return (
      <div className="prescription-files">
        {recentReports.map((file, index) => (
          <div key={index} className="prescription-file-card">
            <div className="file-icon">
              {/* Pass file.uri for potential image thumbnail rendering */}
              {getFileIcon(file.type, file.uri)}
            </div>
            <div className="file-details">
              <h3>{file.name}</h3>
              <p className="file-meta">
                {file.type && <span className="file-type">{file.type}</span>}
                {file.size && <span className="file-size">{formatFileSize(file.size)}</span>}
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

  // Render all reports section with loading and no-data states
  const renderAllReports = () => {
    if (loadingStates.allReports) {
      return <SectionLoading message="Loading reports..." />;
    }

    const reportFiles = patient.reportFiles || [];

    if (reportFiles.length === 0) {
      return (
        <NoDataMessage
          icon="📋"
          title="No Medical Reports"
          subtitle="Your medical reports will appear here once they are uploaded to your record."
        />
      );
    }

    return (
      <div className="prescription-files"> {/* Using prescription-files class for consistency */}
        {reportFiles.map((file, index) => (
          <div key={index} className="prescription-file-card"> {/* Using prescription-file-card class */}
            <div className="file-icon">
              {/* Pass file.uri for potential image thumbnail rendering */}
              {getFileIcon(file.type, file.uri)}
            </div>
            <div className="file-details">
              <h3>{file.name}</h3>
              <p className="file-meta">
                {/* Conditionally render type and size if they exist */}
                {file.type && <span className="file-type">{file.type}</span>}
                {file.size && <span className="file-size">{formatFileSize(file.size)}</span>}
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

  // Removed renderReportsList as it's integrated into renderAllReports

  return (
    <div className="reports-content">
      {/* Removed the Recent Reports section for now, can be added back if patient.recentReports is populated */}
      {/* <div className="details-section">
        <h2>Recent Reports</h2>
        {renderRecentReports()}
      </div> */}

      <div className="details-section">
        <h2><BsFillFileEarmarkMedicalFill className="icon-margin-right" /> All Reports</h2>
        {/* Filter controls can be added back if filtering logic is implemented */}
        {/* <div className="filter-controls">
          <select onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="all">All Reports</option>
            <option value="lab">Lab Tests</option>
            <option value="imaging">Imaging</option>
            <option value="pathology">Pathology</option>
          </select>
        </div> */}
        {renderAllReports()}
      </div>

      {/* Breast Cancer Tests Section - Kept as per original structure, data needs to be passed via props if needed here */}
      {/* Consider moving this section if it doesn't belong under general 'Reports' */}
      <div className="details-section">
        <h2><FaBreast className="icon-margin-right" /> Breast Cancer Tests</h2>

        {/* Mammogram Subsection */}
        <div className="cancer-test-section">
          <h3 className="cancer-test-header">Mammogram</h3>
          {/* Content for Mammogram - Needs data passed via props */}
          {/* Example: patient.testData?.BreastRelatedTests?.breastCancerTestRecords */}
          <NoDataMessage subtitle="Mammogram data not available here." />
        </div>

        {/* Biopsies Subsection */}
        <div className="cancer-test-section">
          <h3 className="cancer-test-header">Biopsies</h3>
          {/* Content for Biopsies - Needs data passed via props */}
          {/* Example: patient.testData?.Biopsy?.biopsyRecords */}
          <NoDataMessage subtitle="Biopsy data not available here." />
        </div>

        {/* Surgeries Subsection */}
        <div className="cancer-test-section">
          <h3 className="cancer-test-header">Surgeries</h3>
          {/* Content for Surgeries - Needs data passed via props */}
          {/* Example: patient.testData?.Surgeries?.breastSurgeryRecords */}
          <NoDataMessage subtitle="Surgery data not available here." />
        </div>
      </div>

      {/* Removed the duplicate "Uploaded Reports" section as it's covered by "All Reports" */}
    </div>
  );
};

export default ReportsContent;
