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
        // Include pinCode filter if it's not set to 'all'
        ...(pinCodeFilter !== "all" && { pinCode: pinCodeFilter }),
      };

      // Log the request payload with filters
      console.log("Request payload with filters:", data);

      /* 
      // FUTURE IMPLEMENTATION: 
      // Once the backend API endpoints are updated to support filtering,
      // the following structure can be used:
      
      // For status filtering
      if (statusFilter !== 'all') {
        // Convert frontend status values to backend expected format if needed
        // e.g., 'active' -> true, 'inactive' -> false
        data.isActive = statusFilter === 'active';
      }
      
      // For PIN code filtering
      if (pinCodeFilter !== 'all') {
        data.pinCode = pinCodeFilter;
      }
      */

      const response = await apiService.AdministratorService.getAllPatients(
        data
      );

      // Add detailed logging to understand the response structure
      console.log("Full API Response:", response);
      console.log("Patient data:", response?.data?.data?.patients?.[0]);
      console.log(
        "createdAt value:",
        response?.data?.data?.patients?.[0]?.createdAt
      ); // Process the API response
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
          healthConditions: [], // API might not have this info, can be added later
          pinCode: patient.placeOfBirth?.pincode || "", // Use pincode from placeOfBirth if available
          UDI_id: patient.UDI_id,
          phoneNumber: patient.patientId?.phoneNumber || "",
          createdAt: patient.createdAt, // Save the full createdAt timestamp for display
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
  }; // Fetch patients on component mount and when page or filters change
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
    if (
      currentPage !== 1 &&
      (statusFilter !== "all" || pinCodeFilter !== "all")
    ) {
      setCurrentPage(1);
    } else {
      handleFilterChange();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentPage, statusFilter, pinCodeFilter]);

  // Handle status change
  const handleStatusChange = async (patientId, newStatus) => {
    console.log("Changing status for patient:", patientId);

    // Object to send
    const data = {
      isActive: newStatus,
    };

    // Simulate API call to update patient status
    const response = await apiService.AdministratorService.togglePatientStatus(
      patientId,
      data
    );

    // console.log("API Response:", response);

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
      render: (_, __, index) => index + 1,
      align: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      align: "left",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      align: "left",
    },
    {
      title: "Health Condition",
      dataIndex: "healthConditions",
      key: "healthConditions",
      align: "left",
      render: (conditions) =>
        conditions && conditions.length > 0 ? (
          conditions.map((cond, idx) => (
            <Tag color="processing" key={idx}>
              {cond}
            </Tag>
          ))
        ) : (
          <Tag color="default">Healthy</Tag>
        ),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "joinedDate",
      align: "left",
      render: (_, record) => {
        // Use the record.createdAt directly from the mapped data
        if (!record.createdAt) return "-";
        const formattedDate = new Date(record.createdAt).toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );
        return formattedDate;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
      align: "left",
    },
    {
      title: "Actions",
      key: "actions",
      width: 240,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="primary"
            icon={<EyeOutlined className="action-button-icon" />}
            className="action-button action-button-primary"
            // TODO: Add router link to patient profile page
          >
            View
          </Button>{" "}
          {record.status === "active" && (
            <Popconfirm
              title="Deactivate Patient"
              description="Are you sure you want to deactivate this patient?"
              onConfirm={() => handleStatusChange(record.patientId, false)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                danger
                icon={<StopOutlined className="action-button-icon" />}
                className="action-button"
              >
                Deactivate
              </Button>
            </Popconfirm>
          )}
          {record.status === "inactive" && (
            <Popconfirm
              title="Activate Patient"
              description="Are you sure you want to activate this patient?"
              onConfirm={() => handleStatusChange(record.patientId, true)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined className="action-button-icon" />}
                className="action-button action-button-success"
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
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
              placeholder="Search by name, gender, status, or date..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              className="search-input"
            />{" "}
            {/* 
              Filter with Status 
              These filters are now configured to send parameters to the backend API.
              Currently using client-side filtering, but the parameters are prepared for 
              future backend implementation.
            */}{" "}
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
            {/* 
              Filter with PIN Code 
              These filters are now configured to send parameters to the backend API.
              The API interface is prepared for future implementation.
              PIN codes are dynamically loaded from patient data.
            */}{" "}
            <Select
              value={pinCodeFilter}
              onChange={(value) => {
                setFilterLoading(true);
                setPinCodeFilter(value);
              }}
              className="pincode-filter"
              suffixIcon={
                filterLoading && pinCodeFilter !== "all" ? (
                  <LoadingOutlined spin />
                ) : (
                  <FilterOutlined />
                )
              }
              disabled={loading}
            >
              <Select.Option value="all">All PIN Codes</Select.Option>
              {availablePinCodes.map((pinCode) => (
                <Select.Option key={pinCode} value={pinCode}>
                  {pinCode}
                </Select.Option>
              ))}
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
