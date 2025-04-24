import React from 'react';
import { FaHeartbeat, FaFemale as FaBreast } from 'react-icons/fa';
import { MdMedication } from 'react-icons/md';
import { BsFillFileEarmarkMedicalFill } from 'react-icons/bs';
import { GiMedicines } from 'react-icons/gi';

const MedicalSubTabs = ({ activeMedicalTab, setActiveMedicalTab }) => {
  return (
    <div className="medical-subtabs">
      <button
        className={`subtab-button ${activeMedicalTab === 'mastalgia' ? 'active' : ''}`}
        onClick={() => setActiveMedicalTab('mastalgia')}
      >
        <FaHeartbeat className="icon-margin-right" /> Mastalgia
      </button>
      <button
        className={`subtab-button ${activeMedicalTab === 'breast' ? 'active' : ''}`}
        onClick={() => setActiveMedicalTab('breast')}
      >
        <FaBreast className="icon-margin-right" /> Breast
      </button>
      <button
        className={`subtab-button ${activeMedicalTab === 'prescription' ? 'active' : ''}`}
        onClick={() => setActiveMedicalTab('prescription')}
      >
        <MdMedication className="icon-margin-right" /> Prescription
      </button>
      <button
        className={`subtab-button ${activeMedicalTab === 'reports' ? 'active' : ''}`}
        onClick={() => setActiveMedicalTab('reports')}
      >
        <BsFillFileEarmarkMedicalFill className="icon-margin-right" /> Reports
      </button>
      <button
        className={`subtab-button ${activeMedicalTab === 'treatment' ? 'active' : ''}`}
        onClick={() => setActiveMedicalTab('treatment')}
      >
        <GiMedicines className="icon-margin-right" /> Treatment
      </button>
    </div>
  );
};

export default MedicalSubTabs;
