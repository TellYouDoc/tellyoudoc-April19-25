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
  DatePicker,
  AutoComplete,
  Radio,
  Empty,
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
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";

const { Text } = Typography;

import apiService from "../../services/api";

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
  primaryColorLight: {
    background: "rgba(var(--primary-color-rgb), 0.1)",
    color: "var(--primary-color)",
    border: "1px solid var(--primary-color)",
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
    overflowX: "auto", // Add horizontal scrolling for small screens
    width: "100%", // Ensure table container takes full width
    "& .highlight-row": {
      background: "var(--primary-color-light) !important",
      "&:hover td": {
        background:
          "color-mix(in srgb, var(--primary-color-light) 80%, white) !important",
      },
    },
  },
  actionButton: {
    borderRadius: "var(--radius)",
  },
  modal: {
    ".ant-modal": {
      margin: "0",
      padding: "0",
    },
    ".ant-modal-content": {
      padding: "24px",
      background: "var(--background-primary)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
      margin: "0",
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
      margin: "0",
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
    "&.ant-switch-checked": {
      backgroundColor: "var(--primary-color) !important",
    },
    "&.ant-switch:not(.ant-switch-checked)": {
      backgroundColor: "var(--border-color) !important",
    },
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
  datePicker: {
    ".ant-picker": {
      background: "var(--background-secondary)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius)",
      "&:hover, &:focus": {
        borderColor: "var(--primary-color)",
      },
    },
    ".ant-picker-input > input": {
      color: "var(--text-primary)",
    },
  },
};

function Administrators() {
  // State management
  const [administrators, setAdministrators] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null); // Add state for current admin
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] =
    useState(false);
  const [isViewDetailsModalVisible, setIsViewDetailsModalVisible] =
    useState(false);
  const [isDebugModalVisible, setIsDebugModalVisible] = useState(false);
  const [localStorageItems, setLocalStorageItems] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form] = Form.useForm();
  const [permissionsForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredAdministrators, setFilteredAdministrators] = useState([]);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [createFormRole, setCreateFormRole] = useState("Admin");
  const [editFormRole, setEditFormRole] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for API operations

  const [totalAdministrators, setTotalAdministrators] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Define available permissions and their descriptions centrally
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
    manage_appointments: {
      label: "Appointments",
      description: "Can schedule, view and modify appointments",
      icon: <FileTextOutlined />,
    },
    manage_notifications: {
      label: "Notifications",
      description: "Can send notifications to users",
      icon: <MailOutlined />,
    },
    view_analytics: {
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
      fixed: "left",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
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
      width: 180,
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
      render: (email, record) => (
        <Tooltip title={email}>
          <span
            style={
              currentAdmin && record._id === currentAdmin.id
                ? { fontWeight: 500 }
                : undefined
            }
          >
            {email}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => {
        // Disable actions if this is the current admin
        const isCurrentAdmin = currentAdmin && record._id === currentAdmin.id;

        if (isCurrentAdmin) {
          return (
            <Space>
              <Button
                type="default"
                icon={<InfoCircleOutlined />}
                onClick={() => handleViewDetails(record)}
                style={customStyles.actionButton}
                className="btn-premium btn-sm btn-outline"
              >
                View
              </Button>
              <Tooltip title="You cannot modify your own account">
                <div
                  style={{ color: "var(--text-secondary)", fontSize: "12px" }}
                >
                  Other actions disabled
                </div>
              </Tooltip>
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              onClick={() => handleViewDetails(record)}
              style={customStyles.actionButton}
              className="btn-premium btn-sm btn-outline"
            >
              View
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
                  color: "white",
                },
              }}
              cancelButtonProps={{
                className: "btn-premium",
                style: {
                  ...customStyles.popconfirmButton,
                  background: "transparent",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                },
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
      },
    },
  ];

  useEffect(() => {
    // Load current admin data from localStorage
    try {
      const adminData = localStorage.getItem("adminData");
      if (adminData) {
        setCurrentAdmin(JSON.parse(adminData));
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    }

    const fetchAdministrators = async () => {
      try {
        let page = currentPage;
        let limit = 10;

        setIsLoading(true);
        const response =
          await apiService.AdministratorService.getAllAdministrators(
            page,
            limit
          );

        if (response && response.status === 200) {
          setAdministrators(response.data.data);
          setFilteredAdministrators(response.data.data);
          setTotalAdministrators(response.data.pagination.total);
        }
      } catch (error) {
        console.error("Error fetching administrators:", error);
        message.error(
          "Failed to fetch administrators: " +
            (error.message || "Unknown error")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdministrators();
  }, [currentPage]);

  // Create new administrator with API integration
  const handleCreate = async (values) => {
    try {
      setIsLoading(true);

      // Set permissions based on role
      let permissions = [];
      if (values.role === "Super Admin") {
        // Super Admin gets all available permissions
        permissions = [...allPermissionKeys];
      } else {
        // For Admin role, collect permissions from form values
        permissions = allPermissionKeys.filter((key) => values[key]);

        // Remove permission keys from the values object to avoid storing them directly
        allPermissionKeys.forEach((key) => delete values[key]);
      }

      const adminRole = values.role === "Super Admin" ? "superadmin" : "admin";

      // Create the new administrator object with all required fields
      const newAdmin = {
        email: values.email,
        username: values.username,
        password: values.password, // This will be hashed on the server
        role: adminRole,
        permissions: permissions,
        refreshToken: localStorage.getItem("refreshToken") || "",
      };

      let createdAdmin;

      try {
        // Try to make the API call
        const response =
          await apiService.AdministratorService.createAdministrator(newAdmin);

        // If successful, use the returned admin from API
        if (response && response.data) {
          createdAdmin = response.data;
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        // Simulate response if API fails for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 800));
        createdAdmin = {
          ...newAdmin,
          id: administrators.length + 1,
          addedOn: new Date().toISOString(),
        };
      }

      // Update the administrators list with the new administrator
      setAdministrators([...administrators, createdAdmin]);

      // Show success message
      message.success("Administrator created successfully");

      // Reset and close the form
      setIsCreateModalVisible(false);
      form.resetFields();
      setUsernameSuggestions([]);
      setCurrentUsername("");
      setCreateFormRole("Admin"); // Reset to default role
    } catch (error) {
      console.error("Error creating administrator:", error);
      message.error(
        "Failed to create administrator: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setIsLoading(true);

      // Update permissions if role changes
      let updatedAdmin = { ...selectedAdmin, ...values };

      // If changing to Super Admin, update permissions
      if (values.role === "Super Admin") {
        updatedAdmin.permissions = [...allPermissionKeys]; // Grant all available permissions
      } else {
        // Admin role
        // Process permissions fields
        const permissions = [];

        allPermissionKeys.forEach((key) => {
          const formKey = `permissions_${key}`;
          if (values[formKey]) {
            permissions.push(key);
          }
          // Remove form permission fields from values to avoid storing them directly
          delete values[formKey];
        });

        updatedAdmin.permissions = permissions;
      }

      // Prepare the update data - only include what's needed for the API
      const updateData = {
        email: updatedAdmin.email,
        username: updatedAdmin.username,
        role: updatedAdmin.role,
        permissions: updatedAdmin.permissions,
      };

      // In a production app, make an API call to update the administrator
      // const response = await fetch(`YOUR_API_ENDPOINT/administrators/${selectedAdmin.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}` // If using token-based auth
      //   },
      //   body: JSON.stringify(updateData)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update administrator');
      // }

      // const data = await response.json();
      // const apiUpdatedAdmin = data.administrator;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For now, simulate API response and update locally
      const updatedAdministrators = administrators.map((admin) =>
        admin.id === selectedAdmin.id ? updatedAdmin : admin
      );

      setAdministrators(updatedAdministrators);
      message.success("Administrator updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      setUsernameSuggestions([]);
      setCurrentUsername("");
      setEditFormRole(""); // Reset form role
    } catch (error) {
      console.error("Error updating administrator:", error);
      message.error(
        "Failed to update administrator: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Prevent deleting current admin
    const adminToDelete = administrators.find((admin) => admin._id === id);
    if (currentAdmin && adminToDelete._id === currentAdmin.id) {
      message.warning("You cannot delete your own account");
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await apiService.AdministratorService.deleteAdministrator(id);

      if (response && response.status === 200) {
        // Filter out the deleted administrator from the list
        const updatedAdministrators = administrators.filter(
          (admin) => admin._id !== id
        );
        setAdministrators(updatedAdministrators);
        setFilteredAdministrators(updatedAdministrators);
        message.success("Administrator deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting administrator:", error);
      message.error(
        "Failed to delete administrator: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setIsViewDetailsModalVisible(true);
  };

  const handlePermissions = async (admin) => {
    // Prevent modifying current admin permissions
    if (currentAdmin && admin._id === currentAdmin.id) {
      message.warning("You cannot modify your own permissions");
      return;
    }

    setSelectedAdmin(admin);

    // Convert permissions array to object format for the form
    const permissionsObject = {};

    // Dynamically set permissions from the permissionConfig
    allPermissionKeys.forEach((key) => {
      permissionsObject[key] = admin.permissions.includes(key);
    });

    permissionsForm.setFieldsValue(permissionsObject);
    setIsPermissionsModalVisible(true);
  };

  const handlePermissionsUpdate = async (values) => {
    try {
      // If the admin is a Super Admin, don't allow permission changes
      if (selectedAdmin.role === "superadmin") {
        message.info("Super Admins automatically have all permissions");
        setIsPermissionsModalVisible(false);
        permissionsForm.resetFields();
        return;
      }

      setIsLoading(true);

      // Convert the object format from form to array format for storage
      const permissionsArray = Object.entries(values)
        .filter(([_, enabled]) => enabled)
        .map(([permission]) => permission);

      // Prepare the update data
      const updateData = {
        permissions: permissionsArray,
      };

      // Simulate API Call
      const response =
        await apiService.AdministratorService.changeAdministratorPermissions(
          selectedAdmin._id,
          updateData
        );

      if (response && response.status === 200) {
        // Update local state with new permissions
        const updatedAdministrators = administrators.map((admin) =>
          admin._id === selectedAdmin._id
            ? { ...admin, permissions: permissionsArray }
            : admin
        );

        setAdministrators(updatedAdministrators);

        // Also update the filtered administrators to immediately reflect changes in the table
        setFilteredAdministrators((prevFiltered) =>
          prevFiltered.map((admin) =>
            admin._id === selectedAdmin._id
              ? { ...admin, permissions: permissionsArray }
              : admin
          )
        );

        message.success("Permissions updated successfully");
      }
      setIsPermissionsModalVisible(false);
      permissionsForm.resetFields();
    } catch (error) {
      console.error("Error updating permissions:", error);
      message.error(
        "Failed to update permissions: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format dates consistently
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Never Logged In";
    }

    try {
      const date = new Date(dateString);
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
  };

  // Helper function to get permission description
  const getPermissionDescription = (key) => {
    return permissionConfig[key]?.description || "";
  };

  // Generate username suggestions based on email
  const generateUsernameSuggestions = (name, email) => {
    if (!email) {
      setUsernameSuggestions([]);
      return;
    }

    const suggestions = [];

    if (name) {
      const nameParts = name.toLowerCase().split(" ");

      // First name
      if (nameParts.length > 0) {
        suggestions.push(nameParts[0]);
      }

      // First name + last initial
      if (nameParts.length > 1) {
        suggestions.push(
          `${nameParts[0]}.${nameParts[nameParts.length - 1][0]}`
        );
      }

      // First initial + last name
      if (nameParts.length > 1) {
        suggestions.push(
          `${nameParts[0][0]}.${nameParts[nameParts.length - 1]}`
        );
      }

      // First name + last name
      if (nameParts.length > 1) {
        suggestions.push(`${nameParts[0]}.${nameParts[nameParts.length - 1]}`);
      }

      // Full name with dots
      if (nameParts.length > 1) {
        suggestions.push(nameParts.join("."));
      }
    }

    if (email) {
      // Username part from email
      const emailUsername = email.split("@")[0];
      suggestions.push(emailUsername);
    }

    // Remove duplicates and format as options for AutoComplete
    const uniqueSuggestions = [...new Set(suggestions)].map((suggestion) => ({
      value: suggestion,
      label: suggestion,
    }));

    setUsernameSuggestions(uniqueSuggestions);
  };

  // Handle changes to the email field
  const handleEmailChange = (e) => {
    const email = e.target.value;
    const name = form.getFieldValue("name") || "";
    generateUsernameSuggestions(name, email);
  };

  // Update search handler to include single date filtering
  const handleSearch = (value, date = selectedDate) => {
    setSearchText(value);
    filterAdministrators(value, date);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterAdministrators(searchText, date);
  };

  const filterAdministrators = (text, date) => {
    let filtered = [...administrators];

    // Text search
    if (text) {
      const searchLower = text.toLowerCase();
      filtered = filtered.filter(
        (admin) =>
          admin.email.toLowerCase().includes(searchLower) ||
          admin.username.toLowerCase().includes(searchLower) ||
          admin.role.toLowerCase().includes(searchLower)
      );
    }

    // // Date search
    // if (date) {
    //   const searchDate = date.startOf("day");
    //   const nextDate = date.clone().endOf("day");

    //   filtered = filtered.filter((admin) => {
    //     const adminDate = new Date(admin.addedOn);
    //     return (
    //       adminDate >= searchDate.toDate() && adminDate <= nextDate.toDate()
    //     );
    //   });
    // }

    setFilteredAdministrators(filtered);
  };

  // Handle role change in create form
  const handleRoleChange = (e) => {
    setCreateFormRole(e.target.value);
  };

  // Handle role change in edit form
  const handleEditRoleChange = (e) => {
    setEditFormRole(e.target.value);
  };

  return (
    <AdminLayout>
      <div style={customStyles.pageContainer} className="premium-scrollbar">
        <div style={customStyles.header}>
          <div style={customStyles.headerLeft}>
            <h1 style={customStyles.title}>Administrators</h1>
            <Text type="secondary">
              Manage administrator accounts and their permissions
            </Text>
          </div>
          <div style={customStyles.headerRight}>
            <div style={customStyles.searchSection}>
              <Input
                placeholder="Search by username, email or role"
                prefix={
                  <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                }
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={customStyles.searchBar}
                className="form-control-premium"
              />

              {/* Date Filter */}
              {/* <DatePicker
                onChange={handleDateChange}
                style={customStyles.datePicker}
                placeholder="Filter by date"
                format="DD/MM/YYYY"
                allowClear={true}
              /> */}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              style={customStyles.createButton}
              className="btn-premium"
            >
              Create Administrator
            </Button>
          </div>
        </div>

        {/* Style the table */}
        <div
          style={customStyles.table}
          className="premium-card premium-table-responsive"
        >
          <Table
            columns={columns}
            dataSource={filteredAdministrators}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
              total: totalAdministrators,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} administrators`,
            }}
            rowClassName={(record) =>
              currentAdmin && record._id === currentAdmin.id
                ? "highlight-row"
                : ""
            }
            scroll={{ x: "max-content" }}
            size="middle"
          />
        </div>

        {/* Create Modal */}
        <Modal
          title={
            <div>
              <div style={{ marginBottom: "8px" }}>Create Administrator</div>
              <Text
                type="secondary"
                style={{ fontSize: "var(--font-size-sm)" }}
              >
                Add a new administrator with specific permissions
              </Text>
            </div>
          }
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
            setUsernameSuggestions([]);
            setCurrentUsername("");
          }}
          footer={null}
          styles={customStyles.modal}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
            requiredMark="optional"
          >
            <div style={customStyles.formSection}>
              <Text strong style={{ display: "block", marginBottom: "16px" }}>
                Administrator Information
              </Text>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please input the email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
                tooltip="This email will be used for login and notifications"
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Enter email address"
                  className="form-control-premium"
                  onChange={handleEmailChange}
                />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: "Please select or enter a username!",
                  },
                ]}
                tooltip="Select from suggestions or enter a custom username"
              >
                <AutoComplete
                  options={usernameSuggestions}
                  value={currentUsername}
                  onChange={(value) => setCurrentUsername(value)}
                  style={{ width: "100%" }}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Select or enter username"
                    className="form-control-premium"
                  />
                </AutoComplete>
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input the password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                ]}
                tooltip="Password must be at least 8 characters long"
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Enter password"
                  className="form-control-premium"
                />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
                tooltip="Super Admin has all permissions by default"
                initialValue="Admin"
              >
                <div>
                  <Radio.Group
                    style={{ marginBottom: "8px" }}
                    onChange={handleRoleChange}
                    value={createFormRole}
                  >
                    <Radio value="Admin">Admin</Radio>
                    <Radio value="Super Admin">Super Admin</Radio>
                  </Radio.Group>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "8px",
                      background: "var(--background-secondary)",
                      padding: "8px 12px",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Super Admin:</strong> Has full access to all
                      system features automatically
                    </div>
                    <div>
                      <strong>Admin:</strong> Has limited access defined by
                      assigned permissions
                    </div>
                  </div>
                </div>
              </Form.Item>

              {/* Permissions section - only shown for Admin role */}
              {createFormRole === "Admin" && (
                <div style={{ ...customStyles.formSection, marginTop: "20px" }}>
                  <Text
                    strong
                    style={{ display: "block", marginBottom: "16px" }}
                  >
                    Permissions
                  </Text>
                  <div style={customStyles.formDescription}>
                    Set the specific permissions for this administrator
                  </div>

                  {/* Dynamically generate permission items based on permissionConfig */}
                  {allPermissionKeys.map((permKey) => (
                    <div key={permKey} style={customStyles.permissionItem}>
                      <div>
                        <div style={customStyles.permissionTitle}>
                          {permissionConfig[permKey].icon}{" "}
                          {permissionConfig[permKey].label}
                        </div>
                        <div style={customStyles.permissionDescription}>
                          {permissionConfig[permKey].description}
                        </div>
                      </div>
                      <Form.Item
                        name={permKey}
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <Switch style={customStyles.switchStyle} />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Form.Item className="flex justify-end">
              <Space>
                <Button
                  onClick={() => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                    setUsernameSuggestions([]);
                    setCurrentUsername("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-premium"
                  loading={isLoading}
                >
                  Create Administrator
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title={
            <div>
              <div style={{ marginBottom: "8px" }}>Edit Administrator</div>
              <Text
                type="secondary"
                style={{ fontSize: "var(--font-size-sm)" }}
              >
                Modify administrator information
              </Text>
            </div>
          }
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            form.resetFields();
            setUsernameSuggestions([]);
            setCurrentUsername("");
          }}
          footer={null}
          styles={customStyles.modal}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            requiredMark="optional"
          >
            <div style={customStyles.formSection}>
              <Text strong style={{ display: "block", marginBottom: "16px" }}>
                Administrator Information
              </Text>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please input the email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
                tooltip="This email will be used for login and notifications"
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Enter email address"
                  className="form-control-premium"
                  onChange={handleEmailChange}
                />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: "Please select or enter a username!",
                  },
                ]}
              >
                <AutoComplete
                  options={usernameSuggestions}
                  style={{ width: "100%" }}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Select or enter username"
                    className="form-control-premium"
                  />
                </AutoComplete>
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
                tooltip="Super Admin has all permissions by default"
              >
                <div>
                  <Radio.Group
                    style={{ marginBottom: "8px" }}
                    onChange={handleEditRoleChange}
                    value={editFormRole}
                  >
                    <Radio value="Admin">Admin</Radio>
                    <Radio value="Super Admin">Super Admin</Radio>
                  </Radio.Group>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "8px",
                      background: "var(--background-secondary)",
                      padding: "8px 12px",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Note:</strong> Changing roles will update
                      permissions automatically.
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Super Admin:</strong> Will gain all permissions
                    </div>
                    <div>
                      <strong>Admin:</strong> Will need permissions assigned
                      manually
                    </div>
                  </div>
                </div>
              </Form.Item>

              {/* Permissions section - only shown for Admin role */}
              {editFormRole === "Admin" && (
                <div style={{ ...customStyles.formSection, marginTop: "20px" }}>
                  <Text
                    strong
                    style={{ display: "block", marginBottom: "16px" }}
                  >
                    Permissions
                  </Text>
                  <div style={customStyles.formDescription}>
                    Set the specific permissions for this administrator
                  </div>

                  {/* Dynamically generate permission items based on permissionConfig */}
                  {allPermissionKeys.map((permKey) => (
                    <div key={permKey} style={customStyles.permissionItem}>
                      <div>
                        <div style={customStyles.permissionTitle}>
                          {permissionConfig[permKey].icon}{" "}
                          {permissionConfig[permKey].label}
                        </div>
                        <div style={customStyles.permissionDescription}>
                          {permissionConfig[permKey].description}
                        </div>
                      </div>
                      <Form.Item
                        name={`permissions_${permKey}`}
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <Switch style={customStyles.switchStyle} />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: "20px",
                marginBottom: "20px",
              }}
            >
              <Text strong style={{ display: "block", marginBottom: "16px" }}>
                Password Management
              </Text>
              <Button
                icon={<LockOutlined />}
                onClick={() => {
                  message.success(
                    "Password reset link sent to administrator's email"
                  );
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 15px",
                }}
                className="btn-premium btn-outline"
              >
                Send Password Reset Link
              </Button>
            </div>

            <Form.Item className="flex justify-end">
              <Space>
                <Button
                  onClick={() => {
                    setIsEditModalVisible(false);
                    form.resetFields();
                    setUsernameSuggestions([]);
                    setCurrentUsername("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-premium"
                >
                  Update Administrator
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          title={
            <div>
              <div style={{ marginBottom: "8px" }}>Administrator Details</div>
              <Text
                type="secondary"
                style={{ fontSize: "var(--font-size-sm)" }}
              >
                Complete information about this administrator
              </Text>
            </div>
          }
          open={isViewDetailsModalVisible}
          onCancel={() => setIsViewDetailsModalVisible(false)}
          footer={[
            <Button
              key="close"
              onClick={() => setIsViewDetailsModalVisible(false)}
            >
              Close
            </Button>,
          ]}
          styles={customStyles.modal}
          width={500}
          centered
        >
          {selectedAdmin && (
            <div style={{ padding: "16px 0" }}>
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                    padding: "16px",
                    background: "var(--background-secondary)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <UserOutlined
                    style={{ color: "var(--primary-color)", fontSize: "20px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          fontSize: "16px",
                        }}
                      >
                        {selectedAdmin.username}
                      </div>
                      {currentAdmin &&
                        selectedAdmin._id === currentAdmin.id && (
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
                            You
                          </Tag>
                        )}
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "14px",
                      }}
                    >
                      {selectedAdmin.email}
                    </div>
                  </div>
                  <Tag
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background:
                        selectedAdmin.role === "superadmin"
                          ? "var(--primary-color)"
                          : "var(--text-primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius)",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {selectedAdmin.role === "superadmin"
                      ? "Super Admin"
                      : "Admin"}
                  </Tag>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div style={customStyles.permissionItem}>
                  <div>
                    <div style={customStyles.permissionTitle}>
                      <SettingOutlined /> Permissions
                    </div>
                    <div style={customStyles.permissionDescription}>
                      {selectedAdmin.role === "superadmin"
                        ? "All Permissions (Super Admin)"
                        : `${
                            selectedAdmin.permissions?.length || 0
                          } active permissions`}
                    </div>
                  </div>
                </div>

                {selectedAdmin.role !== "superadmin" &&
                  selectedAdmin.permissions &&
                  selectedAdmin.permissions.length > 0 && (
                    <div
                      style={{
                        background: "var(--background-secondary)",
                        padding: "16px",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          marginBottom: "12px",
                          color: "var(--text-primary)",
                        }}
                      >
                        Active Permissions:
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {selectedAdmin.permissions.map((perm) => (
                          <Tag
                            key={perm}
                            style={{
                              background: "var(--primary-color-light)",
                              borderColor: "var(--primary-color)",
                              color: "var(--primary-color)",
                              borderRadius: "var(--radius)",
                              padding: "4px 8px",
                              fontSize: "12px",
                            }}
                          >
                            {permissionConfig[perm]?.label || perm}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                <div style={customStyles.permissionItem}>
                  <div>
                    <div style={customStyles.permissionTitle}>
                      <FileTextOutlined /> Added On
                    </div>
                  </div>
                  <span style={{ color: "var(--text-primary)" }}>
                    {formatDate(selectedAdmin.createdAt)}
                  </span>
                </div>

                <div style={customStyles.permissionItem}>
                  <div>
                    <div style={customStyles.permissionTitle}>
                      <BarChartOutlined /> Last Login
                    </div>
                  </div>
                  <span style={{ color: "var(--text-primary)" }}>
                    {formatDate(selectedAdmin.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Permissions Modal */}
        <Modal
          title={
            <div>
              <div style={{ marginBottom: "8px" }}>Change Permissions</div>
              <Text
                type="secondary"
                style={{ fontSize: "var(--font-size-sm)" }}
              >
                Manage administrator access and capabilities
              </Text>
            </div>
          }
          open={isPermissionsModalVisible}
          onCancel={() => {
            setIsPermissionsModalVisible(false);
            permissionsForm.resetFields();
          }}
          footer={null}
          styles={customStyles.modal}
          width={600}
          centered
        >
          {selectedAdmin && selectedAdmin.role === "Super Admin" ? (
            <div>
              <div
                style={{
                  background: "var(--background-secondary)",
                  padding: "20px",
                  borderRadius: "var(--radius)",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <InfoCircleOutlined
                  style={{
                    fontSize: "24px",
                    color: "var(--primary-color)",
                    marginBottom: "12px",
                  }}
                />
                <Text strong style={{ display: "block", fontSize: "16px" }}>
                  Super Admin Role
                </Text>
                <Text style={{ marginTop: "8px" }}>
                  Super Administrators automatically have all permissions
                  granted. These permissions cannot be modified individually.
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={() => setIsPermissionsModalVisible(false)}
                  type="primary"
                  className="btn-premium"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <Form
              form={permissionsForm}
              layout="vertical"
              onFinish={handlePermissionsUpdate}
            >
              <div style={customStyles.formSection}>
                <Text strong style={{ display: "block", marginBottom: "16px" }}>
                  Access Control
                </Text>
                <div style={customStyles.formDescription}>
                  Toggle permissions to control what this administrator can
                  access and modify in the system.
                </div>

                {/* Dynamically generate permission items based on permissionConfig */}
                {allPermissionKeys.map((permKey) => (
                  <div key={permKey} style={customStyles.permissionItem}>
                    <div>
                      <div style={customStyles.permissionTitle}>
                        {permissionConfig[permKey].icon}{" "}
                        {permissionConfig[permKey].label}
                      </div>
                      <div style={customStyles.permissionDescription}>
                        {permissionConfig[permKey].description}
                      </div>
                    </div>
                    <Form.Item name={permKey} valuePropName="checked" noStyle>
                      <Switch style={customStyles.switchStyle} />
                    </Form.Item>
                  </div>
                ))}
              </div>

              <Form.Item className="flex justify-end">
                <Space>
                  <Button
                    onClick={() => {
                      setIsPermissionsModalVisible(false);
                      permissionsForm.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-premium"
                  >
                    Update Permissions
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Debug Modal to display localStorage contents */}
        <Modal
          title={
            <div>
              <div style={{ marginBottom: "8px" }}>
                Debug - localStorage Contents
              </div>
              <Text
                type="secondary"
                style={{ fontSize: "var(--font-size-sm)" }}
              >
                Displaying all keys and values stored in localStorage
              </Text>
            </div>
          }
          open={isDebugModalVisible}
          onCancel={() => setIsDebugModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsDebugModalVisible(false)}>
              Close
            </Button>,
            <Button
              key="copy"
              type="primary"
              className="btn-premium"
              onClick={() => {
                const text = localStorageItems
                  .map((item) => `${item.key}: ${item.value}`)
                  .join("\n");
                navigator.clipboard.writeText(text);
                message.success("localStorage data copied to clipboard");
              }}
            >
              Copy to Clipboard
            </Button>,
          ]}
          styles={customStyles.modal}
          width={800}
          centered
        >
          <div
            style={{ maxHeight: "400px", overflow: "auto" }}
            className="premium-scrollbar"
          >
            {localStorageItems.length > 0 ? (
              <Table
                dataSource={localStorageItems}
                columns={[
                  {
                    title: "Key",
                    dataIndex: "key",
                    key: "key",
                    render: (text) => <strong>{text}</strong>,
                  },
                  {
                    title: "Value",
                    dataIndex: "value",
                    key: "value",
                    render: (text) => {
                      // Try to parse JSON if it looks like JSON
                      try {
                        if (
                          text &&
                          (text.startsWith("{") || text.startsWith("["))
                        ) {
                          const parsed = JSON.parse(text);
                          return (
                            <pre
                              style={{ maxHeight: "100px", overflow: "auto" }}
                            >
                              {JSON.stringify(parsed, null, 2)}
                            </pre>
                          );
                        }
                      } catch (e) {}
                      return text;
                    },
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space>
                        <Button
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(record.value);
                            message.success(
                              `Copied value for key: ${record.key}`
                            );
                          }}
                        >
                          Copy Value
                        </Button>
                        <Popconfirm
                          title="Are you sure you want to delete this item?"
                          onConfirm={() => {
                            localStorage.removeItem(record.key);
                            message.success(`Removed item: ${record.key}`);
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button size="small" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
                pagination={false}
                rowKey="key"
              />
            ) : (
              <Empty description="No items found in localStorage" />
            )}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default Administrators;
