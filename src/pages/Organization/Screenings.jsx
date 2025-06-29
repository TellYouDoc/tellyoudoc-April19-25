// filepath: c:\Users\Ankan Chakraborty\OneDrive\Desktop\IIIT Guwahati\Website\live\tellyoudoc-April19-25\src\pages\Organization\Screenings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Organization/Screenings.css";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  message,
  Select,
  Typography,
  Tooltip,
  Empty,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Card,
  Divider,
  Row,
  Col,
  Descriptions,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import OrganizationLayout from "../../components/OrganizationLayout";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const statusColors = {
  scheduled: "processing",
  completed: "success",
  cancelled: "error",
  pending: "warning",
};

// Custom status tag classes
const statusClasses = {
  scheduled: "status-tag-scheduled",
  completed: "status-tag-completed",
  cancelled: "status-tag-cancelled",
  pending: "status-tag-pending",
};

const Screenings = () => {
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [screeningTypeFilter, setScreeningTypeFilter] = useState("all");
  const [availableLocations, setAvailableLocations] = useState([
    "TellYouDoc Main Center",
    "Community Hospital",
    "Mobile Screening Unit",
  ]); // Default locations
  const [filterLoading, setFilterLoading] = useState(false);

  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [assignDoctorModalVisible, setAssignDoctorModalVisible] =
    useState(false);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [form] = Form.useForm();

  // Pagination and loading states
  const [totalScreenings, setTotalScreenings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
    showTotal: (total) => `Total ${total} screenings`,
  });
  // Filter screenings based on search text and filters
  const filteredScreenings = screenings.filter((screening) => {
    const search = searchText.toLowerCase();

    // Check if screening matches search text
    const matchesSearch =
      screening.screeningId.toLowerCase().includes(search) ||
      screening.screeningType.toLowerCase().includes(search) ||
      screening.status.toLowerCase().includes(search) ||
      (screening.doctorName &&
        screening.doctorName.toLowerCase().includes(search)) ||
      (screening.location &&
        screening.location.toLowerCase().includes(search)) ||
      (screening.fullAddress &&
        screening.fullAddress.toLowerCase().includes(search)) ||
      (screening.assignedDoctors &&
        screening.assignedDoctors.some(
          (doc) =>
            doc.name.toLowerCase().includes(search) ||
            doc.specialization.toLowerCase().includes(search)
        ));

    // Check if screening matches status filter
    const matchesStatus =
      statusFilter === "all" || screening.status === statusFilter;

    // Check if screening matches location filter
    const matchesLocation =
      locationFilter === "all" || screening.location === locationFilter;

    // Check if screening matches screening type filter
    const matchesType =
      screeningTypeFilter === "all" ||
      screening.screeningType === screeningTypeFilter;

    // Return true only if all conditions are met
    return matchesSearch && matchesStatus && matchesLocation && matchesType;
  });

  // Mock function to fetch screenings (replace with actual API call)
  const fetchScreenings = () => {
    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockScreenings = [
        {
          id: "1",
          screeningId: "SCR001",
          patientName: "Jane Smith",
          patientId: "PAT001",
          screeningType: "Mammogram",
          status: "scheduled",
          date: "2025-05-25",
          time: "10:30 AM",
          location: "TellYouDoc Main Center",
          locationDetails: {
            addressLine1: "123 Healthcare Avenue",
            addressLine2: "Building A, Suite 101",
            city: "New Delhi",
            state: "Delhi",
            country: "India",
            pinCode: "110001",
          },
          doctorName: "Dr. Priya Sharma",
          doctorId: "D001",
          notes: "First-time mammogram screening",
          createdAt: "2025-05-10T10:30:00Z",
        },
        {
          id: "2",
          screeningId: "SCR002",
          patientName: "Maria Johnson",
          patientId: "PAT002",
          screeningType: "Ultrasound",
          status: "completed",
          date: "2025-05-18",
          time: "09:15 AM",
          location: "TellYouDoc Main Center",
          locationDetails: {
            addressLine1: "123 Healthcare Avenue",
            addressLine2: "Building A, Suite 101",
            city: "New Delhi",
            state: "Delhi",
            country: "India",
            pinCode: "110001",
          },
          doctorName: "Dr. Rajiv Kumar",
          doctorId: "D002",
          notes: "Follow-up ultrasound after mammogram",
          createdAt: "2025-05-05T14:45:00Z",
          completedAt: "2025-05-18T09:45:00Z",
          results: "No abnormalities detected",
        },
        {
          id: "3",
          screeningId: "SCR003",
          patientName: "Sarah Williams",
          patientId: "PAT003",
          screeningType: "Mammogram",
          status: "completed",
          date: "2025-05-15",
          time: "02:00 PM",
          location: "Mobile Screening Unit",
          doctorName: "Dr. Ananya Sen",
          doctorId: "D003",
          notes: "Annual screening",
          createdAt: "2025-04-30T09:15:00Z",
          completedAt: "2025-05-15T02:30:00Z",
          results: "Normal findings",
        },
        {
          id: "4",
          screeningId: "SCR004",
          patientName: "Lisa Brown",
          patientId: "PAT004",
          screeningType: "Breast MRI",
          status: "cancelled",
          date: "2025-05-20",
          time: "11:30 AM",
          location: "Community Hospital",
          doctorName: null,
          doctorId: null,
          notes: "Patient requested cancellation",
          createdAt: "2025-05-01T11:20:00Z",
          cancelledReason: "Patient unavailable",
        },
        {
          id: "5",
          screeningId: "SCR005",
          patientName: "Emily Davis",
          patientId: "PAT005",
          screeningType: "Clinical Breast Exam",
          status: "pending",
          date: "2025-05-30",
          time: "03:45 PM",
          location: "TellYouDoc Main Center",
          doctorName: null,
          doctorId: null,
          notes: "First clinical examination",
          createdAt: "2025-05-15T16:40:00Z",
        },
      ];

      setScreenings(mockScreenings);
      setTotalScreenings(mockScreenings.length);
      setPagination({
        ...pagination,
        total: mockScreenings.length,
      });
      setLoading(false);
      setFilterLoading(false);
    }, 1000);
  };
  // Load screenings on component mount and when filters change
  useEffect(() => {
    fetchScreenings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, locationFilter, screeningTypeFilter]);

  // Handle viewing screening details
  const viewScreeningDetails = (screening) => {
    setSelectedScreening(screening);
    setViewModalVisible(true);
  };

  // Handle assigning doctor
  const openAssignDoctorModal = (screening) => {
    setSelectedScreening(screening);
    setAssignDoctorModalVisible(true);
  };

  // Handle form submission for adding new screening
  const handleAddScreening = (values) => {
    // Get assigned doctors information
    const assignedDoctorsList = values.assignedDoctors
      ? values.assignedDoctors.map((doctorId) => {
          const doctor = availableDoctors.find((d) => d.id === doctorId);
          return {
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
          };
        })
      : [];

    // Format the address
    const addressDetails = {
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || "",
      city: values.city,
      state: values.state,
      pinCode: values.pinCode,
      fullAddress: `${values.addressLine1}, ${
        values.addressLine2 ? values.addressLine2 + ", " : ""
      }${values.city}, ${values.state} - ${values.pinCode}`,
    }; // Format the values as needed
    const newScreening = {
      id: String(screenings.length + 1),
      screeningId: `SCR00${screenings.length + 1}`,
      patientCount: values.patientCount || 1,
      screeningType: values.screeningType,
      status: "scheduled",
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("hh:mm A"),
      location: values.location,
      addressDetails: addressDetails,
      fullAddress: `${values.location}: ${addressDetails.fullAddress}`,
      assignedDoctors: assignedDoctorsList,
      notes: values.notes,
      createdAt: new Date().toISOString(),
    };

    // Add new screening to the list
    setScreenings([...screenings, newScreening]);
    message.success("New screening added successfully");
    setAddModalVisible(false);
    form.resetFields();
  };
  // Handle form submission for assigning doctor
  const handleAssignDoctor = (values) => {
    // Get assigned doctors information
    const assignedDoctorsList = values.assignedDoctors
      ? values.assignedDoctors.map((doctorId) => {
          const doctor = availableDoctors.find((d) => d.id === doctorId);
          return {
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
          };
        })
      : [];

    const updatedScreenings = screenings.map((s) => {
      if (s.id === selectedScreening.id) {
        return {
          ...s,
          assignedDoctors: assignedDoctorsList,
        };
      }
      return s;
    });

    setScreenings(updatedScreenings);
    message.success("Doctors assigned successfully");
    setAssignDoctorModalVisible(false);
    setSelectedScreening(null);
  };

  // Table columns definition
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
      title: "Screening ID",
      dataIndex: "screeningId",
      key: "screeningId",
    },
    {
      title: "Patients",
      dataIndex: "patientCount",
      key: "patientCount",
      render: (count) => (
        <Space>
          <UserOutlined />
          {count || 1} patients
        </Space>
      ),
    },
    {
      title: "Screening Type",
      dataIndex: "screeningType",
      key: "screeningType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        // Convert YYYY-MM-DD to DD/MM/YYYY
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "";
        return (
          <Space>
            <CalendarOutlined />
            {formattedDate}
          </Space>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time}
        </Space>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <EnvironmentOutlined />
            {location}
          </Space>
          {record.fullAddress && (
            <div
              style={{
                marginLeft: 24,
                fontSize: "12px",
                color: "rgba(0, 0, 0, 0.65)",
              }}
            >
              {record.fullAddress}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Doctors",
      key: "doctors",
      render: (_, record) => {
        if (record.assignedDoctors && record.assignedDoctors.length > 0) {
          return (
            <Space direction="vertical" size={0}>
              {record.assignedDoctors.length > 1 ? (
                <Tag color="green">
                  {record.assignedDoctors.length} doctors assigned
                </Tag>
              ) : (
                <Space>
                  <UserOutlined />
                  {record.assignedDoctors[0].name}
                </Space>
              )}
            </Space>
          );
        } else if (record.doctorName) {
          return (
            <Space>
              <UserOutlined />
              {record.doctorName}
            </Space>
          );
        } else {
          return <Tag color="orange">Not Assigned</Tag>;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status]} className={statusClasses[status]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => viewScreeningDetails(record)}
            className="view-button"
          >
            View
          </Button>
          {record.status !== "completed" &&
            record.status !== "cancelled" &&
            !record.doctorName && (
              <Button
                icon={<UserOutlined />}
                onClick={() => openAssignDoctorModal(record)}
                className="assign-button"
              >
                Assign Doctors
              </Button>
            )}
        </Space>
      ),
    },
  ];

  // Available doctors (mock data)
  const availableDoctors = [
    { id: "D001", name: "Dr. Priya Sharma", specialization: "Oncologist" },
    { id: "D002", name: "Dr. Rajiv Kumar", specialization: "Breast Surgeon" },
    {
      id: "D003",
      name: "Dr. Ananya Sen",
      specialization: "Medical Oncologist",
    },
    { id: "D004", name: "Dr. Vikram Patel", specialization: "Radiologist" },
    {
      id: "D005",
      name: "Dr. Deepika Mehta",
      specialization: "Breast Imaging Specialist",
    },
  ];

  // Available screening types
  const screeningTypes = [
    "Mammogram",
    "Ultrasound",
    "Clinical Breast Exam",
    "Breast MRI",
    "Thermography",
  ];

  // Available patients (mock data)
  const availablePatients = [
    { id: "PAT001", name: "Jane Smith" },
    { id: "PAT002", name: "Maria Johnson" },
    { id: "PAT003", name: "Sarah Williams" },
    { id: "PAT004", name: "Lisa Brown" },
    { id: "PAT005", name: "Emily Davis" },
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
            <Title level={2} style={{ margin: 0 }}>
              Screening Management
            </Title>
            <Text type="secondary">
              Manage breast cancer screening appointments and sessions
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            className="add-screening-button"
          >
            Add Screening
          </Button>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <Input
            placeholder="Search screenings..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Space>
            <FilterOutlined />
            <Text strong>Filters:</Text>
          </Space>
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(value) => {
              setFilterLoading(true);
              setStatusFilter(value);
            }}
            style={{ width: 150 }}
            placeholder="Status"
            suffixIcon={
              filterLoading && statusFilter !== "all" ? (
                <LoadingOutlined spin />
              ) : (
                <FilterOutlined />
              )
            }
            disabled={loading}
          >
            <Option value="all">All Status</Option>
            <Option value="scheduled">Scheduled</Option>
            <Option value="completed">Completed</Option>
            <Option value="pending">Pending</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>{" "}
          {/* Location Filter */}
          <Select
            value={locationFilter}
            onChange={(value) => {
              setFilterLoading(true);
              setLocationFilter(value);
            }}
            style={{ width: 220 }}
            placeholder="Location"
            suffixIcon={
              filterLoading && locationFilter !== "all" ? (
                <LoadingOutlined spin />
              ) : (
                <FilterOutlined />
              )
            }
            disabled={loading}
          >
            <Option value="all">All Locations</Option>
            {availableLocations.map((location) => (
              <Option key={location} value={location}>
                {location}
              </Option>
            ))}
          </Select>
          {/* Screening Type Filter */}
          <Select
            value={screeningTypeFilter}
            onChange={(value) => {
              setFilterLoading(true);
              setScreeningTypeFilter(value);
            }}
            style={{ width: 220 }}
            placeholder="Screening Type"
            suffixIcon={
              filterLoading && screeningTypeFilter !== "all" ? (
                <LoadingOutlined spin />
              ) : (
                <FilterOutlined />
              )
            }
            disabled={loading}
          >
            <Option value="all">All Types</Option>
            {screeningTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </div>

        {/* Screening Table */}
        <Table
          columns={columns}
          dataSource={filteredScreenings}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => {
            setPagination(pagination);
            setCurrentPage(pagination.current);
          }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span style={{ color: "var(--text-secondary)" }}>
                    No screenings found
                  </span>
                }
              />
            ),
          }}
          className="screening-table"
        />

        {/* Add Screening Modal */}
        <Modal
          title="Add New Screening"
          open={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
          className="add-screening-modal"
        >
          <Form form={form} layout="vertical" onFinish={handleAddScreening}>
            {" "}
            <Row gutter={16}>
              {" "}
              <Col span={12}>
                <Form.Item
                  name="patientCount"
                  label="Number of Patients"
                  tooltip="Enter the number of patients for this screening session"
                  rules={[
                    {
                      required: true,
                      message: "Please enter number of patients",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    defaultValue={1}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="screeningType"
                  label="Screening Type"
                  rules={[
                    { required: true, message: "Please select screening type" },
                  ]}
                >
                  <Select placeholder="Select screening type">
                    {screeningTypes.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="screeningType"
                  label="Screening Type"
                  rules={[
                    { required: true, message: "Please select screening type" },
                  ]}
                >
                  <Select placeholder="Select screening type">
                    {screeningTypes.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Location Name"
                  rules={[
                    { required: true, message: "Please select a location" },
                  ]}
                >
                  <Select placeholder="Select location">
                    {availableLocations.map((location) => (
                      <Option key={location} value={location}>
                        {location}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* Address Fields */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="addressLine1"
                  label="Address Line 1"
                  rules={[
                    { required: true, message: "Please enter address line 1" },
                  ]}
                >
                  <Input placeholder="Enter street address" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="addressLine2" label="Address Line 2">
                  <Input placeholder="Apartment, suite, unit, building, floor, etc." />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: "Please enter city" }]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: "Please enter state" }]}
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="pinCode"
                  label="PIN Code"
                  rules={[
                    {
                      required: true,
                      message: "Please enter PIN code",
                      pattern: /^\d{6}$/,
                      len: 6,
                    },
                  ]}
                >
                  <Input placeholder="Enter 6-digit PIN code" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="time"
                  label="Time"
                  rules={[{ required: true, message: "Please select a time" }]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    format="h:mm A"
                    use12Hours
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="assignedDoctors"
                  label="Assigned Doctors"
                  tooltip="You can select multiple doctors for this screening"
                >
                  <Select
                    mode="multiple"
                    placeholder="Select doctors"
                    allowClear
                    style={{ width: "100%" }}
                  >
                    {availableDoctors.map((doctor) => (
                      <Option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialization})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="notes" label="Notes">
              <TextArea
                rows={4}
                placeholder="Any notes or special instructions"
              />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  onClick={() => {
                    setAddModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Schedule Screening
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Screening Modal */}
        <Modal
          title={`Screening Details: ${selectedScreening?.screeningId || ""}`}
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          width={700}
          className="screening-detail-modal"
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedScreening && (
            <Card className="screening-detail-card" bordered={false}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card title="Screening Information" bordered={false}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Screening ID">
                        {selectedScreening.screeningId}
                      </Descriptions.Item>
                      <Descriptions.Item label="Type">
                        <Tag color="blue">
                          {selectedScreening.screeningType}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag
                          color={statusColors[selectedScreening.status]}
                          className={statusClasses[selectedScreening.status]}
                        >
                          {selectedScreening.status.toUpperCase()}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Date & Time">
                        <Space>
                          <CalendarOutlined />
                          {`${selectedScreening.date} at ${selectedScreening.time}`}
                        </Space>
                      </Descriptions.Item>{" "}
                      <Descriptions.Item label="Location">
                        <Space>
                          <EnvironmentOutlined />
                          {selectedScreening.location}
                        </Space>
                      </Descriptions.Item>
                      {selectedScreening.fullAddress ? (
                        <Descriptions.Item label="Full Address">
                          <div style={{ marginLeft: 24 }}>
                            {selectedScreening.fullAddress}
                          </div>
                        </Descriptions.Item>
                      ) : (
                        selectedScreening.addressDetails && (
                          <Descriptions.Item label="Address">
                            <div style={{ marginLeft: 24 }}>
                              {selectedScreening.addressDetails.addressLine1}
                              <br />
                              {selectedScreening.addressDetails
                                .addressLine2 && (
                                <>
                                  {
                                    selectedScreening.addressDetails
                                      .addressLine2
                                  }
                                  <br />
                                </>
                              )}
                              {selectedScreening.addressDetails.city},{" "}
                              {selectedScreening.addressDetails.state}
                              <br />
                              PIN: {selectedScreening.addressDetails.pinCode}
                            </div>
                          </Descriptions.Item>
                        )
                      )}
                    </Descriptions>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Patient Information" bordered={false}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Number of Patients">
                        <Space>
                          <UserOutlined />
                          {selectedScreening.patientCount || 1} patients
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card title="Doctor Assignment" bordered={false}>
                    {selectedScreening.assignedDoctors &&
                    selectedScreening.assignedDoctors.length > 0 ? (
                      <div>
                        <Text
                          strong
                          style={{ marginBottom: 10, display: "block" }}
                        >
                          {selectedScreening.assignedDoctors.length}{" "}
                          {selectedScreening.assignedDoctors.length === 1
                            ? "Doctor"
                            : "Doctors"}{" "}
                          Assigned
                        </Text>
                        {selectedScreening.assignedDoctors.map(
                          (doctor, index) => (
                            <Descriptions
                              key={doctor.id}
                              column={1}
                              size="small"
                              style={{ marginBottom: 10 }}
                            >
                              <Descriptions.Item label={`Doctor ${index + 1}`}>
                                <Space>
                                  <UserOutlined />
                                  {doctor.name} ({doctor.specialization})
                                </Space>
                              </Descriptions.Item>
                            </Descriptions>
                          )
                        )}
                      </div>
                    ) : selectedScreening.doctorName ? (
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Assigned Doctor">
                          <Space>
                            <UserOutlined />
                            {selectedScreening.doctorName}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Doctor ID">
                          {selectedScreening.doctorId}
                        </Descriptions.Item>
                      </Descriptions>
                    ) : (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <Text type="secondary">No doctor assigned yet</Text>{" "}
                        {selectedScreening.status !== "completed" &&
                          selectedScreening.status !== "cancelled" && (
                            <div style={{ marginTop: "10px" }}>
                              <Button
                                type="primary"
                                icon={<UserOutlined />}
                                onClick={() => {
                                  setViewModalVisible(false);
                                  openAssignDoctorModal(selectedScreening);
                                }}
                              >
                                Assign Doctors
                              </Button>
                            </div>
                          )}
                      </div>
                    )}
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card title="Notes & Results" bordered={false}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Notes">
                        {selectedScreening.notes || "No notes available"}
                      </Descriptions.Item>

                      {selectedScreening.status === "completed" &&
                        selectedScreening.results && (
                          <Descriptions.Item label="Results">
                            {selectedScreening.results}
                          </Descriptions.Item>
                        )}

                      {selectedScreening.status === "cancelled" &&
                        selectedScreening.cancelledReason && (
                          <Descriptions.Item label="Cancellation Reason">
                            {selectedScreening.cancelledReason}
                          </Descriptions.Item>
                        )}
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </Card>
          )}
        </Modal>
        {/* Assign Doctor Modal */}
        <Modal
          title="Assign Doctors to Screening"
          open={assignDoctorModalVisible}
          onCancel={() => setAssignDoctorModalVisible(false)}
          footer={null}
          width={500}
          className="assign-doctor-modal"
        >
          {selectedScreening && (
            <Form layout="vertical" onFinish={handleAssignDoctor}>
              {" "}
              <div className="screening-assignment-summary">
                <Text strong>Screening ID:</Text>{" "}
                {selectedScreening.screeningId}
                <br />
                <Text strong>Patient Count:</Text>{" "}
                {selectedScreening.patientCount || 1}
                <br />
                <Text strong>Type:</Text> {selectedScreening.screeningType}
                <br />
                <Text strong>Date & Time:</Text>{" "}
                {`${selectedScreening.date} at ${selectedScreening.time}`}
              </div>
              <Divider />
              <Form.Item
                name="assignedDoctors"
                label="Select Doctors"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one doctor",
                  },
                ]}
                tooltip="You can select multiple doctors for this screening"
              >
                <Select
                  mode="multiple"
                  placeholder="Select doctors"
                  style={{ width: "100%" }}
                >
                  {availableDoctors.map((doctor) => (
                    <Option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialization})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button onClick={() => setAssignDoctorModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<UserOutlined />}
                  >
                    Assign Doctors
                  </Button>
                </div>{" "}
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </OrganizationLayout>
  );
};

export default Screenings;
