import React from 'react';
import { MdMedicalServices, MdPersonalInjury } from 'react-icons/md';

const MainTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="profile-tabs">
      <button
        className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
        onClick={() => setActiveTab('medical')}
      >
        <MdMedicalServices className="icon-margin-right" /> Medical
      </button>
      <button
        className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
        onClick={() => setActiveTab('personal')}
      >
        <MdPersonalInjury className="icon-margin-right" /> Personal
      </button>
    </div>
  );
};

export default MainTabs;
