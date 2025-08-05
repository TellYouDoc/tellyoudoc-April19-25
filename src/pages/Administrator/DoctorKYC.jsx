import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Typography,
  Tag,
  DatePicker,
  Empty,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
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
  statsCard: {
    background: "var(--background-primary)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--border-color)",
    padding: "var(--spacing-4)",
  },
};

function DoctorKYC() {
  // State management
  const [kycData, setKycData] = useState([]);
  const [filteredKycData, setFilteredKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalKYC, setTotalKYC] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // KYC Status configuration
  const kycStatusConfig = {
    not_started: {
      label: "Not Started",
      color: "#95a5a6",
      icon: <ClockCircleOutlined />,
      description: "KYC process has not been initiated",
    },
    aadhaar_initiated: {
      label: "Aadhaar Initiated",
      color: "#f39c12",
      icon: <IdcardOutlined />,
      description: "Aadhaar verification process started",
    },
    aadhaar_verified: {
      label: "Aadhaar Verified",
      color: "#3498db",
      icon: <CheckCircleOutlined />,
      description: "Aadhaar verification completed",
    },
    registration_initiated: {
      label: "Registration Initiated",
      color: "#9b59b6",
      icon: <FileTextOutlined />,
      description: "Medical registration verification started",
    },
    completed: {
      label: "Completed",
      color: "#27ae60",
      icon: <CheckCircleOutlined />,
      description: "KYC process fully completed",
    },
    rejected: {
      label: "Rejected",
      color: "#e74c3c",
      icon: <CloseCircleOutlined />,
      description: "KYC process rejected",
    },
    manual_review_required: {
      label: "Manual Review Required",
      color: "#f1c40f",
      icon: <ExclamationCircleOutlined />,
      description: "Requires manual review",
    },
  };

  // Mock data based on the mongoose schema
  const mockKYCData = [
    {
      _id: '1',
      doctorId: 'doc_001',
      doctorName: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+91-98765-43210',
      aadhaarVerification: {
        aadhaarNumber: '123456789012',
        referenceId: 'AADH_REF_001',
        isVerified: true,
        verificationDate: '2024-01-15T10:30:00Z',
        verificationData: {
          name: 'Sarah Johnson',
          dob: '1985-03-15',
          gender: 'Female'
        }
      },
      doctorRegistrationVerification: {
        registrationNumber: 'MCI-12345',
        yearOfRegistration: '2010',
        councilName: 'Medical Council of India',
        requestId: 'REG_REQ_001',
        taskId: 'TASK_001',
        groupId: 'GROUP_001',
        isVerified: true,
        verificationDate: '2024-01-16T14:20:00Z',
        verificationData: {
          name: 'Dr. Sarah Johnson',
          qualification: 'MBBS, MD',
          specialization: 'Cardiology'
        }
      },
      kycStatus: 'completed',
      kycCompletedAt: '2024-01-16T15:00:00Z',
      kycRejectionReason: null,
      nameMatchingDetails: {
        strategy: 'exact_match',
        confidence: 95,
        details: {
          aadhaarName: 'Sarah Johnson',
          registrationName: 'Dr. Sarah Johnson',
          matchScore: 0.95
        },
        matchedAt: '2024-01-16T14:45:00Z',
        reviewRequiredAt: null
      },
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-16T15:00:00Z'
    },
    {
      _id: '2',
      doctorId: 'doc_002',
      doctorName: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+91-98765-43211',
      aadhaarVerification: {
        aadhaarNumber: '987654321098',
        referenceId: 'AADH_REF_002',
        isVerified: true,
        verificationDate: '2024-01-12T11:15:00Z',
        verificationData: {
          name: 'Michael Chen',
          dob: '1982-07-22',
          gender: 'Male'
        }
      },
      doctorRegistrationVerification: {
        registrationNumber: 'MCI-67890',
        yearOfRegistration: '2008',
        councilName: 'Medical Council of India',
        requestId: 'REG_REQ_002',
        taskId: 'TASK_002',
        groupId: 'GROUP_002',
        isVerified: false,
        verificationDate: null,
        verificationData: null
      },
      kycStatus: 'aadhaar_verified',
      kycCompletedAt: null,
      kycRejectionReason: null,
      nameMatchingDetails: {
        strategy: 'high_similarity',
        confidence: 85,
        details: {
          aadhaarName: 'Michael Chen',
          registrationName: 'Dr. Michael Chen',
          matchScore: 0.85
        },
        matchedAt: '2024-01-12T11:30:00Z',
        reviewRequiredAt: null
      },
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-12T11:30:00Z'
    },
    {
      _id: '3',
      doctorId: 'doc_003',
      doctorName: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+91-98765-43212',
      aadhaarVerification: {
        aadhaarNumber: '456789123456',
        referenceId: 'AADH_REF_003',
        isVerified: false,
        verificationDate: null,
        verificationData: null
      },
      doctorRegistrationVerification: {
        registrationNumber: 'MCI-11111',
        yearOfRegistration: '2012',
        councilName: 'Medical Council of India',
        requestId: 'REG_REQ_003',
        taskId: 'TASK_003',
        groupId: 'GROUP_003',
        isVerified: false,
        verificationDate: null,
        verificationData: null
      },
      kycStatus: 'aadhaar_initiated',
      kycCompletedAt: null,
      kycRejectionReason: null,
      nameMatchingDetails: {
        strategy: 'validation_failed',
        confidence: 0,
        details: {
          aadhaarName: null,
          registrationName: 'Dr. Emily Rodriguez',
          matchScore: 0
        },
        matchedAt: null,
        reviewRequiredAt: '2024-01-20T10:00:00Z'
      },
      createdAt: '2024-01-05T14:00:00Z',
      updatedAt: '2024-01-05T14:00:00Z'
    },
    {
      _id: '4',
      doctorId: 'doc_004',
      doctorName: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91-98765-43213',
      aadhaarVerification: {
        aadhaarNumber: '789123456789',
        referenceId: 'AADH_REF_004',
        isVerified: true,
        verificationDate: '2024-01-14T16:45:00Z',
        verificationData: {
          name: 'Rajesh Kumar',
          dob: '1978-11-08',
          gender: 'Male'
        }
      },
      doctorRegistrationVerification: {
        registrationNumber: 'MCI-22222',
        yearOfRegistration: '2005',
        councilName: 'Medical Council of India',
        requestId: 'REG_REQ_004',
        taskId: 'TASK_004',
        groupId: 'GROUP_004',
        isVerified: true,
        verificationDate: '2024-01-15T09:30:00Z',
        verificationData: {
          name: 'Dr. Rajesh Kumar',
          qualification: 'MBBS, MS',
          specialization: 'Orthopedics'
        }
      },
      kycStatus: 'rejected',
      kycCompletedAt: null,
      kycRejectionReason: 'Name mismatch between Aadhaar and registration documents',
      nameMatchingDetails: {
        strategy: 'no_match',
        confidence: 0,
        details: {
          aadhaarName: 'Rajesh Kumar',
          registrationName: 'Dr. Rajesh Kumar Singh',
          matchScore: 0.3
        },
        matchedAt: '2024-01-15T10:00:00Z',
        reviewRequiredAt: '2024-01-22T10:00:00Z'
      },
      createdAt: '2024-01-03T11:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '5',
      doctorId: 'doc_005',
      doctorName: 'Dr. Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91-98765-43214',
      aadhaarVerification: {
        aadhaarNumber: null,
        referenceId: null,
        isVerified: false,
        verificationDate: null,
        verificationData: null
      },
      doctorRegistrationVerification: {
        registrationNumber: null,
        yearOfRegistration: null,
        councilName: null,
        requestId: null,
        taskId: null,
        groupId: null,
        isVerified: false,
        verificationDate: null,
        verificationData: null
      },
      kycStatus: 'not_started',
      kycCompletedAt: null,
      kycRejectionReason: null,
      nameMatchingDetails: {
        strategy: null,
        confidence: 0,
        details: null,
        matchedAt: null,
        reviewRequiredAt: null
      },
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-20T08:00:00Z'
    }
  ];

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
      title: "Doctor",
      key: "doctor",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {record.doctorName}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            ID: {record.doctorId}
          </div>
        </div>
      ),
    },
    {
      title: "Aadhaar Verification",
      key: "aadhaar",
      width: 150,
      render: (_, record) => {
        const aadhaar = record.aadhaarVerification;
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <IdcardOutlined style={{
                color: aadhaar?.isVerified ? "#27ae60" : "#e74c3c",
                fontSize: "12px"
              }} />
              <span style={{
                fontSize: "12px",
                color: aadhaar?.isVerified ? "#27ae60" : "#e74c3c"
              }}>
                {aadhaar?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            {aadhaar?.aadhaarNumber && (
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                {aadhaar.aadhaarNumber}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Registration Verification",
      key: "registration",
      width: 150,
      render: (_, record) => {
        const registration = record.doctorRegistrationVerification;
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <FileTextOutlined style={{
                color: registration?.isVerified ? "#27ae60" : "#e74c3c",
                fontSize: "12px"
              }} />
              <span style={{
                fontSize: "12px",
                color: registration?.isVerified ? "#27ae60" : "#e74c3c"
              }}>
                {registration?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            {registration?.registrationNumber && (
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                {registration.registrationNumber}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "KYC Status",
      key: "status",
      width: 140,
      render: (_, record) => {
        const status = kycStatusConfig[record.kycStatus];
        return (
          <Tag
            icon={status.icon}
            color={status.color}
            style={{
              borderRadius: "var(--radius)",
              fontSize: "11px",
              fontWeight: "500",
            }}
          >
            {status.label}
          </Tag>
        );
      },
    },
    {
      title: "Name Matching",
      key: "matching",
      width: 120,
      render: (_, record) => {
        const matching = record.nameMatchingDetails;
        if (!matching?.strategy) {
          return <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>No data</span>;
        }
        return (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "500", color: "var(--text-primary)" }}>
              {matching.strategy.replace('_', ' ').toUpperCase()}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              {matching.confidence}% confidence
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            style={customStyles.actionButton}
            className="btn-premium btn-sm btn-outline"
            size="small"
          >
            View
          </Button>
          {record.kycStatus === 'aadhaar_verified' && (
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={() => handleInitiateRegistration(record._id)}
              style={customStyles.actionButton}
              className="btn-premium btn-sm btn-outline"
              size="small"
            >
              Initiate Reg
            </Button>
          )}
          {record.kycStatus === 'registration_initiated' && record.doctorRegistrationVerification?.isVerified && (
            <Button
              type="default"
              icon={<CheckCircleOutlined />}
              onClick={() => handleCompleteKYC(record._id)}
              style={customStyles.actionButton}
              className="btn-premium btn-sm btn-outline"
              size="small"
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setKycData(mockKYCData);
        setFilteredKycData(mockKYCData);
        setTotalKYC(mockKYCData.length);
      } catch (error) {
        console.error("Error fetching KYC data:", error);
        message.error("Failed to fetch KYC data: " + (error.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchKYCData();
  }, []);

  const handleViewDetails = (kyc) => {
    setSelectedKYC(kyc);
    setIsViewModalVisible(true);
  };

  const handleInitiateRegistration = async (id) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setKycData(prev => prev.map(item =>
        item._id === id
          ? { ...item, kycStatus: 'registration_initiated', updatedAt: new Date().toISOString() }
          : item
      ));

      message.success("Registration verification initiated successfully");
    } catch (error) {
      message.error("Failed to initiate registration verification");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteKYC = async (id) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setKycData(prev => prev.map(item =>
        item._id === id
          ? {
            ...item,
            kycStatus: 'completed',
            kycCompletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          : item
      ));

      message.success("KYC completed successfully");
    } catch (error) {
      message.error("Failed to complete KYC");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterKYCData(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterKYCData(searchText, value);
  };

  const filterKYCData = (text, status) => {
    let filtered = [...kycData];

    // Text search
    if (text) {
      const searchLower = text.toLowerCase();
      filtered = filtered.filter(
        (kyc) =>
          kyc.doctorName.toLowerCase().includes(searchLower) ||
          kyc.email.toLowerCase().includes(searchLower) ||
          (kyc.aadhaarVerification?.aadhaarNumber && kyc.aadhaarVerification.aadhaarNumber.includes(searchLower)) ||
          (kyc.doctorRegistrationVerification?.registrationNumber && kyc.doctorRegistrationVerification.registrationNumber.includes(searchLower))
      );
    }

    // Status filter
    if (status && status !== "all") {
      filtered = filtered.filter((kyc) => kyc.kycStatus === status);
    }

    setFilteredKycData(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Calculate statistics
  const getStats = () => {
    const stats = {
      notStarted: kycData.filter(item => item.kycStatus === 'not_started').length,
      inProgress: kycData.filter(item => ['aadhaar_initiated', 'aadhaar_verified', 'registration_initiated'].includes(item.kycStatus)).length,
      completed: kycData.filter(item => item.kycStatus === 'completed').length,
      issues: kycData.filter(item => ['rejected', 'manual_review_required'].includes(item.kycStatus)).length,
      total: kycData.length
    };
    return stats;
  };

  const stats = getStats();

  return (
    <AdminLayout>
      <div style={customStyles.pageContainer} className="premium-scrollbar">
        <div style={customStyles.header}>
          <div style={customStyles.headerLeft}>
            <h1 style={customStyles.title}>Doctor KYC Management</h1>
            <Text type="secondary">
              Manage doctor verification and Know Your Customer processes
            </Text>
          </div>
          <div style={customStyles.headerRight}>
            <div style={customStyles.searchSection}>
              <Input
                placeholder="Search by doctor name, email, Aadhaar, or registration number"
                prefix={
                  <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                }
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={customStyles.searchBar}
                className="form-control-premium"
              />
              <Input
                placeholder="Filter by status"
                prefix={
                  <FilterOutlined style={{ color: "var(--text-secondary)" }} />
                }
                value={statusFilter === "all" ? "" : kycStatusConfig[statusFilter]?.label}
                onClick={() => {
                  // This would typically open a dropdown
                  message.info("Status filter dropdown would open here");
                }}
                style={customStyles.searchBar}
                className="form-control-premium"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col span={4}>
            <Card style={customStyles.statsCard}>
              <Statistic
                title="Not Started"
                value={stats.notStarted}
                valueStyle={{ color: "#95a5a6" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card style={customStyles.statsCard}>
              <Statistic
                title="In Progress"
                value={stats.inProgress}
                valueStyle={{ color: "#f39c12" }}
                prefix={<IdcardOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card style={customStyles.statsCard}>
              <Statistic
                title="Completed"
                value={stats.completed}
                valueStyle={{ color: "#27ae60" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card style={customStyles.statsCard}>
              <Statistic
                title="Issues"
                value={stats.issues}
                valueStyle={{ color: "#e74c3c" }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card style={customStyles.statsCard}>
              <Statistic
                title="Total"
                value={stats.total}
                valueStyle={{ color: "var(--text-primary)" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <div style={customStyles.table} className="premium-card premium-table-responsive">
          <Table
            columns={columns}
            dataSource={filteredKycData}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
              total: totalKYC,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} KYC records`,
            }}
            scroll={{ x: "max-content" }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  description="No KYC records found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </div>

        {/* View Details Modal */}
        <Modal
          title={
            <div>
              <div style={{ marginBottom: "8px" }}>KYC Details</div>
              <Text type="secondary" style={{ fontSize: "var(--font-size-sm)" }}>
                Complete KYC information for {selectedKYC?.doctorName}
              </Text>
            </div>
          }
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>,
          ]}
          styles={customStyles.modal}
          width={800}
          centered
        >
          {selectedKYC && (
            <div style={{ padding: "16px 0" }}>
              {/* Doctor Information */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  padding: "16px",
                  background: "var(--background-secondary)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border-color)",
                }}>
                  <UserOutlined style={{ color: "var(--primary-color)", fontSize: "20px" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}>
                      <div style={{
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        fontSize: "16px",
                      }}>
                        {selectedKYC.doctorName}
                      </div>
                      <Tag style={{
                        background: kycStatusConfig[selectedKYC.kycStatus]?.color,
                        color: "white",
                        borderRadius: "var(--radius)",
                        padding: "0 8px",
                        fontSize: "12px",
                      }}>
                        {kycStatusConfig[selectedKYC.kycStatus]?.label}
                      </Tag>
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      {selectedKYC.email}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      {selectedKYC.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* KYC Details Grid */}
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Aadhaar Verification" size="small">
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Status:</span>
                        <Tag color={selectedKYC.aadhaarVerification?.isVerified ? "green" : "red"}>
                          {selectedKYC.aadhaarVerification?.isVerified ? "Verified" : "Not Verified"}
                        </Tag>
                      </div>
                      {selectedKYC.aadhaarVerification?.aadhaarNumber && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Aadhaar Number:</span>
                          <span>{selectedKYC.aadhaarVerification.aadhaarNumber}</span>
                        </div>
                      )}
                      {selectedKYC.aadhaarVerification?.verificationDate && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Verified On:</span>
                          <span>{formatDate(selectedKYC.aadhaarVerification.verificationDate)}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Registration Verification" size="small">
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Status:</span>
                        <Tag color={selectedKYC.doctorRegistrationVerification?.isVerified ? "green" : "red"}>
                          {selectedKYC.doctorRegistrationVerification?.isVerified ? "Verified" : "Not Verified"}
                        </Tag>
                      </div>
                      {selectedKYC.doctorRegistrationVerification?.registrationNumber && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Registration Number:</span>
                          <span>{selectedKYC.doctorRegistrationVerification.registrationNumber}</span>
                        </div>
                      )}
                      {selectedKYC.doctorRegistrationVerification?.councilName && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Council:</span>
                          <span>{selectedKYC.doctorRegistrationVerification.councilName}</span>
                        </div>
                      )}
                      {selectedKYC.doctorRegistrationVerification?.verificationDate && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Verified On:</span>
                          <span>{formatDate(selectedKYC.doctorRegistrationVerification.verificationDate)}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Name Matching Details */}
              {selectedKYC.nameMatchingDetails?.strategy && (
                <Card title="Name Matching Details" size="small" style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Strategy:</span>
                      <Tag color="blue">{selectedKYC.nameMatchingDetails.strategy.replace('_', ' ').toUpperCase()}</Tag>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Confidence:</span>
                      <span>{selectedKYC.nameMatchingDetails.confidence}%</span>
                    </div>
                    {selectedKYC.nameMatchingDetails.reviewRequiredAt && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Review Required By:</span>
                        <span>{formatDate(selectedKYC.nameMatchingDetails.reviewRequiredAt)}</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Timeline */}
              <Card title="Timeline" size="small" style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>KYC Started on:</span>
                    <span>{formatDate(selectedKYC.createdAt)}</span>
                  </div>
                  {selectedKYC.kycCompletedAt && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Completed:</span>
                      <span>{formatDate(selectedKYC.kycCompletedAt)}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Rejection Reason */}
              {selectedKYC.kycRejectionReason && (
                <Card title="Rejection Details" size="small" style={{ marginTop: "16px" }}>
                  <div style={{ color: "#e74c3c", fontSize: "14px" }}>
                    {selectedKYC.kycRejectionReason}
                  </div>
                </Card>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default DoctorKYC; 