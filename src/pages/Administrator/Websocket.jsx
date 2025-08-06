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
} from "antd";
import { DisconnectOutlined, ReloadOutlined, UserOutlined, TeamOutlined, ThunderboltOutlined, BarChartOutlined } from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import { apiService } from "../../services/api.jsx";
import "../../styles/Administrator/AdminDashboard.css";

const { Text } = Typography;
const { Option } = Select;

const customStyles = {
  pageContainer: {
    padding: "var(--spacing-6)",
    minHeight: "100vh",
    color: "var(--text-primary)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-6)",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  headerRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  dashboardCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
    marginBottom: 32,
    width: "100%",
  },
  dashboardCard: {
    background: "white",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: 20,
    display: "flex",
    alignItems: "flex-start",
    gap: 15,
    minHeight: 120,
    border: "1px solid rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 2,
    opacity: 1,
    visibility: "visible",
  },
  dashboardCardIcon: {
    padding: 12,
    borderRadius: 8,
    background: "none",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    color: "var(--primary-color)",
  },
  dashboardCardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  table: {
    background: "var(--background-primary)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--border-color)",
    padding: "var(--spacing-4)",
    overflowX: "auto",
    width: "100%",
  },
  actionButton: {
    borderRadius: "var(--radius)",
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
  const [pagination, setPagination] = useState({ current: 1, total: 0, pages: 0, hasNext: false, hasPrev: false });

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
      .then(res => setStatus(res.data.data))
      .catch(err => setStatusError(err?.response?.data?.error || 'Failed to fetch status'))
      .finally(() => setStatusLoading(false));
  };
  useEffect(fetchStatus, []);

  // Fetch WebSocket connections
  const fetchConnections = () => {
    setConnectionsLoading(true);
    setConnectionsError(null);
    apiService.AdministratorService.getWebSocketConnections({ page, limit, userType: userType || undefined })
      .then(res => {
        setConnections(res.data.data.connections);
        setPagination(res.data.data.pagination);
      })
      .catch(err => setConnectionsError(err?.response?.data?.error || 'Failed to fetch connections'))
      .finally(() => setConnectionsLoading(false));
  };
  useEffect(fetchConnections, [page, limit, userType]);

  // Fetch analytics
  const fetchAnalytics = () => {
    setAnalyticsLoading(true);
    apiService.AdministratorService.getWebSocketAnalytics({ timeframe: analyticsTimeframe })
      .then(res => setAnalytics(res.data.data))
      .catch(() => setAnalytics(null))
      .finally(() => setAnalyticsLoading(false));
  };
  useEffect(fetchAnalytics, [analyticsTimeframe]);

  // Handlers for pagination and filter
  const handlePageChange = (newPage) => setPage(newPage);
  const handleUserTypeChange = (value) => { setUserType(value); setPage(1); };
  const handleLimitChange = (value) => { setLimit(Number(value)); setPage(1); };

  // Disconnect user
  const handleDisconnect = (userId) => {
    setDisconnectingUserId(userId);
    apiService.AdministratorService.disconnectWebSocketUser(userId)
      .then(res => {
        message.success(res.data.message || 'User disconnected');
        fetchConnections();
        fetchStatus();
      })
      .catch(err => {
        message.error(err?.response?.data?.error || 'Failed to disconnect user');
      })
      .finally(() => setDisconnectingUserId(null));
  };

  // Send registration reminders
  const handleSendReminders = () => {
    setReminderLoading(true);
    apiService.AdministratorService.sendWebSocketRegistrationReminders()
      .then(res => {
        message.success(res.data.message || 'Reminders sent');
        fetchStatus();
      })
      .catch(err => {
        message.error(err?.response?.data?.error || 'Failed to send reminders');
      })
      .finally(() => setReminderLoading(false));
  };

  // Table columns
  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (id) => id ? <Tag icon={<UserOutlined />}>{id}</Tag> : <Tag>-</Tag>,
    },
    {
      title: "Socket ID",
      dataIndex: "socketId",
      key: "socketId",
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (type) => type ? <Tag color={type === 'doctor' ? 'blue' : 'green'} icon={<TeamOutlined />}>{type}</Tag> : <Tag>-</Tag>,
    },
    {
      title: "Connected",
      dataIndex: "connected",
      key: "connected",
      render: (val) => val ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Connected At",
      dataIndex: "connectedAt",
      key: "connectedAt",
      render: (date) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Disconnect this user?"
          onConfirm={() => handleDisconnect(record.userId)}
          okButtonProps={{ loading: disconnectingUserId === record.userId }}
          disabled={!record.connected}
        >
          <Button
            type="primary"
            danger
            icon={<DisconnectOutlined />}
            size="small"
            loading={disconnectingUserId === record.userId}
            disabled={!record.connected}
            style={customStyles.actionButton}
          >
            Disconnect
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={customStyles.pageContainer} className="admin-dashboard-content">
        <div style={customStyles.header} className="admin-dashboard-header">
          <div style={customStyles.headerLeft}>
            <h3 style={{ margin: 0, fontWeight: 600 }}>WebSocket Monitoring</h3>
            <Text type="secondary">Monitor and manage WebSocket connections, analytics, and actions.</Text>
          </div>
          <div style={customStyles.headerRight}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => { fetchStatus(); fetchConnections(); fetchAnalytics(); }}
              className="btn-premium btn-sm btn-outline"
            >
              Refresh
            </Button>
            <Button
              icon={<ThunderboltOutlined />}
              type="primary"
              loading={reminderLoading}
              onClick={handleSendReminders}
              className="btn-premium btn-sm"
            >
              Send Registration Reminders
            </Button>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="dashboard-cards" style={customStyles.dashboardCards}>
          <div className="admin-dashboard-card" style={customStyles.dashboardCard}>
            <div className="dashboard-card-icon" style={customStyles.dashboardCardIcon}>
              <ThunderboltOutlined />
            </div>
            <div className="dashboard-card-content" style={customStyles.dashboardCardContent}>
              <h3>Status</h3>
              {statusLoading ? <Text>Loading...</Text> : statusError ? <Text type="danger">{statusError}</Text> : status && (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li><b>Initialized:</b> {status.initialized ? 'Yes' : 'No'}</li>
                  <li><b>Enabled:</b> {status.enabled ? 'Yes' : 'No'}</li>
                  <li><b>Feature Enabled:</b> {status.featureEnabled ? 'Yes' : 'No'}</li>
                  <li><b>Connected Users:</b> {status.connectedUsers}</li>
                  <li><b>Total Sockets:</b> {status.totalSockets}</li>
                  <li><b>Unregistered Sockets:</b> {status.unregisteredSockets}</li>
                  <li><b>Connected User IDs:</b> {status.connectedUserIds?.join(', ')}</li>
                  <li><b>Uptime:</b> {Math.floor(status.uptime / 1000)} seconds</li>
                </ul>
              )}
            </div>
          </div>
          <div className="admin-dashboard-card" style={customStyles.dashboardCard}>
            <div className="dashboard-card-icon" style={customStyles.dashboardCardIcon}>
              <BarChartOutlined />
            </div>
            <div className="dashboard-card-content" style={customStyles.dashboardCardContent}>
              <h3>Analytics</h3>
              <div style={{ marginBottom: 8 }}>
                <span>Timeframe: </span>
                <Select value={analyticsTimeframe} onChange={setAnalyticsTimeframe} style={{ width: 100 }} size="small">
                  <Option value="1h">1h</Option>
                  <Option value="6h">6h</Option>
                  <Option value="24h">24h</Option>
                  <Option value="7d">7d</Option>
                </Select>
              </div>
              {analyticsLoading ? <Text>Loading...</Text> : analytics ? (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li><b>Current Connections:</b> {analytics.summary?.currentConnections}</li>
                  <li><b>Peak Connections:</b> {analytics.summary?.peakConnections}</li>
                  <li><b>Total Messages:</b> {analytics.summary?.totalMessages}</li>
                  <li><b>Active Users:</b> {analytics.summary?.activeUsers}</li>
                  <li><b>Doctors:</b> {analytics.breakdown?.byUserType?.doctor}</li>
                  <li><b>Patients:</b> {analytics.breakdown?.byUserType?.patient}</li>
                  <li><b>Chat Msgs:</b> {analytics.breakdown?.byMessageType?.chat}</li>
                  <li><b>Notifications:</b> {analytics.breakdown?.byMessageType?.notification}</li>
                  <li><b>Dashboard Msgs:</b> {analytics.breakdown?.byMessageType?.dashboard}</li>
                </ul>
              ) : <Text type="secondary">No analytics data.</Text>}
            </div>
          </div>
        </div>

        {/* Connections Table */}
        <Card title={<><TeamOutlined /> Connections</>} style={{ ...customStyles.dashboardCard, marginBottom: 32 }} bodyStyle={{ padding: 20 }}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
            <span>User Type:</span>
            <Select value={userType} onChange={handleUserTypeChange} style={{ width: 120 }} allowClear placeholder="All">
              <Option value="doctor">Doctor</Option>
              <Option value="patient">Patient</Option>
            </Select>
            <span>Per Page:</span>
            <Select value={limit} onChange={handleLimitChange} style={{ width: 80 }}>
              {[10, 20, 50, 100].map(l => <Option key={l} value={l}>{l}</Option>)}
            </Select>
          </div>
          
          {/* Style the table */}
          <div
            style={customStyles.table}
            className="premium-card premium-table-responsive"
          >
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
              }}
              scroll={{ x: "max-content" }}
              size="middle"
              locale={{ emptyText: connectionsError ? <Text type="danger">{connectionsError}</Text> : "No connections found" }}
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default Websocket;
