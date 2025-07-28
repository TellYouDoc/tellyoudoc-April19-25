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
} from "antd";
import {
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
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
      </div>
    </AdminLayout>
  );
};

export default Doctors;
