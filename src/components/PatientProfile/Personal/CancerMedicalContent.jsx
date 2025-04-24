import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';
import { FaHeartbeat } from 'react-icons/fa';

const CancerMedicalContent = ({ patient, menstrualHistory, reproductiveHistory }) => {
  return (
    <div className="cancer-medical-content">
      <div className="details-section">
        <h2><FaClipboardList className="icon-margin-right" /> Medical History</h2>

        {/* Menstrual History Card */}
        <div className="history-card">
          <div className="history-header">
            <div className="history-icon">
              <FaHeartbeat />
            </div>
            <h3>Menstrual History</h3>
          </div>

          <div className="history-content">
            {menstrualHistory && (
              <>
                <div className="detail-grid">
                  <div className="detail-label">Menstruation Status</div>
                  <div className="detail-value highlight">{menstrualHistory.status}</div>
                </div>

                {menstrualHistory.status === 'Started' && (
                  <>
                    <div className="detail-grid">
                      <div className="detail-label">Started at Age</div>
                      <div className="detail-value">{menstrualHistory.startedAtAge} years</div>
                    </div>

                    <div className="detail-grid">
                      <div className="detail-label">Cycle</div>
                      <div className="detail-value">{menstrualHistory.cycle}</div>
                    </div>

                    <div className="detail-grid">
                      <div className="detail-label">Menopause</div>
                      <div className="detail-value">
                        {menstrualHistory.menopause.status}
                        {menstrualHistory.menopause.status === 'Yes' && (
                          <span className="age-display"> (Age: {menstrualHistory.menopause.age})</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Reproductive History Card */}
        <div className="history-card">
          <div className="history-header">
            <div className="history-icon">
              <FaHeartbeat />
            </div>
            <h3>Reproductive History</h3>
          </div>

          <div className="history-content">
            {reproductiveHistory && (
              <>
                <div className="detail-grid">
                  <div className="detail-label">Pregnancy</div>
                  <div className="detail-value highlight">{reproductiveHistory.pregnancy}</div>
                </div>

                {reproductiveHistory.pregnancy === 'Yes' && (
                  <div className="nested-details">
                    <h4>Pregnancy Details</h4>
                    <div className="detail-grid">
                      <div className="detail-label">Number of Pregnancies</div>
                      <div className="detail-value">{reproductiveHistory.pregnancyDetails.numberOfPregnancies}</div>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-label">Age at First Pregnancy</div>
                      <div className="detail-value">{reproductiveHistory.pregnancyDetails.ageAtFirstPregnancy} years</div>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-label">Complications</div>
                      <div className="detail-value">{reproductiveHistory.pregnancyDetails.complications}</div>
                    </div>
                  </div>
                )}

                <div className="detail-grid">
                  <div className="detail-label">Motherhood</div>
                  <div className="detail-value highlight">{reproductiveHistory.motherhood}</div>
                </div>

                {reproductiveHistory.motherhood === 'Yes' && (
                  <div className="nested-details">
                    <h4>Motherhood Details</h4>
                    <div className="detail-grid">
                      <div className="detail-label">Age at First Child</div>
                      <div className="detail-value">{reproductiveHistory.motherhoodDetails.ageAtFirstChild} years</div>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-label">Number of Children</div>
                      <div className="detail-value">{reproductiveHistory.motherhoodDetails.numberOfChildren}</div>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-label">Breastfed</div>
                      <div className="detail-value">{reproductiveHistory.motherhoodDetails.breastfed}</div>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-label">Breastfeeding Duration</div>
                      <div className="detail-value">{reproductiveHistory.motherhoodDetails.breastfeedingDuration}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="details-section">
        <h2><MdMedicalServices className="icon-margin-right" /> Medical Conditions & Treatments</h2>

        <div className="medical-grid">
          {/* Comorbidities Card */}
          <div className="medical-card">
            <div className="medical-header">
              <h3>Comorbidities</h3>
            </div>
            <div className="medical-content">
              <ul className="medical-list">
                {patient.medicalHistory.previousConditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Current Medications Card */}
          <div className="medical-card">
            <div className="medical-header">
              <h3>Current Medications</h3>
            </div>
            <div className="medical-content">
              <div className="medication-cards">
                {patient.medications.map((medication, index) => (
                  <div key={index} className="medication-card">
                    <h4>{medication.name}</h4>
                    <p><strong>Route:</strong> <span>Oral</span></p>
                    <p><strong>Dosage:</strong> <span>{medication.dosage}</span></p>
                    <p><strong>Frequency:</strong> <span>{medication.frequency}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Medications Card */}
          <div className="medical-card">
            <div className="medical-header">
              <h3>Past Medications</h3>
            </div>
            <div className="medical-content">
              <div className="medication-cards">
                <div className="medication-card">
                  <h4>ABC</h4>
                  <p><strong>Duration:</strong> <span>5 Months</span></p>
                </div>
                <div className="medication-card">
                  <h4>XUC</h4>
                  <p><strong>Duration:</strong> <span>5 Months</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancerMedicalContent;
