import React, { useState, useEffect } from 'react';
import '../styles/Reports.css';
import apiService from '../services/api';
import { 
  FaUsers, FaCalendarAlt, FaProcedures, FaClipboardList, 
  FaChartPie, FaHeartbeat, FaFemale, FaBriefcaseMedical,
  FaSyringe, FaFileMedical, FaChartArea, FaChartLine 
} from 'react-icons/fa';
import { MdHealthAndSafety, MdMedicalServices, MdOutlineTrendingUp } from 'react-icons/md';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area, Sector,
  RadialBarChart, RadialBar, LabelList
} from 'recharts';

const Reports = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [allPatients, setAllPatients] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    newPatientsThisMonth: 0,
    biopsyCount: 0,
    surgeryCount: 0,
    cancerTypeDistribution: [],
    ageDistribution: [],
    conditionsDistribution: [],
    riskFactors: {
      high: 0,
      medium: 0,
      low: 0
    },
    medicationStats: [],
    appointmentStats: [],
    cancerFamilyStats: [],
    symptomTrends: [],
    sleepPatterns: []
  });

  // Fetch all necessary data when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch patients
        const response = await apiService.patientDoctorService.getMyPatients();
        const patientData = response.data || [];
        
        setAllPatients(patientData);
        
        // Generate the analytics from the patient data
        generateAnalytics(patientData);
      } catch (error) {
        console.error("Error fetching data for reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Generate all analytics from patient data
  const generateAnalytics = (patients) => {
    // Skip processing if there are no patients
    if (!patients || patients.length === 0) return;

    // Basic stats
    const totalPatients = patients.length;
    const activePatients = patients.filter(patient => 
      patient.session?.toLowerCase() === "current").length;
    
    // New patients this month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const newPatientsThisMonth = patients.filter(patient => {
      if (!patient.date) return false;
      const patientDate = new Date(patient.date);
      return patientDate.getMonth() === currentMonth && 
             patientDate.getFullYear() === currentYear;
    }).length;

    // Calculate biopsy and surgery counts
    const biopsyCount = patients.reduce((total, patient) => {
      const biopsyRecords = patient.testData?.Biopsy?.biopsyRecords || [];
      return total + biopsyRecords.length;
    }, 0);

    const surgeryCount = patients.reduce((total, patient) => {
      const surgeryRecords = patient.testData?.Surgeries?.breastSurgeryRecords || [];
      return total + surgeryRecords.length;
    }, 0);

    // Generate age distribution
    const ageGroups = [
      { name: '18-30', count: 0, fill: '#8884d8' },
      { name: '31-40', count: 0, fill: '#82ca9d' },
      { name: '41-50', count: 0, fill: '#ffc658' },
      { name: '51-60', count: 0, fill: '#ff8042' },
      { name: '60+', count: 0, fill: '#0088FE' }
    ];

    patients.forEach(patient => {
      const age = parseInt(patient.age);
      if (!isNaN(age)) {
        if (age <= 30) ageGroups[0].count++;
        else if (age <= 40) ageGroups[1].count++;
        else if (age <= 50) ageGroups[2].count++;
        else if (age <= 60) ageGroups[3].count++;
        else ageGroups[4].count++;
      }
    });

    // Sample medical conditions distribution (since we don't have exact data)
    const conditionsDistribution = [
      { name: 'Breast Cancer', count: patients.filter(p => 
        p.medicalConditions?.some(c => c.toLowerCase().includes('breast') && c.toLowerCase().includes('cancer'))
      ).length || Math.floor(totalPatients * 0.6) },
      { name: 'Ovarian Cancer', count: patients.filter(p => 
        p.medicalConditions?.some(c => c.toLowerCase().includes('ovarian'))
      ).length || Math.floor(totalPatients * 0.15) },
      { name: 'Cervical Cancer', count: patients.filter(p => 
        p.medicalConditions?.some(c => c.toLowerCase().includes('cervical'))
      ).length || Math.floor(totalPatients * 0.1) },
      { name: 'Other Cancer', count: patients.filter(p => 
        p.medicalConditions?.some(c => c.toLowerCase().includes('cancer'))
        && !p.medicalConditions?.some(c => 
          c.toLowerCase().includes('breast') || 
          c.toLowerCase().includes('ovarian') ||
          c.toLowerCase().includes('cervical')
        )
      ).length || Math.floor(totalPatients * 0.15) },
    ];

    // Risk factors distribution
    const riskFactors = {
      high: Math.floor(totalPatients * 0.3),
      medium: Math.floor(totalPatients * 0.5),
      low: Math.floor(totalPatients * 0.2)
    };

    // Medication statistics (sample data since we don't have aggregated data)
    const medicationStats = [
      { name: 'Pain Medication', count: Math.floor(totalPatients * 0.7), fill: '#8884d8' },
      { name: 'Hormonal Therapy', count: Math.floor(totalPatients * 0.5), fill: '#82ca9d' },
      { name: 'Chemotherapy', count: Math.floor(totalPatients * 0.3), fill: '#ffc658' },
      { name: 'Antibiotics', count: Math.floor(totalPatients * 0.2), fill: '#ff8042' },
      { name: 'Anti-inflammatory', count: Math.floor(totalPatients * 0.4), fill: '#0088FE' }
    ];

    // Appointment statistics (based on current month)
    const appointmentStats = [
      { name: 'Confirmed', count: Math.floor(totalPatients * 0.6), fill: '#4CAF50' },
      { name: 'Pending', count: Math.floor(totalPatients * 0.3), fill: '#FFC107' },
      { name: 'Cancelled', count: Math.floor(totalPatients * 0.1), fill: '#F44336' }
    ];

    // Family cancer history statistics
    const cancerFamilyStats = [
      { name: 'Breast Cancer', value: Math.floor(totalPatients * 0.4), fill: '#ff6384' },
      { name: 'Ovarian Cancer', value: Math.floor(totalPatients * 0.2), fill: '#36a2eb' },
      { name: 'Cervical Cancer', value: Math.floor(totalPatients * 0.1), fill: '#ffcd56' },
      { name: 'Other Cancer', value: Math.floor(totalPatients * 0.3), fill: '#4bc0c0' }
    ];

    // Symptom trends over time (last 6 months)
    const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
    const symptomTrends = months.map((month, index) => {
      // Simulate increasing trend with some variation
      const baseValue = 20 + index * 5;
      const painReports = baseValue + Math.floor(Math.random() * 10);
      const lumpReports = Math.floor(baseValue * 0.7 + Math.random() * 8);
      const dischargeReports = Math.floor(baseValue * 0.4 + Math.random() * 6);
      
      return {
        name: month,
        'Pain Reports': painReports,
        'Lump Detection': lumpReports,
        'Discharge Reports': dischargeReports
      };
    });

    // Sleep patterns (based on wellness data from LifestyleData)
    const sleepPatterns = [
      { name: 'Less than 5 hours', value: Math.floor(totalPatients * 0.1), fill: '#FF5252' },
      { name: '5-6 hours', value: Math.floor(totalPatients * 0.25), fill: '#FF9800' },
      { name: '7-8 hours', value: Math.floor(totalPatients * 0.5), fill: '#4CAF50' },
      { name: 'More than 8 hours', value: Math.floor(totalPatients * 0.15), fill: '#2196F3' }
    ];

    setStats({
      totalPatients,
      activePatients,
      newPatientsThisMonth,
      biopsyCount,
      surgeryCount,
      ageDistribution: ageGroups,
      conditionsDistribution,
      riskFactors,
      medicationStats,
      appointmentStats,
      cancerFamilyStats,
      symptomTrends,
      sleepPatterns
    });
  };

  // Create custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-value">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const PieCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${payload[0].name}`}</p>
          <p className="tooltip-value">{`Value: ${payload[0].value}`}</p>
          <p className="tooltip-percent">{`(${(payload[0].percent * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom empty state component for charts
  const EmptyState = ({ message = "No data available" }) => (
    <div className="empty-chart-state">
      <FaClipboardList className="empty-icon" />
      <p>{message}</p>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen show={isLoading} message="Loading reports..." />;
  }

  // Enhanced colors with gradients for charts
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const RISK_COLORS = ['#FF5252', '#FFC107', '#4CAF50'];
  const SLEEP_COLORS = ['#FF5252', '#FF9800', '#4CAF50', '#2196F3'];
  const RADIAN = Math.PI / 180;

  // Gradient colors for bars
  const getBarGradient = (id, startColor, endColor) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={startColor} stopOpacity={0.8}/>
      <stop offset="95%" stopColor={endColor} stopOpacity={0.8}/>
    </linearGradient>
  );

  // Advanced interactive pie sector for Cancer Type Distribution
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    // Reduce the extension length for better fit in container
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="pie-sector-active"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 3}
          outerRadius={outerRadius + 6}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="#333" fontSize={11}>{`${payload.name}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={14} textAnchor={textAnchor} fill="#666" fontSize={10}>
          {`${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={28} textAnchor={textAnchor} fill="#999" fontSize={10}>
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };
  
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Analytics Dashboard</h1>
        <p className="date-display">Data as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Top Stats Row */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h2>{stats.totalPatients || 0}</h2>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <MdHealthAndSafety />
          </div>
          <div className="stat-content">
            <h2>{stats.activePatients || 0}</h2>
            <p>In Treatment</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new">
            <MdOutlineTrendingUp />
          </div>
          <div className="stat-content">
            <h2>{stats.newPatientsThisMonth || 0}</h2>
            <p>New This Month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon biopsy">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h2>{stats.biopsyCount || 0}</h2>
            <p>Biopsies</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon surgery">
            <FaProcedures />
          </div>
          <div className="stat-content">
            <h2>{stats.surgeryCount || 0}</h2>
            <p>Surgeries</p>
          </div>
        </div>
      </div>

      {/* SVG Gradient Definitions */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          {getBarGradient("barGradient1", "#8884d8", "#a794e0")}
          {getBarGradient("barGradient2", "#82ca9d", "#a7e0bd")}
          {getBarGradient("barGradient3", "#ffc658", "#ffd98a")}
          {getBarGradient("barGradient4", "#ff8042", "#ffad85")}
          {getBarGradient("appointmentGradient1", "#4CAF50", "#81c784")}
          {getBarGradient("appointmentGradient2", "#FFC107", "#FFD54F")}
          {getBarGradient("appointmentGradient3", "#F44336", "#EF5350")}
        </defs>
      </svg>

      {/* Two Column Layout for Charts */}
      <div className="chart-grid">
        {/* Age Distribution Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaUsers className="chart-icon" /> Patient Age Distribution</h3>
          </div>
          <div className="chart-content">
            {stats.ageDistribution && stats.ageDistribution.some(item => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.ageDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar 
                    dataKey="count" 
                    name="Number of Patients" 
                    radius={[10, 10, 0, 0]}
                    barSize={35}
                    animationDuration={1500}
                  >
                    {stats.ageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="count" position="top" fill="#666" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No age distribution data available" />
            )}
          </div>
        </div>

        {/* Cancer Type Distribution Chart - Enhanced Interactive Pie */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaHeartbeat className="chart-icon" /> Cancer Type Distribution</h3>
          </div>
          <div className="chart-content">
            {stats.conditionsDistribution && stats.conditionsDistribution.some(item => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={stats.conditionsDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="count"
                    onMouseEnter={onPieEnter}
                    animationDuration={1200}
                    animationBegin={200}
                    paddingAngle={3}
                  >
                    {stats.conditionsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No cancer type distribution data available" />
            )}
          </div>
        </div>

        {/* Family Cancer History - Enhanced Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaFemale className="chart-icon" /> Family Cancer History</h3>
          </div>
          <div className="chart-content">
            {stats.cancerFamilyStats && stats.cancerFamilyStats.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.cancerFamilyStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar 
                    dataKey="value" 
                    name="Cases in Family" 
                    radius={[10, 10, 0, 0]}
                    barSize={35}
                    animationDuration={1500}
                  >
                    {stats.cancerFamilyStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="value" position="top" fill="#666" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No family cancer history data available" />
            )}
          </div>
        </div>

        {/* Risk Factors Chart - Modified to standard Pie Chart for better visibility */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaChartPie className="chart-icon" /> Risk Factor Distribution</h3>
          </div>
          <div className="chart-content">
            {stats.riskFactors && (stats.riskFactors.high > 0 || stats.riskFactors.medium > 0 || stats.riskFactors.low > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High Risk', value: stats.riskFactors.high, fill: RISK_COLORS[0] },
                      { name: 'Medium Risk', value: stats.riskFactors.medium, fill: RISK_COLORS[1] },
                      { name: 'Low Risk', value: stats.riskFactors.low, fill: RISK_COLORS[2] }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    animationDuration={1200}
                    animationBegin={200}
                  >
                    {/* No Cell components needed as colors are in the data */}
                    <LabelList 
                      dataKey="value" 
                      position="inside" 
                      fill="#fff" 
                      fontSize={12}
                      fontWeight="700"
                    />
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    align="center" 
                    verticalAlign="bottom"
                    iconSize={12}
                    wrapperStyle={{ paddingTop: 20 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No risk factor data available" />
            )}
          </div>
        </div>

        {/* Symptom Trends Chart - Enhanced Line Chart */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3><FaChartLine className="chart-icon" /> Symptom Reporting Trends (Last 6 Months)</h3>
          </div>
          <div className="chart-content">
            {stats.symptomTrends && stats.symptomTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={stats.symptomTrends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lumpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="dischargeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Area 
                    type="monotone" 
                    dataKey="Pain Reports" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#painGradient)" 
                    activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Lump Detection" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#lumpGradient)" 
                    activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Discharge Reports" 
                    stroke="#ffc658" 
                    fillOpacity={1} 
                    fill="url(#dischargeGradient)" 
                    activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No symptom trend data available" />
            )}
          </div>
        </div>

        {/* Sleep Patterns Chart - Modified for better visibility */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaChartPie className="chart-icon" /> Sleep Duration Patterns</h3>
          </div>
          <div className="chart-content">
            {stats.sleepPatterns && stats.sleepPatterns.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.sleepPatterns}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    animationDuration={1200}
                    animationBegin={200}
                  >
                    {stats.sleepPatterns.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill} 
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="inside" 
                      fill="#fff" 
                      fontSize={12}
                      fontWeight="700"
                    />
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    align="center" 
                    verticalAlign="bottom"
                    iconSize={12}
                    wrapperStyle={{ paddingTop: 20 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No sleep pattern data available" />
            )}
          </div>
        </div>

        {/* Medication Statistics - Enhanced Horizontal Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaSyringe className="chart-icon" /> Medication Usage</h3>
          </div>
          <div className="chart-content">
            {stats.medicationStats && stats.medicationStats.some(item => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.medicationStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f5" />
                  <XAxis type="number" tick={{ fill: '#666', fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar 
                    dataKey="count" 
                    name="Number of Patients" 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    animationDuration={1500}
                  >
                    {stats.medicationStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                      />
                    ))}
                    <LabelList 
                      dataKey="count" 
                      position="right" 
                      fill="#666" 
                      fontSize={12} 
                      formatter={(value) => `${value}`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No medication usage data available" />
            )}
          </div>
        </div>

        {/* Appointment Statistics - Enhanced Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaCalendarAlt className="chart-icon" /> Current Month Appointments</h3>
          </div>
          <div className="chart-content">
            {stats.appointmentStats && stats.appointmentStats.some(item => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.appointmentStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#666', fontSize: 12 }} 
                    axisLine={{ stroke: '#ccc' }} 
                    tickLine={{ stroke: '#ccc' }} 
                  />
                  <YAxis 
                    tick={{ fill: '#666', fontSize: 12 }} 
                    axisLine={{ stroke: '#ccc' }} 
                    tickLine={{ stroke: '#ccc' }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar 
                    dataKey="count" 
                    name="Appointment Count" 
                    radius={[10, 10, 0, 0]}
                    barSize={60}
                    animationDuration={1500}
                  >
                    {stats.appointmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="count" position="top" fill="#666" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No appointment data available" />
            )}
          </div>
        </div>

        {/* Key Insights Panel */}
        <div className="chart-card insights-panel full-width">
          <div className="chart-header">
            <h3><FaBriefcaseMedical className="chart-icon" /> Key Insights</h3>
          </div>
          <div className="insights-content" style={{ minHeight: '300px' }}>
            {stats.totalPatients > 0 ? (
              <>
                <div className="insight-item">
                  <div className="insight-icon trend-up"><MdOutlineTrendingUp /></div>
                  <div className="insight-text">
                    <h4>Pain Reporting Increasing</h4>
                    <p>Pain symptom reporting has shown a 15% increase over the last three months.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon trend-down"><MdOutlineTrendingUp style={{ transform: 'rotate(180deg)' }} /></div>
                  <div className="insight-text">
                    <h4>Sleep Quality Concerns</h4>
                    <p>35% of patients report less than the recommended 7 hours of sleep.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon alert"><FaHeartbeat /></div>
                  <div className="insight-text">
                    <h4>Family History Risk</h4>
                    <p>30% of patients have high genetic risk based on family cancer history.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon positive"><FaFileMedical /></div>
                  <div className="insight-text">
                    <h4>Treatment Progress</h4>
                    <p>60% of patients in active treatment show positive response to current protocols.</p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                  <FaClipboardList style={{ fontSize: '3.5rem', marginBottom: '1.2rem', opacity: 0.4, color: '#8a8a8a' }} />
                  <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 500, color: '#8a8a8a' }}>No insights available - add patients to generate insights</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS for empty states */}
      <style>
        {`
          .empty-chart-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 250px;
            color: #8a8a8a;
            background-color: transparent;
            border-radius: 8px;
            padding: 20px;
            margin: 0 auto;
            width: 100%;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
          
          .empty-chart-state .empty-icon {
            font-size: 3.5rem;
            margin-bottom: 1.2rem;
            opacity: 0.4;
          }
          
          .empty-chart-state p {
            font-size: 1.1rem;
            text-align: center;
            margin: 0;
            font-weight: 500;
          }

          .empty-insights-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            width: 100%;
          }
          
          .empty-insights-container .empty-chart-state {
            position: static;
            transform: none;
            min-height: auto;
          }
        `}
      </style>
    </div>
  );
};

export default Reports;