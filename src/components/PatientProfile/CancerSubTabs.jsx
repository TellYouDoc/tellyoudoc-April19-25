import React from 'react';
import { FaRibbon, FaUser } from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';

const CancerSubTabs = ({ activeCancerTab, setActiveCancerTab }) => {
  return (
    <div className="cancer-subtabs">
      <button
        className={`subtab-button ${activeCancerTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveCancerTab('overview')}
      >
        <FaRibbon className="icon-margin-right" /> Overview
      </button>
      <button
        className={`subtab-button ${activeCancerTab === 'personal' ? 'active' : ''}`}
        onClick={() => setActiveCancerTab('personal')}
      >
        <FaUser className="icon-margin-right" /> Personal
      </button>
      <button
        className={`subtab-button ${activeCancerTab === 'medical' ? 'active' : ''}`}
        onClick={() => setActiveCancerTab('medical')}
      >
        <MdMedicalServices className="icon-margin-right" /> Medical
      </button>
      <button
        className={`subtab-button ${activeCancerTab === 'family' ? 'active' : ''}`}
        onClick={() => setActiveCancerTab('family')}
      >
        <FaUser className="icon-margin-right" /> Family
      </button>
    </div>
  );
};

export default CancerSubTabs;
