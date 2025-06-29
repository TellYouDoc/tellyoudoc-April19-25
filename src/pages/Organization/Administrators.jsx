import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Typography,
  Tag,
  AutoComplete,
  Radio,
  Empty,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  TeamOutlined,
  FileTextOutlined,
  ToolOutlined,
  BarChartOutlined,
  SearchOutlined,
  IdcardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import OrganizationLayout from "../../components/OrganizationLayout";
import "../../styles/Organization/OrganizationDashboard.css";

const { Text } = Typography;
const { Option } = Select;

// Mock API service - replace with actual API calls when available
const apiService = {
  getAdministrators: async () => {
    // Mock data for development
    return {
      data: [
        {
          _id: "1",
          fullName: "John Smith",
          designation: "IT Manager",
          email: "john.smith@hospital.com",
          username: "john_smith",
          role: "superadmin",
          permissions: ["manage_doctors", "manage_patients", "manage_screenings", "manage_analytics", "manage_content"],
          createdAt: "2023-01-15T10:30:00Z",
          lastLogin: "2023-05-20T14:22:00Z",
        },
        {
          _id: "2",
          fullName: "Sarah Johnson",
          designation: "Department Head",
          email: "sarah.johnson@hospital.com",
          username: "sarah_j",
          role: "admin",
          permissions: ["manage_doctors", "manage_patients"],
          createdAt: "2023-02-20T11:45:00Z",
          lastLogin: "2023-05-19T09:15:00Z",
        },
        {
          _id: "3",
          fullName: "Michael Chang",
          designation: "Operations Manager",
          email: "michael.chang@hospital.com",
          username: "m_chang",
          role: "admin",
          permissions: ["manage_screenings", "manage_analytics"],
          createdAt: "2023-03-10T14:20:00Z",
          lastLogin: "2023-05-18T16:30:00Z",
        },
      ],
      total: 3,
    };
  },
  createAdministrator: async (data) => {
    // Mock successful creation
    return { success: true, message: "Administrator created successfully" };
  },
  updateAdministrator: async (id, data) => {
    // Mock successful update
    return { success: true, message: "Administrator updated successfully" };
  },
  deleteAdministrator: async (id) => {
    // Mock successful deletion
    return { success: true, message: "Administrator deleted successfully" };
  },
  updatePermissions: async (id, permissions) => {
    // Mock successful permission update
    return { success: true, message: "Permissions updated successfully" };
  },
};

// Custom styles to match website theme
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
  title: {
    color: "var(--text-primary)",
    fontSize: "var(--font-size-2xl)",
    fontWeight: "600",
    margin: "0",
  },
  roleTag: {
    superAdmin: {
      background: "var(--primary-color)",
      color: "white",
      border: "none",
      borderRadius: "var(--radius)",
      padding: "2px 10px",
      fontSize: "12px",
    },
    admin: {
      background: "var(--background-secondary)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius)",
      padding: "2px 10px",
      fontSize: "12px",
    },
  },
  createButton: {
    background: "var(--primary-color)",
    borderColor: "var(--primary-color)",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    height: "38px",
    borderRadius: "var(--radius)",
    transition: "all var(--transition-normal)",
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
  modal: {
    ".ant-modal-content": {
      padding: "24px",
      background: "var(--background-primary)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
    },
    ".ant-modal-header": {
      padding: "0 0 16px 0",
      background: "transparent",
      border: "none",
      marginBottom: "8px",
      borderBottom: "1px solid var(--border-color)",
    },
    ".ant-modal-title": {
      color: "var(--text-primary)",
      fontSize: "var(--font-size-xl)",
      fontWeight: "600",
    },
    ".ant-modal-body": {
      padding: "24px 0",
    },
    ".ant-modal-close": {
      top: "24px",
      right: "24px",
    },
    ".ant-form-item-label > label": {
      color: "var(--text-primary)",
      fontSize: "var(--font-size-sm)",
      fontWeight: "500",
    },
  },
  switchStyle: {
    backgroundColor: "var(--primary-color)",
  },
  formSection: {
    marginBottom: "24px",
  },
  formDescription: {
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-sm)",
    marginBottom: "16px",
  },
  permissionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border-color)",
    marginBottom: "12px",
    background: "var(--background-secondary)",
  },
  permissionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-primary)",
    fontWeight: "500",
  },
  permissionDescription: {
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-sm)",
    marginTop: "4px",
  },
  popconfirmButton: {
    minWidth: "60px",
    height: "32px",
    padding: "4px 15px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  searchBar: {
    width: "300px",
    ".ant-input-affix-wrapper": {
      background: "var(--background-secondary)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius)",
      "&:hover, &:focus": {
        borderColor: "var(--primary-color)",
      },
    },
    ".ant-input": {
      background: "transparent",
    },
  },
};

function Administrators() {
  // State management
  const [administrators, setAdministrators] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form] = Form.useForm();
  const [permissionsForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredAdministrators, setFilteredAdministrators] = useState([]);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [createFormRole, setCreateFormRole] = useState("admin");
  const [editFormRole, setEditFormRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalAdministrators, setTotalAdministrators] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Define available permissions and their descriptions
  const permissionConfig = {
    manage_doctors: {
      label: "Doctors",
      description: "Can create, edit, and manage doctor accounts",
      icon: <TeamOutlined />,
    },
    manage_patients: {
      label: "Patients",
      description: "Can access and manage patient records",
      icon: <TeamOutlined />,
    },
    manage_screenings: {
      label: "Screenings",
      description: "Can manage breast cancer screening appointments",
      icon: <FileTextOutlined />,
    },
    manage_analytics: {
      label: "Analytics",
      description: "Can view and download system reports and analytics",
      icon: <BarChartOutlined />,
    },
    manage_content: {
      label: "Content",
      description: "Can manage and modify website content",
      icon: <FileTextOutlined />,
    },
  };

  // Get all available permission keys as an array
  const allPermissionKeys = Object.keys(permissionConfig);

  // Table columns configuration
  const columns = [
    {
      title: "Sl No",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
      fixed: 'left'
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      width: 150,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => (
        <Tag
          style={
            role === "superadmin"
              ? customStyles.roleTag.superAdmin
              : customStyles.roleTag.admin
          }
        >
          {role === "superadmin" ? (
            <span>Super Admin</span>
          ) : (
            <span>Admin</span>
          )}
        </Tag>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 140,
      ellipsis: true,
      render: (username, record) => (
        <Tooltip title={username}>
          <span>
            {username}
            {currentAdmin && record._id === currentAdmin.id && (
              <Tag
                style={{
                  background: "var(--primary-color-light)",
                  borderColor: "var(--primary-color)",
                  color: "var(--primary-color)",
                  borderRadius: "var(--radius)",
                  marginLeft: "8px",
                  padding: "0 8px",
                  fontSize: "12px",
                }}
              >
                You
              </Tag>
            )}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      ellipsis: true,
      render: (email) => (
        <Tooltip title={email}>
          <span>{email}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Permissions
          <Tooltip
            title="Super Admins have all permissions by default. Admin permissions can be customized."
            placement="top"
          >
            <InfoCircleOutlined
              style={{ color: "var(--text-secondary)", fontSize: "14px" }}
            />
          </Tooltip>
        </div>
      ),
      key: "permissions",
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        const activePermissions = record.permissions || [];
        const displayPermissions = activePermissions.slice(0, 2);
        const remainingCount = activePermissions.length - 2;

        // Special display for Super Admins
        if (record.role === "superadmin") {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tag
                style={{
                  background: "var(--primary-color-light)",
                  borderColor: "var(--primary-color)",
                  color: "var(--primary-color)",
                  borderRadius: "var(--radius)",
                  padding: "0 8px",
                  fontSize: "12px",
                }}
              >
                All Permissions
              </Tag>
            </div>
          );
        }

        const allPermissionsContent = (
          <div style={{ maxWidth: "300px" }}>
            <div style={{ marginBottom: "8px", fontWeight: 500 }}>
              Active Permissions:
            </div>
            {activePermissions.length > 0 ? (
              activePermissions.map((perm) => (
                <div key={perm} style={{ marginBottom: "4px" }}>
                  • {permissionConfig[perm]?.label || perm}
                </div>
              ))
            ) : (
              <div>No active permissions</div>
            )}
          </div>
        );

        return (
          <Space size={4}>
            {activePermissions.length === 0 ? (
              <Tag
                style={{
                  background: "var(--background-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-secondary)",
                  padding: "0 8px",
                  fontSize: "12px",
                }}
              >
                No permissions
              </Tag>
            ) : (
              <>
                {displayPermissions.map((perm) => (
                  <Tag
                    key={perm}
                    style={{
                      background: "var(--background-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius)",
                      color: "var(--text-primary)",
                      padding: "0 8px",
                      fontSize: "12px",
                    }}
                  >
                    {permissionConfig[perm]?.label || perm}
                  </Tag>
                ))}
                {remainingCount > 0 && (
                  <Tooltip title={allPermissionsContent} placement="topRight">
                    <Tag
                      style={{
                        background: "var(--background-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius)",
                        color: "var(--text-secondary)",
                        padding: "0 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      +{remainingCount} more
                    </Tag>
                  </Tooltip>
                )}
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (text) => {
        try {
          const date = new Date(text);
          if (isNaN(date.getTime())) {
            return "Invalid Date";
          }

          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");

          return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
          return "Invalid Date";
        }
      },
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 150,
      render: (text) => {
        if (!text) {
          return "Never Logged In";
        }

        try {
          const date = new Date(text);
          if (isNaN(date.getTime())) {
            return "Never Logged In";
          }

          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");

          return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
          return "Never Logged In";
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 240,
      render: (_, record) => {
        // Disable actions if this is the current admin
        const isCurrentAdmin = currentAdmin && record._id === currentAdmin.id;

        if (isCurrentAdmin) {
          return (
            <Tooltip title="You cannot modify your own account">
              <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                No actions available
              </div>
            </Tooltip>
          );
        }

        return (
          <Space>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={customStyles.actionButton}
              className="btn-premium btn-sm btn-outline"
            >
              Edit
            </Button>
            {record.role !== "superadmin" && (
              <Button
                type="default"
                icon={<SettingOutlined />}
                onClick={() => handlePermissions(record)}
                style={customStyles.actionButton}
                className="btn-premium btn-sm btn-outline"
              >
                Permissions
              </Button>
            )}
            <Popconfirm
              title="Are you sure you want to delete this administrator?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                className: "btn-premium",
                style: {
                  ...customStyles.popconfirmButton,
                  background: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                  color: "white"
                }
              }}
              cancelButtonProps={{
                className: "btn-premium",
                style: {
                  ...customStyles.popconfirmButton,
                  background: "transparent",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)"
                }
              }}
              placement="topRight"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={customStyles.actionButton}
                className="btn-premium btn-sm btn-outline"
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    },
  ];

  useEffect(() => {
    fetchAdministrators();
    // In a real app, you would get the current admin from authentication context or API
    setCurrentAdmin({
      id: "1", // This would match one of the admin IDs
      username: "john_smith",
    });
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = administrators.filter(
        (admin) =>
          admin.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchText.toLowerCase()) ||
          admin.username.toLowerCase().includes(searchText.toLowerCase()) ||
          admin.designation.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAdministrators(filtered);
    } else {
      setFilteredAdministrators(administrators);
    }
  }, [searchText, administrators]);

  const fetchAdministrators = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAdministrators();
      setAdministrators(response.data);
      setFilteredAdministrators(response.data);
      setTotalAdministrators(response.total);
      message.success("Administrators loaded successfully");
    } catch (error) {
      console.error("Error fetching administrators:", error);
      message.error("Failed to load administrators");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
    setCreateFormRole("admin");
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handlePermissionsCancel = () => {
    setIsPermissionsModalVisible(false);
    permissionsForm.resetFields();
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditFormRole(admin.role);
    form.setFieldsValue({
      fullName: admin.fullName,
      designation: admin.designation,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    });
    setIsEditModalVisible(true);
  };

  const handlePermissions = (admin) => {
    setSelectedAdmin(admin);
    permissionsForm.setFieldsValue({
      permissions: admin.permissions || [],
    });
    setIsPermissionsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const response = await apiService.deleteAdministrator(id);
      if (response.success) {
        message.success("Administrator deleted successfully");
        fetchAdministrators(); // Refresh the list
      } else {
        message.error("Failed to delete administrator");
      }
    } catch (error) {
      console.error("Error deleting administrator:", error);
      message.error("Failed to delete administrator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiService.createAdministrator({
        ...values,
        role: createFormRole,
      });
      if (response.success) {
        message.success("Administrator created successfully");
        setIsCreateModalVisible(false);
        form.resetFields();
        fetchAdministrators(); // Refresh the list
      } else {
        message.error("Failed to create administrator");
      }
    } catch (error) {
      console.error("Error creating administrator:", error);
      message.error("Failed to create administrator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiService.updateAdministrator(selectedAdmin._id, {
        ...values,
        role: editFormRole,
      });
      if (response.success) {
        message.success("Administrator updated successfully");
        setIsEditModalVisible(false);
        form.resetFields();
        fetchAdministrators(); // Refresh the list
      } else {
        message.error("Failed to update administrator");
      }
    } catch (error) {
      console.error("Error updating administrator:", error);
      message.error("Failed to update administrator");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionsSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiService.updatePermissions(selectedAdmin._id, values.permissions);
      if (response.success) {
        message.success("Permissions updated successfully");
        setIsPermissionsModalVisible(false);
        permissionsForm.resetFields();
        fetchAdministrators(); // Refresh the list
      } else {
        message.error("Failed to update permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      message.error("Failed to update permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (value) => {
    setCurrentUsername(value);
    
    // Generate username suggestions based on fullName
    const fullName = form.getFieldValue("fullName");
    if (fullName) {
      const nameParts = fullName.toLowerCase().split(" ");
      if (nameParts.length >= 2) {
        const suggestions = [
          nameParts[0] + "." + nameParts[nameParts.length - 1],
          nameParts[0] + "_" + nameParts[nameParts.length - 1],
          nameParts[0][0] + nameParts[nameParts.length - 1],
          nameParts[0] + nameParts[nameParts.length - 1][0],
        ];
        setUsernameSuggestions(suggestions.map(item => ({ value: item })));
      }
    }
  };

  return (
    <OrganizationLayout>
      <div style={customStyles.pageContainer}>
        {/* Header */}
        <div style={customStyles.header}>
          <div style={customStyles.headerLeft}>
            <h1 style={customStyles.title}>Administrators</h1>
            <Text type="secondary">
              Manage administrators who have access to the breast cancer screening system
            </Text>
          </div>
          <div style={customStyles.headerRight}>
            <div style={customStyles.searchSection}>
              <div style={customStyles.searchBar}>
                <Input
                  placeholder="Search administrators..."
                  prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
                  value={searchText}
                  onChange={handleSearch}
                  allowClear
                />
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={customStyles.createButton}
              className="btn-premium"
            >
              Add Administrator
            </Button>
          </div>
        </div>

        {/* Table */}
        <div style={customStyles.table}>
          <Table
            columns={columns}
            dataSource={filteredAdministrators}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              total: totalAdministrators,
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
            }}
            scroll={{ x: 1300 }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    <span style={{ color: "var(--text-secondary)" }}>
                      No administrators found
                    </span>
                  }
                />
              ),
            }}
          />
        </div>

        {/* Create Administrator Modal */}
        <Modal
          title="Add Administrator"
          open={isCreateModalVisible}
          onCancel={handleCreateCancel}
          footer={null}
          style={customStyles.modal}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSubmit}
            initialValues={{ role: "admin" }}
          >
            <div style={customStyles.formSection}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Administrator Details</h3>
              <p style={customStyles.formDescription}>
                Enter the personal details of the administrator
              </p>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                />
              </Form.Item>

              <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: "Please enter designation" }]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="E.g. IT Manager, Department Head, etc."
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email ID"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>
            </div>

            <div style={customStyles.formSection}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Account Information</h3>
              <p style={customStyles.formDescription}>
                Set up account credentials and role
              </p>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <AutoComplete
                  options={usernameSuggestions}
                  onChange={handleUsernameChange}
                  value={currentUsername}
                >
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="Enter username"
                  />
                </AutoComplete>
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 8, message: "Password must be at least 8 characters" }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                />
              </Form.Item>

              <Form.Item name="role" label="Role">
                <Radio.Group onChange={(e) => setCreateFormRole(e.target.value)} value={createFormRole}>
                  <Radio value="superadmin">Super Admin (All Permissions)</Radio>
                  <Radio value="admin">Admin (Limited Permissions)</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div style={{ textAlign: "right" }}>
              <Button
                key="back"
                onClick={handleCreateCancel}
                style={{
                  marginRight: "8px",
                  borderColor: "var(--border-color)",
                }}
              >
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{
                  background: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Create Administrator
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Edit Administrator Modal */}
        <Modal
          title="Edit Administrator"
          open={isEditModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          style={customStyles.modal}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditSubmit}
          >
            <div style={customStyles.formSection}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Administrator Details</h3>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                />
              </Form.Item>

              <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: "Please enter designation" }]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="E.g. IT Manager, Department Head, etc."
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email ID"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input
                  prefix={<IdcardOutlined />}
                  placeholder="Enter username"
                  disabled
                />
              </Form.Item>

              <Form.Item name="role" label="Role">
                <Radio.Group onChange={(e) => setEditFormRole(e.target.value)} value={editFormRole}>
                  <Radio value="superadmin">Super Admin (All Permissions)</Radio>
                  <Radio value="admin">Admin (Limited Permissions)</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div style={{ textAlign: "right" }}>
              <Button
                key="back"
                onClick={handleEditCancel}
                style={{
                  marginRight: "8px",
                  borderColor: "var(--border-color)",
                }}
              >
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{
                  background: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Update Administrator
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Permissions Modal */}
        <Modal
          title="Manage Permissions"
          open={isPermissionsModalVisible}
          onCancel={handlePermissionsCancel}
          footer={null}
          style={customStyles.modal}
          width={600}
        >
          <Form
            form={permissionsForm}
            layout="vertical"
            onFinish={handlePermissionsSubmit}
          >
            <p style={customStyles.formDescription}>
              Set which areas of the breast cancer screening system this administrator can access and manage.
            </p>

            <Form.Item name="permissions">
              {Object.entries(permissionConfig).map(([key, permission]) => (
                <div key={key} style={customStyles.permissionItem}>
                  <div>
                    <div style={customStyles.permissionTitle}>
                      {permission.icon} {permission.label}
                    </div>
                    <div style={customStyles.permissionDescription}>
                      {permission.description}
                    </div>
                  </div>
                  <Form.Item name={["permissions", key]} valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                </div>
              ))}
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: "24px" }}>
              <Button
                onClick={() => {
                  permissionsForm.setFieldsValue({
                    permissions: allPermissionKeys,
                  });
                }}
                style={{
                  marginRight: "8px",
                  borderColor: "var(--primary-color)",
                  color: "var(--primary-color)",
                }}
              >
                Select All
              </Button>
              <Button
                onClick={() => {
                  permissionsForm.setFieldsValue({
                    permissions: [],
                  });
                }}
                style={{
                  marginRight: "8px",
                  borderColor: "var(--border-color)",
                }}
              >
                Clear All
              </Button>
              <Button
                key="back"
                onClick={handlePermissionsCancel}
                style={{
                  marginRight: "8px",
                  borderColor: "var(--border-color)",
                }}
              >
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{
                  background: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Save Permissions
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </OrganizationLayout>
  );
}

export default Administrators;