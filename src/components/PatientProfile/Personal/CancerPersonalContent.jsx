import React from 'react';
import { FaUser } from 'react-icons/fa';

const CancerPersonalContent = () => {
  return (
    <div className="cancer-personal-content">
      <div className="details-section">
        <h2><FaUser className="icon-margin-right" /> Personal Impact</h2>
        <div className="info-card">
          {/* Address Information */}
          <div className="address-information">
            <h3 className="section-subheader">Address Information</h3>

            <div className="address-container">
              <div className="address-section">
                <h4>Current Address</h4>
                <div className="address-details">
                  <p className="address-line">123 Healthcare Lane, Wellness City</p>
                  <p className="address-line">California, 90210</p>
                </div>
              </div>

              <div className="address-section">
                <h4>Permanent Address</h4>
                <div className="address-details">
                  <p className="address-line same-address">Same as Current Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="family-information">
            <h3 className="section-subheader">Family Information</h3>

            <div className="family-grid-container">
              {/* Parents Block */}
              <div className="family-block parents-block">
                <div className="block-header">
                  <span className="block-icon">👪</span>
                  <h4>Parents</h4>
                </div>
                <div className="family-member-grid">
                  <div className="family-member-card">
                    <div className="member-header">Father</div>
                    <div className="member-details">
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value alive">Alive</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">65 Years</span>
                      </div>
                    </div>
                  </div>

                  <div className="family-member-card">
                    <div className="member-header">Mother</div>
                    <div className="member-details">
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value alive">Alive</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">62 Years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Children Block */}
              <div className="family-block children-block">
                <div className="block-header">
                  <span className="block-icon">👶</span>
                  <h4>Children</h4>
                </div>
                <div className="family-stats-cards">
                  <div className="stats-card">
                    <div className="stats-header">Son</div>
                    <div className="stats-count">4</div>
                    <div className="stats-details">
                      <div className="stats-item">
                        <span className="stats-dot alive"></span>
                        <span className="stats-label">Alive:</span>
                        <span className="stats-value">2</span>
                      </div>
                      <div className="stats-item">
                        <span className="stats-dot deceased"></span>
                        <span className="stats-label">Deceased:</span>
                        <span className="stats-value">2</span>
                      </div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="stats-header">Daughter</div>
                    <div className="stats-count">4</div>
                    <div className="stats-details">
                      <div className="stats-item">
                        <span className="stats-dot alive"></span>
                        <span className="stats-label">Alive:</span>
                        <span className="stats-value">3</span>
                      </div>
                      <div className="stats-item">
                        <span className="stats-dot deceased"></span>
                        <span className="stats-label">Deceased:</span>
                        <span className="stats-value">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Siblings Block */}
              <div className="family-block siblings-block">
                <div className="block-header">
                  <span className="block-icon">👫</span>
                  <h4>Siblings</h4>
                </div>
                <div className="family-stats-cards">
                  <div className="stats-card">
                    <div className="stats-header">Brother</div>
                    <div className="stats-count">5</div>
                    <div className="stats-details">
                      <div className="stats-item">
                        <span className="stats-dot alive"></span>
                        <span className="stats-label">Alive:</span>
                        <span className="stats-value">3</span>
                      </div>
                      <div className="stats-item">
                        <span className="stats-dot deceased"></span>
                        <span className="stats-label">Deceased:</span>
                        <span className="stats-value">2</span>
                      </div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="stats-header">Sister</div>
                    <div className="stats-count">5</div>
                    <div className="stats-details">
                      <div className="stats-item">
                        <span className="stats-dot alive"></span>
                        <span className="stats-label">Alive:</span>
                        <span className="stats-value">3</span>
                      </div>
                      <div className="stats-item">
                        <span className="stats-dot deceased"></span>
                        <span className="stats-label">Deceased:</span>
                        <span className="stats-value">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancerPersonalContent;
