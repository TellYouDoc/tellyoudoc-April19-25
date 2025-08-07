import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  message,
  Select,
  Popconfirm,
  Avatar,
  Modal,
  Typography,
  Empty,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/Patients.css";
import "../../styles/Administrator/pin-code-filter.css";
import apiService from "../../services/api";

const statusColors = {
  active: "success",
  inactive: "error",
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pinCodeFilter, setPinCodeFilter] = useState("all");
  const [availablePinCodes, setAvailablePinCodes] = useState([
    "781001",
    "781005",
    "781019",
  ]); // Default PIN codes
  const [filterLoading, setFilterLoading] = useState(false); // Loading state specifically for filters

  // Variables to Fetch patients from API
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Logs state variables
  const [activeTab, setActiveTab] = useState("patients");
  const [logs, setLogs] = useState([]);
  const [selectedPatientForLogs, setSelectedPatientForLogs] = useState(null);
  const [logDetailsModalVisible, setLogDetailsModalVisible] = useState(false);
  const [selectedLogRecord, setSelectedLogRecord] = useState(null);

  // Action button styles (same as Doctors.jsx)
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
  // Filter patients based on search text, status filter, and PIN code filter
  // NOTE: This client-side filtering will be phased out once the backend API implements filtering
  const filteredPatients = patients.filter((patient) => {
    const search = searchText.toLowerCase();
    // Convert joinedDate to DD/MM/YYYY for search
    const [yyyy, mm, dd] = patient.joinedDate.split("-");
    const joinedDateFormatted = `${dd}/${mm}/${yyyy}`;

    // Check if patient matches search text
    const matchesSearch =
      patient.name.toLowerCase().includes(search) ||
      patient.gender.toLowerCase().includes(search) ||
      patient.status.toLowerCase().includes(search) ||
      joinedDateFormatted.includes(search) ||
      String(patient.age).includes(search);

    // Check if patient matches status filter (temporary client-side filtering)
    // This will be handled by the backend API in the future
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    // Check if patient matches pin code filter (temporary client-side filtering)
    // This will be handled by the backend API in the future
    const matchesPinCode =
      pinCodeFilter === "all" || patient.pinCode === pinCodeFilter;

    // Return true only if all conditions are met
    return matchesSearch && matchesStatus && matchesPinCode;
  });

  // Get all patients
  const getAllPatients = async () => {
    try {
      setLoading(true);
      // Data to send
      const data = {
        page: currentPage,
        limit: 10,
        // Include status filter if it's not set to 'all'
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchText !== "" && { searchText: searchText }),
      };

      const response = await apiService.AdministratorService.getAllPatients(
        data
      );

      // Process the API response
      if (response && response.data && response.data.status === "success") {
        // Map the patient data to the format expected by our component
        const apiPatients = response.data.data.patients.map((patient) => ({
          id: patient._id,
          patientId: patient.patientId._id,
          name: patient.fullName,
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: patient.age,
          gender: patient.gender,
          status: patient.isActive ? "active" : "inactive",
          joinedDate: new Date(patient.createdAt).toISOString().split("T")[0], // Convert to YYYY-MM-DD
          pinCode: patient.placeOfBirth?.pincode || "", // Use pincode from placeOfBirth if available
          currentAddress: patient.currentAddress, // Include currentAddress for pincode display
          UDI_id: patient.UDI_id,
          phoneNumber: patient.patientId?.phoneNumber || "",
          createdAt: patient.createdAt, // Save the full createdAt timestamp for display
          profileImage: patient.profileImage || "", // Include profile image
        }));

        setPatients(apiPatients);
        setTotalPatients(response.data.pagination.totalCount);
        setPagination(response.data.pagination);

        // Extract unique PIN codes from the patient data and update the available PIN codes list
        const uniquePinCodes = [
          ...new Set(
            apiPatients
              .map((patient) => patient.pinCode)
              .filter((pinCode) => pinCode && pinCode.trim() !== "")
          ),
        ];

        if (uniquePinCodes.length > 0) {
          setAvailablePinCodes(uniquePinCodes);
        }
      } else {
        // If no patients data or error status, set empty array
        setPatients([]);
        message.warning("No patients found");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      message.error("Failed to fetch patients");
      setPatients([]);
    } finally {
      // Reset loading states
      setLoading(false);
      setFilterLoading(false);
    }
  };

  // Fetch patients on component mount and when page or filters change
  React.useEffect(() => {
    // Create a variable to track if the component is mounted
    let isMounted = true;

    // Define a function to handle filter changes
    const handleFilterChange = () => {
      if (isMounted) {
        getAllPatients();
      }
    };

    // Reset to first page when filters change
    if (currentPage !== 1 && (statusFilter !== "all" || searchText !== "")) {
      setCurrentPage(1);
    } else {
      handleFilterChange();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentPage, statusFilter, searchText]);

  // Navigate to patient profile with ID
  const handleViewProfile = (patient) => {
    // TODO: Add navigation to patient profile page
    console.log("View patient profile:", patient);
  };

  // Handle logs for a patient
  const handleLogs = async (patient) => {
    try {
      const response = await apiService.AdministratorService.getPatientLogs(patient.patientId);
      console.log("response", JSON.stringify(response.data, null, 2));
      if (response && response.status === 200) {
        setLogs(response.data.data.logs || []);
        setSelectedPatientForLogs(patient);
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

  // Handle status change
  const handleStatusChange = async (patientId, newStatus) => {
    // Object to send
    const data = {
      isActive: newStatus,
    };

    // Simulate API call to update patient status
    const response = await apiService.AdministratorService.togglePatientStatus(
      patientId,
      data
    );

    if (response.status === 200) {
      message.success(
        `Patient status updated to ${newStatus ? "active" : "inactive"}`
      );

      // If newStatus is true, update the patient status in the state as active
      // If newStatus is false, update the patient status in the state as inactive
      if (newStatus === true) {
        const updatedPatients = patients.map((patient) =>
          patient.patientId === patientId
            ? { ...patient, status: "active" }
            : patient
        );
        setPatients(updatedPatients);
      } else {
        const updatedPatients = patients.map((patient) =>
          patient.patientId === patientId
            ? { ...patient, status: "inactive" }
            : patient
        );
        setPatients(updatedPatients);
      }
    }
  };

  // Column Configurations for the table
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
      dataIndex: "name",
      key: "name",
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
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.age} • {record.gender} • Joined:{" "}
              {new Date(record.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <Tag color={statusColors[record.status]} key={record.status}>
            {record.status === "active" ? "Active" : "Inactive"}
          </Tag>
        </Space>
      ),
      align: "left",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "left",
      render: (text, record) => record.phoneNumber || "N/A",
    },

    {
      title: "Pincode",
      dataIndex: "currentAddress",
      key: "pincode",
      align: "left",
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

          {/* Block/Activate Action */}
          {record.status === "active" ? (
            <Button
              danger
              icon={<StopOutlined style={actionIconStyle} />}
              onClick={() => handleStatusChange(record.patientId, false)}
              style={actionButtonStyle}
            >
              Block
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined style={actionIconStyle} />}
              onClick={() => handleStatusChange(record.patientId, true)}
              style={{
                ...actionButtonStyle,
                background: "var(--admin-success)",
                borderColor: "var(--admin-success)",
              }}
            >
              Activate
            </Button>
          )}
        </div>
      ),
      align: "left",
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
      <div className="patient-container">
        {activeTab === "patients" ? (
          <>
            <div className="patient-header">
              <h1 className="patient-title">Patient Management</h1>

              <div className="patient-header-actions">
                {/* Search Bar */}
                <Input
                  placeholder="Search by name, age, gender and pincode"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  className="search-input"
                />{" "}
                <Select
                  value={statusFilter}
                  onChange={(value) => {
                    setFilterLoading(true);
                    setStatusFilter(value);
                  }}
                  className="status-filter"
                  suffixIcon={
                    filterLoading && statusFilter !== "all" ? (
                      <LoadingOutlined spin />
                    ) : (
                      <FilterOutlined />
                    )
                  }
                  disabled={loading}
                >
                  <Select.Option value="all">All Status</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </div>
            </div>{" "}
            {/* Patient Table */}
            <Table
              columns={columns}
              dataSource={filteredPatients}
              rowKey="id"
              loading={loading}
              pagination={{
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.totalCount,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} patients`,
                onChange: (page) => {
                  setCurrentPage(page);
                },
              }}
              className="patient-table"
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
                  onClick={() => setActiveTab("patients")}
                  style={{
                    borderColor: "var(--border-color)",
                    background: "transparent",
                  }}
                >
                  Back to Patients
                </Button>
                <div>
                  <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
                    Activity Logs
                  </h1>
                  <Typography.Text type="secondary">
                    {selectedPatientForLogs
                      ? `${selectedPatientForLogs.name}`
                      : "Patient"}
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

export default Patients;
