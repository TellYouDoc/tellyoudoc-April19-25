import React, { useState } from 'react';
import { 
  FaUser, 
  FaBell, 
  FaLock, 
  FaPalette, 
  FaLanguage, 
  FaMoon, 
  FaSun,
  FaTrash,
  FaDownload,
  FaShieldAlt,
  FaChartLine,
  FaCog
} from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    updates: false
  });
  const [language, setLanguage] = useState('en');
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: true,
    sessionTimeout: '30'
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSecurityChange = (type, value) => {
    setSecurity(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Here you would typically update the app's theme
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Here you would typically update the app's language
  };

  const handleExportData = () => {
    // Here you would typically handle data export
    console.log('Exporting data...');
  };

  const handleDeleteAccount = () => {
    // Here you would typically handle account deletion
    console.log('Deleting account...');
  };

  const renderAccountSettings = () => (
    <div className="settings-section">
      <h2>Account Settings</h2>
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-label">
            <FaUser className="setting-icon" />
            <span>Email Notifications</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.email}
              onChange={() => handleNotificationChange('email')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <FaBell className="setting-icon" />
            <span>Push Notifications</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.push}
              onChange={() => handleNotificationChange('push')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <FaChartLine className="setting-icon" />
            <span>Usage Analytics</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.updates}
              onChange={() => handleNotificationChange('updates')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h2>Security Settings</h2>
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-label">
            <FaLock className="setting-icon" />
            <span>Two-Factor Authentication</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={security.twoFactor}
              onChange={() => handleSecurityChange('twoFactor', !security.twoFactor)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <FaShieldAlt className="setting-icon" />
            <span>Biometric Authentication</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={security.biometric}
              onChange={() => handleSecurityChange('biometric', !security.biometric)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <FaCog className="setting-icon" />
            <span>Session Timeout</span>
          </div>
          <select 
            className="setting-select"
            value={security.sessionTimeout}
            onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h2>Appearance Settings</h2>
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-label">
            <FaPalette className="setting-icon" />
            <span>Theme</span>
          </div>
          <div className="theme-options">
            <button 
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <FaSun /> Light
            </button>
            <button 
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <FaMoon /> Dark
            </button>
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <FaLanguage className="setting-icon" />
            <span>Language</span>
          </div>
          <select 
            className="setting-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="settings-section">
      <h2>Data Management</h2>
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-label">
            <FaDownload className="setting-icon" />
            <span>Export Data</span>
          </div>
          <button 
            className="export-button"
            onClick={handleExportData}
          >
            Export
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <FaTrash className="setting-icon" />
            <span>Delete Account</span>
          </div>
          <button 
            className="delete-account-button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>
        <div className="settings-main">
          <div className="settings-sidebar">
            <button 
              className={`sidebar-button ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <FaUser /> Account
            </button>
            <button 
              className={`sidebar-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaLock /> Security
            </button>
            <button 
              className={`sidebar-button ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <FaPalette /> Appearance
            </button>
            <button 
              className={`sidebar-button ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <FaDownload /> Data
            </button>
          </div>
          <div className="settings-panel">
            {activeTab === 'account' && renderAccountSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'data' && renderDataSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 