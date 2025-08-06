import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Select,
  Input,
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
  Typography,
  Tabs,
  Card,
  Divider,
  Radio,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  MessageOutlined,
  FilterOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/Reports.css";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for doctor feedbacks
const mockDoctorFeedbacks = [
  {
    id: "DFB-1001",
    type: "app_feedback",
    subject: "Great experience with the new appointment system",
    description: "The new appointment booking interface is much more intuitive and user-friendly. I can now manage my schedule more efficiently.",
    reportedBy: {
      id: "DOC-1001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "doctor",
      specialization: "Cardiology",
    },
    date: "2025-05-10T14:25:00",
    status: "resolved",
    priority: "low",
    assignedTo: "ADM-101",
    comments: [
      {
        id: "CMT-1001",
        content: "Thank you for your positive feedback! We're glad the new system is working well for you.",
        author: "Admin",
        date: "2025-05-11T10:30:00",
      },
    ],
  },
  {
    id: "DFB-1002",
    type: "bug_report",
    subject: "Patient data not loading in consultation room",
    description: "When I try to access patient medical history during virtual consultations, the data takes too long to load or sometimes doesn't load at all.",
    reportedBy: {
      id: "DOC-1002",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      role: "doctor",
      specialization: "Pediatrics",
    },
    date: "2025-05-12T09:15:00",
    status: "in_progress",
    priority: "high",
    assignedTo: "ADM-102",
    comments: [
      {
        id: "CMT-1002",
        content: "We are investigating this issue. Our technical team is working on optimizing the data loading process.",
        author: "Admin",
        date: "2025-05-12T11:30:00",
      },
    ],
  },
  {
    id: "DFB-1003",
    type: "feature_request",
    subject: "Request for prescription template feature",
    description: "It would be very helpful to have customizable prescription templates that I can save and reuse for common medications.",
    reportedBy: {
      id: "DOC-1003",
      name: "Dr. Emily Chen",
      email: "emily.chen@example.com",
      role: "doctor",
      specialization: "General Medicine",
    },
    date: "2025-05-09T16:45:00",
    status: "pending",
    priority: "medium",
    assignedTo: null,
    comments: [],
  },
  {
    id: "DFB-1004",
    type: "complaint",
    subject: "Difficulty with video call quality",
    description: "The video call quality during consultations is often poor, making it difficult to properly assess patients.",
    reportedBy: {
      id: "DOC-1004",
      name: "Dr. Michael Brown",
      email: "michael.brown@example.com",
      role: "doctor",
      specialization: "Dermatology",
    },
    date: "2025-05-08T13:20:00",
    status: "resolved",
    priority: "high",
    assignedTo: "ADM-101",
    comments: [
      {
        id: "CMT-1003",
        content: "We have upgraded our video infrastructure. Please test the new system and let us know if the quality has improved.",
        author: "Admin",
        date: "2025-05-09T09:15:00",
      },
    ],
  },
];

const DoctorFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
  });
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await apiService.get('/admin/doctor-feedbacks');
      // setFeedbacks(response.data);
      
      // For now, using mock data
      setTimeout(() => {
        setFeedbacks(mockDoctorFeedbacks);
        setLoading(false);
      }, 1000);
    } catch {
      message.error("Failed to fetch doctor feedbacks");
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchText);
  };

  const handleViewDetails = (record) => {
    setSelectedFeedback(record);
    setIsModalVisible(true);
  };

  const handleAction = (record) => {
    setSelectedFeedback(record);
    setIsResponseModalVisible(true);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      message.warning("Please enter a response");
      return;
    }

    try {
      // In a real app, this would be an API call
      // await apiService.post(`/admin/doctor-feedbacks/${selectedFeedback.id}/respond`, {
      //   response: responseText
      // });
      
      message.success("Response sent successfully");
      setResponseText("");
      setIsResponseModalVisible(false);
      fetchFeedbacks(); // Refresh the list
    } catch {
      message.error("Failed to send response");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "in_progress":
        return "blue";
      case "resolved":
        return "green";
      case "closed":
        return "red";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "bug_report":
        return "red";
      case "feature_request":
        return "blue";
      case "app_feedback":
        return "green";
      case "complaint":
        return "orange";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "bug_report":
        return "Bug Report";
      case "feature_request":
        return "Feature Request";
      case "app_feedback":
        return "App Feedback";
      case "complaint":
        return "Complaint";
      default:
        return type;
    }
  };

  const renderComment = (comment) => (
    <div key={comment.id} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <Text strong>{comment.author}</Text>
        <Text type="secondary">{new Date(comment.date).toLocaleString()}</Text>
      </div>
      <div style={{ 
        background: "#f5f5f5", 
        padding: 12, 
        borderRadius: 6,
        borderLeft: "3px solid #1890ff"
      }}>
        {comment.content}
      </div>
    </div>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Doctor",
      dataIndex: "reportedBy",
      key: "doctor",
      render: (reportedBy) => (
        <div>
          <div style={{ fontWeight: 500 }}>{reportedBy.name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{reportedBy.specialization}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={getTypeColor(type)}>{getTypeLabel(type)}</Tag>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Respond">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => handleAction(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesStatus = filters.status === "all" || feedback.status === filters.status;
    const matchesPriority = filters.priority === "all" || feedback.priority === filters.priority;
    const matchesType = filters.type === "all" || feedback.type === filters.type;
    const matchesSearch = searchText === "" || 
      feedback.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.reportedBy.name.toLowerCase().includes(searchText.toLowerCase());

    return matchesStatus && matchesPriority && matchesType && matchesSearch;
  });

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <UserOutlined style={{ marginRight: 8 }} />
            Doctor Feedbacks
          </Title>
          <Text type="secondary">
            Manage and respond to feedback from doctors using the platform
          </Text>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Status:</Text>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                style={{ width: 120 }}
              >
                <Option value="all">All</Option>
                <Option value="pending">Pending</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="resolved">Resolved</Option>
                <Option value="closed">Closed</Option>
              </Select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Priority:</Text>
              <Select
                value={filters.priority}
                onChange={(value) => handleFilterChange("priority", value)}
                style={{ width: 120 }}
              >
                <Option value="all">All</Option>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Type:</Text>
              <Select
                value={filters.type}
                onChange={(value) => handleFilterChange("type", value)}
                style={{ width: 140 }}
              >
                <Option value="all">All</Option>
                <Option value="bug_report">Bug Report</Option>
                <Option value="feature_request">Feature Request</Option>
                <Option value="app_feedback">App Feedback</Option>
                <Option value="complaint">Complaint</Option>
              </Select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
              <Input
                placeholder="Search feedbacks..."
                value={searchText}
                onChange={handleSearchChange}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
                onPressEnter={handleSearch}
              />
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Feedbacks Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredFeedbacks}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} feedbacks`,
            }}
          />
        </Card>

        {/* Feedback Details Modal */}
        <Modal
          title="Feedback Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedFeedback && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <Title level={4}>{selectedFeedback.subject}</Title>
                    <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                      <Tag color={getTypeColor(selectedFeedback.type)}>
                        {getTypeLabel(selectedFeedback.type)}
                      </Tag>
                      <Tag color={getStatusColor(selectedFeedback.status)}>
                        {selectedFeedback.status.replace("_", " ").toUpperCase()}
                      </Tag>
                      <Tag color={getPriorityColor(selectedFeedback.priority)}>
                        {selectedFeedback.priority.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>ID: {selectedFeedback.id}</div>
                    <div style={{ color: "#666" }}>
                      {new Date(selectedFeedback.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Card title="Doctor Information" size="small" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <Text strong>Name:</Text> {selectedFeedback.reportedBy.name}
                    </div>
                    <div>
                      <Text strong>Email:</Text> {selectedFeedback.reportedBy.email}
                    </div>
                    <div>
                      <Text strong>Specialization:</Text> {selectedFeedback.reportedBy.specialization}
                    </div>
                  </div>
                </Card>

                <Card title="Description" size="small" style={{ marginBottom: 16 }}>
                  <Text>{selectedFeedback.description}</Text>
                </Card>

                {selectedFeedback.comments && selectedFeedback.comments.length > 0 && (
                  <Card title="Comments" size="small">
                    {selectedFeedback.comments.map(renderComment)}
                  </Card>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Response Modal */}
        <Modal
          title="Send Response"
          visible={isResponseModalVisible}
          onCancel={() => setIsResponseModalVisible(false)}
          onOk={handleSendResponse}
          okText="Send Response"
        >
          {selectedFeedback && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Responding to:</Text> {selectedFeedback.subject}
              </div>
              <TextArea
                rows={6}
                placeholder="Enter your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default DoctorFeedbacks; 