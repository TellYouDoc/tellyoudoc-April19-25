import React, { useState } from 'react';
import { FaStickyNote, FaPills, FaHistory, FaProcedures } from 'react-icons/fa'; // Added icons
import { SectionLoading, NoDataMessage } from '../../LoadingStates';

const TreatmentContent = ({ patient, addNote, editNote, deleteNote }) => {
  // Add section-specific loading states (can be enhanced if needed)
  const [loadingStates, setLoadingStates] = useState({
    currentTreatments: false,
    treatmentHistory: false,
    surgeries: false
  });

  // Function to update loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  // Render current treatments (Ongoing Medications)
  const renderCurrentTreatments = () => {
    if (loadingStates.currentTreatments) {
      return <SectionLoading message="Loading current treatments..." />;
    }

    const ongoingMeds = patient?.medications || []; // Assuming patient.medications holds ongoing meds

    if (ongoingMeds.length === 0) {
      return (
        <NoDataMessage
          icon="💊"
          title="No Current Treatments"
          subtitle="Your current treatments and therapies will appear here once they are prescribed."
        />
      );
    }

    return (
      <div className="medication-list"> {/* Added a class for styling */}
        {ongoingMeds.map((med, index) => (
          <div key={index} className="medication-card"> {/* Added a class for styling */}
            <p><strong>Medication:</strong> {med.medicationName}</p>
            <p><strong>Dosage:</strong> {med.dosage}</p>
            <p><strong>Frequency:</strong> {med.frequency}</p>
            <p><strong>Reason:</strong> {med.reason}</p>
            {/* Add more details if available */}
          </div>
        ))}
      </div>
    );
  };

  // Render treatment history (Past Medications)
  const renderTreatmentHistory = () => {
    if (loadingStates.treatmentHistory) {
      return <SectionLoading message="Loading treatment history..." />;
    }

    const pastMeds = patient?.pastMedications || []; // Assuming patient.pastMedications holds past meds

    if (pastMeds.length === 0) {
      return (
        <NoDataMessage
          icon="📋"
          title="No Treatment History"
          subtitle="Your past treatments and therapies will appear here once they are recorded."
        />
      );
    }

    return (
      <div className="medication-list"> {/* Reusing class */}
        {pastMeds.map((med, index) => (
          <div key={index} className="medication-card"> {/* Reusing class */}
            <p><strong>Medication:</strong> {med.medicationName}</p>
            <p><strong>Dosage:</strong> {med.dosage}</p>
            <p><strong>Frequency:</strong> {med.frequency}</p>
            <p><strong>Reason:</strong> {med.reason}</p>
            {/* Add more details like start/end dates if available */}
          </div>
        ))}
      </div>
    );
  };

  // Render surgeries (from testData)
  const renderSurgeries = () => {
    if (loadingStates.surgeries) {
      return <SectionLoading message="Loading surgical procedures..." />;
    }

    const surgeries = patient?.testData?.Surgeries?.breastSurgeryRecords || [];

    if (surgeries.length === 0) {
      return (
        <NoDataMessage
          icon="🔪" // Consider a less graphic icon like FaProcedures
          title="No Surgical Procedures"
          subtitle="Your surgical procedures will appear here once they are recorded."
        />
      );
    }

    return (
      <div className="surgery-list"> {/* Added a class for styling */}
        {surgeries.map((surgery, index) => (
          <div key={index} className="surgery-card"> {/* Added a class for styling */}
            <p><strong>Date:</strong> {new Date(surgery.date).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {surgery.surgeryType}</p>
            <p><strong>Details:</strong> {surgery.surgeryDetails}</p>
            {/* Add more details if available */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="treatment-content">
      <div className="details-section">
        <h2><FaPills className="icon-margin-right" /> Current Treatments</h2>
        {renderCurrentTreatments()}
      </div>

      <div className="details-section">
        <h2><FaHistory className="icon-margin-right" /> Treatment History</h2>
        {renderTreatmentHistory()}
      </div>

      <div className="details-section">
        <h2><FaProcedures className="icon-margin-right" /> Surgical Procedures</h2>
        {renderSurgeries()}
      </div>

      <div className="details-section">
        <h2><FaStickyNote className="icon-margin-right" /> Notes</h2>
        {/* Add sorting controls if needed */}
        {/* <button onClick={handleSortNotes}>Sort by Date ({sortAscending ? 'Asc' : 'Desc'})</button> */}
        <div className="notes-list">
          {patient.notes && patient.notes.length > 0 ? (
            patient.notes.map((note, index) => (
              <div key={note._id || index} className="note-card">
                <div className="note-header">
                  <p className="note-text">{note.note}</p> {/* Changed h3 to p for consistency */}
                  <span className="note-date">Added On: {new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="note-actions">
                  <button className="edit-note-btn" onClick={() => editNote(note)}>
                    Edit
                  </button>
                  <button className="delete-note-btn" onClick={() => deleteNote(note)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <NoDataMessage subtitle="No notes added yet." />
          )}
        </div>
        <button className="add-note-btn" onClick={addNote}>Add Note</button>
      </div>
    </div>
  );
};

export default TreatmentContent;
