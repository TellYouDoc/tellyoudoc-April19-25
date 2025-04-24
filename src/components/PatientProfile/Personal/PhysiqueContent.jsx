import React from 'react';
import { GiBodyHeight, GiWeightScale } from 'react-icons/gi';

const PhysiqueContent = () => {
  return (
    <div className="physique-content">
      <div className="details-section">
        <h2><GiBodyHeight className="icon-margin-right" /> Body Parameters</h2>
        
        <div className="physique-cards">
          {/* Height Card */}
          <div className="physique-card">
            <div className="physique-icon">
              <GiBodyHeight />
            </div>
            <div className="physique-details">
              <h3>Height</h3>
              <div className="physique-value">165 cm</div>
              <div className="physique-secondary">5'5"</div>
            </div>
          </div>
          
          {/* Weight Card */}
          <div className="physique-card">
            <div className="physique-icon">
              <GiWeightScale />
            </div>
            <div className="physique-details">
              <h3>Weight</h3>
              <div className="physique-value">62 kg</div>
              <div className="physique-secondary">136.7 lbs</div>
            </div>
          </div>
          
          {/* BMI Card */}
          <div className="physique-card">
            <div className="physique-icon">
              <GiWeightScale />
            </div>
            <div className="physique-details">
              <h3>BMI</h3>
              <div className="physique-value">22.8</div>
              <div className="physique-secondary">Normal</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="details-section">
        <h2><GiBodyHeight className="icon-margin-right" /> Body Measurements</h2>
        
        <div className="measurement-table">
          <table className="measurements">
            <thead>
              <tr>
                <th>Measurement</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chest</td>
                <td>36 inches</td>
              </tr>
              <tr>
                <td>Waist</td>
                <td>28 inches</td>
              </tr>
              <tr>
                <td>Hips</td>
                <td>38 inches</td>
              </tr>
              <tr>
                <td>Body Fat</td>
                <td>22%</td>
              </tr>
              <tr>
                <td>Muscle Mass</td>
                <td>45 kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="details-section">
        <h2><GiBodyHeight className="icon-margin-right" /> Body History</h2>
        
        <div className="history-chart-container">
          <h3>Weight History</h3>
          <p>Historical weight tracking chart would go here</p>
          
          <div className="weight-milestones">
            <div className="milestone">
              <div className="milestone-date">Jan 2024</div>
              <div className="milestone-value">65 kg</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Apr 2024</div>
              <div className="milestone-value">63 kg</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Jul 2024</div>
              <div className="milestone-value">62 kg</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Oct 2024</div>
              <div className="milestone-value">63 kg</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Jan 2025</div>
              <div className="milestone-value">62 kg</div>
            </div>
            <div className="milestone current">
              <div className="milestone-date">Apr 2025</div>
              <div className="milestone-value">62 kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysiqueContent;
