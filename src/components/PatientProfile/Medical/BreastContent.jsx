import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { SectionLoading, NoDataMessage } from '../../LoadingStates';

const BreastContent = ({ 
  selectedDate, 
  setSelectedDate, 
  breastSymptomData, 
  selectedDateSymptoms, 
  setSelectedDateSymptoms 
}) => {
  // Add section-specific loading states
  const [loadingStates, setLoadingStates] = useState({
    examinations: false,
    concerns: false,
    history: false
  });

  // Function to set loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  // Handle filter changes with loading state
  const handleFilterChange = (section, filterValue) => {
    setLoading(section, true);
    
    // Your filter logic here
    // ...
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(section, false);
    }, 500);
  };

  // Render breast examinations with loading and no-data states
  const renderBreastExaminations = () => {
    if (loadingStates.examinations) {
      return <SectionLoading message="Loading examination data..." />;
    }
    
    if (!patient.breastExaminations || patient.breastExaminations.length === 0) {
      return (
        <NoDataMessage 
          icon="🩺" 
          title="No Examination Data"
          subtitle="Breast examination data will appear here once examinations are recorded."
        />
      );
    }
    
    return (
      <div className="breast-examinations">
        {/* ...existing breast examinations rendering code... */}
      </div>
    );
  };

  // Render breast concerns with loading and no-data states
  const renderBreastConcerns = () => {
    if (loadingStates.concerns) {
      return <SectionLoading message="Loading breast concerns..." />;
    }
    
    if (!patient.breastConcerns || patient.breastConcerns.length === 0) {
      return (
        <NoDataMessage 
          icon="⚠️" 
          title="No Breast Concerns"
          subtitle="Breast concerns and issues will appear here once they're added to your record."
        />
      );
    }
    
    return (
      <div className="breast-concerns">
        {/* ...existing breast concerns rendering code... */}
      </div>
    );
  };

  // Render breast health history with loading and no-data states
  const renderBreastHistory = () => {
    if (loadingStates.history) {
      return <SectionLoading message="Loading breast health history..." />;
    }
    
    if (!patient.breastHistory) {
      return (
        <NoDataMessage 
          icon="📋" 
          title="No Breast Health History"
          subtitle="Your breast health history will appear here once it's added to your record."
        />
      );
    }
    
    return (
      <div className="breast-history">
        {/* ...existing breast history rendering code... */}
      </div>
    );
  };

  return (
    <div className="breast-content">
      {/* Symptom Calendar Section */}
      <div className="details-section">
        <h2><FaCalendarAlt className="icon-margin-right" /> Symptom Calendar</h2>
        <div className="info-card">
          <p className="calendar-info">Dates highlighted in green indicate days with recorded symptoms. Click on a date to view details.</p>

          <div className="symptom-calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="symptom-calendar"
              tileClassName={({ date }) => {
                // Format date as YYYY-MM-DD for comparison with our data
                const dateStr = date.toISOString().split('T')[0];
                return breastSymptomData[dateStr] ? 'has-symptoms' : null;
              }}
              onClickDay={(date) => {
                setSelectedDate(date);
                const dateStr = date.toISOString().split('T')[0];
                setSelectedDateSymptoms(breastSymptomData[dateStr] || null);
              }}
              minDetail="month"
              maxDate={new Date()}
              // Show April by default
              defaultActiveStartDate={new Date('2025-04-01')}
            />
          </div>

          {selectedDateSymptoms && (
            <div className="selected-date-symptoms">
              <h3>Symptoms on {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>

              <div className="symptom-sections">
                {/* Breast Symptoms Section */}
                <div className="symptom-section">
                  <h4>Breast Symptoms</h4>

                  {/* 1. Lump */}
                  <div className="symptom-category">
                    <h5>1. Lump</h5>
                    <div className="symptom-detail">
                      <div className="symptom-side">
                        <strong>Left:</strong> {selectedDateSymptoms.breast.lump.left || 'None'}
                        {selectedDateSymptoms.breast.lump.leftImage ? (
                          <button className="view-image-btn">View Image</button>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </div>
                      <div className="symptom-side">
                        <strong>Right:</strong> {selectedDateSymptoms.breast.lump.right || 'None'}
                        {selectedDateSymptoms.breast.lump.rightImage ? (
                          <button className="view-image-btn">View Image</button>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Pain */}
                  <div className="symptom-category">
                    <h5>2. Pain</h5>
                    <div className="symptom-detail">
                      <p><strong>Pain Rating:</strong> {selectedDateSymptoms.breast.pain.painRating}/5</p>
                      <p><strong>Pain Locations:</strong> {selectedDateSymptoms.breast.pain.painLocations.join(', ')}</p>
                    </div>
                  </div>

                  {/* 3. Rashes */}
                  <div className="symptom-category">
                    <h5>3. Rashes</h5>
                    <div className="symptom-detail">
                      <p><strong>Present:</strong> {selectedDateSymptoms.breast.rashes.hasRashes ? 'Yes' : 'No'}</p>
                      {selectedDateSymptoms.breast.rashes.hasRashes && (
                        <>
                          {selectedDateSymptoms.breast.rashes.image ? (
                            <button className="view-image-btn">View Image</button>
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* 4. Symmetry */}
                  <div className="symptom-category">
                    <h5>4. Symmetry</h5>
                    <div className="symptom-detail">
                      <p>{selectedDateSymptoms.breast.symmetry}</p>
                    </div>
                  </div>

                  {/* 5. Swelling */}
                  <div className="symptom-category">
                    <h5>5. Swelling</h5>
                    <div className="symptom-detail">
                      <div className="symptom-side">
                        <strong>Left:</strong> {selectedDateSymptoms.breast.swelling.left ? 'Yes' : 'No'}
                        {selectedDateSymptoms.breast.swelling.left && (
                          <>
                            {selectedDateSymptoms.breast.swelling.leftImage ? (
                              <button className="view-image-btn">View Image</button>
                            ) : (
                              <span className="no-image">No Image</span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="symptom-side">
                        <strong>Right:</strong> {selectedDateSymptoms.breast.swelling.right ? 'Yes' : 'No'}
                        {selectedDateSymptoms.breast.swelling.right && (
                          <>
                            {selectedDateSymptoms.breast.swelling.rightImage ? (
                              <button className="view-image-btn">View Image</button>
                            ) : (
                              <span className="no-image">No Image</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 6. Itching */}
                  <div className="symptom-category">
                    <h5>6. Itching</h5>
                    <div className="symptom-detail">
                      <p>{selectedDateSymptoms.breast.itching.length > 0 ? selectedDateSymptoms.breast.itching.join(', ') : 'None'}</p>
                    </div>
                  </div>
                </div>

                {/* Nipple Symptoms Section */}
                <div className="symptom-section">
                  <h4>Nipple Symptoms</h4>

                  {/* 1. Inversion */}
                  <div className="symptom-category">
                    <h5>1. Inversion</h5>
                    <div className="symptom-detail">
                      <div className="symptom-side">
                        <strong>Left:</strong> {selectedDateSymptoms.nipple.inversion.left}
                      </div>
                      <div className="symptom-side">
                        <strong>Right:</strong> {selectedDateSymptoms.nipple.inversion.right}
                      </div>
                    </div>
                  </div>

                  {/* 2. Discharge */}
                  <div className="symptom-category">
                    <h5>2. Discharge</h5>
                    <div className="symptom-detail">
                      <p>
                        <strong>Type:</strong> {selectedDateSymptoms.nipple.discharge.type}
                        {selectedDateSymptoms.nipple.discharge.type === 'Unusual' &&
                          ` (${selectedDateSymptoms.nipple.discharge.details})`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedDateSymptoms && (
            <div className="no-symptoms-message">
              <p>No symptoms recorded for {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreastContent;
