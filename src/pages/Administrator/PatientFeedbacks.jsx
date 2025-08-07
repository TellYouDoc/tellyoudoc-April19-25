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
  Rate,
  Avatar,
  Row,
  Col,
  Statistic,
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
  StarOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import ProfileAvatar from "../../components/ProfileAvatar";
import { apiService } from "../../services/api";
import "../../styles/Administrator/Reports.css";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    overallExperience: "all",
    appUsability: "all",
    appointmentBooking: "all",
  });
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageOverallExperience: 0,
    averageAppUsability: 0,
    averageAppointmentBooking: 0,
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.current, pagination.pageSize]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiService.AdministratorService.getPatientFeedbacks({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        overallExperience: filters.overallExperience !== "all" ? filters.overallExperience : undefined,
        appUsability: filters.appUsability !== "all" ? filters.appUsability : undefined,
        appointmentBooking: filters.appointmentBooking !== "all" ? filters.appointmentBooking : undefined,
      });

      const { feedback, pagination: apiPagination } = response.data;
      setFeedbacks(feedback);
      setPagination(prev => ({
        ...prev,
        total: apiPagination.totalRecords,
        current: apiPagination.currentPage,
      }));

      // Calculate stats
      if (feedback.length > 0) {
        const totalOverall = feedback.reduce((sum, item) => sum + item.overallExperience, 0);
        const totalUsability = feedback.reduce((sum, item) => sum + item.appUsability, 0);
        const totalBooking = feedback.reduce((sum, item) => sum + item.appointmentBooking, 0);

        setStats({
          totalFeedbacks: apiPagination.totalRecords,
          averageOverallExperience: (totalOverall / feedback.length).toFixed(1),
          averageAppUsability: (totalUsability / feedback.length).toFixed(1),
          averageAppointmentBooking: (totalBooking / feedback.length).toFixed(1),
        });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      message.error("Failed to fetch patient feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchFeedbacks();
  };

  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  const handleViewDetails = (record) => {
    setSelectedFeedback(record);
    setIsModalVisible(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "green";
    if (rating >= 3) return "orange";
    return "red";
  };

  const getRatingText = (rating) => {
    if (rating >= 4) return "Excellent";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientInfo",
      key: "patient",
      width: 310,
      render: (patientInfo) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ProfileAvatar
            name={patientInfo.name}
            imageUrl={patientInfo.profileImage}
            size="medium"
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{patientInfo.name}</div>
            <div style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 4 }}>
              <PhoneOutlined />
              {patientInfo.contactNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Overall Experience",
      dataIndex: "overallExperience",
      key: "overallExperience",
      width: 150,
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
            {getRatingText(rating)}
          </div>
        </div>
      ),
    },
    {
      title: "App Usability",
      dataIndex: "appUsability",
      key: "appUsability",
      width: 120,
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
            {getRatingText(rating)}
          </div>
        </div>
      ),
    },
    {
      title: "Booking",
      dataIndex: "appointmentBooking",
      key: "appointmentBooking",
      width: 160,
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
            {getRatingText(rating)}
          </div>
        </div>
      ),
    },
    {
      title: "Comments",
      dataIndex: "additionalComments",
      key: "comments",
      ellipsis: true,
      render: (comments) => (
        <div style={{ maxWidth: 180 }}>
          {comments ? (
            <Text ellipsis={{ tooltip: comments }}>
              {comments}
            </Text>
          ) : (
            <Text type="secondary" italic>No comments</Text>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      width: 120,
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          <div>{new Date(date).toLocaleDateString()}</div>
          <div style={{ color: "#666" }}>
            {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 80,
    //   render: (_, record) => (
    //     <Tooltip title="View Details">
    //       <Button
    //         type="text"
    //         icon={<EyeOutlined />}
    //         onClick={() => handleViewDetails(record)}
    //       />
    //     </Tooltip>
    //   ),
    // },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <UserOutlined style={{ marginRight: 8 }} />
            Patient Feedbacks
          </Title>
          <Text type="secondary">
            View and analyze feedback from patients about their experience
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Feedbacks"
                value={stats.totalFeedbacks}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Avg. Overall Experience"
                value={stats.averageOverallExperience}
                prefix={<StarOutlined />}
                suffix="/ 5"
                valueStyle={{ color: getRatingColor(stats.averageOverallExperience) }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Avg. App Usability"
                value={stats.averageAppUsability}
                prefix={<StarOutlined />}
                suffix="/ 5"
                valueStyle={{ color: getRatingColor(stats.averageAppUsability) }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Avg. Appointment Booking"
                value={stats.averageAppointmentBooking}
                prefix={<StarOutlined />}
                suffix="/ 5"
                valueStyle={{ color: getRatingColor(stats.averageAppointmentBooking) }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Overall Experience:</Text>
              <Select
                value={filters.overallExperience}
                onChange={(value) => handleFilterChange("overallExperience", value)}
                style={{ width: 120 }}
              >
                <Option value="all">All</Option>
                <Option value="5">5 Stars</Option>
                <Option value="4">4+ Stars</Option>
                <Option value="3">3+ Stars</Option>
                <Option value="2">2+ Stars</Option>
                <Option value="1">1+ Stars</Option>
              </Select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>App Usability:</Text>
              <Select
                value={filters.appUsability}
                onChange={(value) => handleFilterChange("appUsability", value)}
                style={{ width: 120 }}
              >
                <Option value="all">All</Option>
                <Option value="5">5 Stars</Option>
                <Option value="4">4+ Stars</Option>
                <Option value="3">3+ Stars</Option>
                <Option value="2">2+ Stars</Option>
                <Option value="1">1+ Stars</Option>
              </Select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Appointment Booking:</Text>
              <Select
                value={filters.appointmentBooking}
                onChange={(value) => handleFilterChange("appointmentBooking", value)}
                style={{ width: 140 }}
              >
                <Option value="all">All</Option>
                <Option value="5">5 Stars</Option>
                <Option value="4">4+ Stars</Option>
                <Option value="3">3+ Stars</Option>
                <Option value="2">2+ Stars</Option>
                <Option value="1">1+ Stars</Option>
              </Select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
              <Input
                placeholder="Search by patient name..."
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
            dataSource={feedbacks}
            loading={loading}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} feedbacks`,
            }}
            onChange={handleTableChange}
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
                {/* Patient Information */}
                <Card title="Patient Information" size="small" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <ProfileAvatar
                      name={selectedFeedback.patientInfo.name}
                      imageUrl={selectedFeedback.patientInfo.profileImage}
                      size="large"
                    />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>{selectedFeedback.patientInfo.name}</Title>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <PhoneOutlined />
                        <Text>{selectedFeedback.patientInfo.contactNumber}</Text>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <CalendarOutlined />
                        <Text type="secondary">
                          {new Date(selectedFeedback.createdAt).toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Ratings */}
                <Card title="Ratings" size="small" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Overall Experience</Text>
                        </div>
                        <Rate disabled defaultValue={selectedFeedback.overallExperience} />
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">{getRatingText(selectedFeedback.overallExperience)}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>App Usability</Text>
                        </div>
                        <Rate disabled defaultValue={selectedFeedback.appUsability} />
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">{getRatingText(selectedFeedback.appUsability)}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Appointment Booking</Text>
                        </div>
                        <Rate disabled defaultValue={selectedFeedback.appointmentBooking} />
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">{getRatingText(selectedFeedback.appointmentBooking)}</Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Comments */}
                <Card title="Additional Comments" size="small">
                  {selectedFeedback.additionalComments ? (
                    <Text>{selectedFeedback.additionalComments}</Text>
                  ) : (
                    <Text type="secondary" italic>No additional comments provided</Text>
                  )}
                </Card>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default PatientFeedbacks; 