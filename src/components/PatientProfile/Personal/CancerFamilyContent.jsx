import React from 'react';
import { FaUser, FaRibbon, FaHeartbeat, FaFemale } from 'react-icons/fa';

const CancerFamilyContent = ({ familyCancerHistory }) => {
  return (
    <div className="cancer-family-content">
      <div className="details-section cancer-history-section">
        <h2><FaUser className="icon-margin-right" /> Family Cancer History</h2>
        <div className="info-card">
          <div className="cancer-history-section">
            <h3 className="section-subheader">Cancer History in Family</h3>

            <div className="cancer-history-boxes">
              <div className="cancer-history-box">
                <div className="cancer-history-icon breast">
                  <FaRibbon />
                </div>
                <div className="cancer-history-details">
                  <h4>Breast Cancer</h4>
                  <div className="cancer-cases">5 Cases</div>
                </div>
              </div>

              <div className="cancer-history-box">
                <div className="cancer-history-icon ovarian">
                  <FaFemale />
                </div>
                <div className="cancer-history-details">
                  <h4>Ovarian Cancer</h4>
                  <div className="cancer-cases">2 Cases</div>
                </div>
              </div>

              <div className="cancer-history-box">
                <div className="cancer-history-icon cervical">
                  <FaFemale />
                </div>
                <div className="cancer-history-details">
                  <h4>Cervical Cancer</h4>
                  <div className="cancer-cases">1 Case</div>
                </div>
              </div>

              <div className="cancer-history-box">
                <div className="cancer-history-icon other">
                  <FaHeartbeat />
                </div>
                <div className="cancer-history-details">
                  <h4>Other Cancer</h4>
                  <div className="cancer-cases">3 Cases</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="family-sections-container">
            <div className="immediate-family-section">
              <h3 className="section-subheader">Immediate Family</h3>

              <div className="family-grid">
                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon breast"></span>
                    Breast Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.immediate.breastCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon ovarian"></span>
                    Ovarian Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.immediate.ovarianCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon cervical"></span>
                    Cervical Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.immediate.cervicalCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {familyCancerHistory.immediate.otherCancer.length > 0 && (
                  <div className="family-cancer-category">
                    <h4 className="cancer-type-header">
                      <span className="cancer-icon other"></span>
                      Other Cancer
                    </h4>
                    <div className="family-members-list">
                      {familyCancerHistory.immediate.otherCancer.map((relative, index) => (
                        <div key={index} className="family-member-tag">
                          <span className="relation-name">{relative.relation}</span>
                          <span className="relation-age">{relative.age || 'Unknown'}</span>
                          {relative.type && <span className="cancer-specific-type">{relative.type}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="extended-family-section">
              <h3 className="section-subheader">Extended Family</h3>

              <div className="family-grid">
                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon breast"></span>
                    Breast Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.extended.breastCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon ovarian"></span>
                    Ovarian Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.extended.ovarianCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon cervical"></span>
                    Cervical Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.extended.cervicalCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="family-cancer-category">
                  <h4 className="cancer-type-header">
                    <span className="cancer-icon other"></span>
                    Other Cancer
                  </h4>
                  <div className="family-members-list">
                    {familyCancerHistory.extended.otherCancer.map((relative, index) => (
                      <div key={index} className="family-member-tag">
                        <span className="relation-name">{relative.relation}</span>
                        <span className="relation-age">{relative.age || 'Unknown'}</span>
                        {relative.type && <span className="cancer-specific-type">{relative.type}</span>}
                      </div>
                    ))}
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

export default CancerFamilyContent;
