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
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/Reports.css";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for demonstration
const mockReports = [
  {
    id: "RPT-1001",
    type: "bug",
    subject: "Unable to book appointment",
    description:
      "When trying to book an appointment on Tuesday, the system shows an error message.",
    reportedBy: {
      id: "USR-1001",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "patient",
    },
    date: "2025-05-10T14:25:00",
    status: "pending",
    priority: "high",
    assignedTo: null,
    comments: [
      {
        id: "CMT-1001",
        content: "We are looking into this issue.",
        author: "Admin",
        date: "2025-05-11T10:30:00",
      },
    ],
  },
  {
    id: "RPT-1002",
    type: "feedback",
    subject: "Great experience with the new UI",
    description: "I love the new interface. Much more intuitive than before.",
    reportedBy: {
      id: "USR-1002",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "doctor",
    },
    date: "2025-05-12T09:15:00",
    status: "resolved",
    priority: "low",
    assignedTo: "ADM-101",
    comments: [],
  },
  {
    id: "RPT-1003",
    type: "complaint",
    subject: "Doctor was late for virtual appointment",
    description:
      "My appointment was scheduled for 3 PM but the doctor joined at 3:20 PM without any prior notice.",
    reportedBy: {
      id: "USR-1003",
      name: "Mike Brown",
      email: "mike.brown@example.com",
      role: "patient",
    },
    date: "2025-05-09T16:45:00",
    status: "in_progress",
    priority: "medium",
    assignedTo: "ADM-102",
    comments: [
      {
        id: "CMT-1002",
        content: "We have contacted the doctor for clarification.",
        author: "Admin",
        date: "2025-05-10T11:20:00",
      },
      {
        id: "CMT-1003",
        content:
          "The doctor has apologized for the delay due to an emergency case.",
        author: "Admin",
        date: "2025-05-11T14:15:00",
      },
    ],
  },
  {
    id: "RPT-1004",
    type: "suggestion",
    subject: "Add a calendar view for appointments",
    description:
      "It would be helpful to have a calendar view option for doctors to see their upcoming appointments.",
    reportedBy: {
      id: "USR-1004",
      name: "Dr. Priya Patel",
      email: "dr.priya@example.com",
      role: "doctor",
    },
    date: "2025-05-08T10:30:00",
    status: "pending",
    priority: "medium",
    assignedTo: null,
    comments: [],
  },
  {
    id: "RPT-1005",
    type: "bug",
    subject: "Payment confirmation email not received",
    description:
      "I made a payment for my appointment but did not receive any confirmation email.",
    reportedBy: {
      id: "USR-1005",
      name: "Robert Chen",
      email: "robert.c@example.com",
      role: "patient",
    },
    date: "2025-05-11T13:20:00",
    status: "in_progress",
    priority: "high",
    assignedTo: "ADM-101",
    comments: [
      {
        id: "CMT-1004",
        content:
          "We have checked our email system and found an issue with the email service. Working on fixing it.",
        author: "Admin",
        date: "2025-05-11T15:40:00",
      },
    ],
  },
  {
    id: "RPT-1006",
    type: "feedback",
    subject: "Mobile app performance issues",
    description: "The mobile app is quite slow when loading patient history.",
    reportedBy: {
      id: "USR-1006",
      name: "Dr. Alex Wong",
      email: "dr.alex@example.com",
      role: "doctor",
    },
    date: "2025-05-07T09:50:00",
    status: "pending",
    priority: "medium",
    assignedTo: null,
    comments: [],
  },
];

// Mock admins for assigning reports
const mockAdmins = [
  { id: "ADM-101", name: "Admin Jane", role: "Technical Support" },
  { id: "ADM-102", name: "Admin Tom", role: "Customer Relations" },
  { id: "ADM-103", name: "Admin Sheila", role: "System Administrator" },
];

// Status map for styling
const statusMap = {
  pending: { color: "gold", label: "Pending" },
  in_progress: { color: "blue", label: "In Progress" },
  resolved: { color: "green", label: "Resolved" },
  closed: { color: "gray", label: "Closed" },
};

// Status map for styling

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [commentForm] = Form.useForm();

  // Load reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch reports with current filters
  const fetchReports = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      setTimeout(() => {
        const filteredReports = mockReports.filter((report) => {
          // Filter by status
          if (filters.status !== "all" && report.status !== filters.status) {
            return false;
          }

          // Filter by search text (description or reported by)
          if (searchText) {
            const searchLower = searchText.toLowerCase();
            const descriptionMatch = report.description
              .toLowerCase()
              .includes(searchLower);
            const reporterMatch = report.reportedBy.name
              .toLowerCase()
              .includes(searchLower);

            return descriptionMatch || reporterMatch;
          }

          return true;
        });

        setReports(filteredReports);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching reports:", error);
      message.error("Failed to load reports");
      setLoading(false);
    }
  };

  // Apply filters
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });

    // In a real app, you might want to debounce this call
    setTimeout(() => {
      fetchReports();
    }, 300);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Apply search filter
  const handleSearch = () => {
    fetchReports();
  };

  // View report details
  const handleViewDetails = (record) => {
    setSelectedReport(record);
    setDetailsModalVisible(true);
  };

  // Handle taking action on a report
  const handleAction = (record) => {
    setSelectedReport(record);
    setActionModalVisible(true);
    commentForm.resetFields();
  };
  // Submit action on report
  const handleSubmitAction = async (values) => {
    const { status, comment } = values;

    try {
      // In a real app, this would be an API call to update the report
      setLoading(true);

      setTimeout(() => {
        // Update the report in our mock data
        const updatedReports = reports.map((report) => {
          if (report.id === selectedReport.id) {
            const updatedReport = {
              ...report,
              status,
            };

            // Add comment if provided
            if (comment) {
              updatedReport.comments = [
                ...report.comments,
                {
                  id: `CMT-${Math.floor(1000 + Math.random() * 9000)}`,
                  content: comment,
                  author: "Admin",
                  date: new Date().toISOString(),
                },
              ];
            }

            return updatedReport;
          }
          return report;
        });

        setReports(updatedReports);
        setActionModalVisible(false);
        message.success("Report updated successfully");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error updating report:", error);
      message.error("Failed to update report");
      setLoading(false);
    }
  };

  // Send response to reporter
  const handleSendResponse = async () => {
    message.success("Response email sent to reporter");
  }; // Column definitions for the table
  const columns = [
    {
      title: "Sl No",
      key: "slNo",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      className: "description-column",
      width: 300,
      render: (text) => (
        <div
          style={{
            maxWidth: 280,
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Reported By",
      dataIndex: "reportedBy",
      key: "reportedBy",
      render: (reporter) => (
        <div>
          <div>{reporter.name}</div>
          <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>
            {reporter.role.charAt(0).toUpperCase() + reporter.role.slice(1)}
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={statusMap[text]?.color || "default"}>
          {statusMap[text]?.label || text}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {record.status !== "resolved" && record.status !== "closed" && (
            <Button
              type="default"
              size="small"
              icon={<MessageOutlined />}
              onClick={() => handleAction(record)}
            >
              Action
            </Button>
          )}
        </Space>
      ),
      width: 160,
    },
  ];
  // Render comment item
  const renderComment = (comment) => {
    const date = new Date(comment.date);
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return (
      <div key={comment.id} className="report-comment">
        <div className="report-comment-header">
          <span className="report-comment-author">{comment.author}</span>
          <span className="report-comment-date">{formattedDate}</span>
        </div>
        <div className="report-comment-content">{comment.content}</div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-reports-container">
        <div className="admin-reports-header">
          <div className="admin-reports-title">
            <h1>Reports & Feedback Management</h1>
            <p>View and manage user reports, feedback, and issues</p>
          </div>{" "}
          <div className="admin-reports-actions">
            <div className="admin-reports-filters">
              <Input.Search
                placeholder="Search by description or reporter"
                value={searchText}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                style={{ width: 250, marginRight: 16 }}
              />
              <Select
                placeholder="Filter by status"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("status", value)}
                value={filters.status}
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="resolved">Resolved</Option>
                <Option value="closed">Closed</Option>
              </Select>
            </div>
          </div>
        </div>{" "}
        <div className="admin-reports-content">
          {loading ? (
            <div className="loading-message">Loading...</div>
          ) : (
            <Table
              columns={columns}
              dataSource={reports}
              rowKey="id"
              size="middle"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total) => `Total ${total} reports`,
                position: ["bottomRight"],
                className: "reports-pagination",
              }}
              bordered={false}
              className="reports-table"
            />
          )}
        </div>
        {/* Report Details Modal */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              Report {selectedReport?.id} Details
            </div>
          }
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={[
            <Button
              key="response"
              type="default"
              icon={<MailOutlined />}
              onClick={handleSendResponse}
            >
              Send Response{" "}
            </Button>,
            selectedReport?.status !== "resolved" &&
            selectedReport?.status !== "closed" ? (
              <Button
                key="action"
                type="primary"
                onClick={() => {
                  setDetailsModalVisible(false);
                  handleAction(selectedReport);
                }}
              >
                Take Action
              </Button>
            ) : null,
            <Button key="close" onClick={() => setDetailsModalVisible(false)}>
              Close
            </Button>,
          ].filter(Boolean)}
          width={800}
        >
          {selectedReport && (
            <div className="report-details">
              <Tabs defaultActiveKey="details">
                <TabPane tab="Details" key="details">
                  <Card className="report-info-card">
                    {" "}
                    <div className="report-info-header">
                      <div>
                        <Tag color={statusMap[selectedReport.status]?.color}>
                          {statusMap[selectedReport.status]?.label}
                        </Tag>
                      </div>{" "}
                      <div className="report-date">
                        Reported on:{" "}
                        {new Date(selectedReport.date).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </div>
                    <p className="report-description">
                      {selectedReport.description}
                    </p>
                    <Divider />
                    <div className="report-reporter">
                      <h3>Reported By</h3>
                      <p>
                        <strong>Name:</strong> {selectedReport.reportedBy.name}
                      </p>
                      <p>
                        <strong>Role:</strong>{" "}
                        {selectedReport.reportedBy.role
                          .charAt(0)
                          .toUpperCase() +
                          selectedReport.reportedBy.role.slice(1)}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedReport.reportedBy.email}
                      </p>
                    </div>
                    {selectedReport.assignedTo && (
                      <>
                        <Divider />
                        <div className="report-assigned">
                          <h3>Assigned To</h3>
                          <p>
                            {mockAdmins.find(
                              (admin) => admin.id === selectedReport.assignedTo
                            )?.name || selectedReport.assignedTo}
                          </p>
                        </div>
                      </>
                    )}
                  </Card>
                </TabPane>
                <TabPane tab="Comments & History" key="comments">
                  <div className="report-comments">
                    {selectedReport.comments.length > 0 ? (
                      selectedReport.comments.map((comment) =>
                        renderComment(comment)
                      )
                    ) : (
                      <div className="no-comments">
                        <p>No comments or history available for this report.</p>
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          )}
        </Modal>
        {/* Action Modal */}
        <Modal
          title="Take Action on Report"
          open={actionModalVisible}
          onCancel={() => setActionModalVisible(false)}
          footer={null}
        >
          {" "}
          {selectedReport && (
            <Form
              form={commentForm}
              layout="vertical"
              onFinish={handleSubmitAction}
              initialValues={{
                status: selectedReport.status,
              }}
            >
              <Form.Item
                name="status"
                label="Update Status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Radio.Group>
                  <Radio.Button value="pending">Pending</Radio.Button>
                  <Radio.Button value="in_progress">In Progress</Radio.Button>
                  <Radio.Button value="resolved">Resolved</Radio.Button>
                  <Radio.Button value="closed">Closed</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="comment" label="Add Comment">
                <TextArea
                  rows={4}
                  placeholder="Add a comment or note about this action"
                />
              </Form.Item>
              <Form.Item className="action-buttons">
                <Button
                  type="default"
                  onClick={() => setActionModalVisible(false)}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Action
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default Reports;
