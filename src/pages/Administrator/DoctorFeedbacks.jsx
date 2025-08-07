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

const DoctorFeedbacks = () => {
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
    overallSatisfaction: "all",
    professionalImpact: "all",
  });
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageSatisfaction: 0,
    averageProfessionalImpact: 0,
    totalRecommendations: 0,
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.current, pagination.pageSize]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiService.AdministratorService.getAdminDoctorFeedbacks(
        pagination.current,
        pagination.pageSize
      );
      
      const { feedback, pagination: apiPagination } = response.data;
      setFeedbacks(feedback || []);
      setPagination(prev => ({
        ...prev,
        total: apiPagination.totalRecords,
        current: apiPagination.currentPage,
      }));

      // Calculate stats
      if (feedback && feedback.length > 0) {
        const totalSatisfaction = feedback.reduce((sum, item) => sum + (Number(item.overall_satisfaction) || 0), 0);
        const totalImpact = feedback.reduce((sum, item) => sum + (Number(item.professional_impact) || 0), 0);
        const totalRecs = feedback.filter(item => item.recommendations && item.recommendations.trim()).length;
        
        const avgSatisfaction = feedback.length > 0 ? (totalSatisfaction / feedback.length).toFixed(1) : "0.0";
        const avgImpact = feedback.length > 0 ? (totalImpact / feedback.length).toFixed(1) : "0.0";
        
        setStats({
          totalFeedbacks: apiPagination.totalRecords,
          averageSatisfaction: avgSatisfaction,
          averageProfessionalImpact: avgImpact,
          totalRecommendations: totalRecs,
        });
      } else {
        setStats({
          totalFeedbacks: apiPagination.totalRecords,
          averageSatisfaction: "0.0",
          averageProfessionalImpact: "0.0",
          totalRecommendations: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      message.error("Failed to fetch doctor feedbacks");
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

  const getImpactText = (impact) => {
    if (impact >= 4) return "High Impact";
    if (impact >= 3) return "Moderate Impact";
    if (impact >= 2) return "Low Impact";
    return "Minimal Impact";
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctorInfo",
      key: "doctor",
      width: 250,
      render: (doctorInfo) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ProfileAvatar
            name={doctorInfo?.name || "Unknown"}
            imageUrl={doctorInfo?.profileImage}
            size="medium"
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{doctorInfo?.name || "Unknown"}</div>
            <div style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 4 }}>
              <PhoneOutlined />
              {doctorInfo?.contactNumber || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Overall Satisfaction",
      dataIndex: "overall_satisfaction",
      key: "overall_satisfaction",
      width: 150,
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating || 0} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
            {getRatingText(rating || 0)}
          </div>
        </div>
      ),
    },
    {
      title: "Professional Impact",
      dataIndex: "professional_impact",
      key: "professional_impact",
      width: 140,
      render: (impact) => (
        <div>
          <Rate disabled defaultValue={impact || 0} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
            {getImpactText(impact || 0)}
          </div>
        </div>
      ),
    },
    {
      title: "Most Used Features",
      dataIndex: "most_used_features",
      key: "most_used_features",
      width: 180,
      render: (features) => (
        <div style={{ maxWidth: 160 }}>
          {features && features.length > 0 ? (
            <Text ellipsis={{ tooltip: features.join(", ") }}>
              {features.join(", ")}
            </Text>
          ) : (
            <Text type="secondary" italic>No features listed</Text>
          )}
        </div>
      ),
    },
    {
      title: "Recommendations",
      dataIndex: "recommendations",
      key: "recommendations",
      ellipsis: true,
      render: (recommendations) => (
        <div style={{ maxWidth: 200 }}>
          {recommendations ? (
            <Text ellipsis={{ tooltip: recommendations }}>
              {recommendations}
            </Text>
          ) : (
            <Text type="secondary" italic>No recommendations</Text>
          )}
        </div>
      ),
    },
    {
      title: "Bug Reports",
      dataIndex: "bug_reports",
      key: "bug_reports",
      ellipsis: true,
      render: (bugReports) => (
        <div style={{ maxWidth: 180 }}>
          {bugReports ? (
            <Text ellipsis={{ tooltip: bugReports }}>
              {bugReports}
            </Text>
          ) : (
            <Text type="secondary" italic>No bug reports</Text>
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
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSatisfaction = filters.overallSatisfaction === "all" || 
      (feedback.overall_satisfaction && feedback.overall_satisfaction >= parseInt(filters.overallSatisfaction));
    const matchesImpact = filters.professionalImpact === "all" || 
      (feedback.professional_impact && feedback.professional_impact >= parseInt(filters.professionalImpact));
    const matchesSearch = searchText === "" ||
      (feedback.doctorInfo?.name?.toLowerCase().includes(searchText.toLowerCase())) ||
      (feedback.recommendations?.toLowerCase().includes(searchText.toLowerCase())) ||
      (feedback.bug_reports?.toLowerCase().includes(searchText.toLowerCase()));

    return matchesSatisfaction && matchesImpact && matchesSearch;
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
            View and analyze feedback from doctors about their experience
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
                title="Avg. Satisfaction"
                value={stats.averageSatisfaction}
                prefix={<StarOutlined />}
                suffix="/ 5"
                valueStyle={{ color: getRatingColor(stats.averageSatisfaction) }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Avg. Professional Impact"
                value={stats.averageProfessionalImpact}
                prefix={<StarOutlined />}
                suffix="/ 5"
                valueStyle={{ color: getRatingColor(stats.averageProfessionalImpact) }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Recommendations"
                value={stats.totalRecommendations}
                prefix={<MessageOutlined />}
                suffix="provided"
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Overall Satisfaction:</Text>
              <Select
                value={filters.overallSatisfaction}
                onChange={(value) => handleFilterChange("overallSatisfaction", value)}
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

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text>Professional Impact:</Text>
              <Select
                value={filters.professionalImpact}
                onChange={(value) => handleFilterChange("professionalImpact", value)}
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
                placeholder="Search by doctor name, recommendations, or bug reports..."
                value={searchText}
                onChange={handleSearchChange}
                style={{ width: 300 }}
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
          width={900}
        >
          {selectedFeedback && (
            <div>
              <div style={{ marginBottom: 24 }}>
                {/* Doctor Information */}
                <Card title="Doctor Information" size="small" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <ProfileAvatar
                      name={selectedFeedback.doctorInfo?.name || "Unknown"}
                      imageUrl={selectedFeedback.doctorInfo?.profileImage}
                      size="large"
                    />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>{selectedFeedback.doctorInfo?.name || "Unknown"}</Title>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <PhoneOutlined />
                        <Text>{selectedFeedback.doctorInfo?.contactNumber || "N/A"}</Text>
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
                    <Col span={12}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Overall Satisfaction</Text>
                        </div>
                        <Rate disabled defaultValue={selectedFeedback.overall_satisfaction || 0} />
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">{getRatingText(selectedFeedback.overall_satisfaction || 0)}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Professional Impact</Text>
                        </div>
                        <Rate disabled defaultValue={selectedFeedback.professional_impact || 0} />
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">{getImpactText(selectedFeedback.professional_impact || 0)}</Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Most Used Features */}
                <Card title="Most Used Features" size="small" style={{ marginBottom: 16 }}>
                  {selectedFeedback.most_used_features && selectedFeedback.most_used_features.length > 0 ? (
                    <div>
                      {selectedFeedback.most_used_features.map((feature, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                          {feature}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary" italic>No features listed</Text>
                  )}
                </Card>

                {/* Recommendations */}
                <Card title="Recommendations" size="small" style={{ marginBottom: 16 }}>
                  {selectedFeedback.recommendations ? (
                    <Text>{selectedFeedback.recommendations}</Text>
                  ) : (
                    <Text type="secondary" italic>No recommendations provided</Text>
                  )}
                </Card>

                {/* Bug Reports */}
                <Card title="Bug Reports" size="small" style={{ marginBottom: 16 }}>
                  {selectedFeedback.bug_reports ? (
                    <Text>{selectedFeedback.bug_reports}</Text>
                  ) : (
                    <Text type="secondary" italic>No bug reports provided</Text>
                  )}
                </Card>

                {/* Device Info */}
                <Card title="Device Information" size="small">
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <Text strong>Platform:</Text> {selectedFeedback.device_info?.platform || "N/A"}
                    </div>
                    <div>
                      <Text strong>App Version:</Text> {selectedFeedback.app_version || "N/A"}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default DoctorFeedbacks; 