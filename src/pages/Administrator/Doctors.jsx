import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Tag,
  Select,
  Input,
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  EyeOutlined,
  SearchOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import apiService from "../../services/api";

const { Option } = Select;

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();

  const [pinCodeFilter, setPinCodeFilter] = useState("all");
  const availablePinCodes = [
    "110001",
    "110002",
    "110003",
    "110004",
    "110005",
    "110006",
    "110007",
    "110008",
    "110009",
    "110010",
    "110011",
    "110012",
  ];

  const [totalDoctors, setTotalDoctors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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
  const handleStatusChange = (doctorId, newStatus) => {
    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === doctorId ? { ...doctor, isActive: newStatus } : doctor
    );
    setDoctors(updatedDoctors);
    message.success(`Doctor status updated to ${newStatus}`);
  };

  // Navigate to doctor profile with ID
  const handleViewProfile = (doctor) => {
    navigate(`/admin/doctors/${doctor.doctorId}`);
  };

  // Handle subscription management
  const handleManageSubscription = (doctor) => {
    setSelectedDoctor(doctor);
    form.setFieldsValue({ subscription: doctor.subscription });
    setIsSubscriptionModalVisible(true);
  };

  // Handle subscription update
  const handleSubscriptionUpdate = (values) => {
    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === selectedDoctor.id
        ? { ...doctor, subscription: values.subscription }
        : doctor
    );
    setDoctors(updatedDoctors);
    setIsSubscriptionModalVisible(false);
    message.success("Subscription updated successfully");
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
        let status = statusFilter === "all" ? "" : statusFilter;

        let search = searchText;

        const response = await apiService.AdministratorService.getAllDoctors(
          page,
          limit,
          status,
          pinCodeFilter,
          search
        );

        console.log("API response:", response);
        console.log("Fetched doctors:", response.data.data);

        if (response.status === 200) {
          setDoctors(response.data.data);

          console.log("Doctors: ", response.data.data);
          console.log("Total doctors: ", response.data.total);

          setTotalDoctors(response.data.total);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        message.error("Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, [searchText, statusFilter, currentPage]);

  // Pagination state for correct serial number
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const paginationConfigRef = React.useRef(pagination);
  React.useEffect(() => {
    paginationConfigRef.current = pagination;
  }, [pagination]);

  // Table columns configuration
  const columns = [
    {
      title: "Sl No",
      key: "slNo",
      width: 70,
      render: (_, __, index) => {
        // Calculate correct serial number based on pagination and filteredDoctors
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        return startIndex + index + 1;
      },
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "firstName", // Keep this as is since it's used in the render function
      key: "firstName", // Keep the original key
      render: (text, record) => (
        <Space>
          {/* Combine firstName and lastName */}
          {`${record.firstName || ""} ${record.lastName || ""}`}
          <Tag color={statusColors[record.isActive]} key={record.isActive}>
            {record.isActive === true ? "Active" : "Inactive"}
          </Tag>
          {record.subscription === "Beta Partner" && (
            <Tooltip title="Beta Partner">
              <CrownOutlined style={{ color: "#722ed1" }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Experience",
      dataIndex: "yearsOfExperience",
      key: "yearsOfExperience",
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
      render: (text, record) => {
        return (
          <Badge
            count={record.subscription}
            style={{
              backgroundColor:
                record.subscription === "Beta Partner" ? "#722ed1" : "#d9d9d9",
              color: "#fff",
            }}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 420,
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

          {/* Status Actions Group */}
          <div style={{ display: "flex", gap: 4 }}>
            {record.isActive === true && (
              <Button
                danger
                icon={<StopOutlined style={actionIconStyle} />}
                onClick={() => handleStatusChange(record.id, true)}
                style={actionButtonStyle}
              >
                Block
              </Button>
            )}
            {record.isActive === false && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined style={actionIconStyle} />}
                onClick={() => handleStatusChange(record.id, false)}
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

          {/* Subscription Action */}
          <Button
            type="default"
            icon={
              <CrownOutlined style={{ ...actionIconStyle, color: "#722ed1" }} />
            }
            onClick={() => handleManageSubscription(record)}
            style={{
              ...actionButtonStyle,
              borderColor: "#722ed1",
              color: "#722ed1",
            }}
          >
            Sub
          </Button>
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
            Doctor Management
          </h1>
          <Space>
            <Input
              placeholder="Search by name..."
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
              <Option value="pending">Pending</Option>
            </Select>

            {/* PIN Code Filter */}
            <Select
              value={pinCodeFilter}
              onChange={setPinCodeFilter}
              style={{ width: 120 }}
              className="pincode-filter"
            >
              <Option value="all">All PIN Codes</Option>
              {availablePinCodes.map((pinCode) => (
                <Option key={pinCode} value={pinCode}>
                  {pinCode}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey="id"
          pagination={{
            ...pagination,
            showTotal: (total) => `Total ${total} doctors`,
            pageSize: 10,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            total: totalDoctors,
            showSizeChanger: false,
          }}
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        />

        {/* Subscription Management Modal */}
        <Modal
          title="Manage Subscription"
          open={isSubscriptionModalVisible}
          onCancel={() => setIsSubscriptionModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleSubscriptionUpdate}
            layout="vertical"
          >
            <Form.Item
              name="subscription"
              label="Subscription Type"
              rules={[
                {
                  required: true,
                  message: "Please select a subscription type",
                },
              ]}
            >
              <Select>
                <Option value="Beta Partner">Beta Partner</Option>
                <Option value="Not Subscribed">Not Subscribed</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-premium">
                Update Subscription
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Doctors;
