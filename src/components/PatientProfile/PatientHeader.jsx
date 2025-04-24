import React from 'react';
import { FaUser, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PatientHeader = ({ patient }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/patients')}>
          <FaArrowLeft className="icon-margin-right" /> Back to Patients
        </button>
      </div>

      <h2 className='page-title'><FaUser className="icon-margin-right" /> Patient Profile</h2>

      {/* Patient Header Card */}
      <div className="patient-header-card">
        <div className="patient-header-info">
          <img
            src={patient.profileImage}
            alt={`${patient.name}'s profile`}
            className="patient-avatar"
          />
          <div className="patient-basic-info">
            <h3 className="patient-name">{patient.name}</h3>
            <div className="patient-attributes">
              <span className="patient-gender">{patient.gender}</span>
              <span className="attribute-separator">•</span>
              <span className="patient-age">{patient.age} years</span>
              <span className="attribute-separator">•</span>
              <div className="status-badge">{patient.status}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientHeader;
