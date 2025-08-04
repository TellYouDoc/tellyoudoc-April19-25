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
  CloseCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  UserOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { SectionLoading } from "../../components/LoadingStates";
import AdminLayout from "../../components/AdminLayout";
import dayjs from "dayjs";
import apiService from "../../services/api";
import "../../styles/Administrator/Appointments.css";



// Status map for colors and labels
const statusMap = {
  booked: { color: "blue", label: "Booked" },
  complete: { color: "green", label: "Completed" },
  cancel: { color: "red", label: "Cancelled" },
  pending: { color: "orange", label: "Pending" },
  rescheduled: { color: "orange", label: "Rescheduled" },
};

// Helper function to export using csv or pdf
const exportData = (data, format, doctorName = 'all') => {
  if (format === "excel") {
    // Create a CSV file that Excel can open properly
    // Excel can open CSV files directly, so we'll use CSV format with .csv extension
    const headers = "ID,Date,Time,Patient Name,Patient Age,Patient Gender,Status,Type,Is Visited,Prescription Provided,Report Provided,Next Visit\n";
    const csvContent = data
      .map((item) => {
        const date = dayjs(item.appointmentDate).format("YYYY-MM-DD");
        const time = dayjs(item.appointmentDate).format("HH:mm");
        return `${item.id},${date},${time},"${item.patient.name}","${item.patient.age}","${item.patient.gender}",${item.status},${item.type},${item.isVisited ? 'Yes' : 'No'},${item.prescriptionProvided ? 'Yes' : 'No'},${item.reportProvided ? 'Yes' : 'No'},"${item.nextVisit || 'N/A'}"`;
      })
      .join("\n");

    const blob = new Blob([headers + csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `appointments_${doctorName}_${dayjs().format("YYYY-MM-DD")}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else if (format === "pdf") {
    // Create a proper PDF using jsPDF library
    // First, we need to dynamically load jsPDF and autoTable plugin
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js';

      script2.onload = () => {
        const { jsPDF } = window.jspdf;

        // Create new PDF document
        const doc = new jsPDF();

        // Set font
        doc.setFont("helvetica");

        // Add title
        doc.setFontSize(20);
        doc.text("Appointments Report", 105, 20, { align: "center" });

        // Add subtitle
        doc.setFontSize(12);
        doc.text(`Doctor: ${doctorName}`, 105, 30, { align: "center" });
        doc.text(`Generated: ${dayjs().format("MMMM DD, YYYY")}`, 105, 40, { align: "center" });

        // Define table headers
        const headers = [
          ['Date & Time', 'Patient Details', 'Status', 'Visited', 'Prescription', 'Report']
        ];

        // Prepare table data
        const tableData = data.map((item) => {
          const date = dayjs(item.appointmentDate).format("MMM DD");
          const time = dayjs(item.appointmentDate).format("HH:mm");
          const patientDetails = `${item.patient.name.substring(0, 25)}\n${item.patient.age} yrs, ${item.patient.gender}`;
          const formattedStatus = item.status.charAt(0).toUpperCase() + item.status.slice(1);
          return [
            `${date}\n${time}`,
            patientDetails,
            formattedStatus,
            item.isVisited ? 'Yes' : 'No',
            item.prescriptionProvided ? 'Yes' : 'No',
            item.reportProvided ? 'Yes' : 'No'
          ];
        });



        // Create table
        doc.autoTable({
          head: [headers[0]],
          body: tableData,
          startY: 55,
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [66, 139, 202],
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          columnStyles: {
            0: { cellWidth: 25 }, // Date & Time
            1: { cellWidth: 80 }, // Patient Details
            2: { cellWidth: 20 }, // Status
            3: { cellWidth: 20 }, // Visited
            4: { cellWidth: 25 }, // Prescription
            5: { cellWidth: 20 }, // Report
          },
          margin: { left: 10, right: 10 },
          tableWidth: 'auto',
          didDrawPage: function (data) {
            // Add page number
            doc.setFontSize(10);
            doc.text(
              `Page ${doc.internal.getNumberOfPages()}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 10
            );
          }
        });

        // Add summary
        const finalY = doc.lastAutoTable.finalY || 50;
        doc.setFontSize(12);
        doc.text(`Total Appointments: ${data.length}`, 105, finalY + 10, { align: "center" });

        // Save the PDF
        doc.save(`appointments_${doctorName}_${dayjs().format("YYYY-MM-DD")}.pdf`);

        message.success("PDF report generated successfully!");
      };

      script2.onerror = () => {
        message.error("Failed to load autoTable plugin. Please try again.");
      };

      document.head.appendChild(script2);
    };

    script1.onerror = () => {
      message.error("Failed to load PDF library. Please try again.");
    };

    document.head.appendChild(script1);
  }
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");
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
  const [slots, setSlots] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [doctorSearchText, setDoctorSearchText] = useState("");
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;

  // Helper function to convert 24-hour format to 12-hour format
  const convertTo12HourFormat = (time24) => {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedHour = hour12.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');

    return `${formattedHour}:${formattedMinutes} ${ampm}`;
  };

  // Load doctors when component mounts
  useEffect(() => {
    if (currentView === "doctors") {
      fetchDoctors();
    }
  }, [currentView]);

  // Load appointments when component mounts
  useEffect(() => {
    if (currentView === "appointments" && selectedDoctor) {
      fetchAppointmentsByDoctorId(selectedDoctor.doctorId, status);
    }
  }, [currentView, selectedDoctor]);

  // Load appointments when filters change
  useEffect(() => {
    if (currentView === "appointments" && selectedDoctor) {
      fetchAppointmentsByDoctorId(selectedDoctor.doctorId, status);
    }
  }, [filters, currentView, selectedDoctor]);

  // Handle doctor selection for slots
  const handleViewSlots = async (doctor) => {
    setSelectedDoctor(doctor);
    await fetchSlotsByDoctorId(doctor.doctorId);
    setCurrentView("slots");
  };

  // Handle doctor selection for appointments
  const handleViewAppointments = async (doctor) => {
    await fetchAppointmentsByDoctorId(doctor.doctorId, 'all');

    setSelectedDoctor(doctor);
    setFilters({
      ...filters,
      doctorId: doctor._id || doctor.id,
    });
    setCurrentView("appointments");
  };

  // Handle doctor search
  const handleDoctorSearch = (e) => {
    const searchValue = e.target.value;
    setDoctorSearchText(searchValue);
    // Call API with search text
    fetchDoctors(searchValue);
  };

  // Fetch doctors from API
  const fetchDoctors = async (searchText = "") => {
    setDoctorsLoading(true);
    try {
      const response = await apiService.AdministratorService.getAllDoctors(
        1, // page
        100, // limit - get more doctors for the grid view
        searchText, // search
        "" // status - get all doctors
      );

      if (response.status === 200) {
        setDoctors(response.data.data);
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

      if (response.status === 200) {
        setSlots((prevSlots) => ({
          ...prevSlots,
          [doctorId]: response.data.data || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      message.error("Failed to fetch slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  // Fetch appointments by doctor ID with optional status filter
  const fetchAppointmentsByDoctorId = async (doctorId, statusFilter = null) => {
    setLoading(true);
    try {
      // Build query parameters based on status filter
      let queryParams = {};
      if (statusFilter && statusFilter !== 'all') {
        // Map frontend status values to backend query parameters
        // The backend expects the actual status value, not a boolean
        switch (statusFilter) {
          case 'booked':
            queryParams.booked = 'booked';
            break;
          case 'complete':
            queryParams.complete = 'complete';
            break;
          case 'cancel':
            queryParams.cancel = 'cancel';
            break;
          case 'pending':
            queryParams.pending = 'pending';
            break;
          default:
            break;
        }
      }

      const response = await apiService.AdministratorService.getAppointmentsByDoctorId(doctorId, queryParams);

      console.log("Appointments fetched successfully:", response.data);
      console.log("Response status:", response.status);
      console.log("Response data success:", response.data.success);
      console.log("Response data data:", response.data.data);

      if (response.status === 200 && response.data.success) {
        // Transform the API response to match the expected format
        const transformedAppointments = response.data.data.map(appointment => ({
          id: appointment._id,
          appointmentDate: appointment.date,
          patient: {
            name: `${appointment.patientId.patientProfile.firstName} ${appointment.patientId.patientProfile.middleName} ${appointment.patientId.patientProfile.lastName}`.trim(),
            age: appointment.patientId.patientProfile.age,
            gender: appointment.patientId.patientProfile.gender
          },
          status: appointment.bookingStatus,
          type: "Consultation", // Default type since it's not in the API response
          isVisited: appointment.isVisited,
          prescriptionProvided: appointment.prescriptionProvided,
          reportProvided: appointment.reportProvided,
          nextVisit: appointment.nextVisit,
          behalfUserId: appointment.behalfUserId
        }));

        setAppointments(transformedAppointments);
        console.log("Appointments fetched successfully:", transformedAppointments);
        console.log("Appointments count:", transformedAppointments.length);
        console.log("Appointments statuses:", transformedAppointments.map(apt => apt.status));
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
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



  // Handle status filter change
  const handleStatusChange = (value) => {
    setStatus(value);
    setFilters({
      ...filters,
      status: value,
    });

    // Fetch appointments with the new status filter
    if (selectedDoctor) {
      fetchAppointmentsByDoctorId(selectedDoctor.doctorId, value);
    }
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
      // TODO: Replace with actual API call when available
      // await apiService.AdministratorService.rescheduleAppointment(
      //   selectedAppointment.id,
      //   rescheduleDate.format("YYYY-MM-DDTHH:mm:ss")
      // );
      message.info("Reschedule API integration pending");
      setRescheduleVisible(false);
      if (selectedDoctor) {
        fetchAppointmentsByDoctorId(selectedDoctor.doctorId, status);
      }
    } catch (error) {
      message.error("Failed to reschedule appointment");
      console.error("Error rescheduling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancel = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call when available
      // await apiService.AdministratorService.cancelAppointment(record.id);
      message.info("Cancel appointment API integration pending");
      if (selectedDoctor) {
        fetchAppointmentsByDoctorId(selectedDoctor.doctorId, status);
      }
    } catch (error) {
      message.error("Failed to cancel appointment");
      console.error("Error cancelling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export appointments
  const handleExport = (format) => {
    const doctorName = selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : 'all';
    exportData(appointments, format, doctorName);
  };

  // Table columns
  const columns = [
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
            {patient.age}, {patient.gender}
          </div>
        </div>
      ),
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
        { text: "Booked", value: "booked" },
        { text: "Completed", value: "complete" },
        { text: "Cancelled", value: "cancel" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {record.status === "booked" && (
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
                onClick={() => handleCancel()}
              >
                Cancel
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];




  // State for slot modal
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotDateFilter, setSlotDateFilter] = useState('upcoming'); // 'past' or 'upcoming'
  const [selectedDate, setSelectedDate] = useState(null); // For specific date search

  // Handle slot click to open modal
  const handleSlotClick = (slot, dateSlot, timeSlot) => {
    setSelectedSlot({
      ...slot,
      selectedDate: dateSlot.date,
      selectedTimeSlot: timeSlot
    });
    setEditingSlot(null);
    setSlotModalVisible(true);
  };

  // Handle edit slot
  const handleEditSlot = () => {
    setEditingSlot(selectedSlot);
  };

  // Handle delete slot
  const handleDeleteSlot = async () => {
    try {
      // Here you would call the API to delete the slot
      message.success("Slot deleted successfully");
      setSlotModalVisible(false);
      // Refresh slots
      if (selectedDoctor) {
        await fetchSlotsByDoctorId(selectedDoctor.doctorId);
      }
    } catch (error) {
      message.error("Failed to delete slot");
      console.error("Error deleting slot:", error);
    }
  };

  // Handle save edited slot
  const handleSaveSlot = async () => {
    try {
      // Here you would call the API to update the slot
      message.success("Slot updated successfully");
      setSlotModalVisible(false);
      setEditingSlot(null);
      // Refresh slots
      if (selectedDoctor) {
        await fetchSlotsByDoctorId(selectedDoctor.doctorId);
      }
    } catch (error) {
      message.error("Failed to update slot");
      console.error("Error updating slot:", error);
    }
  };

  // Render slot table
  const renderSlotTable = () => {
    // Group slots by date
    const slotsByDate = {};

    slots[selectedDoctor?.doctorId]?.forEach((slot) => {
      slot.applicableDates?.forEach((dateSlot) => {
        const dateKey = dayjs(dateSlot.date).format("YYYY-MM-DD");
        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = {
            date: dateSlot.date,
            slots: []
          };
        }

        // Add slot information with location
        dateSlot.timeSlots?.forEach((timeSlot) => {
          slotsByDate[dateKey].slots.push({
            ...timeSlot,
            location: slot.location,
            slotId: slot._id,
            originalSlot: slot
          });
        });
      });
    });

    // Filter dates based on selected filter
    const today = dayjs().startOf('day');
    const filteredDates = Object.keys(slotsByDate).filter(dateKey => {
      const slotDate = dayjs(dateKey);
      if (slotDateFilter === 'past') {
        return slotDate.isBefore(today);
      } else if (slotDateFilter === 'upcoming') {
        return slotDate.isSame(today) || slotDate.isAfter(today);
      } else if (slotDateFilter === 'specific' && selectedDate) {
        return slotDate.isSame(selectedDate, 'day');
      }
      return true; // Show all if no filter
    });

    // Sort dates
    const sortedDates = filteredDates.sort();

    // Check if no slots found for specific date
    if (slotDateFilter === 'specific' && selectedDate && sortedDates.length === 0) {
      return (
        <div className="no-slots-message">
          <p>No slots available for {selectedDate.format('MMM DD, YYYY')}</p>
        </div>
      );
    }

    return (
      <div className="slot-table-container">
        <Table
          dataSource={sortedDates.map(dateKey => ({
            key: dateKey,
            date: slotsByDate[dateKey].date,
            slots: slotsByDate[dateKey].slots
          }))}
          columns={[
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
              width: 150,
              render: (date) => (
                <div className="slot-date-cell">
                  <div className="slot-date-line">
                    <CalendarOutlined className="slot-table-icon" />
                    <span>{dayjs(date).format("MMM DD, YYYY")}</span>
                  </div>
                  <div className="slot-day-name">{dayjs(date).format("dddd")}</div>
                </div>
              ),
            },
            {
              title: "Available Time Slots",
              dataIndex: "slots",
              key: "slots",
              render: (slots) => (
                <div className="slot-time-slots">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`time-slot-chip ${slot.status === 'available' ? 'available' : 'booked'}`}
                      onClick={() => handleSlotClick(slot.originalSlot, { date: slot.date }, slot)}
                    >
                      <div className="time-slot-time">
                        {convertTo12HourFormat(slot.startTime)} to {convertTo12HourFormat(slot.endTime)}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            }
          ]}
          pagination={false}
          className="slot-table"
        />
      </div>
    );
  };

  // Render slot modal
  const renderSlotModal = () => {
    if (!selectedSlot) return null;

    return (
      <Modal
        title={
          <div className="slot-modal-title">
            <CalendarOutlined />
            <span>Slot Details</span>
          </div>
        }
        open={slotModalVisible}
        onCancel={() => {
          setSlotModalVisible(false);
          setSelectedSlot(null);
          setEditingSlot(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setSlotModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="edit" type="primary" onClick={handleEditSlot}>
            Edit
          </Button>,
          <Button key="delete" danger onClick={handleDeleteSlot}>
            Delete
          </Button>,
        ]}
        width={600}
      >
        {editingSlot ? (
          <div className="slot-edit-form">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Date">
                    <DatePicker
                      style={{ width: '100%' }}
                      value={dayjs(editingSlot.selectedDate)}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Location">
                    <Input value={editingSlot.location} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Start Time">
                    <Input value={editingSlot.selectedTimeSlot.startTime} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="End Time">
                    <Input value={editingSlot.selectedTimeSlot.endTime} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Status">
                <Select value={editingSlot.selectedTimeSlot.status}>
                  <Select.Option value="available">Available</Select.Option>
                  <Select.Option value="booked">Booked</Select.Option>
                </Select>
              </Form.Item>
              <div className="slot-edit-actions">
                <Button onClick={() => setEditingSlot(null)}>Cancel</Button>
                <Button type="primary" onClick={() => handleSaveSlot(editingSlot)}>
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="slot-details">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="slot-detail-item">
                  <label>Date:</label>
                  <span>{dayjs(selectedSlot.selectedDate).format("MMM DD, YYYY")}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="slot-detail-item">
                  <label>Day:</label>
                  <span>{dayjs(selectedSlot.selectedDate).format("dddd")}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="slot-detail-item">
                  <label>Time:</label>
                  <span>{convertTo12HourFormat(selectedSlot.selectedTimeSlot.startTime)} to {convertTo12HourFormat(selectedSlot.selectedTimeSlot.endTime)}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="slot-detail-item">
                  <label>Location:</label>
                  <span>{selectedSlot.location}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="slot-detail-item">
                  <label>Status:</label>
                  <Tag color={selectedSlot.selectedTimeSlot.status === "available" ? "green" : "red"}>
                    {selectedSlot.selectedTimeSlot.status === "available" ? "Available" : "Booked"}
                  </Tag>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
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
            appointment.status === "booked" && (
              <Tooltip title="Reschedule">
                <Button
                  type="text"
                  icon={<SyncOutlined />}
                  onClick={() => handleRescheduleClick(appointment)}
                />
              </Tooltip>
            ),
            appointment.status === "booked" && (
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleCancel()}
                />
              </Tooltip>
            ),
          ].filter(Boolean)}
        >
          <div className="appointment-card-header">
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
                {appointment.patient.age}, {appointment.patient.gender}
              </div>
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

            {/* Doctors table */}
            <div className="admin-appointments-table" >
              <div
                className="admin-appointments-title"
                style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', flexDirection: "row", alignItems: "center" }}
              >
                <p>Select a doctor to view their slots</p>


                {/* Search input for doctors */}
                <div style={{ marginBottom: 16, width: '300px', borderRadius: '8px' }}>
                  <Input
                    placeholder="Search doctors by name..."
                    value={doctorSearchText}
                    onChange={handleDoctorSearch}
                    prefix={<UserOutlined />}
                    style={{ maxWidth: 400 }}
                    allowClear
                  />
                </div>
              </div>

              <Table
                columns={[
                  {
                    title: "Sl No",
                    key: "slNo",
                    width: 80,
                    render: (_, __, index) => index + 1,
                  },
                  {
                    title: "Doctor",
                    key: "doctorName",
                    render: (_, doctor) => {
                      const doctorName = `${doctor.firstName || ""} ${doctor.lastName || ""
                        }`.trim();
                      const specializations =
                        doctor.professionalDetails?.specialization || [];
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Avatar src={doctor.profileImage} size={32}>
                            {doctorName.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <div>
                            <div style={{ fontWeight: 500 }}>{doctorName}</div>
                            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
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
                                <div style={{ cursor: "pointer" }}>
                                  {specializations.length > 0
                                    ? specializations[0]
                                    : "Not specified"}
                                  {specializations.length > 1 && (
                                    <span style={{ color: "#1890ff", fontWeight: 500, marginLeft: "2px" }}>
                                      +{specializations.length - 1}
                                    </span>
                                  )}
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    title: "Total Bookings",
                    key: "totalBookings",
                    align: "center",
                    render: (_, doctor) => (
                      <span style={{ fontWeight: 500 }}>
                        {doctor.appointmentCounts?.all || 0}
                      </span>
                    ),
                  },
                  {
                    title: "Pending",
                    key: "pendingBookings",
                    align: "center",
                    render: (_, doctor) => (
                      <Tag color="orange">
                        {doctor.appointmentCounts?.pending || 0}
                      </Tag>
                    ),
                  },
                  {
                    title: "Upcoming",
                    key: "upcomingBookings",
                    align: "center",
                    render: (_, doctor) => (
                      <Tag color="blue">
                        {doctor.appointmentCounts?.upcoming || 0}
                      </Tag>
                    ),
                  },
                  {
                    title: "Completed",
                    key: "completedBookings",
                    align: "center",
                    render: (_, doctor) => (
                      <Tag color="green">
                        {doctor.appointmentCounts?.completed || 0}
                      </Tag>
                    ),
                  },
                  {
                    title: "Cancelled",
                    key: "cancelledBookings",
                    align: "center",
                    render: (_, doctor) => (
                      <Tag color="red">
                        {doctor.appointmentCounts?.cancelled || 0}
                      </Tag>
                    ),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    align: "center",
                    render: (_, doctor) => (
                      <>
                        <Button
                          type="primary"
                          size="small"
                          icon={<CalendarOutlined />}
                          onClick={() => handleViewSlots(doctor)}
                        >
                          View Slots
                        </Button>

                        <Button
                          type="primary"
                          size="small"
                          icon={<CalendarOutlined />}
                          onClick={() => handleViewAppointments(doctor)}
                        >
                          View Appointments
                        </Button>
                      </>
                    ),
                  },
                ]}
                dataSource={doctors}
                rowKey={(record) => record._id || record.id}
                loading={doctorsLoading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total) => `Total ${total} doctors`,
                }}
                locale={{
                  emptyText: "No doctors found.",
                }}
              />
            </div>
          </>
        ) : currentView === "slots" ? (
          // Slots View
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

            <div className="admin-appointments-table">
              {slotsLoading ? (
                <div className="appointments-loading">
                  <div className="loading-message">Loading slots...</div>
                </div>
              ) : (
                <>
                  {slots[selectedDoctor?.doctorId] &&
                    slots[selectedDoctor.doctorId].length > 0 ? (
                    <>
                      <div className="slot-filter-buttons">
                        <div className="slot-filter-left">
                          <Button
                            type={slotDateFilter === 'past' ? 'primary' : 'default'}
                            onClick={() => {
                              setSlotDateFilter('past');
                              setSelectedDate(null);
                            }}
                            style={{ marginRight: 8 }}
                          >
                            Past
                          </Button>
                          <Button
                            type={slotDateFilter === 'upcoming' ? 'primary' : 'default'}
                            onClick={() => {
                              setSlotDateFilter('upcoming');
                              setSelectedDate(null);
                            }}
                          >
                            Upcoming
                          </Button>
                        </div>
                        <div className="slot-filter-right">
                          <DatePicker
                            placeholder="Search specific date"
                            value={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              setSlotDateFilter('specific');
                            }}
                            format="DD/MM/YYYY"
                            style={{ marginRight: 8, width: 150 }}
                            allowClear
                          />
                          <Button
                            type="default"
                            onClick={() => {
                              setSelectedDate(dayjs());
                              setSlotDateFilter('specific');
                            }}
                          >
                            Today
                          </Button>
                          {(slotDateFilter !== 'upcoming' || selectedDate) && (
                            <Button
                              type="default"
                              danger
                              onClick={() => {
                                setSlotDateFilter('upcoming');
                                setSelectedDate(null);
                              }}
                              style={{ marginLeft: 8 }}
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </div>
                      {renderSlotTable()}
                    </>
                  ) : (
                    <div className="no-appointments-message">
                      <p>No slots found for this doctor.</p>
                    </div>
                  )}
                </>
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
                  onClick={handleBackToDoctors}
                  style={{ marginRight: 16 }}
                >
                  Back to Doctors
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
              <div className="admin-appointments-actions" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', padding: '10px 0' }}>
                <div className="admin-appointments-filters">
                  <Input.Search
                    placeholder="Search by patient name or appointment ID"
                    value={searchText}
                    onChange={handleSearchChange}
                    onSearch={handleSearch}
                    style={{ width: 250, marginRight: 16 }}
                  />
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
                    <Tooltip title="Export as Excel">
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={() => handleExport("excel")}
                      >
                        Excel
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
                      <TabPane tab="Booked" key="booked">
                        <Row gutter={[16, 16]}>
                          {appointments.filter(appointment => appointment.status === "booked").length > 0 ? (
                            appointments
                              .filter(appointment => appointment.status === "booked")
                              .map((appointment) =>
                                renderAppointmentCard(appointment)
                              )
                          ) : (
                            <Col span={24}>
                              <div className="no-appointments-message">
                                <p>
                                  No booked appointments found for this
                                  doctor.
                                </p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </TabPane>
                      <TabPane tab="Completed" key="complete">
                        <Row gutter={[16, 16]}>
                          {appointments.filter(appointment => appointment.status === "complete").length > 0 ? (
                            appointments
                              .filter(appointment => appointment.status === "complete")
                              .map((appointment) =>
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
                      <TabPane tab="Cancelled" key="cancel">
                        <Row gutter={[16, 16]}>
                          {appointments.filter(appointment => appointment.status === "cancel").length > 0 ? (
                            appointments
                              .filter(appointment => appointment.status === "cancel")
                              .map((appointment) =>
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
                      <TabPane tab="Pending" key="pending">
                        <Row gutter={[16, 16]}>
                          {appointments.filter(appointment => appointment.status === "pending").length > 0 ? (
                            appointments
                              .filter(appointment => appointment.status === "pending")
                              .map((appointment) =>
                                renderAppointmentCard(appointment)
                              )
                          ) : (
                            <Col span={24}>
                              <div className="no-appointments-message">
                                <p>
                                  No pending appointments found for this
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

        {/* Slot Modal */}
        {renderSlotModal()}
      </div>
    </AdminLayout>
  );
}

export default Appointments;
