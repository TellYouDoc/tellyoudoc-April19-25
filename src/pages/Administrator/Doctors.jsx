import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Tag,
  Select,
  Input,
  message,
  Avatar,
  Modal,
  Typography,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AdminLayout from "../../components/AdminLayout";
import apiService from "../../services/api";

const { Option } = Select;

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [pinCodeFilter, setPinCodeFilter] = useState("all");
  const [availablePinCodes, setAvailablePinCodes] = useState([]);

  const [totalDoctors, setTotalDoctors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Logs state variables
  const [activeTab, setActiveTab] = useState("doctors");
  const [logs, setLogs] = useState([]);
  const [selectedDoctorForLogs, setSelectedDoctorForLogs] = useState(null);
  const [logDetailsModalVisible, setLogDetailsModalVisible] = useState(false);
  const [selectedLogRecord, setSelectedLogRecord] = useState(null);

  // Status color mapping
  const statusColors = {
    active: "success",
    inactive: "error",
    pending: "warning",
  };

  // // Subscription badge color mapping
  // const subscriptionColors = {
  //   "Beta Partner": "#722ed1",
  //   "Not Subscribed": "#d9d9d9",
  // };

  // Handle status change
  const handleStatusChange = async (doctorId, newStatus) => {
    try {
      const data = {
        newStatus: newStatus,
      };

      const response = await apiService.AdministratorService.updateDoctorStatus(
        doctorId,
        data
      );

      if (response.status === 200) {
        // Update the doctor status in the local state
        const updatedDoctors = doctors.map((doctor) =>
          doctor._id === doctorId ? { ...doctor, isActive: newStatus } : doctor
        );
        setDoctors(updatedDoctors);

        message.success(
          `Doctor status updated to ${newStatus ? "Active" : "Inactive"}`
        );
      }
    } catch (error) {
      console.error(
        "Error updating doctor status:",
        JSON.stringify(error, null, 2)
      );
      message.error("Failed to update doctor status");
    }
  };

  // Navigate to doctor profile with ID
  const handleViewProfile = (doctor) => {
    navigate(`/admin/doctors/${doctor.doctorId}`);
  };

  // Handle logs for a doctor
  const handleLogs = async (doctor) => {
    try {
      const response = await apiService.AdministratorService.getDoctorLogs(doctor._id);
      console.log("response", JSON.stringify(response.data, null, 2));
      if (response && response.status === 200) {
        setLogs(response.data.data.logs || []);
        setSelectedDoctorForLogs(doctor);
        setActiveTab("logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      message.error("Failed to fetch logs: " + (error.message || "Unknown error"));
    }
  };

  // Handle view log details
  const handleViewLogDetails = (record) => {
    try {
      console.log("View log details clicked for record:", record);
      if (!record) {
        console.error("No record provided to handleViewLogDetails");
        message.error("No log data available");
        return;
      }
      setSelectedLogRecord(record);
      setLogDetailsModalVisible(true);
    } catch (error) {
      console.error("Error in handleViewLogDetails:", error);
      message.error("Failed to display log details: " + (error.message || "Unknown error"));
    }
  };

  // Helper functions for logs table
  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 400 && statusCode < 500) return "warning";
    if (statusCode >= 500) return "error";
    return "default";
  };

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "blue";
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "DELETE":
        return "red";
      case "PATCH":
        return "purple";
      default:
        return "default";
    }
  };

  // Filter doctors based on status and search text
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesStatus =
      statusFilter === "all" || doctor.status === statusFilter;
    const matchesSearch = doctor.firstName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const actionButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    height: "32px",
    borderRadius: "6px",
    fontSize: "13px",
    whiteSpace: "nowrap",
  };

  const actionIconStyle = {
    fontSize: "14px",
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let page = currentPage;
        let limit = 10;

        const response = await apiService.AdministratorService.getAllDoctors(
          page,
          limit,
          searchText,
          statusFilter === "all" ? "" : statusFilter,
          pinCodeFilter === "all" ? "" : pinCodeFilter
        );

        if (response.status === 200) {
          setDoctors(response.data.data);
          setTotalDoctors(response.data.totalDoctors);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);

          // Extract unique pincodes from the doctors data
          const pincodes = [
            ...new Set(
              response.data.data
                .map((doctor) => doctor.currentAddress?.pincode)
                .filter((pincode) => pincode) // Remove undefined/null values
            ),
          ].sort();
          setAvailablePinCodes(pincodes);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        message.error("Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, [searchText, statusFilter, currentPage, pinCodeFilter]);

  // Table columns configuration
  const columns = [
    {
      title: "Sl No",
      key: "slNo",
      width: 70,
      render: (_, __, index) => {
        // Calculate correct serial number based on current page
        const startIndex = (currentPage - 1) * 10;
        return startIndex + index + 1;
      },
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.profileImage}
            size={40}
            style={{ marginRight: 8 }}
          >
            {record.firstName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>
              {`${record.firstName || ""} ${record.lastName || ""}`}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Joined:{" "}
              {new Date(record.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <Tag color={statusColors[record.isActive]} key={record.isActive}>
            {record.isActive === true ? "Active" : "Inactive"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "professionalDetails",
      key: "specialization",
      render: (text, record) => {
        const specializations =
          record.professionalDetails?.specialization || [];
        return specializations.join(", ");
      },
    },
    {
      title: "Experience",
      dataIndex: "professionalDetails",
      key: "yearsOfExperience",
      render: (text, record) => {
        const experience = record.professionalDetails?.yearsOfExperience;
        return experience ? `${experience} years` : "N/A";
      },
    },
    {
      title: "Pincode",
      dataIndex: "currentAddress",
      key: "pincode",
      render: (text, record) => {
        return record.currentAddress?.pincode || "N/A";
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 280,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            icon={<EyeOutlined style={actionIconStyle} />}
            onClick={() => handleViewProfile(record)}
            style={{
              ...actionButtonStyle,
              background: "var(--admin-primary-color)",
              borderColor: "var(--admin-primary-color)",
            }}
          >
            View
          </Button>

          {/* Block/Activate Action */}
          {record.isActive === true ? (
            <Button
              danger
              icon={<StopOutlined style={actionIconStyle} />}
              onClick={() => handleStatusChange(record._id, false)}
              style={actionButtonStyle}
            >
              Block
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined style={actionIconStyle} />}
              onClick={() => handleStatusChange(record._id, true)}
              style={{
                ...actionButtonStyle,
                background: "var(--admin-success)",
                borderColor: "var(--admin-success)",
              }}
            >
              Activate
            </Button>
          )}

          <Button
            icon={<HistoryOutlined style={actionIconStyle} />}
            onClick={() => handleLogs(record)}
            style={{
              ...actionButtonStyle,
              background: "#1890ff",
              borderColor: "#1890ff",
              color: "white",
            }}
          >
            Logs
          </Button>
        </div>
      ),
    },
  ];

  // Logs table columns
  const logsColumns = [
    {
      title: "Sl No",
      key: "slNo",
      width: 70,
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 100,
      render: (method) => (
        <Tag color={getMethodColor(method)} style={{ fontWeight: "bold" }}>
          {method}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      render: (path) => (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "var(--text-primary)",
            wordBreak: "break-all",
          }}
        >
          {path}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusCode",
      key: "statusCode",
      width: 100,
      render: (statusCode) => (
        <Tag color={getStatusColor(statusCode)} style={{ fontWeight: "bold" }}>
          {statusCode}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Response Time",
      dataIndex: "responseTime",
      key: "responseTime",
      width: 120,
      render: (responseTime) => `${responseTime}ms`,
      align: "center",
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
      width: 120,
      render: (ip) => (
        <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
          {ip}
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 150,
      render: (timestamp) => (
        <div style={{ fontSize: "12px" }}>
          {moment(timestamp).format("DD/MM/YYYY HH:mm:ss")}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined style={{ color: "var(--text-primary)" }} />}
          onClick={() => {
            console.log("View button clicked for record:", record);
            handleViewLogDetails(record);
          }}
          style={{
            borderColor: "var(--border-color)",
            background: "transparent",
            cursor: "pointer",
          }}
          className="btn-premium btn-sm"
          title="View details"
          type="default"
        />
      ),
      align: "center",
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        {activeTab === "doctors" ? (
          <>
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
                Doctors
              </h1>
              <Space>
                <Input
                  placeholder="Search by name, specialization, experience, pincode"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  className="search-input"
                />

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 120 }}
                  className="status-filter"
                >
                  <Option value="all">All Status</Option>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={doctors}
              rowKey="_id"
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: totalDoctors,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} doctors`,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
                showQuickJumper: true,
              }}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            />
          </>
        ) : activeTab === "logs" ? (
          <>
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setActiveTab("doctors")}
                  style={{
                    borderColor: "var(--border-color)",
                    background: "transparent",
                  }}
                >
                  Back to Doctors
                </Button>
                <div>
                  <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
                    Activity Logs
                  </h1>
                  <Typography.Text type="secondary">
                    {selectedDoctorForLogs
                      ? `Dr. ${selectedDoctorForLogs.firstName} ${selectedDoctorForLogs.lastName}`
                      : "Doctor"}
                  </Typography.Text>
                </div>
              </div>
              <div>
                <Typography.Text strong>
                  Total Logs: {logs.length}
                </Typography.Text>
              </div>
            </div>

            <Table
              columns={logsColumns}
              dataSource={logs}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} logs`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="No logs found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            />

            {/* Log Details Modal */}
            <Modal
              title="Log Details"
              open={logDetailsModalVisible}
              onCancel={() => {
                setLogDetailsModalVisible(false);
                setSelectedLogRecord(null);
              }}
              footer={[
                <Button key="close" onClick={() => {
                  setLogDetailsModalVisible(false);
                  setSelectedLogRecord(null);
                }}>
                  Close
                </Button>
              ]}
              width={800}
              centered
            >
              {selectedLogRecord && (
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <strong>Request Information:</strong>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                    <div><strong>Method:</strong> <Tag color={getMethodColor(selectedLogRecord.method)}>{selectedLogRecord.method}</Tag></div>
                    <div><strong>Status:</strong> <Tag color={getStatusColor(selectedLogRecord.statusCode)}>{selectedLogRecord.statusCode}</Tag></div>
                    <div><strong>Response Time:</strong> {selectedLogRecord.responseTime}ms</div>
                    <div><strong>IP Address:</strong> {selectedLogRecord.ip}</div>
                    {selectedLogRecord.userId && <div><strong>User ID:</strong> {selectedLogRecord.userId}</div>}
                    {selectedLogRecord.userType && <div><strong>User Type:</strong> <Tag color={selectedLogRecord.userType === "admin" ? "red" : selectedLogRecord.userType === "doctor" ? "blue" : "green"}>{selectedLogRecord.userType?.toUpperCase()}</Tag></div>}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Path:</strong>
                  </div>
                  <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px", marginBottom: "16px", fontFamily: "monospace" }}>
                    {selectedLogRecord.path}
                  </div>
                  {selectedLogRecord.userAgent && (
                    <>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>User Agent:</strong>
                      </div>
                      <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px", marginBottom: "16px", fontSize: "12px" }}>
                        {selectedLogRecord.userAgent}
                      </div>
                    </>
                  )}
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Timestamp:</strong>
                  </div>
                  <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px" }}>
                    {moment(selectedLogRecord.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                  </div>
                  {selectedLogRecord.requestBody && (
                    <>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Request Body:</strong>
                      </div>
                      <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px", marginBottom: "16px", fontSize: "12px", fontFamily: "monospace" }}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(selectedLogRecord.requestBody, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
                  {selectedLogRecord.responseBody && (
                    <>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Response Body:</strong>
                      </div>
                      <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" }}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(selectedLogRecord.responseBody, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Modal>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default Doctors;
