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
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
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
      width: 200,
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

  return (
    <AdminLayout>
      <div className="patient-container">
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
      </div>
    </AdminLayout>
  );
};

export default Patients;
