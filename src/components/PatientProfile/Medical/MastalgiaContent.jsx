import React, { useState, useEffect } from 'react';
import { FaHeartbeat } from 'react-icons/fa';
import { TbChartHistogram, TbChartPie } from 'react-icons/tb';
import { RiMentalHealthFill } from 'react-icons/ri';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, Sector } from 'recharts';
import { SectionLoading, NoDataMessage } from '../LoadingStates';

const MastalgiaContent = ({ 
  expandedSections, 
  toggleSection, 
  chartDuration, 
  setChartDuration,
  showLineGraph,
  toggleLineGraph,
  activeBreast,
  setActiveBreast,
  painData,
  painDistributionData,
  activeIndex,
  setActiveIndex,
  menstrualCorrData,
  getPainColor
}) => {
  // Add loading states for each section
  const [loadingStates, setLoadingStates] = useState({
    painChart: false,
    painDistribution: false,
    menstrualCorrelation: false
  });

  // Function to update loading state for a specific section
  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  // Handle duration changes with loading state
  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    
    // Set loading states for all sections that use this duration
    setLoading('painChart', true);
    setLoading('painDistribution', true);
    setLoading('menstrualCorrelation', true);
    
    // Update the duration
    setChartDuration(newDuration);
    
    // Simulate data loading delay
    setTimeout(() => {
      setLoading('painChart', false);
      setLoading('painDistribution', false);
      setLoading('menstrualCorrelation', false);
    }, 600);
  };

  // Handle breast selection change with loading state
  const handleBreastChange = (breast) => {
    if (breast === activeBreast) return;
    
    setLoading('painChart', true);
    setActiveBreast(breast);
    
    // Simulate data loading delay
    setTimeout(() => {
      setLoading('painChart', false);
    }, 500);
  };

  // Handle line graph toggle with loading state
  const handleLineGraphToggle = () => {
    setLoading('painChart', true);
    toggleLineGraph();
    
    // Simulate data loading delay
    setTimeout(() => {
      setLoading('painChart', false);
    }, 400);
  };

  // Customize the chart tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pain-chart-tooltip">
          <p className="tooltip-date">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || getPainColor(entry.value) }}>
              {entry.name}: {entry.value} {entry.value === 1 ? 'point' : 'points'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Function for active shape in pie chart
  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Custom bar label component to show percentages
  const CustomBarLabel = (props) => {
    const { x, y, width, value, height } = props;
    return (
      <text
        x={x + width + 10}
        y={y + height / 2}
        fill="#1e293b"
        alignmentBaseline="middle"
        fontSize={14}
      >
        {`${value}%`}
      </text>
    );
  };

  // Function to render the chart based on toggle state
  const renderPainChart = () => {
    try {
      if (!painData || painData.length === 0) {
        return (
          <div className="no-data-container">
            <div className="no-data-icon">📊</div>
            <div className="no-data-text">No Pain Data Available</div>
            <div className="no-data-subtext">Your pain tracking data will appear here once you start recording it.</div>
          </div>
        );
      }

      // Sort data by date in ascending order
      const sortedData = [...painData].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Prepare data for chart - map backend format to chart format
      const formattedData = sortedData.map(entry => {
        const painLevel = activeBreast === 'left' ? entry.leftPainLevel : entry.rightPainLevel;
        const isPeriodDay = entry.periodDay === 'yes';
        
        return {
          date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          [activeBreast === 'left' ? 'leftPain' : 'rightPain']: painLevel,
          isPeriodDay: isPeriodDay
        };
      });

      const dataKey = activeBreast === 'left' ? 'leftPain' : 'rightPain';
      const name = `${activeBreast === 'left' ? 'Left' : 'Right'} Breast Pain`;

      // Calculate max bars to display based on viewport
      const maxBarsOnScreen = Math.min(formattedData.length, 180); 
      const visibleData = formattedData.slice(-maxBarsOnScreen);

      // Always use ComposedChart which can show both bar and line
      return (
        <ComposedChart data={visibleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={Math.floor(visibleData.length / 5)}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Always show the bar chart */}
          <Bar
            dataKey={dataKey}
            name={`${name} (Bar)`}
            shape={(props) => {
              const isPeriodDay = props.payload.isPeriodDay;
              const painValue = props.payload[dataKey];
              // Use red for period days with pain, pink otherwise
              const barColor = isPeriodDay && painValue > 0 ? "#FF0000" : getPainColor(painValue);
              
              return <rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill={barColor}
                radius={[0, 0, 0, 0]}
              />;
            }}
          />

          {/* Conditionally show the line */}
          {showLineGraph && (
            <Line
              type="monotone"
              dataKey={dataKey}
              name={`${name} (Line)`}
              stroke="#06BE21"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              connectNulls={true}
            />
          )}
        </ComposedChart>
      );
    } catch (error) {
      console.error("Error rendering pain chart:", error);
      return <div>Error rendering chart. Please check console for details.</div>;
    }
  };

  return (
    <div className="mastalgia-content">
      <div className="details-section">
        <h2><FaHeartbeat className="icon-margin-right" /> Mastalgia Information</h2>

        {/* Collapsable section: Pain Level Chart */}
        <div className="collapsable-section">
          <div
            className="collapsable-header"
            onClick={() => toggleSection('painLevel')}
          >
            <h3><TbChartHistogram className="icon-margin-right" /> Pain Level Chart</h3>
            <span className={`collapse-icon ${expandedSections.painLevel ? 'expanded' : ''}`}>&#9650;</span>
          </div>
          <div className={`collapsable-content ${expandedSections.painLevel ? 'expanded' : ''}`}>
            <div className="info-card">
              {/* Chart Controls */}
              <div className="chart-controls">
                <div className="chart-duration">
                  <label htmlFor="duration-select">Duration:</label>
                  <select
                    id="duration-select"
                    value={chartDuration}
                    onChange={handleDurationChange}
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Month">2 Month</option>
                    <option value="3 Month">3 Month</option>
                    <option value="6 Month">6 Month</option>
                  </select>
                </div>

                <div className="line-graph-toggle">
                  <label htmlFor="line-toggle" onClick={handleLineGraphToggle}>Line Graph:</label>
                  <div className="toggle-switch" onClick={handleLineGraphToggle}>
                    <input
                      type="checkbox"
                      id="line-toggle"
                      checked={showLineGraph}
                      onChange={handleLineGraphToggle}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>

              {/* Breast Selection */}
              <div className="breast-selection">
                <button
                  className={`breast-button ${activeBreast === 'left' ? 'active' : ''}`}
                  onClick={() => handleBreastChange('left')}
                >
                  Left Breast
                </button>
                <button
                  className={`breast-button ${activeBreast === 'right' ? 'active' : ''}`}
                  onClick={() => handleBreastChange('right')}
                >
                  Right Breast
                </button>
              </div>

              {/* Pain Level Color Legend */}
              <div className="pain-level-legend">
                <div className="legend-title">Pain Level:</div>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: getPainColor(0) }}></div>
                    <span>0 - None</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: getPainColor(1) }}></div>
                    <span>1 - Very low</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: getPainColor(2) }}></div>
                    <span>2 - Low</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: getPainColor(3) }}></div>
                    <span>3 - Medium</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: getPainColor(4) }}></div>
                    <span>4 - High</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: getPainColor(5) }}></div>
                    <span>5 - Very high</span>
                  </div>
                </div>
              </div>

              {/* Pain Chart */}
              <div className="pain-chart">
                <ResponsiveContainer width="100%" height={300}>
                  {loadingStates.painChart ? <SectionLoading /> : renderPainChart()}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsable section: Pain Distribution */}
        <div className="collapsable-section">
          <div
            className="collapsable-header"
            onClick={() => toggleSection('painDistribution')}
          >
            <h3><TbChartPie className="icon-margin-right" /> Pain Distribution</h3>
            <span className={`collapse-icon ${expandedSections.painDistribution ? 'expanded' : ''}`}>&#9650;</span>
          </div>
          <div className={`collapsable-content ${expandedSections.painDistribution ? 'expanded' : ''}`}>
            <div className="info-card">
              <div className="pain-distribution-info">
                <h4>Pain Intensity Distribution</h4>
                <p>This chart shows the percentage distribution of pain intensity levels over the {chartDuration.toLowerCase()} period.</p>
              </div>

              {/* Duration selector for pie chart */}
              <div className="chart-controls">
                <div className="chart-duration">
                  <label htmlFor="pie-duration-select">Duration:</label>
                  <select
                    id="pie-duration-select"
                    value={chartDuration}
                    onChange={handleDurationChange}
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Month">2 Month</option>
                    <option value="3 Month">3 Month</option>
                    <option value="6 Month">6 Month</option>
                  </select>
                </div>
              </div>

              <div className="pain-distribution-chart">
                <ResponsiveContainer width="100%" height={300}>
                  {loadingStates.painDistribution ? <SectionLoading /> : (() => {
                    try {
                      return (
                        <PieChart>
                          <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={painDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={90}
                            paddingAngle={1}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                          >
                            {painDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={1} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `${value}%`}
                            labelFormatter={(index) => painDistributionData[index]?.name || ''}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            formatter={(value, entry, index) => (
                              <span style={{ color: '#1e293b' }}>
                                {value.replace(' Pain', '')}: {painDistributionData[index]?.value}%
                              </span>
                            )}
                          />
                        </PieChart>
                      );
                    } catch (error) {
                      console.error("Error rendering pain distribution chart:", error);
                      return <div>Error rendering chart. Please check console for details.</div>;
                    }
                  })()}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsable section: Menstrual Correlation */}
        <div className="collapsable-section">
          <div
            className="collapsable-header"
            onClick={() => toggleSection('menstrualCorrelation')}
          >
            <h3><FaHeartbeat className="icon-margin-right" /> Menstrual Correlation</h3>
            <span className={`collapse-icon ${expandedSections.menstrualCorrelation ? 'expanded' : ''}`}>&#9650;</span>
          </div>
          <div className={`collapsable-content ${expandedSections.menstrualCorrelation ? 'expanded' : ''}`}>
            <div className="info-card">
              <div className="menstrual-correlation-info">
                <h4>Pain Intensity During Menstrual Cycle</h4>
                <p>This chart shows the correlation between pain intensity and menstrual cycle phases.</p>
              </div>

              <div className="menstrual-correlation-chart">
                <ResponsiveContainer width="100%" height={300}>
                  {loadingStates.menstrualCorrelation ? <SectionLoading /> : (() => {
                    try {
                      return (
                        <BarChart
                          layout="vertical"
                          data={menstrualCorrData}
                          margin={{ top: 20, right: 60, left: 80, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={80}
                          />
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Frequency']}
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                          />
                          <Bar
                            dataKey="value"
                            name="Frequency"
                            label={<CustomBarLabel />}
                          >
                            {menstrualCorrData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      );
                    } catch (error) {
                      console.error("Error rendering menstrual correlation chart:", error);
                      return <div>Error rendering chart. Please check console for details.</div>;
                    }
                  })()}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsable section: Pain Insights */}
        <div className="collapsable-section">
          <div
            className="collapsable-header"
            onClick={() => toggleSection('painInsights')}
          >
            <h3><RiMentalHealthFill className="icon-margin-right" /> Pain Insights</h3>
            <span className={`collapse-icon ${expandedSections.painInsights ? 'expanded' : ''}`}>&#9650;</span>
          </div>
          <div className={`collapsable-content ${expandedSections.painInsights ? 'expanded' : ''}`}>
            <div className="info-card">
              <p>Pain insights content will go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MastalgiaContent;
