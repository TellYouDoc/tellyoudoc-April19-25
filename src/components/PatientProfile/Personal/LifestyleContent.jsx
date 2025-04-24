import React from 'react';
import { FaRunning, FaAppleAlt, FaSmoking } from 'react-icons/fa';
import { MdOutlineMood } from 'react-icons/md';

const LifestyleContent = () => {
  return (
    <div className="lifestyle-content">
      <div className="details-section">
        <h2><FaAppleAlt className="icon-margin-right" /> Nutrition</h2>
        
        <div className="lifestyle-cards">
          {/* Diet Type Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaAppleAlt />
              </div>
              <h3>Diet Type</h3>
            </div>
            <div className="lifestyle-content">
              <div className="diet-type">Vegetarian</div>
              <p className="lifestyle-details">Plant-based diet with dairy products</p>
            </div>
          </div>
          
          {/* Meals Per Day Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaAppleAlt />
              </div>
              <h3>Meals Per Day</h3>
            </div>
            <div className="lifestyle-content">
              <div className="meals-count">3</div>
              <p className="lifestyle-details">Regular schedule</p>
            </div>
          </div>
          
          {/* Food Allergies Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaAppleAlt />
              </div>
              <h3>Food Allergies</h3>
            </div>
            <div className="lifestyle-content">
              <ul className="allergy-list">
                <li>Nuts</li>
                <li>Shellfish</li>
              </ul>
            </div>
          </div>
          
          {/* Water Intake Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaAppleAlt />
              </div>
              <h3>Water Intake</h3>
            </div>
            <div className="lifestyle-content">
              <div className="water-amount">2.5 liters/day</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="details-section">
        <h2><FaRunning className="icon-margin-right" /> Physical Activity</h2>
        
        <div className="lifestyle-cards">
          {/* Exercise Frequency Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaRunning />
              </div>
              <h3>Exercise Frequency</h3>
            </div>
            <div className="lifestyle-content">
              <div className="frequency">3-4 times per week</div>
              <p className="lifestyle-details">Moderate intensity</p>
            </div>
          </div>
          
          {/* Activity Types Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaRunning />
              </div>
              <h3>Activity Types</h3>
            </div>
            <div className="lifestyle-content">
              <div className="activity-types">
                <span className="activity-tag">Walking</span>
                <span className="activity-tag">Yoga</span>
                <span className="activity-tag">Swimming</span>
              </div>
            </div>
          </div>
          
          {/* Daily Steps Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaRunning />
              </div>
              <h3>Daily Steps</h3>
            </div>
            <div className="lifestyle-content">
              <div className="steps-count">7,500</div>
              <p className="lifestyle-details">Average per day</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="details-section">
        <h2><FaSmoking className="icon-margin-right" /> Habits</h2>
        
        <div className="lifestyle-cards">
          {/* Smoking Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaSmoking />
              </div>
              <h3>Smoking</h3>
            </div>
            <div className="lifestyle-content">
              <div className="habit-status negative">Non-smoker</div>
              <p className="lifestyle-details">Never smoked</p>
            </div>
          </div>
          
          {/* Alcohol Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <FaSmoking />
              </div>
              <h3>Alcohol</h3>
            </div>
            <div className="lifestyle-content">
              <div className="habit-status moderate">Social drinker</div>
              <p className="lifestyle-details">1-2 drinks per week</p>
            </div>
          </div>
          
          {/* Sleep Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <MdOutlineMood />
              </div>
              <h3>Sleep</h3>
            </div>
            <div className="lifestyle-content">
              <div className="sleep-hours">7 hours/night</div>
              <p className="lifestyle-details">Occasional insomnia</p>
            </div>
          </div>
          
          {/* Stress Management Card */}
          <div className="lifestyle-card">
            <div className="lifestyle-header">
              <div className="lifestyle-icon">
                <MdOutlineMood />
              </div>
              <h3>Stress Management</h3>
            </div>
            <div className="lifestyle-content">
              <div className="management-methods">
                <span className="method-tag">Meditation</span>
                <span className="method-tag">Reading</span>
                <span className="method-tag">Nature walks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleContent;
