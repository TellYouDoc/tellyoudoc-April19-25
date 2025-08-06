import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Tag,
  Select,
  message,
  Popconfirm,
  Typography,
  Space,
  Empty,
} from "antd";
import {
  DisconnectOutlined,
  ReloadOutlined,
  UserOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import { apiService } from "../../services/api.jsx";
import "../../styles/Administrator/AdminDashboard.css";
import "../../styles/Administrator/Websocket.css";

const { Text } = Typography;
const { Option } = Select;

const customStyles = {
  pageContainer: {
    padding: "var(--spacing-6)",
    minHeight: "100vh",
    color: "var(--text-primary)",
    backgroundColor: "#f8f9fd",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-6)",
    padding: "0 4px",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  headerRight: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "var(--font-size-2xl)",
    fontWeight: "600",
    margin: "0",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-sm)",
    margin: "0",
  },
  dashboardCards: {
    display: "flex",
    gap: "24px",
    marginBottom: "32px",
    width: "100%",
  },
  statusSection: {
    width: "340px",
    flexShrink: 0,
  },
  statusCard: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    padding: "28px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    position: "relative",
    overflow: "hidden",
  },
  analyticsSection: {
    flex: 1,
  },
  analyticsContainer: {
    background: "#667eea",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    padding: "28px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    position: "relative",
    overflow: "hidden",
    height: "auto",
    minHeight: "200px",
  },
  dashboardCard: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    padding: "28px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    position: "relative",
    overflow: "hidden",
  },
  dashboardCardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
  },
  cardIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "white",
    flexShrink: 0,
    background: "var(--primary-color)",
    boxShadow: "0 4px 12px rgba(14, 159, 110, 0.25)",
  },
  cardContent: {
    flex: 1,
    height: 120,
  },
  statusList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  statusItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  statusLabel: {
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
  statusValue: {
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  analyticsCard: {
    background: "#667eea",
  },
  analyticsCardIcon: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
  },
  table: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "24px 28px 16px",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafbfc",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: "0 0 12px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tableFilters: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterLabel: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: "500",
  },
  tableBody: {
    // marginTop: "24px",
    padding: "10px",
  },
  actionButton: {
    borderRadius: "8px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  refreshButton: {
    background: "white",
    borderColor: "#e5e7eb",
    color: "var(--text-primary)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  primaryButton: {
    background: "var(--primary-color)",
    borderColor: "var(--primary-color)",
    color: "white",
    boxShadow: "0 2px 4px rgba(14, 159, 110, 0.2)",
  },
};

function Websocket() {
  // State for WebSocket status
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState(null);

  // State for connections
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [connectionsError, setConnectionsError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [userType, setUserType] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // State for analytics
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("24h");

  // State for actions
  const [reminderLoading, setReminderLoading] = useState(false);
  const [disconnectingUserId, setDisconnectingUserId] = useState(null);

  // Fetch WebSocket status
  const fetchStatus = () => {
    setStatusLoading(true);
    setStatusError(null);
    apiService.AdministratorService.getWebSocketStatus()
      .then((res) => setStatus(res.data.data))
      .catch((err) =>
        setStatusError(err?.response?.data?.error || "Failed to fetch status")
      )
      .finally(() => setStatusLoading(false));
  };
  useEffect(fetchStatus, []);

  // Fetch WebSocket connections
  const fetchConnections = () => {
    setConnectionsLoading(true);
    setConnectionsError(null);
    apiService.AdministratorService.getWebSocketConnections({
      page,
      limit,
      userType: userType || undefined,
    })
      .then((res) => {
        setConnections(res.data.data.connections);
        setPagination(res.data.data.pagination);
      })
      .catch((err) =>
        setConnectionsError(
          err?.response?.data?.error || "Failed to fetch connections"
        )
      )
      .finally(() => setConnectionsLoading(false));
  };
  useEffect(fetchConnections, [page, limit, userType]);

  // Fetch analytics
  const fetchAnalytics = () => {
    setAnalyticsLoading(true);
    apiService.AdministratorService.getWebSocketAnalytics({
      timeframe: analyticsTimeframe,
    })
      .then((res) => setAnalytics(res.data.data))
      .catch(() => setAnalytics(null))
      .finally(() => setAnalyticsLoading(false));
  };
  useEffect(fetchAnalytics, [analyticsTimeframe]);

  // Handlers for pagination and filter
  const handlePageChange = (newPage) => setPage(newPage);
  const handleUserTypeChange = (value) => {
    setUserType(value);
    setPage(1);
  };
  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  // Disconnect user
  const handleDisconnect = (userId) => {
    setDisconnectingUserId(userId);
    apiService.AdministratorService.disconnectWebSocketUser(userId)
      .then((res) => {
        message.success(res.data.message || "User disconnected");
        fetchConnections();
        fetchStatus();
      })
      .catch((err) => {
        message.error(
          err?.response?.data?.error || "Failed to disconnect user"
        );
      })
      .finally(() => setDisconnectingUserId(null));
  };

  // Send registration reminders
  const handleSendReminders = () => {
    setReminderLoading(true);
    apiService.AdministratorService.sendWebSocketRegistrationReminders()
      .then((res) => {
        message.success(res.data.message || "Reminders sent");
        fetchStatus();
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "Failed to send reminders");
      })
      .finally(() => setReminderLoading(false));
  };

  // Table columns
  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 120,
      render: (id) =>
        id ? (
          <Tag icon={<UserOutlined />} color="blue" className="connection-tag">
            {id}
          </Tag>
        ) : (
          <Tag color="default" className="connection-tag">
            Anonymous
          </Tag>
        ),
    },
    {
      title: "Socket ID",
      dataIndex: "socketId",
      key: "socketId",
      width: 180,
      render: (id) => (
        <Text code className="socket-id">
          {id}
        </Text>
      ),
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      width: 120,
      render: (type) =>
        type ? (
          <Tag
            color={type === "doctor" ? "cyan" : "green"}
            icon={<TeamOutlined />}
            className="connection-tag"
            style={{ textTransform: "capitalize" }}
          >
            {type}
          </Tag>
        ) : (
          <Tag color="default" className="connection-tag">
            Unknown
          </Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "connected",
      key: "connected",
      width: 100,
      render: (val) => (
        <Tag
          color={val ? "green" : "red"}
          className="connection-tag"
          style={{ minWidth: "70px", textAlign: "center" }}
        >
          {val ? "Online" : "Offline"}
        </Tag>
      ),
    },
    {
      title: "Connected At",
      dataIndex: "connectedAt",
      key: "connectedAt",
      width: 160,
      render: (date) =>
        date ? (
          <div style={{ fontSize: "13px" }}>
            <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>
              {new Date(date).toLocaleDateString()}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              {new Date(date).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Disconnect User?"
          description="Are you sure you want to disconnect this user from WebSocket?"
          onConfirm={() => handleDisconnect(record.userId)}
          okButtonProps={{
            loading: disconnectingUserId === record.userId,
            style: { background: "#ef4444", borderColor: "#ef4444" },
          }}
          disabled={!record.connected}
          okText="Disconnect"
          cancelText="Cancel"
        >
          <Button
            type="primary"
            danger
            icon={<DisconnectOutlined />}
            size="small"
            loading={disconnectingUserId === record.userId}
            disabled={!record.connected}
            style={{
              ...customStyles.actionButton,
              opacity: record.connected ? 1 : 0.5,
              cursor: record.connected ? "pointer" : "not-allowed",
            }}
          >
            Disconnect
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div
        style={customStyles.pageContainer}
        className="admin-dashboard-content"
      >
        <div style={customStyles.header} className="admin-dashboard-header">
          <div style={customStyles.headerLeft}>
            <h3 style={customStyles.title}>WebSocket Monitoring</h3>
            <Text style={customStyles.subtitle}>
              Monitor and manage WebSocket connections, analytics, and actions.
            </Text>
          </div>
          <div style={customStyles.headerRight}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchStatus();
                fetchConnections();
                fetchAnalytics();
              }}
              className="refresh-btn"
              style={customStyles.refreshButton}
            >
              Refresh
            </Button>
            {/* <Button
              icon={<ThunderboltOutlined />}
              type="primary"
              loading={reminderLoading}
              onClick={handleSendReminders}
              className="primary-action-btn"
              style={customStyles.primaryButton}
            >
              Send Registration Reminders
            </Button> */}
          </div>
        </div>

        {/* Dashboard Layout */}
        <div
          style={customStyles.dashboardCards}
          className="websocket-dashboard-flex"
        >
          {/* Status Section - Left Side */}
          <div
            style={customStyles.statusSection}
            className="websocket-status-section"
          >
            <div className="websocket-card" style={customStyles.statusCard}>
              <div style={customStyles.cardHeader}>
                <div style={customStyles.cardContent}>
                  <h3 style={customStyles.cardTitle}>WebSocket Status</h3>
                  {statusLoading ? (
                    <Text>Loading status information...</Text>
                  ) : statusError ? (
                    <Text type="danger">{statusError}</Text>
                  ) : (
                    status && (
                      <ul style={customStyles.statusList}>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>
                            Initialized:
                          </span>
                          <Tag
                            color={status.initialized ? "green" : "red"}
                            className="connection-tag"
                          >
                            {status.initialized ? "Yes" : "No"}
                          </Tag>
                        </li>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>
                            Service Status:
                          </span>
                          <Tag
                            color={status.enabled ? "green" : "red"}
                            className="connection-tag"
                          >
                            {status.enabled ? "Active" : "Inactive"}
                          </Tag>
                        </li>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>
                            Feature Status:
                          </span>
                          <Tag
                            color={status.featureEnabled ? "green" : "orange"}
                            className="connection-tag"
                          >
                            {status.featureEnabled ? "Enabled" : "Disabled"}
                          </Tag>
                        </li>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>
                            Connected Users:
                          </span>
                          <span style={customStyles.statusValue}>
                            {status.connectedUsers}
                          </span>
                        </li>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>
                            Total Sockets:
                          </span>
                          <span style={customStyles.statusValue}>
                            {status.totalSockets}
                          </span>
                        </li>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>
                            Unregistered Sockets:
                          </span>
                          <span style={customStyles.statusValue}>
                            {status.unregisteredSockets}
                          </span>
                        </li>
                        <li style={customStyles.statusItem}>
                          <span style={customStyles.statusLabel}>Uptime:</span>
                          <span style={customStyles.statusValue}>
                            {Math.floor(status.uptime / 1000)}s
                          </span>
                        </li>
                      </ul>
                    )
                  )}
                </div>
                <div style={customStyles.cardIcon}>
                  <ThunderboltOutlined />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section - Right Side */}
          <div style={customStyles.analyticsSection}>
            <div
              className="websocket-card"
              style={customStyles.analyticsContainer}
            >
              <div style={customStyles.cardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ ...customStyles.cardTitle, color: "white" }}>
                    Analytics Dashboard
                  </h3>
                  <div style={{ marginBottom: 16 }}>
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "14px",
                        marginRight: "12px",
                      }}
                    >
                      Timeframe:
                    </span>
                    <Select
                      value={analyticsTimeframe}
                      onChange={setAnalyticsTimeframe}
                      style={{ width: 100 }}
                      size="small"
                    >
                      <Option value="1h">1h</Option>
                      <Option value="6h">6h</Option>
                      <Option value="24h">24h</Option>
                      <Option value="7d">7d</Option>
                    </Select>
                  </div>
                </div>
                {analyticsLoading ? (
                  <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Loading analytics...
                  </Text>
                ) : analytics ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        minWidth: "90px",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "11px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        Current Connections
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {analytics.summary?.currentConnections}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        minWidth: "90px",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "11px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        Peak Connections
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {analytics.summary?.peakConnections}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        minWidth: "90px",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "11px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        Total Messages
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {analytics.summary?.totalMessages}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        minWidth: "90px",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "11px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        Active Users
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {analytics.summary?.activeUsers}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        minWidth: "90px",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "11px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        Doctors
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {analytics.breakdown?.byUserType?.doctor}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        minWidth: "90px",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "11px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        Patients
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {analytics.breakdown?.byUserType?.patient}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    No analytics data available.
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Connections Table */}
        <div style={customStyles.table}>
          <div style={customStyles.tableHeader}>
            <h3 style={customStyles.tableTitle}>
              <TeamOutlined /> WebSocket Connections
            </h3>
            <div style={customStyles.tableFilters}>
              <span style={customStyles.filterLabel}>User Type:</span>
              <Select
                value={userType}
                onChange={handleUserTypeChange}
                style={{ width: 140 }}
                allowClear
                placeholder="All Types"
                size="middle"
              >
                <Option value="doctor">Doctor</Option>
                <Option value="patient">Patient</Option>
              </Select>
              <span style={customStyles.filterLabel}>Per Page:</span>
              <Select
                value={limit}
                onChange={handleLimitChange}
                style={{ width: 80 }}
                size="middle"
              >
                {[10, 20, 50, 100].map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div style={customStyles.tableBody}>
            <Table
              columns={columns}
              dataSource={connections}
              rowKey="socketId"
              loading={connectionsLoading}
              pagination={{
                pageSize: limit,
                current: page,
                onChange: handlePageChange,
                total: pagination.total,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} connections`,
                style: { marginTop: "16px" },
              }}
              size="middle"
              locale={{
                emptyText: connectionsError ? (
                  <Text type="danger">{connectionsError}</Text>
                ) : (
                  <Empty description="No connections found" />
                ),
              }}
              rowClassName={(record, index) =>
                record.connected ? "" : "disconnected-row"
              }
              className="websocket-connections-table"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Websocket;
