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
  Popover,
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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
  reactCalendar: {
    width: "100%",
    maxWidth: "400px",
    background: "var(--background-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius)",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "var(--text-primary)",
    "& .react-calendar__navigation": {
      background: "var(--background-secondary)",
      borderBottom: "1px solid var(--border-color)",
      padding: "8px",
      "& button": {
        background: "transparent",
        border: "none",
        color: "var(--text-primary)",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "var(--radius)",
        "&:hover": {
          background: "var(--primary-color)",
          color: "white",
        },
        "&:disabled": {
          color: "var(--text-secondary)",
          cursor: "not-allowed",
        },
      },
    },
    "& .react-calendar__month-view__weekdays": {
      background: "var(--background-secondary)",
      borderBottom: "1px solid var(--border-color)",
      "& abbr": {
        color: "var(--text-secondary)",
        fontSize: "12px",
        fontWeight: "600",
        textDecoration: "none",
        padding: "8px 4px",
        display: "block",
      },
    },
    "& .react-calendar__month-view__days": {
      "& .react-calendar__tile": {
        background: "transparent",
        border: "none",
        color: "var(--text-primary)",
        fontSize: "14px",
        padding: "12px 8px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        "&:hover": {
          background: "var(--primary-color)",
          color: "white",
        },
        "&:disabled": {
          color: "var(--text-secondary)",
          cursor: "not-allowed",
        },
        "&--now": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
        "&--active": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
        "&--rangeStart": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
        "&--rangeEnd": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
        "&--rangeBothEnds": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
        "&--rangeMiddle": {
          background: "rgba(var(--primary-rgb), 0.3)",
          color: "var(--text-primary)",
        },
      },
    },
    "& .react-calendar__year-view__months": {
      "& .react-calendar__tile": {
        background: "transparent",
        border: "none",
        color: "var(--text-primary)",
        fontSize: "14px",
        padding: "16px 8px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        "&:hover": {
          background: "var(--primary-color)",
          color: "white",
        },
        "&--active": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
      },
    },
    "& .react-calendar__decade-view__years": {
      "& .react-calendar__tile": {
        background: "transparent",
        border: "none",
        color: "var(--text-primary)",
        fontSize: "14px",
        padding: "16px 8px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        "&:hover": {
          background: "var(--primary-color)",
          color: "white",
        },
        "&--active": {
          background: "var(--primary-color)",
          color: "white",
          fontWeight: "600",
        },
      },
    },
  },
};

const ActivityLogs = () => {
  // State management
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isDatesModalVisible, setIsDatesModalVisible] = useState(false);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [error, setError] = useState(null);

  // Custom styles for react-calendar
  const calendarStyles = `
    .react-calendar {
      width: 100% !important;
      max-width: 400px !important;
      background: var(--background-primary) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: var(--radius) !important;
      font-family: inherit !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      color: var(--text-primary) !important;
    }
    
    .react-calendar__navigation {
      background: var(--background-secondary) !important;
      border-bottom: 1px solid var(--border-color) !important;
      padding: 8px !important;
    }
    
    .react-calendar__navigation button {
      background: transparent !important;
      border: none !important;
      color: var(--text-primary) !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      padding: 8px 12px !important;
      border-radius: var(--radius) !important;
    }
    
    .react-calendar__navigation button:hover {
      background: var(--primary-color) !important;
      color: white !important;
    }
    
    .react-calendar__navigation button:disabled {
      color: var(--text-secondary) !important;
      cursor: not-allowed !important;
    }
    
    .react-calendar__month-view__weekdays {
      background: var(--background-secondary) !important;
      border-bottom: 1px solid var(--border-color) !important;
    }
    
    .react-calendar__month-view__weekdays abbr {
      color: var(--text-secondary) !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      text-decoration: none !important;
      padding: 8px 4px !important;
      display: block !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile {
      background: transparent !important;
      border: none !important;
      color: var(--text-primary) !important;
      font-size: 14px !important;
      padding: 12px 8px !important;
      cursor: pointer !important;
      border-radius: 4px !important;
      transition: all 0.2s ease !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile:hover {
      background: var(--primary-color) !important;
      color: white !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile:disabled {
      color: var(--text-secondary) !important;
      cursor: not-allowed !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile--now {
      background: var(--primary-color) !important;
      color: white !important;
      font-weight: 600 !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile--active {
      background: var(--primary-color) !important;
      color: white !important;
      font-weight: 600 !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile--rangeStart {
      background: var(--primary-color) !important;
      color: white !important;
      font-weight: 600 !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile--rangeEnd {
      background: var(--primary-color) !important;
      color: white !important;
      font-weight: 600 !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile--rangeBothEnds {
      background: var(--primary-color) !important;
      color: white !important;
      font-weight: 600 !important;
    }
    
    .react-calendar__month-view__days .react-calendar__tile--rangeMiddle {
      background: rgba(var(--primary-rgb), 0.3) !important;
      color: var(--text-primary) !important;
    }
  `;

  // Filter states for main table and statistics
  const [filters, setFilters] = useState({
    userId: "",
    userType: "",
    method: "",
    path: "",
    statusCode: "",
    from: "",
    to: "",
  });

  // Separate filter states for hourly requests chart
  const [hourlyFilters, setHourlyFilters] = useState({
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
      } else {
        setError("Failed to fetch activity logs");
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setError(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch requests per hour data - now uses separate hourly filters
  const fetchRequestsPerHour = async () => {
    try {
      const response = await apiService.AdministratorService.getRequestsPerHour(
        {
          from: hourlyFilters.from,
          to: hourlyFilters.to,
        }
      );

      console.log("Requests Per Hour", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        setHourlyData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching requests per hour:", error);
      // Don't set error for hourly data as it's not critical
    }
  };

  // Fetch statistics - now uses main filters (excludes date range)
  const fetchStats = async () => {
    setIsStatsLoading(true);

    try {
      const response =
        await apiService.AdministratorService.getActivityLogsStats({
          userId: filters.userId,
          userType: filters.userType,
          method: filters.method,
          path: filters.path,
          statusCode: filters.statusCode,
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
  }, [
    currentPage,
    pageSize,
    filters.userId,
    filters.userType,
    filters.method,
    filters.path,
    filters.statusCode,
    filters.from,
    filters.to,
  ]);

  useEffect(() => {
    fetchStats();
  }, [
    filters.userId,
    filters.userType,
    filters.method,
    filters.path,
    filters.statusCode,
  ]);

  // Hourly data updates independently with its own filters
  useEffect(() => {
    fetchRequestsPerHour();
  }, [hourlyFilters.from, hourlyFilters.to]);

  // Load initial hourly data on component mount
  useEffect(() => {
    fetchRequestsPerHour();
  }, []);

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
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Only reset current page for non-date filters
    if (key !== "from" && key !== "to") {
      setCurrentPage(1);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const fromDate = dates[0] ? dates[0].toISOString() : "";
      const toDate = dates[1] ? dates[1].toISOString() : "";
      setFilters((prev) => ({
        ...prev,
        from: fromDate,
        to: toDate,
      }));
    } else {
      setFilters((prev) => ({ ...prev, from: "", to: "" }));
    }
    // Don't reset current page for date range changes
  };

  // Separate handler for hourly date range changes
  const handleHourlyDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const fromDate = dates[0] ? dates[0].toISOString() : "";
      const toDate = dates[1] ? dates[1].toISOString() : "";
      setHourlyFilters((prev) => ({
        ...prev,
        from: fromDate,
        to: toDate,
      }));
    } else {
      setHourlyFilters((prev) => ({ ...prev, from: "", to: "" }));
    }
  };

  // Get current date range display text for main filters
  const getCurrentDateRangeText = () => {
    if (!filters.from && !filters.to) {
      return "All Time";
    }

    const fromDate = filters.from
      ? moment(filters.from).format("DD MMM YYYY")
      : "Start";
    const toDate = filters.to
      ? moment(filters.to).format("DD MMM YYYY")
      : "End";

    return `${fromDate} - ${toDate}`;
  };

  // Get current date range display text for hourly chart
  const getCurrentHourlyDateRangeText = () => {
    if (!hourlyFilters.from && !hourlyFilters.to) {
      return "All Time";
    }

    const fromDate = hourlyFilters.from
      ? moment(hourlyFilters.from).format("DD MMM YYYY")
      : "Start";
    const toDate = hourlyFilters.to
      ? moment(hourlyFilters.to).format("DD MMM YYYY")
      : "End";

    return `${fromDate} - ${toDate}`;
  };

  // Helper function to check if a date range matches current hourly selection
  const isHourlyDateRangeSelected = (startMoment, endMoment) => {
    if (!hourlyFilters.from || !hourlyFilters.to) return false;

    const currentStart = moment(hourlyFilters.from);
    const currentEnd = moment(hourlyFilters.to);

    return (
      currentStart.isSame(startMoment, "day") &&
      currentEnd.isSame(endMoment, "day")
    );
  };

  // Helper function to check if a date range matches current main selection
  const isDateRangeSelected = (startMoment, endMoment) => {
    if (!filters.from || !filters.to) return false;

    const currentStart = moment(filters.from);
    const currentEnd = moment(filters.to);

    return (
      currentStart.isSame(startMoment, "day") &&
      currentEnd.isSame(endMoment, "day")
    );
  };

  // Helper function to get button style based on selection state
  const getQuickButtonStyle = (isSelected) => {
    if (isSelected) {
      return {
        backgroundColor: "var(--primary-color) !important",
        borderColor: "var(--primary-color) !important",
        color: "white !important",
        fontWeight: "600",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      };
    }
    return {
      borderColor: "var(--border-color)",
      color: "var(--text-primary)",
      backgroundColor: "transparent",
      fontWeight: "normal",
    };
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

  const handleClearHourlyFilters = () => {
    setHourlyFilters({
      from: "",
      to: "",
    });
  };

  const handleDateSelect = (dateString) => {
    if (dateString && typeof dateString === "string") {
      // Ensure the date is in the correct format
      const formattedDate = moment(dateString).isValid()
        ? dateString
        : moment().format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
    } else if (dateString === null || dateString === undefined) {
      setSelectedDate(null);
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
      case "GET":
        return "blue";
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "PATCH":
        return "purple";
      case "DELETE":
        return "red";
      default:
        return "default";
    }
  };

  // Get available dates from hourly data
  const getAvailableDates = (data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const dates = new Set();
    data.forEach((item) => {
      if (item._id && item._id.year && item._id.month && item._id.day) {
        const dateStr = `${item._id.year}-${String(item._id.month).padStart(
          2,
          "0"
        )}-${String(item._id.day).padStart(2, "0")}`;
        dates.add(dateStr);
      }
    });

    return Array.from(dates).sort();
  };

  // Format hourly data for display (filtered by selected date)
  const formatHourlyData = (data) => {
    if (!data || !Array.isArray(data) || !selectedDate) {
      return [];
    }

    const selectedDateObj = moment(selectedDate);
    if (!selectedDateObj.isValid()) {
      return [];
    }

    return data
      .filter((item) => {
        if (!item._id || !item._id.year || !item._id.month || !item._id.day) {
          return false;
        }
        const itemDate = moment(
          `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(
            item._id.day
          ).padStart(2, "0")}`
        );
        return itemDate.isValid() && itemDate.isSame(selectedDateObj, "day");
      })
      .map((item) => ({
        key: `${item._id.year}-${item._id.month}-${item._id.day}-${item._id.hour}`,
        date: `${item._id.day}/${item._id.month}/${item._id.year}`,
        hour: `${String(item._id.hour).padStart(2, "0")}:00`,
        requests: item.totalRequests || 0,
        timestamp: new Date(
          item._id.year,
          item._id.month - 1,
          item._id.day,
          item._id.hour || 0
        ),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // Table columns configuration - Show only important columns
  const columns = [
    {
      title: "S.No",
      key: "index",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      align: "center",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      width: 100,
      render: (userType) => (
        <Tag
          color={
            userType === "admin"
              ? "red"
              : userType === "doctor"
              ? "blue"
              : "green"
          }
        >
          {userType?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 80,
      render: (method) => <Tag color={getMethodColor(method)}>{method}</Tag>,
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
        <Tag color={getStatusColor(statusCode)}>{statusCode}</Tag>
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
      align: "center",
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
      <style>{calendarStyles}</style>
      <div style={customStyles.pageContainer} className="premium-scrollbar">
        <div style={customStyles.header}>
          <div style={customStyles.headerContent}>
            <div style={customStyles.headerLeft}>
              <h1 style={customStyles.title}>
                <ClockCircleOutlined
                  style={{ fontSize: "24px", color: "var(--primary-color)" }}
                />
                Activity Logs
              </h1>
              <Text style={customStyles.subtitle}>
                Monitor and track user activities, API requests, and system
                events across the platform
              </Text>
            </div>
            <div style={customStyles.headerRight}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchActivityLogs();
                  fetchRequestsPerHour();
                  fetchStats();
                }}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <BarChartOutlined style={{ color: "var(--primary-color)" }} />
                <span>
                  Requests Per Hour -{" "}
                  {moment(selectedDate).format("DD/MM/YYYY")}
                </span>
              </div>
            }
          >
            {/* Calendar and Chart Layout */}
            <Row gutter={[24, 16]}>
              {/* Date Selection Section */}
              <Col xs={24} md={8}>
                <div
                  style={{
                    padding: "16px",
                    background: "var(--background-secondary)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "150px",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <CalendarOutlined
                      style={{
                        color: "var(--primary-color)",
                        fontSize: "24px",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    />
                    <Text
                      strong
                      style={{ fontSize: "16px", color: "var(--text-primary)" }}
                    >
                      Date Range Selection
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      Current: {getCurrentHourlyDateRangeText()}
                    </Text>
                  </div>

                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => setIsCalendarModalVisible(true)}
                    style={{
                      borderColor: "var(--primary-color)",
                      color: "var(--primary-color)",
                      fontSize: "14px",
                      height: "40px",
                      padding: "0 24px",
                    }}
                    className="btn-premium"
                    size="large"
                  >
                    Select Dates
                  </Button>
                </div>
              </Col>

              {/* Chart Section */}
              <Col xs={24} md={16}>
                {/* Summary Statistics */}
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "16px",
                    background: "var(--background-secondary)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <div style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Total Requests
                        </Text>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "var(--primary-color)",
                            marginTop: "4px",
                          }}
                        >
                          {formatHourlyData(hourlyData).reduce(
                            (sum, item) => sum + item.requests,
                            0
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Average Per Hour
                        </Text>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "var(--success-color)",
                            marginTop: "4px",
                          }}
                        >
                          {formatHourlyData(hourlyData).length > 0
                            ? Math.round(
                                formatHourlyData(hourlyData).reduce(
                                  (sum, item) => sum + item.requests,
                                  0
                                ) / formatHourlyData(hourlyData).length
                              )
                            : 0}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Peak Hour
                        </Text>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "var(--warning-color)",
                            marginTop: "4px",
                          }}
                        >
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
                  <div
                    style={{
                      height: "300px",
                      overflowX: "auto",
                      overflowY: "hidden",
                      padding: "16px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "2px",
                        height: "250px",
                        minWidth: "max-content",
                        padding: "0 16px",
                      }}
                    >
                      {formatHourlyData(hourlyData).map((item) => {
                        const maxRequests = Math.max(
                          ...formatHourlyData(hourlyData).map((d) => d.requests)
                        );
                        const height =
                          maxRequests > 0
                            ? (item.requests / maxRequests) * 200
                            : 0;
                        const isPeak = item.requests === maxRequests;

                        return (
                          <div
                            key={item.key}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              minWidth: "40px",
                              position: "relative",
                            }}
                          >
                            {/* Bar */}
                            <div
                              style={{
                                width: "30px",
                                height: `${height}px`,
                                backgroundColor: isPeak
                                  ? "var(--warning-color)"
                                  : "var(--primary-color)",
                                borderRadius: "4px 4px 0 0",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              title={`${item.date} ${item.hour}: ${item.requests} requests`}
                            />

                            {/* Hour Label */}
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "10px",
                                color: "var(--text-secondary)",
                                whiteSpace: "nowrap",
                                position: "absolute",
                                bottom: "-20px",
                                left: "50%",
                                transform: "translateX(-50%) rotate(-45deg)",
                              }}
                            >
                              {item.hour}
                            </div>

                            {/* Request Count */}
                            <div
                              style={{
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
                                opacity: height > 30 ? 1 : 0,
                              }}
                            >
                              {item.requests}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "300px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--background-secondary)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <Text
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "16px",
                      }}
                    >
                      No data available for{" "}
                      {moment(selectedDate).format("DD/MM/YYYY")}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <BarChartOutlined style={{ color: "var(--primary-color)" }} />
                <span>Requests Per Hour</span>
              </div>
            }
          >
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                background: "var(--background-secondary)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Text
                style={{ color: "var(--text-secondary)", fontSize: "16px" }}
              >
                Please select a date to view hourly request data
              </Text>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card style={customStyles.filtersCard}>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
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
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
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
            </Button>,
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
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  Request Information
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>User ID</div>
                    <div style={customStyles.infoValue}>
                      {selectedLog.userId}
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>User Type</div>
                    <div style={customStyles.infoValue}>
                      <Tag
                        color={
                          selectedLog.userType === "admin"
                            ? "red"
                            : selectedLog.userType === "doctor"
                            ? "blue"
                            : "green"
                        }
                      >
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
                    <div style={customStyles.infoValue}>
                      {selectedLog.responseTime}ms
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Timestamp</div>
                    <div style={customStyles.infoValue}>
                      {moment(selectedLog.timestamp).format(
                        "DD MMM YYYY [at] HH:mm:ss"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div style={customStyles.formSection}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  Request Details
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Path</div>
                    <div
                      style={{
                        ...customStyles.infoValue,
                        wordBreak: "break-all",
                      }}
                    >
                      <Text style={{ color: "var(--primary-color)" }}>
                        {selectedLog.path}
                      </Text>
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
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: "16px",
                      fontSize: "var(--font-size-lg)",
                    }}
                  >
                    Request Body
                  </Text>
                  <div
                    style={{
                      background: "var(--background-secondary)",
                      padding: "16px",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <pre
                      style={{
                        margin: 0,
                        color: "var(--text-primary)",
                        fontSize: "12px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {JSON.stringify(selectedLog.body, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* User Agent */}
              <div style={customStyles.formSection}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  User Agent
                </Text>
                <div
                  style={{
                    background: "var(--background-secondary)",
                    padding: "16px",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <Text
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      wordBreak: "break-all",
                    }}
                  >
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
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
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
            </Button>,
          ]}
          styles={customStyles.modal}
          width={600}
          maskClosable={false}
          destroyOnClose
        >
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: "8px",
              }}
            >
              {getAvailableDates(hourlyData).map((date) => (
                <Tag
                  key={date}
                  color={
                    date === selectedDate ? "var(--primary-color)" : "default"
                  }
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "8px 12px",
                    textAlign: "center",
                    margin: 0,
                  }}
                  onClick={() => {
                    handleDateSelect(date);
                    setIsDatesModalVisible(false);
                  }}
                >
                  {moment(date).format("DD/MM/YYYY")}
                </Tag>
              ))}
            </div>
          </div>
        </Modal>

        {/* Calendar Modal */}
        <Modal
          title={
            <div style={{ padding: "4px 0" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Select Date Range
              </div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Choose your start and end dates using the calendar
              </Text>
            </div>
          }
          open={isCalendarModalVisible}
          onCancel={() => setIsCalendarModalVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsCalendarModalVisible(false)}
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              className="btn-premium"
            >
              Cancel
            </Button>,
            <Button
              key="apply"
              type="primary"
              onClick={() => {
                setIsCalendarModalVisible(false);
              }}
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white",
                borderColor: "var(--primary-color)",
              }}
              className="btn-premium"
            >
              Apply
            </Button>,
          ]}
          styles={customStyles.modal}
          width={900}
          maskClosable={false}
          destroyOnClose
        >
          <div style={{ padding: "24px 0" }}>
            <Row gutter={[32, 24]}>
              {/* React Calendar */}
              <Col xs={24} md={16}>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <Text
                    strong
                    style={{ fontSize: "18px", color: "var(--text-primary)" }}
                  >
                    Select Date Range
                  </Text>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Calendar
                    onChange={(value) => {
                      if (Array.isArray(value) && value.length === 2) {
                        const [startDate, endDate] = value;
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: startDate ? startDate.toISOString() : "",
                          to: endDate ? endDate.toISOString() : "",
                        }));
                      }
                    }}
                    value={[
                      hourlyFilters.from ? new Date(hourlyFilters.from) : null,
                      hourlyFilters.to ? new Date(hourlyFilters.to) : null,
                    ]}
                    selectRange={true}
                    allowPartialRange={false}
                    maxDate={new Date()}
                    minDate={new Date(2020, 0, 1)}
                    showDoubleView={false}
                    showFixedNumberOfWeeks={true}
                    showNeighboringMonth={true}
                    showNavigation={true}
                    showWeekNumbers={false}
                    tileClassName={({ date, view }) => {
                      if (view === "month") {
                        const today = new Date();
                        const isToday =
                          date.toDateString() === today.toDateString();
                        if (isToday) {
                          return "react-calendar__tile--now";
                        }
                      }
                      return null;
                    }}
                    style={customStyles.reactCalendar}
                  />
                </div>
              </Col>

              {/* Quick Selection Panel */}
              <Col xs={24} md={8}>
                <div
                  style={{
                    padding: "16px",
                    background: "var(--background-secondary)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                    height: "fit-content",
                  }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: "16px",
                      fontSize: "16px",
                      color: "var(--text-primary)",
                    }}
                  >
                    Quick Selection
                  </Text>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      block
                      size="middle"
                      onClick={() => {
                        const today = moment().startOf("day");
                        const endOfDay = moment().endOf("day");
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: today.toISOString(),
                          to: endOfDay.toISOString(),
                        }));
                      }}
                      style={getQuickButtonStyle(
                        isHourlyDateRangeSelected(
                          moment().startOf("day"),
                          moment().endOf("day")
                        )
                      )}
                      className="btn-premium"
                    >
                      Today
                    </Button>
                    <Button
                      block
                      size="middle"
                      onClick={() => {
                        const yesterday = moment()
                          .subtract(1, "day")
                          .startOf("day");
                        const endOfYesterday = moment()
                          .subtract(1, "day")
                          .endOf("day");
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: yesterday.toISOString(),
                          to: endOfYesterday.toISOString(),
                        }));
                      }}
                      style={getQuickButtonStyle(
                        isHourlyDateRangeSelected(
                          moment().subtract(1, "day").startOf("day"),
                          moment().subtract(1, "day").endOf("day")
                        )
                      )}
                      className="btn-premium"
                    >
                      Yesterday
                    </Button>
                    <Button
                      block
                      size="middle"
                      onClick={() => {
                        const last7Days = moment()
                          .subtract(6, "day")
                          .startOf("day");
                        const today = moment().endOf("day");
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: last7Days.toISOString(),
                          to: today.toISOString(),
                        }));
                      }}
                      style={getQuickButtonStyle(
                        isHourlyDateRangeSelected(
                          moment().subtract(6, "day").startOf("day"),
                          moment().endOf("day")
                        )
                      )}
                      className="btn-premium"
                    >
                      Last 7 Days
                    </Button>
                    <Button
                      block
                      size="middle"
                      onClick={() => {
                        const last30Days = moment()
                          .subtract(29, "day")
                          .startOf("day");
                        const today = moment().endOf("day");
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: last30Days.toISOString(),
                          to: today.toISOString(),
                        }));
                      }}
                      style={getQuickButtonStyle(
                        isHourlyDateRangeSelected(
                          moment().subtract(29, "day").startOf("day"),
                          moment().endOf("day")
                        )
                      )}
                      className="btn-premium"
                    >
                      Last 30 Days
                    </Button>
                    <Button
                      block
                      size="middle"
                      onClick={() => {
                        const thisMonth = moment().startOf("month");
                        const endOfMonth = moment().endOf("month");
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: thisMonth.toISOString(),
                          to: endOfMonth.toISOString(),
                        }));
                      }}
                      style={getQuickButtonStyle(
                        isHourlyDateRangeSelected(
                          moment().startOf("month"),
                          moment().endOf("month")
                        )
                      )}
                      className="btn-premium"
                    >
                      This Month
                    </Button>
                    <Button
                      block
                      size="middle"
                      onClick={() => {
                        const lastMonth = moment()
                          .subtract(1, "month")
                          .startOf("month");
                        const endOfLastMonth = moment()
                          .subtract(1, "month")
                          .endOf("month");
                        setHourlyFilters((prev) => ({
                          ...prev,
                          from: lastMonth.toISOString(),
                          to: endOfLastMonth.toISOString(),
                        }));
                      }}
                      style={getQuickButtonStyle(
                        isHourlyDateRangeSelected(
                          moment().subtract(1, "month").startOf("month"),
                          moment().subtract(1, "month").endOf("month")
                        )
                      )}
                      className="btn-premium"
                    >
                      Last Month
                    </Button>
                  </Space>

                  {/* Current Selection Display */}
                  <div
                    style={{
                      marginTop: "24px",
                      padding: "16px",
                      background: "var(--background-primary)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        color: "var(--text-primary)",
                      }}
                    >
                      Current Selection:
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {getCurrentHourlyDateRangeText()}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
