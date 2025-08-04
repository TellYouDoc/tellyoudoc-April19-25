import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  DatePicker,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Tabs,
  Row,
  Col,
  Tooltip,
  message,
  Timeline,
  Radio,
  Avatar,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  FileSearchOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ArrowLeftOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { SectionLoading } from "../../components/LoadingStates";
import AdminLayout from "../../components/AdminLayout";
import dayjs from "dayjs";
import apiService from "../../services/api";
import "../../styles/Administrator/Appointments.css";

const { Title, Text } = Typography;

// Mock API service for appointments (replace with actual API calls later)
const mockApiService = {
  getAppointments: (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockAppointments.filter((appointment) => {
            // Filter by doctor ID
            if (
              filters.doctorId &&
              appointment.doctor.id !== filters.doctorId
            ) {
              return false;
            }

            // Filter by status
            if (filters.status && filters.status !== "all") {
              if (appointment.status !== filters.status) return false;
            }

            // Filter by date range
            if (filters.dateRange && filters.dateRange.length === 2) {
              const appointmentDate = dayjs(appointment.appointmentDate);
              const startDate = filters.dateRange[0];
              const endDate = filters.dateRange[1];

              if (
                appointmentDate.isBefore(startDate) ||
                appointmentDate.isAfter(endDate)
              ) {
                return false;
              }
            }

            // Filter by search text (patient name or appointment ID)
            if (filters.searchText) {
              const searchLower = filters.searchText.toLowerCase();
              const patientName = appointment.patient.name.toLowerCase();
              const appointmentId = appointment.id.toLowerCase();

              if (
                !patientName.includes(searchLower) &&
                !appointmentId.includes(searchLower)
              ) {
                return false;
              }
            }

            return true;
          }),
        });
      }, 500);
    });
  },

  cancelAppointment: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update the database
        const appointmentIndex = mockAppointments.findIndex(
          (app) => app.id === id
        );
        if (appointmentIndex !== -1) {
          mockAppointments[appointmentIndex].status = "cancelled";
          mockAppointments[appointmentIndex].statusHistory.push({
            status: "cancelled",
            timestamp: new Date().toISOString(),
            message: "Cancelled by administrator",
          });
        }
        resolve({ success: true });
      }, 500);
    });
  },

  rescheduleAppointment: (id, newDateTime) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update the database
        const appointmentIndex = mockAppointments.findIndex(
          (app) => app.id === id
        );
        if (appointmentIndex !== -1) {
          mockAppointments[appointmentIndex].appointmentDate = newDateTime;
          mockAppointments[appointmentIndex].statusHistory.push({
            status: "rescheduled",
            timestamp: new Date().toISOString(),
            message: "Rescheduled by administrator",
          });
        }
        resolve({ success: true });
      }, 500);
    });
  },
};

// Mock appointment data
const mockAppointments = [
  {
    id: "APT-1001",
    appointmentDate: "2025-05-20T10:30:00",
    createdAt: "2025-05-10T14:25:00",
    duration: 30,
    status: "upcoming",
    type: "checkup",
    patient: {
      id: "PT-1001",
      name: "Jane Cooper",
      age: 32,
      gender: "Female",
      phone: "+91 9834567890",
      email: "jane.cooper@example.com",
    },
    doctor: {
      id: "DOC-101",
      name: "Dr. Rajesh Sharma",
      specialization: "Oncology",
      phone: "+91 9876543210",
      email: "dr.sharma@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 123 Medical Plaza",
      city: "Mumbai",
      pincode: "400001",
    },
    payment: {
      amount: 1200,
      status: "paid",
      method: "online",
    },
    notes: "Regular follow-up for breast cancer screening",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-10T14:25:00",
        message: "Appointment booked by patient",
      },
      {
        status: "confirmed",
        timestamp: "2025-05-10T14:30:00",
        message: "Appointment confirmed by system",
      },
    ],
  },
  {
    id: "APT-1002",
    appointmentDate: "2025-05-18T15:00:00",
    createdAt: "2025-05-12T10:15:00",
    duration: 45,
    status: "upcoming",
    type: "consultation",
    patient: {
      id: "PT-1002",
      name: "Rahul Mehta",
      age: 45,
      gender: "Male",
      phone: "+91 8765432190",
      email: "rahul.m@example.com",
    },
    doctor: {
      id: "DOC-102",
      name: "Dr. Priya Patel",
      specialization: "Cardiology",
      phone: "+91 9876512340",
      email: "dr.priya@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 123 Medical Plaza",
      city: "Mumbai",
      pincode: "400001",
    },
    payment: {
      amount: 1500,
      status: "paid",
      method: "credit card",
    },
    notes: "Initial consultation for chest pain",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-12T10:15:00",
        message: "Appointment booked by patient",
      },
    ],
  },
  {
    id: "APT-1003",
    appointmentDate: "2025-05-15T11:00:00",
    createdAt: "2025-05-05T09:30:00",
    duration: 60,
    status: "completed",
    type: "follow-up",
    patient: {
      id: "PT-1003",
      name: "Anita Singh",
      age: 28,
      gender: "Female",
      phone: "+91 9234567890",
      email: "anita.s@example.com",
    },
    doctor: {
      id: "DOC-103",
      name: "Dr. Alok Gupta",
      specialization: "Gynecology",
      phone: "+91 9876123450",
      email: "dr.alok@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 456 Health Center",
      city: "Delhi",
      pincode: "110001",
    },
    payment: {
      amount: 1800,
      status: "paid",
      method: "online",
    },
    notes: "Follow-up after treatment",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-05T09:30:00",
        message: "Appointment booked by patient",
      },
      {
        status: "completed",
        timestamp: "2025-05-15T12:05:00",
        message: "Appointment marked as completed",
      },
    ],
  },
  {
    id: "APT-1004",
    appointmentDate: "2025-05-25T14:30:00",
    createdAt: "2025-05-11T16:45:00",
    duration: 30,
    status: "upcoming",
    type: "checkup",
    patient: {
      id: "PT-1004",
      name: "Vikram Desai",
      age: 52,
      gender: "Male",
      phone: "+91 9876543210",
      email: "vikram.d@example.com",
    },
    doctor: {
      id: "DOC-101",
      name: "Dr. Rajesh Sharma",
      specialization: "Oncology",
      phone: "+91 9876543210",
      email: "dr.sharma@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 123 Medical Plaza",
      city: "Mumbai",
      pincode: "400001",
    },
    payment: {
      amount: 1200,
      status: "pending",
      method: null,
    },
    notes: "Routine checkup for cancer monitoring",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-11T16:45:00",
        message: "Appointment booked via mobile app",
      },
    ],
  },
  {
    id: "APT-1005",
    appointmentDate: "2025-05-10T09:15:00",
    createdAt: "2025-05-02T13:20:00",
    duration: 45,
    status: "cancelled",
    type: "consultation",
    patient: {
      id: "PT-1005",
      name: "Sunita Patel",
      age: 39,
      gender: "Female",
      phone: "+91 7654321890",
      email: "sunita.p@example.com",
    },
    doctor: {
      id: "DOC-102",
      name: "Dr. Priya Patel",
      specialization: "Cardiology",
      phone: "+91 9876512340",
      email: "dr.priya@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 456 Health Center",
      city: "Delhi",
      pincode: "110001",
    },
    payment: {
      amount: 1500,
      status: "refunded",
      method: "credit card",
    },
    notes: "Consultation regarding high blood pressure",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-02T13:20:00",
        message: "Appointment booked by patient",
      },
      {
        status: "cancelled",
        timestamp: "2025-05-08T10:15:00",
        message: "Cancelled by patient: Family emergency",
      },
    ],
  },
  {
    id: "APT-1006",
    appointmentDate: "2025-05-16T16:30:00",
    createdAt: "2025-05-09T11:45:00",
    duration: 30,
    status: "completed",
    type: "follow-up",
    patient: {
      id: "PT-1006",
      name: "Arjun Khanna",
      age: 41,
      gender: "Male",
      phone: "+91 8123456789",
      email: "arjun.k@example.com",
    },
    doctor: {
      id: "DOC-104",
      name: "Dr. Maya Reddy",
      specialization: "Neurology",
      phone: "+91 9876901234",
      email: "dr.maya@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 789 Brain Center",
      city: "Bangalore",
      pincode: "560001",
    },
    payment: {
      amount: 2000,
      status: "paid",
      method: "online",
    },
    notes: "Follow-up for migraine treatment",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-09T11:45:00",
        message: "Appointment booked by patient",
      },
      {
        status: "completed",
        timestamp: "2025-05-16T17:05:00",
        message: "Appointment marked as completed",
      },
    ],
  },
  {
    id: "APT-1007",
    appointmentDate: "2025-05-22T13:00:00",
    createdAt: "2025-05-14T09:30:00",
    duration: 60,
    status: "upcoming",
    type: "consultation",
    patient: {
      id: "PT-1007",
      name: "Priya Malhotra",
      age: 35,
      gender: "Female",
      phone: "+91 9876123450",
      email: "priya.m@example.com",
    },
    doctor: {
      id: "DOC-103",
      name: "Dr. Alok Gupta",
      specialization: "Gynecology",
      phone: "+91 9876123450",
      email: "dr.alok@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 123 Medical Plaza",
      city: "Mumbai",
      pincode: "400001",
    },
    payment: {
      amount: 1800,
      status: "paid",
      method: "online",
    },
    notes: "Initial consultation for fertility treatment",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-14T09:30:00",
        message: "Appointment booked by patient",
      },
    ],
  },
  {
    id: "APT-1008",
    appointmentDate: "2025-05-12T10:00:00",
    createdAt: "2025-05-05T14:20:00",
    duration: 45,
    status: "cancelled",
    type: "consultation",
    patient: {
      id: "PT-1008",
      name: "Sanjay Kumar",
      age: 56,
      gender: "Male",
      phone: "+91 7890123456",
      email: "sanjay.k@example.com",
    },
    doctor: {
      id: "DOC-105",
      name: "Dr. Ritu Verma",
      specialization: "Dermatology",
      phone: "+91 9123456780",
      email: "dr.ritu@tellyoudoc.com",
    },
    location: {
      address: "TellyouDoc Clinic, 456 Health Center",
      city: "Delhi",
      pincode: "110001",
    },
    payment: {
      amount: 1300,
      status: "refunded",
      method: "cash",
    },
    notes: "Consultation for skin condition",
    statusHistory: [
      {
        status: "booked",
        timestamp: "2025-05-05T14:20:00",
        message: "Appointment booked by patient",
      },
      {
        status: "cancelled",
        timestamp: "2025-05-11T08:30:00",
        message: "Cancelled by doctor: Doctor unavailable due to emergency",
      },
    ],
  },
];

// Status map for colors and labels
const statusMap = {
  upcoming: { color: "blue", label: "Upcoming" },
  completed: { color: "green", label: "Completed" },
  cancelled: { color: "red", label: "Cancelled" },
  rescheduled: { color: "orange", label: "Rescheduled" },
};

// Helper function to export using csv or pdf
const exportData = (data, format) => {
  if (format === "csv") {
    // Convert data to CSV format
    const headers = "ID,Date,Time,Patient,Doctor,Status,Type\n";
    const csvContent = data
      .map((item) => {
        const date = dayjs(item.appointmentDate).format("YYYY-MM-DD");
        const time = dayjs(item.appointmentDate).format("HH:mm");
        return `${item.id},${date},${time},"${item.patient.name}","${item.doctor.name}",${item.status},${item.type}`;
      })
      .join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `appointments_${dayjs().format("YYYY-MM-DD")}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else if (format === "pdf") {
    // In a real application, you would generate a PDF here
    // This is just a placeholder
    message.info("PDF export functionality would be implemented here");
  }
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [status, setStatus] = useState("all");
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: null,
    searchText: "",
    doctorId: null,
  });
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  const [currentView, setCurrentView] = useState("doctors"); // 'doctors', 'slots', or 'appointments'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [slots, setSlots] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;

  // Load doctors when component mounts
  useEffect(() => {
    if (currentView === "doctors") {
      fetchDoctors();
    }
  }, [currentView]);

  // Load appointments when component mounts
  useEffect(() => {
    if (currentView === "appointments" && selectedDoctor) {
      fetchAppointments();
    }
  }, [currentView, selectedDoctor]);

  // Load appointments when filters change
  useEffect(() => {
    if (currentView === "appointments" && selectedDoctor) {
      fetchAppointments();
    }
  }, [filters, currentView, selectedDoctor]);

  // Handle doctor selection
  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    await fetchSlotsByDoctorId(doctor.doctorId);
    setCurrentView("options");
  };

  // Fetch doctors from API
  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      const response = await apiService.AdministratorService.getAllDoctors(
        1, // page
        100, // limit - get more doctors for the grid view
        "", // search
        "" // status - get all doctors
      );

      if (response.status === 200) {
        setDoctors(response.data.data);
        setTotalDoctors(response.data.totalDoctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to fetch doctors");
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Fetch slots by doctor ID
  const fetchSlotsByDoctorId = async (doctorId) => {
    setSlotsLoading(true);
    try {
      const response = await apiService.AdministratorService.getSlotsByDoctorId(
        doctorId
      );
      console.log("Slots for doctor", doctorId, ":", JSON.stringify(response.data, null, 2));
      if (response.status === 200) {
        setSlots(prevSlots => ({
          ...prevSlots,
          [doctorId]: response.data.data || []
        }));
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      message.error("Failed to fetch slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  // Handle back to doctors view
  const handleBackToDoctors = () => {
    setCurrentView("doctors");
    setSelectedDoctor(null);
    setFilters({
      ...filters,
      doctorId: null,
    });
  };

  // Handle view slots
  const handleViewSlots = () => {
    setCurrentView("slots");
  };

  // Handle view appointments
  const handleViewAppointments = () => {
    setFilters({
      ...filters,
      doctorId: selectedDoctor._id || selectedDoctor.id,
    });
    setCurrentView("appointments");
  };

  // Fetch appointments with current filters
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await mockApiService.getAppointments(filters);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Apply search filter
  const handleSearch = () => {
    setFilters({
      ...filters,
      searchText,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setFilters({
      ...filters,
      dateRange: dates,
    });
  };

  // Handle status filter change
  const handleStatusChange = (value) => {
    setStatus(value);
    setFilters({
      ...filters,
      status: value,
    });
  };

  // View appointment details
  const handleViewDetails = (record) => {
    setSelectedAppointment(record);
    setViewDetailsVisible(true);
  };

  // Open reschedule modal
  const handleRescheduleClick = (record) => {
    setSelectedAppointment(record);
    setRescheduleDate(dayjs(record.appointmentDate));
    setRescheduleVisible(true);
  };

  // Submit reschedule appointment
  const handleReschedule = async () => {
    setLoading(true);
    try {
      await mockApiService.rescheduleAppointment(
        selectedAppointment.id,
        rescheduleDate.format("YYYY-MM-DDTHH:mm:ss")
      );
      message.success("Appointment rescheduled successfully");
      setRescheduleVisible(false);
      fetchAppointments();
    } catch (error) {
      message.error("Failed to reschedule appointment");
      console.error("Error rescheduling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancel = async (record) => {
    setLoading(true);
    try {
      await mockApiService.cancelAppointment(record.id);
      message.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      message.error("Failed to cancel appointment");
      console.error("Error cancelling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export appointments
  const handleExport = (format) => {
    exportData(appointments, format);
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Date & Time",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (text) => (
        <div>
          <div>{dayjs(text).format("MMM DD, YYYY")}</div>
          <div style={{ color: "rgba(0, 0, 0, 0.45)" }}>
            {dayjs(text).format("hh:mm A")}
          </div>
        </div>
      ),
      sorter: (a, b) =>
        new Date(a.appointmentDate) - new Date(b.appointmentDate),
    },
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      render: (patient) => (
        <div>
          <div>{patient.name}</div>
          <div style={{ color: "rgba(0, 0, 0, 0.45)" }}>
            {patient.age} yrs, {patient.gender}
          </div>
        </div>
      ),
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={statusMap[text]?.color || "default"}>
          {statusMap[text]?.label ||
            text.charAt(0).toUpperCase() + text.slice(1)}
        </Tag>
      ),
      filters: [
        { text: "Upcoming", value: "upcoming" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
        { text: "Rescheduled", value: "rescheduled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<FileSearchOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>

          {record.status === "upcoming" && (
            <>
              <Button
                type="default"
                size="small"
                icon={<SyncOutlined />}
                onClick={() => handleRescheduleClick(record)}
              >
                Reschedule
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record)}
              >
                Cancel
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];
  // Render appointment detail tabs
  const renderAppointmentDetailTabs = () => {
    if (!selectedAppointment) return null;

    return (
      <Tabs defaultActiveKey="details">
        <TabPane tab="Details" key="details">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Patient Information" bordered={false}>
                <p>
                  <UserOutlined /> <strong>Name:</strong>{" "}
                  {selectedAppointment.patient.name}
                </p>
                <p>
                  <InfoCircleOutlined /> <strong>Age/Gender:</strong>{" "}
                  {selectedAppointment.patient.age} years,{" "}
                  {selectedAppointment.patient.gender}
                </p>
                <p>
                  <PhoneOutlined /> <strong>Phone:</strong>{" "}
                  {selectedAppointment.patient.phone}
                </p>
                <p>
                  <MailOutlined /> <strong>Email:</strong>{" "}
                  {selectedAppointment.patient.email}
                </p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Doctor Information" bordered={false}>
                <p>
                  <TeamOutlined /> <strong>Name:</strong>{" "}
                  {selectedAppointment.doctor.name}
                </p>
                <p>
                  <InfoCircleOutlined /> <strong>Specialization:</strong>{" "}
                  {selectedAppointment.doctor.specialization}
                </p>
                <p>
                  <PhoneOutlined /> <strong>Phone:</strong>{" "}
                  {selectedAppointment.doctor.phone}
                </p>
                <p>
                  <MailOutlined /> <strong>Email:</strong>{" "}
                  {selectedAppointment.doctor.email}
                </p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Appointment Details" bordered={false}>
                <p>
                  <CalendarOutlined /> <strong>Date & Time:</strong>{" "}
                  {dayjs(selectedAppointment.appointmentDate).format(
                    "MMM DD, YYYY hh:mm A"
                  )}
                </p>
                <p>
                  <ClockCircleOutlined /> <strong>Duration:</strong>{" "}
                  {selectedAppointment.duration} minutes
                </p>
                <p>
                  <Tag
                    color={
                      statusMap[selectedAppointment.status]?.color || "default"
                    }
                  >
                    {statusMap[selectedAppointment.status]?.label ||
                      selectedAppointment.status}
                  </Tag>
                </p>
                <p>
                  <InfoCircleOutlined /> <strong>Type:</strong>{" "}
                  {selectedAppointment.type.charAt(0).toUpperCase() +
                    selectedAppointment.type.slice(1)}
                </p>
                <p>
                  <InfoCircleOutlined /> <strong>Notes:</strong>{" "}
                  {selectedAppointment.notes}
                </p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Location & Payment" bordered={false}>
                <p>
                  <EnvironmentOutlined /> <strong>Address:</strong>{" "}
                  {selectedAppointment.location.address}
                </p>
                <p>
                  <EnvironmentOutlined /> <strong>City:</strong>{" "}
                  {selectedAppointment.location.city},{" "}
                  {selectedAppointment.location.pincode}
                </p>
                <p>
                  <InfoCircleOutlined /> <strong>Payment Amount:</strong> ₹
                  {selectedAppointment.payment.amount}
                </p>
                <p>
                  <InfoCircleOutlined /> <strong>Payment Status:</strong>{" "}
                  {selectedAppointment.payment.status.charAt(0).toUpperCase() +
                    selectedAppointment.payment.status.slice(1)}
                </p>
                {selectedAppointment.payment.method && (
                  <p>
                    <InfoCircleOutlined /> <strong>Payment Method:</strong>{" "}
                    {selectedAppointment.payment.method
                      .charAt(0)
                      .toUpperCase() +
                      selectedAppointment.payment.method.slice(1)}
                  </p>
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="History" key="history">
          <Timeline>
            {selectedAppointment.statusHistory.map((history, index) => (
              <Timeline.Item
                key={index}
                color={
                  history.status === "booked"
                    ? "blue"
                    : history.status === "confirmed"
                      ? "blue"
                      : history.status === "completed"
                        ? "green"
                        : history.status === "cancelled"
                          ? "red"
                          : history.status === "rescheduled"
                            ? "orange"
                            : "gray"
                }
              >
                <p>
                  <strong>
                    {dayjs(history.timestamp).format("MMM DD, YYYY hh:mm A")}
                  </strong>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {history.status.charAt(0).toUpperCase() +
                    history.status.slice(1)}
                </p>
                <p>{history.message}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </TabPane>
      </Tabs>
    );
  };

  // Render doctor card
  const renderDoctorCard = (doctor) => {
    // Get doctor name from API data structure
    const doctorName = `${doctor.firstName || ""} ${doctor.lastName || ""
      }`.trim();

    // Get specializations from API data structure
    const specializations = doctor.professionalDetails?.specialization || [];
    const specializationText = specializations.join(", ") || "Not specified";

    // Get contact information
    const phone = doctor.contact?.primaryNumber || "Not available";
    const email = doctor.contact?.email || "Not available";

    // Get status
    const status = doctor.isActive ? "Active" : "Inactive";
    const statusColor = doctor.isActive ? "blue" : "red";

    // Get appointment stats from the API response
    const appointmentStats = {
      total: doctor.appointmentCounts?.all || 0,
      upcoming: doctor.appointmentCounts?.upcoming || 0,
      completed: doctor.appointmentCounts?.completed || 0,
      cancelled: doctor.appointmentCounts?.cancelled || 0,
    };

    return (
      <Col xs={24} sm={12} lg={8} xl={8} key={doctor._id || doctor.id}>
        <Card
          hoverable
          className="doctor-card"
          onClick={() => handleDoctorSelect(doctor)}
          style={{ cursor: "pointer" }}
        >
          <div className="doctor-card-header">
            <Avatar
              src={doctor.profileImage}
              size={48}
              style={{ marginBottom: 8 }}
            >
              {doctorName.charAt(0)?.toUpperCase()}
            </Avatar>
            <Tag color={statusColor} style={{ marginBottom: 0 }}>
              {status}
            </Tag>
          </div>

          <div className="doctor-card-info">
            <Title level={4}>{doctorName}</Title>
            <div className="specialization-container">
              <Tooltip
                title={
                  <div>
                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      Specializations:
                    </div>
                    {specializations.map((spec, index) => (
                      <div key={index}>• {spec}</div>
                    ))}
                  </div>
                }
                placement="top"
              >
                <div className="specialization-text">
                  {specializations.length > 0
                    ? specializations[0]
                    : "Not specified"}
                  {specializations.length > 1 && (
                    <span className="more-indicator">
                      {" "}
                      +{specializations.length - 1}
                    </span>
                  )}
                </div>
              </Tooltip>
            </div>

            <div
              style={{
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "2px solid #e8e8e8",
                padding: "12px 8px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color:
                        appointmentStats.total === 0 ? "#d9d9d9" : "#262626",
                      marginBottom: "4px",
                    }}
                  >
                    {appointmentStats.total}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#8c8c8c",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Total
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color:
                        appointmentStats.upcoming === 0 ? "#d9d9d9" : "#1890ff",
                      marginBottom: "4px",
                    }}
                  >
                    {appointmentStats.upcoming}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#8c8c8c",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Upcoming
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color:
                        appointmentStats.completed === 0
                          ? "#d9d9d9"
                          : "#52c41a",
                      marginBottom: "4px",
                    }}
                  >
                    {appointmentStats.completed}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#8c8c8c",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Completed
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color:
                        appointmentStats.cancelled === 0
                          ? "#d9d9d9"
                          : "#ff4d4f",
                      marginBottom: "4px",
                    }}
                  >
                    {appointmentStats.cancelled}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#8c8c8c",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Cancelled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  // Render slot card
  const renderSlotCard = (slot) => {
    return (
      <Col xs={24} sm={12} lg={8} xl={6} key={slot._id}>
        <Card
          hoverable
          className="slot-card"
          style={{ marginBottom: 16 }}
        >
          <div className="slot-card-header">
            <div className="slot-card-location">
              <EnvironmentOutlined className="slot-card-icon" />
              <div>
                <div className="slot-card-location-text">{slot.location}</div>
              </div>
            </div>
            <Tag color={slot.active ? "green" : "red"}>
              {slot.active ? "Active" : "Inactive"}
            </Tag>
          </div>

          <div className="slot-card-dates">
            <div className="slot-card-dates-title">Available Dates:</div>
            {slot.applicableDates?.map((dateSlot, index) => (
              <div key={index} className="slot-date-item">
                <div className="slot-date">
                  <CalendarOutlined className="slot-card-icon" />
                  <div>
                    <div className="slot-date-text">
                      {dayjs(dateSlot.date).format("MMM DD, YYYY")}
                    </div>
                    <div className="slot-time-text">
                      {dateSlot.timeSlots?.map((timeSlot, timeIndex) => (
                        <span key={timeIndex} className="time-slot">
                          {timeSlot.startTime} - {timeSlot.endTime}
                          {timeSlot.status === "available" && (
                            <Tag color="green" size="small" style={{ marginLeft: 8 }}>
                              Available
                            </Tag>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
    );
  };

  // Render appointment card
  const renderAppointmentCard = (appointment) => {
    return (
      <Col xs={24} sm={12} lg={8} xl={6} key={appointment.id}>
        <Card
          hoverable
          className="appointment-card"
          actions={[
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<FileSearchOutlined />}
                onClick={() => handleViewDetails(appointment)}
              />
            </Tooltip>,
            appointment.status === "upcoming" && (
              <Tooltip title="Reschedule">
                <Button
                  type="text"
                  icon={<SyncOutlined />}
                  onClick={() => handleRescheduleClick(appointment)}
                />
              </Tooltip>
            ),
            appointment.status === "upcoming" && (
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleCancel(appointment)}
                />
              </Tooltip>
            ),
          ].filter(Boolean)}
        >
          <div className="appointment-card-header">
            <div className="appointment-card-id">{appointment.id}</div>
            <Tag color={statusMap[appointment.status]?.color || "default"}>
              {statusMap[appointment.status]?.label ||
                appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Tag>
          </div>

          <div className="appointment-card-date">
            <CalendarOutlined className="appointment-card-icon" />
            <div>
              <div className="appointment-card-date-text">
                {dayjs(appointment.appointmentDate).format("MMM DD, YYYY")}
              </div>
              <div className="appointment-card-time-text">
                {dayjs(appointment.appointmentDate).format("hh:mm A")}
              </div>
            </div>
          </div>

          <div className="appointment-card-divider" />

          <div className="appointment-card-patient">
            <UserOutlined className="appointment-card-icon" />
            <div>
              <div className="appointment-card-name">
                {appointment.patient.name}
              </div>
              <div className="appointment-card-detail">
                {appointment.patient.age} years, {appointment.patient.gender}
              </div>
            </div>
          </div>

          <div className="appointment-card-type">
            <InfoCircleOutlined className="appointment-card-icon" />
            <div>
              {appointment.type.charAt(0).toUpperCase() +
                appointment.type.slice(1)}
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-appointments-container">

        {/* Main Page content */}
        {currentView === "doctors" ? (
          // Doctors View
          <>

            {/* Main heading */}

            <div className="admin-appointments-title">
              <h1>Appointment Management</h1>
            </div>

            {/* Doctors grid */}
            <div className="admin-appointments-grid">
              {doctorsLoading ? (
                <div className="appointments-loading">
                  <div className="loading-message">Loading doctors...</div>
                </div>
              ) : (
                <Row gutter={[16, 16]} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Heading */}
                  <div className="admin-appointments-title">
                    <h1>Select a doctor to view their slots or appointments</h1>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Doctors grid */}
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => renderDoctorCard(doctor))
                    ) : (
                      <Col span={24}>
                        <div className="no-appointments-message">
                          <p>No doctors found.</p>
                        </div>
                      </Col>
                    )}
                  </div>
                </Row>
              )}
            </div>
          </>
        ) : currentView === "options" ? (
          // Options View
          <>
            <div className="admin-appointments-header">
              <div className="admin-appointments-title">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBackToDoctors}
                  style={{ marginRight: 16 }}
                >
                  Back to Doctors
                </Button>
                <div>
                  <h1>
                    {selectedDoctor
                      ? `${selectedDoctor.firstName || ""} ${selectedDoctor.lastName || ""
                        }`.trim()
                      : ""}
                  </h1>
                  <p>Choose what you want to view</p>
                </div>
              </div>
            </div>

            <div className="admin-appointments-grid">
              <Row gutter={[24, 24]} justify="center">
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    className="options-card"
                    onClick={handleViewSlots}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      height: '240px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <CalendarOutlined style={{ fontSize: '56px', color: '#667eea', marginBottom: '20px' }} />
                    <Title level={3} style={{ marginBottom: '8px', color: '#262626' }}>View Slots</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>View available appointment slots</Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    className="options-card"
                    onClick={handleViewAppointments}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      height: '240px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <FileSearchOutlined style={{ fontSize: '56px', color: '#52c41a', marginBottom: '20px' }} />
                    <Title level={3} style={{ marginBottom: '8px', color: '#262626' }}>Booked Appointments</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>View and manage booked appointments</Text>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        ) : currentView === "slots" ? (
          // Slots View
          <>
            <div className="admin-appointments-header">
              <div className="admin-appointments-title">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setCurrentView("options")}
                  style={{ marginRight: 16 }}
                >
                  Back to Options
                </Button>
                <div>
                  <h1>
                    Slots -{" "}
                    {selectedDoctor
                      ? `${selectedDoctor.firstName || ""} ${selectedDoctor.lastName || ""
                        }`.trim()
                      : ""}
                  </h1>
                  <p>View available appointment slots</p>
                </div>
              </div>
            </div>

            <div className="admin-appointments-grid">
              {slotsLoading ? (
                <div className="appointments-loading">
                  <div className="loading-message">Loading slots...</div>
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {slots[selectedDoctor?.doctorId] && slots[selectedDoctor.doctorId].length > 0 ? (
                    slots[selectedDoctor.doctorId].map((slot) => renderSlotCard(slot))
                  ) : (
                    <Col span={24}>
                      <div className="no-appointments-message">
                        <p>No slots found for this doctor.</p>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </div>
          </>
        ) : (
          // Appointments View
          <>
            <div className="admin-appointments-header">
              <div className="admin-appointments-title">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setCurrentView("options")}
                  style={{ marginRight: 16 }}
                >
                  Back to Options
                </Button>
                <div>
                  <h1>
                    Appointments -{" "}
                    {selectedDoctor
                      ? `${selectedDoctor.firstName || ""} ${selectedDoctor.lastName || ""
                        }`.trim()
                      : ""}
                  </h1>
                  <p>
                    View and manage appointments for{" "}
                    {selectedDoctor
                      ? `${selectedDoctor.firstName || ""} ${selectedDoctor.lastName || ""
                        }`.trim()
                      : ""}
                  </p>
                </div>
              </div>
              <div className="admin-appointments-actions">
                <div className="admin-appointments-filters">
                  <Input.Search
                    placeholder="Search by patient name or appointment ID"
                    value={searchText}
                    onChange={handleSearchChange}
                    onSearch={handleSearch}
                    style={{ width: 250, marginRight: 16 }}
                  />
                  <RangePicker
                    style={{ width: 280, marginRight: 16 }}
                    onChange={handleDateRangeChange}
                  />
                  <Select
                    placeholder="Filter by status"
                    style={{ width: 150 }}
                    onChange={handleStatusChange}
                    value={status}
                  >
                    <Select.Option value="all">All Status</Select.Option>
                    <Select.Option value="upcoming">Upcoming</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                    <Select.Option value="rescheduled">
                      Rescheduled
                    </Select.Option>
                  </Select>
                </div>
                <div className="admin-appointments-actions-right">
                  <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="view-mode-toggle"
                  >
                    <Tooltip title="Card View">
                      <Radio.Button value="card">
                        <AppstoreOutlined />
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="Table View">
                      <Radio.Button value="table">
                        <UnorderedListOutlined />
                      </Radio.Button>
                    </Tooltip>
                  </Radio.Group>

                  <div className="admin-appointments-export">
                    <Tooltip title="Export as CSV">
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={() => handleExport("csv")}
                      >
                        CSV
                      </Button>
                    </Tooltip>
                    <Tooltip title="Export as PDF">
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={() => handleExport("pdf")}
                        style={{ marginLeft: 8 }}
                      >
                        PDF
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === "card" ? (
              <div className="admin-appointments-grid">
                {loading ? (
                  <div className="appointments-loading">
                    <div className="loading-message">Loading...</div>
                  </div>
                ) : (
                  <>
                    <Tabs
                      defaultActiveKey="all"
                      className="appointment-status-tabs"
                      onChange={(key) => handleStatusChange(key)}
                      activeKey={status}
                    >
                      <TabPane tab="All" key="all">
                        <Row gutter={[16, 16]}>
                          {appointments.length > 0 ? (
                            appointments.map((appointment) =>
                              renderAppointmentCard(appointment)
                            )
                          ) : (
                            <Col span={24}>
                              <div className="no-appointments-message">
                                <p>No appointments found for this doctor.</p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </TabPane>
                      <TabPane tab="Upcoming" key="upcoming">
                        <Row gutter={[16, 16]}>
                          {appointments.length > 0 ? (
                            appointments.map((appointment) =>
                              renderAppointmentCard(appointment)
                            )
                          ) : (
                            <Col span={24}>
                              <div className="no-appointments-message">
                                <p>
                                  No upcoming appointments found for this
                                  doctor.
                                </p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </TabPane>
                      <TabPane tab="Completed" key="completed">
                        <Row gutter={[16, 16]}>
                          {appointments.length > 0 ? (
                            appointments.map((appointment) =>
                              renderAppointmentCard(appointment)
                            )
                          ) : (
                            <Col span={24}>
                              <div className="no-appointments-message">
                                <p>
                                  No completed appointments found for this
                                  doctor.
                                </p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </TabPane>
                      <TabPane tab="Cancelled" key="cancelled">
                        <Row gutter={[16, 16]}>
                          {appointments.length > 0 ? (
                            appointments.map((appointment) =>
                              renderAppointmentCard(appointment)
                            )
                          ) : (
                            <Col span={24}>
                              <div className="no-appointments-message">
                                <p>
                                  No cancelled appointments found for this
                                  doctor.
                                </p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </TabPane>
                    </Tabs>

                    {appointments.length > 0 && (
                      <div className="appointments-pagination">
                        <div className="appointments-total">
                          Total {appointments.length} appointments
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="admin-appointments-table">
                <Table
                  columns={columns}
                  dataSource={appointments}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    showTotal: (total) => `Total ${total} appointments`,
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* View Details Modal */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              Appointment Details - {selectedAppointment?.id}
            </div>
          }
          open={viewDetailsVisible}
          onCancel={() => setViewDetailsVisible(false)}
          footer={[
            <Button key="back" onClick={() => setViewDetailsVisible(false)}>
              Close
            </Button>,
          ]}
          width={900}
        >
          {renderAppointmentDetailTabs()}
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          title="Reschedule Appointment"
          open={rescheduleVisible}
          onCancel={() => setRescheduleVisible(false)}
          footer={[
            <Button key="back" onClick={() => setRescheduleVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleReschedule}
            >
              Reschedule
            </Button>,
          ]}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              name="rescheduleDate"
              label="New Date & Time"
              rules={[
                {
                  required: true,
                  message: "Please select a date and time",
                },
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                allowClear={false}
                style={{ width: "100%" }}
                value={rescheduleDate}
                onChange={setRescheduleDate}
                disabledDate={(current) => {
                  // Can't select days before today
                  return current && current < dayjs().startOf("day");
                }}
              />
            </Form.Item>
            <Form.Item name="rescheduleReason" label="Reason for Rescheduling">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default Appointments;
