import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Select,
  Tag,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Alert,
} from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  FilterOutlined,
  UserOutlined,
  ApiOutlined,
  GlobalOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AdminLayout from "../../components/AdminLayout";
import { apiService } from "../../services/api";

const { Text } = Typography;
const { RangePicker } = DatePicker;

// Styles to match BetaPartners.jsx
const customStyles = {
  pageContainer: {
    padding: "var(--spacing-6)",
    minHeight: "100vh",
    color: "var(--text-primary)",
  },
  header: {
    background: "var(--background-secondary)",
    padding: "24px",
    borderRadius: "var(--radius)",
    marginBottom: "var(--spacing-6)",
    border: "1px solid var(--border-color)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "24px",
    fontWeight: "600",
    margin: "0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    margin: "0",
    maxWidth: "600px",
  },
  headerRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  searchSection: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  searchBar: {
    width: "280px",
    ".ant-input": {
      fontSize: "13px",
      background: "var(--background-primary)",
      border: "1px solid var(--border-color)",
      borderRadius: "6px",
      color: "var(--text-primary)",
      height: "36px",
      padding: "8px 12px",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: "var(--primary-color)",
        boxShadow: "none",
      },
      "&:focus": {
        borderColor: "var(--primary-color)",
        boxShadow: "0 0 0 2px rgba(var(--primary-rgb), 0.1)",
      },
    },
    ".ant-input-prefix": {
      marginRight: "8px",
      color: "var(--text-secondary)",
    },
  },
  filterSelect: {
    minWidth: "120px",
    ".ant-select-selector": {
      background: "var(--background-primary) !important",
      border: "1px solid var(--border-color) !important",
      borderRadius: "6px !important",
      height: "36px !important",
      padding: "0 12px !important",
      transition: "all 0.2s ease !important",
      "&:hover": {
        borderColor: "var(--primary-color) !important",
      },
    },
    ".ant-select-selection-item": {
      color: "var(--text-primary)",
      lineHeight: "34px !important",
      fontSize: "13px",
    },
    ".ant-select-arrow": {
      color: "var(--text-secondary)",
      fontSize: "12px",
    },
  },
  table: {
    backgroundColor: "var(--background-primary)",
    borderRadius: "var(--radius)",
    padding: "var(--spacing-4)",
  },
  modal: {
    header: {
      borderBottom: "1px solid var(--border-color)",
      padding: "16px 24px",
      marginBottom: "0",
    },
    body: {
      padding: "24px",
    },
    footer: {
      marginTop: "0",
      borderTop: "1px solid var(--border-color)",
      padding: "16px 24px",
    },
  },
  statsCard: {
    background: "var(--background-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius)",
  },
  formSection: {
    marginBottom: "24px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginBottom: "8px",
  },
  infoValue: {
    color: "var(--text-primary)",
    fontSize: "16px",
  },
  filtersCard: {
    background: "var(--background-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius)",
    marginBottom: "var(--spacing-6)",
  },
};

const ActivityLogs = () => {
  // State management
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isDatesModalVisible, setIsDatesModalVisible] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    userId: "",
    userType: "",
    method: "",
    path: "",
    statusCode: "",
    from: "",
    to: "",
  });

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.AdministratorService.getActivityLogs({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });

      console.log("Activity Logs", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        setLogs(response.data.data.logs);
        setTotalRecords(response.data.data.pagination.totalRecords);

        // Set hourly data if available
        if (response.data.data.totalRequestsPerHour) {
          setHourlyData(response.data.data.totalRequestsPerHour);
        }
      } else {
        setError("Failed to fetch activity logs");
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setError(error.response?.data?.message || "Failed to fetch activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    setIsStatsLoading(true);

    try {
      const response = await apiService.AdministratorService.getActivityLogsStats({
        from: filters.from,
        to: filters.to,
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchActivityLogs();
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchStats();
  }, [filters.from, filters.to]);

  // Set initial selected date when hourly data is loaded
  useEffect(() => {
    if (hourlyData.length > 0 && !selectedDate) {
      const availableDates = getAvailableDates(hourlyData);
      if (availableDates.length > 0) {
        // Set to the most recent date
        setSelectedDate(availableDates[availableDates.length - 1]);
      }
    }
  }, [hourlyData, selectedDate]);

  // Handler functions
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFilters(prev => ({
        ...prev,
        from: dates[0]?.toISOString() || "",
        to: dates[1]?.toISOString() || "",
      }));
    } else {
      setFilters(prev => ({ ...prev, from: "", to: "" }));
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      userId: "",
      userType: "",
      method: "",
      path: "",
      statusCode: "",
      from: "",
      to: "",
    });
    setCurrentPage(1);
  };

  const handleDateSelect = (dateString) => {
    if (dateString && typeof dateString === 'string') {
      setSelectedDate(dateString);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedLog(record);
    setIsDetailsModalVisible(true);
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 300 && statusCode < 400) return "warning";
    if (statusCode >= 400 && statusCode < 500) return "error";
    if (statusCode >= 500) return "error";
    return "default";
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "GET": return "blue";
      case "POST": return "green";
      case "PUT": return "orange";
      case "PATCH": return "purple";
      case "DELETE": return "red";
      default: return "default";
    }
  };

  // Get available dates from hourly data
  const getAvailableDates = (data) => {
    const dates = new Set();
    data.forEach(item => {
      const dateStr = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
      dates.add(dateStr);
    });
    return Array.from(dates).sort();
  };

  // Format hourly data for display (filtered by selected date)
  const formatHourlyData = (data) => {
    const selectedDateObj = moment(selectedDate);

    return data
      .filter(item => {
        const itemDate = moment(`${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`);
        return itemDate.isSame(selectedDateObj, 'day');
      })
      .map(item => ({
        key: `${item._id.year}-${item._id.month}-${item._id.day}-${item._id.hour}`,
        date: `${item._id.day}/${item._id.month}/${item._id.year}`,
        hour: `${item._id.hour}:00`,
        requests: item.totalRequests,
        timestamp: new Date(item._id.year, item._id.month - 1, item._id.day, item._id.hour),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // Table columns configuration - Show only important columns
  const columns = [
    {
      title: "S.No",
      key: "index",
      width: 70,
      render: (_, __, index) => ((currentPage - 1) * pageSize) + index + 1,
      align: 'center'
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      width: 100,
      render: (userType) => (
        <Tag color={userType === "admin" ? "red" : userType === "doctor" ? "blue" : "green"}>
          {userType?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 80,
      render: (method) => (
        <Tag color={getMethodColor(method)}>
          {method}
        </Tag>
      ),
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      render: (path) => (
        <Text style={{ color: "var(--text-primary)", fontSize: "12px" }}>
          {path}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusCode",
      key: "statusCode",
      width: 80,
      render: (statusCode) => (
        <Tag color={getStatusColor(statusCode)}>
          {statusCode}
        </Tag>
      ),
    },
    {
      title: "Time",
      key: "time",
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: "12px" }}>
            {moment(record.timestamp).format("DD MMM HH:mm")}
          </Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined style={{ color: "var(--text-primary)" }} />}
          onClick={() => handleViewDetails(record)}
          style={{
            borderColor: "var(--border-color)",
            background: "transparent",
          }}
          className="btn-premium btn-sm"
          title="View details"
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={customStyles.pageContainer} className="premium-scrollbar">
        <div style={customStyles.header}>
          <div style={customStyles.headerContent}>
            <div style={customStyles.headerLeft}>
              <h1 style={customStyles.title}>
                <ClockCircleOutlined style={{ fontSize: "24px", color: "var(--primary-color)" }} />
                Activity Logs
              </h1>
              <Text style={customStyles.subtitle}>
                Monitor and track user activities, API requests, and system events across the platform
              </Text>
            </div>
            <div style={customStyles.headerRight}>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchActivityLogs}
                loading={isLoading}
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
                className="btn-premium"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={customStyles.statsCard} loading={isStatsLoading}>
              <Statistic
                title="Total Requests"
                value={stats?.totalRequests || 0}
                prefix={<ApiOutlined />}
                valueStyle={{ color: "var(--primary-color)" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={customStyles.statsCard} loading={isStatsLoading}>
              <Statistic
                title="Unique Users"
                value={stats?.uniqueUsers || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: "var(--primary-color)" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={customStyles.statsCard} loading={isStatsLoading}>
              <Statistic
                title="Success Rate"
                value={stats?.statusCodeBreakdown?.[200] || 0}
                suffix={`/ ${stats?.totalRequests || 0}`}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: "var(--success-color)" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={customStyles.statsCard} loading={isStatsLoading}>
              <Statistic
                title="Error Rate"
                value={
                  (stats?.statusCodeBreakdown?.[500] || 0) +
                  (stats?.statusCodeBreakdown?.[400] || 0)
                }
                suffix={`/ ${stats?.totalRequests || 0}`}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: "var(--error-color)" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Hourly Requests Chart */}
        {hourlyData.length > 0 && selectedDate && (
          <Card
            style={{ ...customStyles.statsCard, marginBottom: "24px" }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChartOutlined style={{ color: "var(--primary-color)" }} />
                <span>Requests Per Hour - {moment(selectedDate).format('DD/MM/YYYY')}</span>
              </div>
            }
          >
            {/* Calendar and Chart Layout */}
            <Row gutter={[24, 16]}>
              {/* Calendar Section */}
              <Col xs={24} md={8}>
                <div style={{
                  padding: "16px",
                  background: "var(--background-secondary)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border-color)",
                  height: "fit-content"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <CalendarOutlined style={{ color: "var(--primary-color)" }} />
                    <Text strong>Select Date</Text>
                  </div>

                  <Select
                    value={selectedDate}
                    onChange={handleDateSelect}
                    style={{ width: "100%", marginBottom: "16px" }}
                    size="middle"
                    placeholder="Select a date"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {getAvailableDates(hourlyData).map(date => (
                      <Select.Option key={date} value={date}>
                        {moment(date).format('DD/MM/YYYY')}
                      </Select.Option>
                    ))}
                  </Select>

                  <div style={{ marginTop: "16px" }}>
                    <Text style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", display: "block" }}>
                      Available Dates ({getAvailableDates(hourlyData).length}):
                    </Text>

                    {/* Compact Date Range Display */}
                    {(() => {
                      const availableDates = getAvailableDates(hourlyData);
                      if (availableDates.length <= 7) {
                        // Show all dates if 7 or fewer
                        return (
                          <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            maxHeight: "80px",
                            overflowY: "auto"
                          }}>
                            {availableDates.map(date => (
                              <Tag
                                key={date}
                                color={date === selectedDate ? "var(--primary-color)" : "default"}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "11px",
                                  padding: "2px 6px"
                                }}
                                onClick={() => handleDateSelect(date)}
                              >
                                {moment(date).format('DD/MM/YYYY')}
                              </Tag>
                            ))}
                          </div>
                        );
                      } else {
                        // Show date range and recent dates for many dates
                        const sortedDates = availableDates.sort();
                        const firstDate = sortedDates[0];
                        const lastDate = sortedDates[sortedDates.length - 1];
                        const recentDates = sortedDates.slice(-5); // Last 5 dates

                        return (
                          <div style={{ fontSize: "11px" }}>
                            <div style={{
                              marginBottom: "8px",
                              padding: "6px",
                              background: "var(--background-primary)",
                              borderRadius: "4px",
                              border: "1px solid var(--border-color)"
                            }}>
                              <Text style={{ color: "var(--text-secondary)" }}>
                                Range: {moment(firstDate).format('DD/MM/YYYY')} - {moment(lastDate).format('DD/MM/YYYY')}
                              </Text>
                            </div>

                            <div style={{ marginBottom: "8px" }}>
                              <Text style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                                Recent Dates:
                              </Text>
                            </div>

                            <div style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "3px",
                              maxHeight: "60px",
                              overflowY: "auto"
                            }}>
                              {recentDates.map(date => (
                                <Tag
                                  key={date}
                                  color={date === selectedDate ? "var(--primary-color)" : "default"}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "10px",
                                    padding: "1px 4px"
                                  }}
                                  onClick={() => handleDateSelect(date)}
                                >
                                  {moment(date).format('DD/MM/YYYY')}
                                </Tag>
                              ))}
                            </div>

                            <div style={{
                              marginTop: "8px",
                              padding: "4px 8px",
                              background: "var(--background-primary)",
                              borderRadius: "4px",
                              border: "1px solid var(--border-color)",
                              textAlign: "center",
                              cursor: "pointer"
                            }}
                              onClick={() => setIsDatesModalVisible(true)}
                            >
                              <Text style={{ color: "var(--primary-color)", fontSize: "10px" }}>
                                View All {availableDates.length} Dates
                              </Text>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </Col>

              {/* Chart Section */}
              <Col xs={24} md={16}>
                {/* Summary Statistics */}
                <div style={{ marginBottom: "16px", padding: "16px", background: "var(--background-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border-color)" }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <div style={{ textAlign: "center" }}>
                        <Text style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Total Requests</Text>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary-color)", marginTop: "4px" }}>
                          {formatHourlyData(hourlyData).reduce((sum, item) => sum + item.requests, 0)}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ textAlign: "center" }}>
                        <Text style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Average Per Hour</Text>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--success-color)", marginTop: "4px" }}>
                          {formatHourlyData(hourlyData).length > 0
                            ? Math.round(formatHourlyData(hourlyData).reduce((sum, item) => sum + item.requests, 0) / formatHourlyData(hourlyData).length)
                            : 0
                          }
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ textAlign: "center" }}>
                        <Text style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Peak Hour</Text>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--warning-color)", marginTop: "4px" }}>
                          {(() => {
                            const filteredData = formatHourlyData(hourlyData);
                            if (filteredData.length === 0) return "No data";
                            const peakHour = filteredData.reduce((max, item) =>
                              item.requests > max.requests ? item : max
                            );
                            return `${peakHour.hour} (${peakHour.requests})`;
                          })()}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Compact Chart Visualization */}
                {formatHourlyData(hourlyData).length > 0 ? (
                  <div style={{
                    height: "300px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    padding: "16px 0"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "2px",
                      height: "250px",
                      minWidth: "max-content",
                      padding: "0 16px"
                    }}>
                      {formatHourlyData(hourlyData).map((item) => {
                        const maxRequests = Math.max(...formatHourlyData(hourlyData).map(d => d.requests));
                        const height = maxRequests > 0 ? (item.requests / maxRequests) * 200 : 0;
                        const isPeak = item.requests === maxRequests;

                        return (
                          <div
                            key={item.key}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              minWidth: "40px",
                              position: "relative"
                            }}
                          >
                            {/* Bar */}
                            <div
                              style={{
                                width: "30px",
                                height: `${height}px`,
                                backgroundColor: isPeak ? "var(--warning-color)" : "var(--primary-color)",
                                borderRadius: "4px 4px 0 0",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                position: "relative"
                              }}
                              title={`${item.date} ${item.hour}: ${item.requests} requests`}
                            />

                            {/* Hour Label */}
                            <div style={{
                              marginTop: "8px",
                              fontSize: "10px",
                              color: "var(--text-secondary)",
                              whiteSpace: "nowrap",
                              position: "absolute",
                              bottom: "-20px",
                              left: "50%",
                              transform: "translateX(-50%) rotate(-45deg)"
                            }}>
                              {item.hour}
                            </div>

                            {/* Request Count */}
                            <div style={{
                              position: "absolute",
                              top: `${Math.max(height - 20, 0)}px`,
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: "10px",
                              color: "var(--text-primary)",
                              fontWeight: "600",
                              backgroundColor: "var(--background-primary)",
                              padding: "2px 4px",
                              borderRadius: "2px",
                              border: "1px solid var(--border-color)",
                              opacity: height > 30 ? 1 : 0
                            }}>
                              {item.requests}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--background-secondary)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)"
                  }}>
                    <Text style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                      No data available for {moment(selectedDate).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        )}

        {/* No Date Selected Message */}
        {hourlyData.length > 0 && !selectedDate && (
          <Card
            style={{ ...customStyles.statsCard, marginBottom: "24px" }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChartOutlined style={{ color: "var(--primary-color)" }} />
                <span>Requests Per Hour</span>
              </div>
            }
          >
            <div style={{
              padding: "40px",
              textAlign: "center",
              background: "var(--background-secondary)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-color)"
            }}>
              <Text style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Please select a date to view hourly request data
              </Text>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card style={customStyles.filtersCard}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            {/* <Input
              placeholder="User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
              style={{ width: "150px" }}
              size="middle"
            /> */}
            <Select
              placeholder="User Type"
              value={filters.userType}
              onChange={(value) => handleFilterChange("userType", value)}
              style={{ width: "120px" }}
              size="middle"
              allowClear
              options={[
                { value: "admin", label: "Admin" },
                { value: "doctor", label: "Doctor" },
                { value: "patient", label: "Patient" },
              ]}
            />
            <Select
              placeholder="Method"
              value={filters.method}
              onChange={(value) => handleFilterChange("method", value)}
              style={{ width: "100px" }}
              size="middle"
              allowClear
              options={[
                { value: "GET", label: "GET" },
                { value: "POST", label: "POST" },
                { value: "PUT", label: "PUT" },
                { value: "PATCH", label: "PATCH" },
                { value: "DELETE", label: "DELETE" },
              ]}
            />
            <Input
              placeholder="Path"
              value={filters.path}
              onChange={(e) => handleFilterChange("path", e.target.value)}
              style={{ width: "200px" }}
              size="middle"
            />
            <Input
              placeholder="Status Code"
              value={filters.statusCode}
              onChange={(e) => handleFilterChange("statusCode", e.target.value)}
              style={{ width: "100px" }}
              size="middle"
            />
            <RangePicker
              onChange={handleDateRangeChange}
              size="middle"
              placeholder={["From Date", "To Date"]}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={handleClearFilters}
              size="middle"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              className="btn-premium"
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: "16px" }}
          />
        )}

        {/* Table */}
        <div style={customStyles.table}>
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
            className="premium-table-responsive"
            loading={isLoading}
            scroll={{ x: 800 }}
          />
        </div>

        {/* Details Modal */}
        <Modal
          title={
            <div style={{ padding: "4px 0" }}>
              <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                Activity Details
              </div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Detailed information about the API request
              </Text>
            </div>
          }
          open={isDetailsModalVisible}
          onCancel={() => setIsDetailsModalVisible(false)}
          footer={[
            <Button
              key="close"
              onClick={() => setIsDetailsModalVisible(false)}
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              className="btn-premium"
            >
              Close
            </Button>
          ]}
          styles={customStyles.modal}
          width={900}
          maskClosable={false}
          destroyOnClose
        >
          {selectedLog && (
            <div>
              {/* Basic Information */}
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                  Request Information
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>User ID</div>
                    <div style={customStyles.infoValue}>{selectedLog.userId}</div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>User Type</div>
                    <div style={customStyles.infoValue}>
                      <Tag color={selectedLog.userType === "admin" ? "red" : selectedLog.userType === "doctor" ? "blue" : "green"}>
                        {selectedLog.userType?.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>HTTP Method</div>
                    <div style={customStyles.infoValue}>
                      <Tag color={getMethodColor(selectedLog.method)}>
                        {selectedLog.method}
                      </Tag>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Status Code</div>
                    <div style={customStyles.infoValue}>
                      <Tag color={getStatusColor(selectedLog.statusCode)}>
                        {selectedLog.statusCode}
                      </Tag>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Response Time</div>
                    <div style={customStyles.infoValue}>{selectedLog.responseTime}ms</div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Timestamp</div>
                    <div style={customStyles.infoValue}>
                      {moment(selectedLog.timestamp).format("DD MMM YYYY [at] HH:mm:ss")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                  Request Details
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Path</div>
                    <div style={{ ...customStyles.infoValue, wordBreak: "break-all" }}>
                      <Text style={{ color: "var(--primary-color)" }}>{selectedLog.path}</Text>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>IP Address</div>
                    <div style={customStyles.infoValue}>{selectedLog.ip}</div>
                  </div>
                </div>
              </div>

              {/* Request Body */}
              {selectedLog.body && (
                <div style={customStyles.formSection}>
                  <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                    Request Body
                  </Text>
                  <div style={{
                    background: "var(--background-secondary)",
                    padding: "16px",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                  }}>
                    <pre style={{
                      margin: 0,
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}>
                      {JSON.stringify(selectedLog.body, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* User Agent */}
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                  User Agent
                </Text>
                <div style={{
                  background: "var(--background-secondary)",
                  padding: "16px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border-color)",
                }}>
                  <Text style={{ color: "var(--text-primary)", fontSize: "12px", wordBreak: "break-all" }}>
                    {selectedLog.userAgent}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* All Dates Modal */}
        <Modal
          title={
            <div style={{ padding: "4px 0" }}>
              <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                All Available Dates
              </div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Click on any date to select it
              </Text>
            </div>
          }
          open={isDatesModalVisible}
          onCancel={() => setIsDatesModalVisible(false)}
          footer={[
            <Button
              key="close"
              onClick={() => setIsDatesModalVisible(false)}
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              className="btn-premium"
            >
              Close
            </Button>
          ]}
          styles={customStyles.modal}
          width={600}
          maskClosable={false}
          destroyOnClose
        >
          <div style={{
            maxHeight: "400px",
            overflowY: "auto",
            padding: "16px 0"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: "8px"
            }}>
              {getAvailableDates(hourlyData).map(date => (
                <Tag
                  key={date}
                  color={date === selectedDate ? "var(--primary-color)" : "default"}
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "8px 12px",
                    textAlign: "center",
                    margin: 0
                  }}
                  onClick={() => {
                    handleDateSelect(date);
                    setIsDatesModalVisible(false);
                  }}
                >
                  {moment(date).format('DD/MM/YYYY')}
                </Tag>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;