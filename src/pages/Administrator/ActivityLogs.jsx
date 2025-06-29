import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Select,
  Tag,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AdminLayout from "../../components/AdminLayout";

const { Text } = Typography;

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
  map: {
    width: "100%",
    height: "400px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border-color)",
    marginTop: "16px",
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
};

// Dummy data for activity logs
const dummyData = [
  {
    id: 1,
    username: "dr.johndoe",
    timestamp: "2025-05-18T10:30:00",
    deviceName: "iPhone 13 Pro",
    browserInfo: "Safari 17.0 / iOS 17",
    location: {
      city: "Mumbai",
      country: "India",
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    action: "Login",
    url: "/dashboard",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  },
  {
    id: 2,
    username: "dr.sarahsmith",
    timestamp: "2025-05-18T10:35:00",
    deviceName: "Windows PC",
    browserInfo: "Chrome 120.0 / Windows 11",
    location: {
      city: "Delhi",
      country: "India",
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    action: "View Patient Profile",
    url: "/patients/123",
    userAgent: "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  },
  {
    id: 3,
    username: "dr.rajeshverma",
    timestamp: "2025-05-18T11:00:00",
    deviceName: "MacBook Pro",
    browserInfo: "Firefox 120.0 / macOS 14",
    location: {
      city: "Bangalore",
      country: "India",
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    action: "Update Settings",
    url: "/settings",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Firefox/120.0"
  }
];

const ActivityLogs = () => {
  // State management
  const [data, setData] = useState(dummyData);
  const [filteredData, setFilteredData] = useState(dummyData);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentTimeFilter, setCurrentTimeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // Handler functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterLogs(value, currentTimeFilter);
    setCurrentPage(1);
  };

  const handleTimeFilterChange = (filter) => {
    setCurrentTimeFilter(filter);
    filterLogs(searchText, filter);
    setCurrentPage(1);
  };

  const filterLogs = (text, timeFilter) => {
    let filtered = [...data];

    // Text search
    if (text) {
      const searchLower = text.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.deviceName.toLowerCase().includes(searchLower) ||
          log.browserInfo.toLowerCase().includes(searchLower) ||
          log.location.city.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower)
      );
    }    // Time filter
    if (timeFilter !== "all") {
      const now = moment();
      const startOfDay = now.clone().startOf('day');
      filtered = filtered.filter((log) => {
        const logTime = moment(log.timestamp);
        switch (timeFilter) {
          case "today":
            return logTime.isSameOrAfter(startOfDay);
          case "week":
            return logTime.isSameOrAfter(startOfDay.clone().subtract(7, "days"));
          case "month":
            return logTime.isSameOrAfter(startOfDay.clone().subtract(30, "days"));
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
  };

  const handleViewMap = (location) => {
    setSelectedLocation(location);
    setIsMapModalVisible(true);
  };

  const handleViewDetails = (record) => {
    setSelectedLog(record);
    setIsDetailsModalVisible(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: "S.No",
      key: "index",
      width: 70,
      render: (_, __, index) => ((currentPage - 1) * 10) + index + 1,
      align: 'center'
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (username) => (
        <Text style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          {username}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color="blue">{record.action}</Tag>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            on {record.url.replace("/", "")}
          </Text>
        </Space>
      ),
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) => (
        <Space>
          <ClockCircleOutlined style={{ color: "var(--text-secondary)" }} />
          <Text>{moment(record.timestamp).format("DD MMM YYYY [at] HH:mm")}</Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
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
                Monitor and track user activities, system events, and security logs across the platform
              </Text>
            </div>
            <div style={customStyles.headerRight}>
              <div style={customStyles.searchSection}>
                <Input
                  placeholder="Search activities..."
                  prefix={<SearchOutlined style={{ color: "var(--text-secondary)", fontSize: "16px" }} />}
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchText}
                  style={customStyles.searchBar}
                  size="large"
                />
                <Select
                  defaultValue="all"
                  onChange={handleTimeFilterChange}
                  style={customStyles.filterSelect}
                  size="large"
                  options={[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "Last Week" },
                    { value: "month", label: "Last Month" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={customStyles.table}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: 10,
              onChange: handlePageChange,
              showSizeChanger: false
            }}
            className="premium-table-responsive"
            loading={isLoading}
          />
        </div>

        <Modal
          title="Location Details"
          open={isMapModalVisible}
          onCancel={() => setIsMapModalVisible(false)}
          footer={null}
          width={800}
          styles={customStyles.modal}
        >
          {selectedLocation && (
            <div>
              <Text strong>
                {selectedLocation.city}, {selectedLocation.country}
              </Text>
              <div style={customStyles.map}>
                {/* Here you would integrate your map component */}
                <iframe
                  title="location-map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}&zoom=15`}
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title={
            <div style={{ padding: "4px 0" }}>
              <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                Activity Details
              </div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Detailed information about the activity
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
          width={800}
          maskClosable={false}
          destroyOnClose
        >
          {selectedLog && (
            <div>
              {/* Basic Information */}
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                  Basic Information
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Username</div>
                    <div style={customStyles.infoValue}>{selectedLog.username}</div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Action</div>
                    <div style={customStyles.infoValue}>
                      <Tag color="blue">{selectedLog.action}</Tag>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Time</div>
                    <div style={customStyles.infoValue}>
                      {moment(selectedLog.timestamp).format("DD MMM YYYY [at] HH:mm")}
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>URL</div>
                    <div style={customStyles.infoValue}>
                      <Text style={{ color: "var(--primary-color)" }}>{selectedLog.url}</Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                  Device Information
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Device</div>
                    <div style={customStyles.infoValue}>{selectedLog.deviceName}</div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Browser</div>
                    <div style={customStyles.infoValue}>{selectedLog.browserInfo}</div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Location</div>
                    <div style={customStyles.infoValue}>
                      {`${selectedLog.location.city}, ${selectedLog.location.country}`}
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>User Agent</div>
                    <div style={{ ...customStyles.infoValue, wordBreak: "break-all" }}>
                      {selectedLog.userAgent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map View */}
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "var(--font-size-lg)" }}>
                  Location Map
                </Text>
                <div style={customStyles.map}>
                  <iframe
                    title="location-map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${selectedLog.location.coordinates.lat},${selectedLog.location.coordinates.lng}&zoom=15`}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;