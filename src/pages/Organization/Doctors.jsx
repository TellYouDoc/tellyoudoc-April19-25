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
  Typography,
  Popconfirm,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  MailOutlined,
  UserAddOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import OrganizationLayout from "../../components/OrganizationLayout";
import apiService from "../../services/api";

const { Option } = Select;
const { Title, Text } = Typography;

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [inviteForm] = Form.useForm();
  const [specializationFilter, setSpecializationFilter] = useState("all");

  const [totalDoctors, setTotalDoctors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Status color mapping
  const statusColors = {
    active: "success",
    inactive: "error",
    pending: "warning",
  };

  // Mock specializations
  const specializations = [
    "Cardiologist",
    "Oncologist",
    "Gynecologist",
    "Radiologist",
    "General Practitioner",
    "Surgeon",
    "Dermatologist",
  ];

  // Handle status change
  const handleStatusChange = (doctorId, newStatus) => {
    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === doctorId ? { ...doctor, isActive: newStatus } : doctor
    );
    setDoctors(updatedDoctors);
    message.success(`Doctor status updated to ${newStatus ? 'Active' : 'Inactive'}`);
  };

  // Navigate to doctor profile
  const handleViewProfile = (doctor) => {
    navigate(`/organization/doctors/${doctor.id}`);
  };

  // Open edit modal
  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    editForm.setFieldsValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialization: doctor.specialization,
      yearsOfExperience: doctor.yearsOfExperience,
      phoneNumber: doctor.phoneNumber,
    });
    setIsEditModalVisible(true);
  };

  // Handle doctor deletion
  const handleDelete = (doctorId) => {
    // In a real app, you'd call an API endpoint here
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== doctorId);
    setDoctors(updatedDoctors);
    message.success("Doctor removed successfully");
  };

  // Filter doctors based on status, specialization and search text
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "active" ? doctor.isActive : !doctor.isActive);
    const matchesSpecialization =
      specializationFilter === "all" || doctor.specialization === specializationFilter;
    const matchesSearch = 
      (doctor.firstName?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (doctor.lastName?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (doctor.email?.toLowerCase() || "").includes(searchText.toLowerCase());
    
    return matchesStatus && matchesSpecialization && matchesSearch;
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
      setLoading(true);
      try {
        // In a real app, this would be connected to a real API
        // For now, we'll use mock data
        const mockDoctors = [
          {
            id: "1",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@hospital.com",
            specialization: "Oncologist",
            yearsOfExperience: 8,
            isActive: true,
            phoneNumber: "+91 98765 43210",
            joinedDate: "2022-05-15T10:30:00Z",
          },
          {
            id: "2",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@hospital.com",
            specialization: "Radiologist",
            yearsOfExperience: 5,
            isActive: true,
            phoneNumber: "+91 87654 32109",
            joinedDate: "2022-07-22T14:20:00Z",
          },
          {
            id: "3",
            firstName: "Robert",
            lastName: "Williams",
            email: "robert.williams@hospital.com",
            specialization: "Gynecologist",
            yearsOfExperience: 12,
            isActive: false,
            phoneNumber: "+91 76543 21098",
            joinedDate: "2021-11-10T09:15:00Z",
          },
          {
            id: "4",
            firstName: "Jessica",
            lastName: "Brown",
            email: "jessica.brown@hospital.com",
            specialization: "Cardiologist",
            yearsOfExperience: 10,
            isActive: true,
            phoneNumber: "+91 65432 10987",
            joinedDate: "2022-03-18T11:45:00Z",
          },
          {
            id: "5",
            firstName: "Michael",
            lastName: "Davis",
            email: "michael.davis@hospital.com",
            specialization: "General Practitioner",
            yearsOfExperience: 6,
            isActive: true,
            phoneNumber: "+91 54321 09876",
            joinedDate: "2023-01-05T08:30:00Z",
          },
        ];

        setDoctors(mockDoctors);
        setTotalDoctors(mockDoctors.length);
        
        // In a real app with pagination:
        // setTotalDoctors(response.data.total);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        message.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Pagination state for correct serial number
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Submit handlers
  const handleAddSubmit = (values) => {
    // In a real app, you'd call an API endpoint here
    const newDoctor = {
      id: (doctors.length + 1).toString(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      specialization: values.specialization,
      yearsOfExperience: values.yearsOfExperience,
      isActive: true,
      phoneNumber: values.phoneNumber,
      joinedDate: new Date().toISOString(),
    };

    setDoctors([...doctors, newDoctor]);
    message.success("Doctor added successfully");
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const handleEditSubmit = (values) => {
    // In a real app, you'd call an API endpoint here
    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === selectedDoctor.id
        ? {
            ...doctor,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            specialization: values.specialization,
            yearsOfExperience: values.yearsOfExperience,
            phoneNumber: values.phoneNumber,
          }
        : doctor
    );

    setDoctors(updatedDoctors);
    message.success("Doctor information updated successfully");
    setIsEditModalVisible(false);
    editForm.resetFields();
  };
  const handleInviteSubmit = (values) => {
    // In a real app, you'd call an API endpoint to send an invitation
    const inviteMethod = values.inviteMethod;
    let successMessage = '';
    
    switch (inviteMethod) {
      case 'email':
        successMessage = `Invitation email sent to ${values.email}`;
        break;
      case 'phone':
        successMessage = `Invitation SMS sent to ${values.phoneNumber}`;
        break;
      case 'whatsapp':
        successMessage = `Invitation sent via WhatsApp to ${values.phoneNumber}`;
        break;
      case 'qrcode':
        successMessage = 'QR Code has been generated and downloaded';
        break;
      case 'link':
        successMessage = 'Invitation link has been copied to clipboard';
        // In a real app, you would copy to clipboard here
        break;
      default:
        successMessage = 'Invitation sent successfully';
    }
    
    message.success(successMessage);
    setIsInviteModalVisible(false);
    inviteForm.resetFields();
  };
  // Table columns configuration
  const columns = [
    {
      title: "Sl No",
      key: "slNo",
      width: 70,
      render: (_, __, index) => {
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        return startIndex + index + 1;
      },
      align: "center",
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Space>
          {`${record.firstName || ""} ${record.lastName || ""}`}
          <Tag 
            color={record.isActive ? "success" : "error"}
            key={record.isActive}
          >
            {record.isActive ? "Active" : "Inactive"}
          </Tag>
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
      render: (years) => `${years} years`,
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: "joinedDate",
      render: (text) => {
        try {
          const date = new Date(text);
          if (isNaN(date.getTime())) {
            return "Invalid Date";
          }
          return date.toLocaleDateString();
        } catch (error) {
          return "Invalid Date";
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 280,
      render: (_, record) => (        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            icon={<EyeOutlined style={actionIconStyle} />}
            onClick={() => handleViewProfile(record)}
            style={{
              ...actionButtonStyle,
              background: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            View
          </Button>

          {/* Status Actions */}
          {record.isActive ? (
            <Button
              danger
              icon={<CloseCircleOutlined style={actionIconStyle} />}
              onClick={() => handleStatusChange(record.id, false)}
              style={actionButtonStyle}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined style={actionIconStyle} />}
              onClick={() => handleStatusChange(record.id, true)}
              style={{
                ...actionButtonStyle,
                background: "var(--success-color, #52c41a)",
                borderColor: "var(--success-color, #52c41a)",
              }}
            >
              Activate
            </Button>
          )}

          <Popconfirm
            title="Are you sure you want to remove this doctor?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined style={actionIconStyle} />}
              style={actionButtonStyle}
            >
              Remove
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <OrganizationLayout>
      <div style={{ padding: "24px" }}>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>Doctor Management</Title>
            <Text type="secondary">
              Manage doctors who can perform breast cancer screenings
            </Text>
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsAddModalVisible(true)}
              style={{
                background: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              Add Doctor
            </Button>
            <Button
              icon={<MailOutlined />}
              onClick={() => setIsInviteModalVisible(true)}
            >
              Invite Doctor
            </Button>
          </Space>
        </div>

        {/* Filter Section */}
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            background: "#f9f9f9",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Input
            placeholder="Search doctors..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FilterOutlined />
            <Text strong>Filters:</Text>
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>

          {/* Specialization Filter */}
          <Select
            value={specializationFilter}
            onChange={setSpecializationFilter}
            style={{ width: 180 }}
            placeholder="Specialization"
          >
            <Option value="all">All Specializations</Option>
            {specializations.map((specialization) => (
              <Option key={specialization} value={specialization}>
                {specialization}
              </Option>
            ))}
          </Select>
        </div>

        {/* Doctor Table */}
        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
              setCurrentPage(page);
            },
            total: filteredDoctors.length,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} doctors`,
          }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span style={{ color: "var(--text-secondary)" }}>
                    No doctors found
                  </span>
                }
              />
            ),
          }}
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        />

        {/* Add Doctor Modal */}
        <Modal
          title="Add New Doctor"
          open={isAddModalVisible}
          onCancel={() => {
            setIsAddModalVisible(false);
            addForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={addForm}
            layout="vertical"
            onFinish={handleAddSubmit}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true, message: "Please select specialization" }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="Select specialization">
                  {specializations.map((spec) => (
                    <Option key={spec} value={spec}>
                      {spec}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="yearsOfExperience"
                label="Years of Experience"
                rules={[{ required: true, message: "Please enter years of experience" }]}
                style={{ flex: 1 }}
              >
                <Input type="number" min={0} placeholder="Enter years" />
              </Form.Item>
            </div>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button
                  onClick={() => {
                    setIsAddModalVisible(false);
                    addForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "var(--primary-color)",
                    borderColor: "var(--primary-color)",
                  }}
                >
                  Add Doctor
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Doctor Modal */}
        <Modal
          title="Edit Doctor Information"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            editForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" disabled />
            </Form.Item>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true, message: "Please select specialization" }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="Select specialization">
                  {specializations.map((spec) => (
                    <Option key={spec} value={spec}>
                      {spec}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="yearsOfExperience"
                label="Years of Experience"
                rules={[{ required: true, message: "Please enter years of experience" }]}
                style={{ flex: 1 }}
              >
                <Input type="number" min={0} placeholder="Enter years" />
              </Form.Item>
            </div>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button
                  onClick={() => {
                    setIsEditModalVisible(false);
                    editForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "var(--primary-color)",
                    borderColor: "var(--primary-color)",
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Invite Doctor Modal */}        <Modal
          title="Invite Doctor"
          open={isInviteModalVisible}
          onCancel={() => {
            setIsInviteModalVisible(false);
            inviteForm.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={inviteForm}
            layout="vertical"
            onFinish={handleInviteSubmit}
            initialValues={{ inviteMethod: 'email' }}
          >
            {/* Invitation Method Selection */}
            <Form.Item
              name="inviteMethod"
              label="Invitation Method"
              rules={[{ required: true, message: "Please select an invitation method" }]}
            >
              <Select
                placeholder="Select invitation method"
                onChange={(value) => {
                  inviteForm.resetFields(['email', 'phoneNumber']);
                }}
              >
                <Option value="email">Email</Option>
                <Option value="phone">SMS</Option>
                <Option value="whatsapp">WhatsApp</Option>
                <Option value="qrcode">QR Code</Option>
                <Option value="link">Invitation Link</Option>
              </Select>
            </Form.Item>
            
            {/* Dynamic fields based on invitation method */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.inviteMethod !== currentValues.inviteMethod
              }
            >
              {({ getFieldValue }) => {
                const inviteMethod = getFieldValue('inviteMethod');
                
                // Email fields
                if (inviteMethod === 'email') {
                  return (
                    <>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: "Please enter email" },
                          { type: "email", message: "Please enter a valid email" },
                        ]}
                      >
                        <Input placeholder="Enter doctor's email address" />
                      </Form.Item>
                      <Form.Item
                        name="message"
                        label="Invitation Message (Optional)"
                      >
                        <Input.TextArea
                          rows={4}
                          placeholder="Add a personal message to the invitation email"
                        />
                      </Form.Item>
                    </>
                  );
                }
                
                // Phone/SMS fields
                if (inviteMethod === 'phone' || inviteMethod === 'whatsapp') {
                  return (
                    <>
                      <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[
                          { required: true, message: "Please enter phone number" },
                        ]}
                      >
                        <Input placeholder="Enter doctor's phone number" />
                      </Form.Item>
                      <Form.Item
                        name="message"
                        label="Invitation Message (Optional)"
                      >
                        <Input.TextArea
                          rows={4}
                          placeholder={`Add a personal message to the ${inviteMethod === 'phone' ? 'SMS' : 'WhatsApp message'}`}
                        />
                      </Form.Item>
                    </>
                  );
                }
                
                // QR Code
                if (inviteMethod === 'qrcode') {
                  return (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div style={{ 
                        border: '1px dashed #d9d9d9',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '16px'
                      }}>
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tellyoudoc.com/register?invitedBy=org" 
                          alt="QR Code" 
                          style={{ maxWidth: '150px' }}
                        />
                      </div>
                      <Text type="secondary">
                        Generate a QR code that doctors can scan to register with your organization.
                        You can download this QR code and share it in printed materials or display it at your facility.
                      </Text>
                      <div style={{ marginTop: '16px' }}>
                        <Button icon={<PlusOutlined />}>Download QR Code</Button>
                      </div>
                    </div>
                  );
                }
                
                // Invitation Link
                if (inviteMethod === 'link') {
                  return (
                    <div style={{ padding: '20px 0' }}>
                      <Input.Group compact style={{ display: 'flex' }}>
                        <Input
                          style={{ flex: 1 }}
                          value="https://tellyoudoc.com/register?invitedBy=org&token=abc123"
                          readOnly
                        />
                        <Button type="primary">Copy Link</Button>
                      </Input.Group>
                      <Text type="secondary" style={{ display: 'block', marginTop: '10px' }}>
                        Share this link with doctors to invite them to join your organization.
                        The link is valid for 7 days.
                      </Text>
                    </div>
                  );
                }
                
                return null;
              }}
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button
                  onClick={() => {
                    setIsInviteModalVisible(false);
                    inviteForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues.inviteMethod !== currentValues.inviteMethod
                  }
                >
                  {({ getFieldValue }) => {
                    const inviteMethod = getFieldValue('inviteMethod');
                    let buttonText = 'Send Invitation';
                    let icon = <MailOutlined />;
                    
                    if (inviteMethod === 'qrcode') {
                      return null; // No send button needed for QR code
                    }
                    
                    // Customize button based on invitation method
                    switch (inviteMethod) {
                      case 'email':
                        icon = <MailOutlined />;
                        buttonText = 'Send Email Invitation';
                        break;
                      case 'phone':
                        icon = <MailOutlined />;
                        buttonText = 'Send SMS Invitation';
                        break;
                      case 'whatsapp':
                        icon = <MailOutlined />;
                        buttonText = 'Send WhatsApp Invitation';
                        break;
                      case 'link':
                        icon = <MailOutlined />;
                        buttonText = 'Generate Link';
                        break;
                    }
                    
                    return (
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={icon}
                        style={{
                          background: "var(--primary-color)",
                          borderColor: "var(--primary-color)",
                        }}
                      >
                        {buttonText}
                      </Button>
                    );
                  }}
                </Form.Item>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </OrganizationLayout>
  );
};

export default Doctors;