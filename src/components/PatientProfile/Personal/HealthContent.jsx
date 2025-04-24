import React, { useState } from 'react';
import { MdHealthAndSafety, MdMedicalServices } from 'react-icons/md';
import { NoDataMessage, SectionLoading } from '../../LoadingStates';

const HealthContent = ({ healthData, chartDuration, setChartDuration }) => {
  // Add section-specific loading states
  const [loadingStates, setLoadingStates] = useState({
    allergies: false,
    conditions: false,
    vaccinations: false,
    medications: false
  });
  
  // Function to update loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };
  
  // Handle duration changes with loading state
  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    
    // Set loading states for all sections that use this duration
    setLoading('conditions', true);
    setLoading('medications', true);
    
    // Update the duration
    setChartDuration(newDuration);
    
    // Simulate data loading delay
    setTimeout(() => {
      setLoading('conditions', false);
      setLoading('medications', false);
    }, 600);
  };
  
  // Render allergies section with improved no-data state
  const renderAllergiesSection = () => {
    if (loadingStates.allergies) {
      return <SectionLoading message="Loading allergies..." />;
    }
    
    if (!healthData?.allergies?.length) {
      return (
        <NoDataMessage 
          icon="🌿" 
          title="No Allergies Recorded"
          subtitle="Your allergies will be displayed here once they are added to your record."
        />
      );
    }
    
    return (
      <ul className="health-list">
        {healthData.allergies.map((allergy, idx) => (
          <li key={idx}>{allergy}</li>
        ))}
      </ul>
    );
  };
  
  // Similar implementations for other sections
  const renderConditionsSection = () => {
    if (loadingStates.conditions) {
      return <SectionLoading message="Loading conditions..." />;
    }
    
    if (!healthData?.conditions?.length) {
      return (
        <NoDataMessage 
          icon="🩺" 
          title="No Conditions Recorded"
          subtitle="Your medical conditions will be displayed here once they are added to your record."
        />
      );
    }
    
    return (
      <div className="health-content">
        {Object.entries(healthData.chronicConditions).map(([category, conditions]) => (
          <div key={category} className="health-category">
            <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            <ul className="health-list">
              {conditions.map((condition, idx) => (
                <li key={idx}>{condition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  const renderVaccinationsSection = () => {
    if (loadingStates.vaccinations) {
      return <SectionLoading message="Loading vaccinations..." />;
    }
    
    if (!healthData?.vaccinations?.length) {
      return (
        <NoDataMessage 
          icon="💉" 
          title="No Vaccinations Recorded"
          subtitle="Your vaccination history will be displayed here once it is added to your record."
        />
      );
    }
    
    return (
      <ul className="health-list">
        {healthData.vaccinations.map((vax, idx) => (
          <li key={idx}>{vax}</li>
        ))}
      </ul>
    );
  };
  
  const renderMedicationsSection = () => {
    if (loadingStates.medications) {
      return <SectionLoading message="Loading medications..." />;
    }
    
    if (!healthData?.medications?.length) {
      return (
        <NoDataMessage 
          icon="💊" 
          title="No Medications Recorded"
          subtitle="Your current medications will be displayed here once they are added to your record."
        />
      );
    }
    
    return (
      <ul className="health-list">
        {healthData.medications.map((medication, idx) => (
          <li key={idx}>{medication}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="health-content">
      <div className="details-section">
        <h2><MdHealthAndSafety className="icon-margin-right" /> Health Information</h2>
        
        <div className="health-grid">
          {/* Chronic Conditions */}
          <div className="health-card">
            <div className="health-header">
              <h3>Chronic Conditions</h3>
            </div>
            {renderConditionsSection()}
          </div>
          
          {/* Infectious Diseases */}
          <div className="health-card">
            <div className="health-header">
              <h3>Infectious Diseases</h3>
            </div>
            <div className="health-content">
              <ul className="health-list">
                {healthData.infectiousDiseases.map((disease, idx) => (
                  <li key={idx}>{disease}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Vaccinations */}
          <div className="health-card">
            <div className="health-header">
              <h3>Vaccinations</h3>
            </div>
            {renderVaccinationsSection()}
          </div>
          
          {/* Surgical History */}
          <div className="health-card">
            <div className="health-header">
              <h3>Surgical History</h3>
            </div>
            <div className="health-content">
              <p>{healthData.surgeryHistory}</p>
            </div>
          </div>
          
          {/* Allergies */}
          <div className="health-card">
            <div className="health-header">
              <h3>Allergies</h3>
            </div>
            {renderAllergiesSection()}
          </div>
          
          {/* Alternative Medicine */}
          <div className="health-card">
            <div className="health-header">
              <h3>Alternative Medicine</h3>
            </div>
            <div className="health-content">
              <ul className="health-list">
                {healthData.alternativeMedicine.map((medicine, idx) => (
                  <li key={idx}>{medicine}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Hospitalization */}
          <div className="health-card">
            <div className="health-header">
              <h3>Hospitalization</h3>
            </div>
            <div className="health-content">
              <div className="detail-grid">
                <div className="detail-label">Reason:</div>
                <div className="detail-value">{healthData.hospitalization.reason}</div>
              </div>
              <div className="detail-grid">
                <div className="detail-label">Duration:</div>
                <div className="detail-value">{healthData.hospitalization.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="details-section">
        <h2><MdMedicalServices className="icon-margin-right" /> Emotional Health</h2>
        
        <div className="health-grid">
          {/* Psychiatric Conditions */}
          <div className="health-card">
            <div className="health-header">
              <h3>Psychiatric Conditions</h3>
            </div>
            <div className="health-content">
              <ul className="health-list">
                {healthData.emotional.psychiatricConditions.map((condition, idx) => (
                  <li key={idx}>{condition}</li>
                ))}
              </ul>
              <div className="detail-grid">
                <div className="detail-label">Psychiatric Admission:</div>
                <div className="detail-value">{healthData.emotional.psychiatricAdmission}</div>
              </div>
            </div>
          </div>
          
          {/* Mental Health in Family */}
          <div className="health-card">
            <div className="health-header">
              <h3>Mental Health in Family</h3>
            </div>
            <div className="health-content">
              {Object.entries(healthData.emotional.mentalHealth).map(([relation, conditions]) => (
                <div key={relation} className="detail-grid">
                  <div className="detail-label">{relation}:</div>
                  <div className="detail-value">{conditions.join(', ')}</div>
                </div>
              ))}
              <div className="detail-grid">
                <div className="detail-label">Social Engagement:</div>
                <div className="detail-value">{healthData.emotional.socialEngagement}</div>
              </div>
            </div>
          </div>
          
          {/* Trauma History */}
          <div className="health-card">
            <div className="health-header">
              <h3>Trauma History</h3>
            </div>
            <div className="health-content">
              <div className="detail-grid">
                <div className="detail-label">Childhood Trauma:</div>
                <div className="detail-value">{healthData.emotional.trauma.childhood}</div>
              </div>
              <div className="detail-grid">
                <div className="detail-label">Recent Trauma:</div>
                <div className="detail-value">{healthData.emotional.trauma.recent.join(', ')}</div>
              </div>
            </div>
          </div>
          
          {/* Neurological Conditions */}
          <div className="health-card">
            <div className="health-header">
              <h3>Neurological Conditions</h3>
            </div>
            <div className="health-content">
              <ul className="health-list">
                {healthData.emotional.neurologicalConditions.map((condition, idx) => (
                  <li key={idx}>{condition}</li>
                ))}
              </ul>
              <div className="detail-grid">
                <div className="detail-label">Handling Emotions:</div>
                <div className="detail-value">{healthData.emotional.handlingEmotions}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthContent;
