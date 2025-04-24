import React, { useState } from 'react';
import { FaRibbon, FaUser, FaHeartbeat } from 'react-icons/fa';
import { SectionLoading, NoDataMessage } from '../../LoadingStates';

const CancerOverviewContent = ({ patient, familyCancerHistory, menstrualHistory, reproductiveHistory }) => {
  // Add section-specific loading states
  const [loadingStates, setLoadingStates] = useState({
    timeline: false,
    summary: false,
    statistics: false
  });

  // Function to set loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  // Function to handle filter/option changes with loading state
  const handleFilterChange = (section, filterValue) => {
    // Set loading for the specific section
    setLoading(section, true);
    
    // Apply your filter logic here
    // ...
    
    // Simulate data loading delay
    setTimeout(() => {
      setLoading(section, false);
    }, 600);
  };

  // Render cancer timeline section
  const renderCancerTimeline = () => {
    if (loadingStates.timeline) {
      return <SectionLoading message="Loading timeline..." />;
    }
    
    if (!familyCancerHistory || !familyCancerHistory.timeline || familyCancerHistory.timeline.length === 0) {
      return (
        <NoDataMessage 
          icon="📅" 
          title="No Timeline Data Available"
          subtitle="The cancer treatment timeline will appear here once events are recorded."
        />
      );
    }
    
    return (
      // Your existing timeline rendering code
      <div className="cancer-timeline">
        {/* Timeline content... */}
      </div>
    );
  };

  return (
    <div className="cancer-overview-content">
      {/* Cancer Statistics Section */}
      <div className="details-section">
        <h2><FaRibbon className="icon-margin-right" /> Family Cancer Statistics</h2>
        <div className="cancer-stats-grid">
          <div className="cancer-stat-card breast">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaRibbon />
              </div>
              <h3>Breast Cancer</h3>
            </div>
            <div className="cancer-stat-count">
              {familyCancerHistory.summary.breastCancer}
            </div>
            <div className="cancer-stat-footer">
              {familyCancerHistory.immediate.breastCancer.length} immediate, {familyCancerHistory.extended.breastCancer.length} extended
            </div>
          </div>

          <div className="cancer-stat-card ovarian">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Ovarian Cancer</h3>
            </div>
            <div className="cancer-stat-count">
              {familyCancerHistory.summary.ovarianCancer}
            </div>
            <div className="cancer-stat-footer">
              {familyCancerHistory.immediate.ovarianCancer.length} immediate, {familyCancerHistory.extended.ovarianCancer.length} extended
            </div>
          </div>

          <div className="cancer-stat-card cervical">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Cervical Cancer</h3>
            </div>
            <div className="cancer-stat-count">
              {familyCancerHistory.summary.cervicalCancer}
            </div>
            <div className="cancer-stat-footer">
              {familyCancerHistory.immediate.cervicalCancer.length} immediate, {familyCancerHistory.extended.cervicalCancer.length} extended
            </div>
          </div>

          <div className="cancer-stat-card other">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Other Cancer</h3>
            </div>
            <div className="cancer-stat-count">
              {familyCancerHistory.summary.otherCancer}
            </div>
            <div className="cancer-stat-footer">
              {familyCancerHistory.immediate.otherCancer.length} immediate, {familyCancerHistory.extended.otherCancer.length} extended
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors Section */}
      <div className="details-section risk-factors-section">
        <h2><FaHeartbeat className="icon-margin-right" /> Cancer Risk Factors</h2>
        <div className="risk-factors-grid">
          {/* Genetic Risk Factors */}
          <div className="risk-factor-card genetic">
            <div className="risk-factor-header">
              <div className="risk-factor-icon">
                <FaUser />
              </div>
              <h3>Genetic Factors</h3>
            </div>
            <div className="risk-factor-content">
              <div className="risk-factor-level">
                <span className="risk-level-label">Risk:</span>
                <div className="risk-level-bar">
                  <div className="risk-level-fill high"></div>
                </div>
                <span className="risk-level-value">High</span>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Family history of breast cancer (mother diagnosed at age 55)</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Multiple relatives with breast and ovarian cancer</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">BRCA1/2 genetic testing recommended</div>
              </div>
            </div>
          </div>

          {/* Reproductive Risk Factors */}
          <div className="risk-factor-card reproductive">
            <div className="risk-factor-header">
              <div className="risk-factor-icon">
                <FaHeartbeat />
              </div>
              <h3>Reproductive Factors</h3>
            </div>
            <div className="risk-factor-content">
              <div className="risk-factor-level">
                <span className="risk-level-label">Risk:</span>
                <div className="risk-level-bar">
                  <div className="risk-level-fill medium"></div>
                </div>
                <span className="risk-level-value">Medium</span>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Age at first pregnancy: 30 (after age 30)</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Age at menarche: 13 (average risk)</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Breastfed for more than 1 year (protective factor)</div>
              </div>
            </div>
          </div>

          {/* Lifestyle Risk Factors */}
          <div className="risk-factor-card lifestyle">
            <div className="risk-factor-header">
              <div className="risk-factor-icon">
                <FaHeartbeat />
              </div>
              <h3>Lifestyle Factors</h3>
            </div>
            <div className="risk-factor-content">
              <div className="risk-factor-level">
                <span className="risk-level-label">Risk:</span>
                <div className="risk-level-bar">
                  <div className="risk-level-fill low"></div>
                </div>
                <span className="risk-level-value">Low</span>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Weight/BMI: Normal (protective factor)</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Non-smoker (protective factor)</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Moderate alcohol consumption (1-2 drinks/week)</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Regular physical activity (protective factor)</div>
              </div>
            </div>
          </div>

          {/* Environmental Risk Factors */}
          <div className="risk-factor-card environmental">
            <div className="risk-factor-header">
              <div className="risk-factor-icon">
                <FaHeartbeat />
              </div>
              <h3>Environmental Factors</h3>
            </div>
            <div className="risk-factor-content">
              <div className="risk-factor-level">
                <span className="risk-level-label">Risk:</span>
                <div className="risk-level-bar">
                  <div className="risk-level-fill low"></div>
                </div>
                <span className="risk-level-value">Low</span>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">No significant radiation exposure history</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">No known exposure to carcinogens in workplace</div>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-bullet"></div>
                <div className="risk-factor-text">Residential area with low pollution levels</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Summary Section */}
      <div className="details-section" style={{ marginTop: '2rem' }}>
        <h2><FaUser className="icon-margin-right" /> Personal Summary</h2>
        <div className="cancer-stats-grid">
          <div className="cancer-stat-card">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaUser />
              </div>
              <h3>Age</h3>
            </div>
            <div className="cancer-stat-count">
              {patient.age}
            </div>
            <div className="cancer-stat-footer">
              Years
            </div>
          </div>

          <div className="cancer-stat-card reproductive">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Menstrual Status</h3>
            </div>
            <div className="cancer-stat-count" style={{ fontSize: '1.8rem' }}>
              {menstrualHistory.status}
            </div>
            <div className="cancer-stat-footer">
              {menstrualHistory.cycle || 'N/A'}
            </div>
          </div>

          <div className="cancer-stat-card">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Children</h3>
            </div>
            <div className="cancer-stat-count">
              {reproductiveHistory.motherhoodDetails.numberOfChildren || 0}
            </div>
            <div className="cancer-stat-footer">
              {reproductiveHistory.motherhood === 'Yes' ? 'Mother' : 'No Children'}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Summary Section */}
      <div className="details-section" style={{ marginTop: '2rem' }}>
        <h2><FaHeartbeat className="icon-margin-right" /> Medical Summary</h2>
        <div className="cancer-stats-grid">
          <div className="cancer-stat-card">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Comorbidities</h3>
            </div>
            <div className="cancer-stat-count">
              {patient.medicalHistory.previousConditions.length}
            </div>
            <div className="cancer-stat-footer">
              Conditions
            </div>
          </div>

          <div className="cancer-stat-card">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Biopsies</h3>
            </div>
            <div className="cancer-stat-count">
              3
            </div>
            <div className="cancer-stat-footer">
              Samples
            </div>
          </div>

          <div className="cancer-stat-card breast">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaRibbon />
              </div>
              <h3>Family Cancer</h3>
            </div>
            <div className="cancer-stat-count">
              {familyCancerHistory.summary.breastCancer +
                familyCancerHistory.summary.ovarianCancer +
                familyCancerHistory.summary.cervicalCancer +
                familyCancerHistory.summary.otherCancer}
            </div>
            <div className="cancer-stat-footer">
              Total Cases
            </div>
          </div>

          <div className="cancer-stat-card">
            <div className="cancer-stat-header">
              <div className="cancer-stat-icon">
                <FaHeartbeat />
              </div>
              <h3>Medications</h3>
            </div>
            <div className="cancer-stat-count">
              {patient.medications.length}
            </div>
            <div className="cancer-stat-footer">
              Current Medications
            </div>
          </div>
        </div>
      </div>

      {/* Cancer Treatment Timeline Section */}
      <div className="timeline-section">
        <h3>Cancer Treatment Timeline</h3>
        {renderCancerTimeline()}
      </div>
    </div>
  );
};

export default CancerOverviewContent;
