import React, { useState, useEffect } from 'react';
import { NoDataMessage } from '../../LoadingStates';
import React from 'react';

const MedicalTab = ({ activeMedicalTab, setActiveMedicalTab, painData, chartDuration, setChartDuration, showLineGraph, setShowLineGraph, activeBreast, setActiveBreast }) => {
    // For fetching data with loading states
    const fetchTabData = (tabId) => {
        // Set appropriate loading state
        if (tabId === 'breast') {
            // Use your existing loading state mechanism or add one
        }

        // Your existing data fetching logic
        // ...
    };

    // Helper function to render empty state for any section
    const renderNoData = (title, subtitle, icon = "🩺") => {
        return (
            <NoDataMessage
                icon={icon}
                title={title}
                subtitle={subtitle}
            />
        );
    };

    // Render the currently selected tab
    const renderSelectedTab = () => {
        switch (selectedTab) {
            // ...existing cases...

            default:
                return renderNoData(
                    "Tab Data Not Available",
                    "Please select another tab or check back later for updates."
                );
        }
    };

    return (
        <div className="medical-tab">
            <button onClick={() => setActiveMedicalTab('mastalgia')}>Mastalgia</button>
            <button onClick={() => setActiveMedicalTab('breast')}>Breast</button>
            {activeMedicalTab === 'mastalgia' && (
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
                                <span className={`collapse-icon ${expandedSections.painLevel ? 'expanded' : ''}`}>
                                    &#9650;
                                </span>
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
                                                onChange={(e) => setChartDuration(e.target.value)}
                                            >
                                                <option value="1 Month">1 Month</option>
                                                <option value="2 Month">2 Month</option>
                                                <option value="3 Month">3 Month</option>
                                                <option value="6 Month">6 Month</option>
                                            </select>
                                        </div>

                                        <div className="line-graph-toggle">
                                            <label htmlFor="line-toggle" onClick={toggleLineGraph}>Line Graph:</label>
                                            <div className="toggle-switch" onClick={toggleLineGraph}>
                                                <input
                                                    type="checkbox"
                                                    id="line-toggle"
                                                    checked={showLineGraph}
                                                    onChange={toggleLineGraph}
                                                />
                                                <span className="toggle-slider"></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breast Selection */}
                                    <div className="breast-selection">
                                        <button
                                            className={`breast-button ${activeBreast === 'left' ? 'active' : ''}`}
                                            onClick={() => setActiveBreast('left')}
                                        >
                                            Left Breast
                                        </button>
                                        <button
                                            className={`breast-button ${activeBreast === 'right' ? 'active' : ''}`}
                                            onClick={() => setActiveBreast('right')}
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
                                            {renderPainChart()}
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
                                <span className={`collapse-icon ${expandedSections.painDistribution ? 'expanded' : ''}`}>
                                    &#9650;
                                </span>
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
                                                onChange={(e) => setChartDuration(e.target.value)}
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
                                            {(() => {
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
                                <h3><FaFemale className="icon-margin-right" /> Menstrual Correlation</h3>
                                <span className={`collapse-icon ${expandedSections.menstrualCorrelation ? 'expanded' : ''}`}>
                                    &#9650;
                                </span>
                            </div>
                            <div className={`collapsable-content ${expandedSections.menstrualCorrelation ? 'expanded' : ''}`}>
                                <div className="info-card">
                                    <div className="menstrual-correlation-info">
                                        <h4>Pain Intensity During Menstrual Cycle</h4>
                                        <p>This chart shows the correlation between pain intensity and menstrual cycle phases.</p>
                                    </div>

                                    <div className="menstrual-correlation-chart">
                                        <ResponsiveContainer width="100%" height={300}>
                                            {(() => {
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
                                <span className={`collapse-icon ${expandedSections.painInsights ? 'expanded' : ''}`}>
                                    &#9650;
                                </span>
                            </div>
                            <div className={`collapsable-content ${expandedSections.painInsights ? 'expanded' : ''}`}>
                                <div className="info-card">
                                    <p>Pain insights content will go here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeMedicalTab === 'breast' && (
                <div className="breast-content">
                    {/* Symptom Calendar Section */}
                    <div className="details-section">
                        <h2><FaCalendarAlt className="icon-margin-right" /> Symptom Calendar</h2>
                        <div className="info-card">
                            <p className="calendar-info">Dates highlighted in green indicate days with recorded symptoms. Click on a date to view details.</p>

                            <div className="symptom-calendar-container">
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    className="symptom-calendar"
                                    tileClassName={({ date }) => {
                                        // Format date as YYYY-MM-DD for comparison with our data
                                        const dateStr = date.toISOString().split('T')[0];
                                        return breastSymptomData[dateStr] ? 'has-symptoms' : null;
                                    }}
                                    onClickDay={(date) => {
                                        setSelectedDate(date);
                                        const dateStr = date.toISOString().split('T')[0];
                                        setSelectedDateSymptoms(breastSymptomData[dateStr] || null);
                                    }}
                                    minDetail="month"
                                    maxDate={new Date()}
                                    // Show April by default
                                    defaultActiveStartDate={new Date('2025-04-01')}
                                />
                            </div>

                            {selectedDateSymptoms && (
                                <div className="selected-date-symptoms">
                                    <h3>Symptoms on {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>

                                    <div className="symptom-sections">
                                        {/* Breast Symptoms Section */}
                                        <div className="symptom-section">
                                            <h4>Breast Symptoms</h4>

                                            {/* 1. Lump */}
                                            <div className="symptom-category">
                                                <h5>1. Lump</h5>
                                                <div className="symptom-detail">
                                                    <div className="symptom-side">
                                                        <strong>Left:</strong> {selectedDateSymptoms.breast.lump.left || 'None'}
                                                        {selectedDateSymptoms.breast.lump.leftImage ? (
                                                            <button className="view-image-btn">View Image</button>
                                                        ) : (
                                                            <span className="no-image">No Image</span>
                                                        )}
                                                    </div>
                                                    <div className="symptom-side">
                                                        <strong>Right:</strong> {selectedDateSymptoms.breast.lump.right || 'None'}
                                                        {selectedDateSymptoms.breast.lump.rightImage ? (
                                                            <button className="view-image-btn">View Image</button>
                                                        ) : (
                                                            <span className="no-image">No Image</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Pain */}
                                            <div className="symptom-category">
                                                <h5>2. Pain</h5>
                                                <div className="symptom-detail">
                                                    <p><strong>Pain Rating:</strong> {selectedDateSymptoms.breast.pain.painRating}/5</p>
                                                    <p><strong>Pain Locations:</strong> {selectedDateSymptoms.breast.pain.painLocations.join(', ')}</p>
                                                </div>
                                            </div>

                                            {/* 3. Rashes */}
                                            <div className="symptom-category">
                                                <h5>3. Rashes</h5>
                                                <div className="symptom-detail">
                                                    <p><strong>Present:</strong> {selectedDateSymptoms.breast.rashes.hasRashes ? 'Yes' : 'No'}</p>
                                                    {selectedDateSymptoms.breast.rashes.hasRashes && (
                                                        <>
                                                            {selectedDateSymptoms.breast.rashes.image ? (
                                                                <button className="view-image-btn">View Image</button>
                                                            ) : (
                                                                <span className="no-image">No Image</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 4. Symmetry */}
                                            <div className="symptom-category">
                                                <h5>4. Symmetry</h5>
                                                <div className="symptom-detail">
                                                    <p>{selectedDateSymptoms.breast.symmetry}</p>
                                                </div>
                                            </div>

                                            {/* 5. Swelling */}
                                            <div className="symptom-category">
                                                <h5>5. Swelling</h5>
                                                <div className="symptom-detail">
                                                    <div className="symptom-side">
                                                        <strong>Left:</strong> {selectedDateSymptoms.breast.swelling.left ? 'Yes' : 'No'}
                                                        {selectedDateSymptoms.breast.swelling.left && (
                                                            <>
                                                                {selectedDateSymptoms.breast.swelling.leftImage ? (
                                                                    <button className="view-image-btn">View Image</button>
                                                                ) : (
                                                                    <span className="no-image">No Image</span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="symptom-side">
                                                        <strong>Right:</strong> {selectedDateSymptoms.breast.swelling.right ? 'Yes' : 'No'}
                                                        {selectedDateSymptoms.breast.swelling.right && (
                                                            <>
                                                                {selectedDateSymptoms.breast.swelling.rightImage ? (
                                                                    <button className="view-image-btn">View Image</button>
                                                                ) : (
                                                                    <span className="no-image">No Image</span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 6. Itching */}
                                            <div className="symptom-category">
                                                <h5>6. Itching</h5>
                                                <div className="symptom-detail">
                                                    <p>{selectedDateSymptoms.breast.itching.length > 0 ? selectedDateSymptoms.breast.itching.join(', ') : 'None'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nipple Symptoms Section */}
                                        <div className="symptom-section">
                                            <h4>Nipple Symptoms</h4>

                                            {/* 1. Inversion */}
                                            <div className="symptom-category">
                                                <h5>1. Inversion</h5>
                                                <div className="symptom-detail">
                                                    <div className="symptom-side">
                                                        <strong>Left:</strong> {selectedDateSymptoms.nipple.inversion.left}
                                                    </div>
                                                    <div className="symptom-side">
                                                        <strong>Right:</strong> {selectedDateSymptoms.nipple.inversion.right}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Discharge */}
                                            <div className="symptom-category">
                                                <h5>2. Discharge</h5>
                                                <div className="symptom-detail">
                                                    <p>
                                                        <strong>Type:</strong> {selectedDateSymptoms.nipple.discharge.type}
                                                        {selectedDateSymptoms.nipple.discharge.type === 'Unusual' &&
                                                            ` (${selectedDateSymptoms.nipple.discharge.details})`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!selectedDateSymptoms && (
                                <div className="no-symptoms-message">
                                    <p>No symptoms recorded for {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalTab;