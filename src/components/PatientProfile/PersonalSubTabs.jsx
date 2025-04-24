import React from 'react';
import { FaRibbon, FaAppleAlt } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';
import { GiBodyHeight } from 'react-icons/gi';

const PersonalSubTabs = ({ activePersonalTab, setActivePersonalTab }) => {
  return (
    <div className="personal-subtabs">
      <button
        className={`subtab-button ${activePersonalTab === 'cancer' ? 'active' : ''}`}
        onClick={() => setActivePersonalTab('cancer')}
      >
        <FaRibbon className="icon-margin-right" /> Cancer
      </button>
      <button
        className={`subtab-button ${activePersonalTab === 'health' ? 'active' : ''}`}
        onClick={() => setActivePersonalTab('health')}
      >
        <MdHealthAndSafety className="icon-margin-right" /> Health
      </button>
      <button
        className={`subtab-button ${activePersonalTab === 'physique' ? 'active' : ''}`}
        onClick={() => setActivePersonalTab('physique')}
      >
        <GiBodyHeight className="icon-margin-right" /> Physique
      </button>
      <button
        className={`subtab-button ${activePersonalTab === 'lifestyle' ? 'active' : ''}`}
        onClick={() => setActivePersonalTab('lifestyle')}
      >
        <FaAppleAlt className="icon-margin-right" /> Lifestyle
      </button>
    </div>
  );
};

export default PersonalSubTabs;
