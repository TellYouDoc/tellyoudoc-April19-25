import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Descriptions,
  Button,
  Divider,
  Tag,
  Space,
  Badge,
  Tabs,
  Image,
  List,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Spin,
  Switch,
  Tooltip,
  Checkbox,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  BookOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  IdcardOutlined,
  TrophyOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/DoctorProfile.css";
import apiService from "../../services/api";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Dummy doctors data - In real app, this would be fetched from an API
const dummyDoctorsData = {
  1: {
    id: 1,
    profilePhoto: "https://xsgames.co/randomusers/avatar.php?g=male",
    fullName: "Dr. Rajesh Kumar",
    firstName: "Rajesh",
    middleName: "Kumar",
    lastName: "Singh",
    gender: "Male",
    dateOfBirth: "15/07/1978",
    status: "active",
    subscription: "Beta Partner",
    languages: {
      understand: ["English", "Hindi", "Bengali"],
      speak: ["English", "Hindi"],
      write: ["English", "Hindi", "Bengali"],
    },
    socialMedia: {
      linkedin: "https://linkedin.com/in/dr-rajesh-kumar",
      facebook: "https://facebook.com/dr.rajeshkumar",
      twitter: "https://twitter.com/dr_rajeshkumar",
      instagram: "https://instagram.com/dr.rajeshkumar",
    },
    contact: {
      primaryNumber: "+91 98765 43210",
      alternateNumber: "+91 98123 45678",
      whatsappNumber: "+91 98765 43210",
      email: "dr.rajesh@tellyoudoc.com",
    },
    currentAddress: {
      addressLine1: "123, Millennium Tower",
      addressLine2: "Salt Lake, Sector V",
      pincode: "700091",
      state: "West Bengal",
      district: "Kolkata",
      postOffice: "Salt Lake",
    },
    permanentAddressSameAsCurrent: true,
    medicalCertification: {
      registrationNumber: "MCI-12345-2008",
      medicalCouncil: "Medical Council of India",
      yearOfRegistration: "2008",
      yearsOfExperience: "14 years",
    },
    qualifications: [
      "MBBS - AIIMS, Delhi (2004)",
      "MD in Neurology - PGIMER, Chandigarh (2008)",
      "Fellowship in Neuro-Oncology - Johns Hopkins, USA (2012)",
    ],
    expertise: ["Neurology", "Neuro-Oncology", "Brain Tumor Surgery"],
    specialization: "Neurologist",
    practiceDetails: {
      hospitalName: "Care Neuroscience Center",
      address: "456, Apollo Medical Complex, Park Street",
      designation: "Senior Consultant Neurologist",
      department: "Neurology",
      pincode: "700016",
      state: "West Bengal",
      district: "Kolkata",
      postOffice: "Park Street",
    },
  },
  2: {
    id: 2,
    profilePhoto: "https://xsgames.co/randomusers/avatar.php?g=female",
    fullName: "Dr. Sarah Johnson",
    firstName: "Sarah",
    middleName: "",
    lastName: "Johnson",
    gender: "Female",
    dateOfBirth: "23/04/1985",
    status: "active",
    subscription: "Not Subscribed",
    languages: {
      understand: ["English", "French"],
      speak: ["English", "French"],
      write: ["English", "French"],
    },
    socialMedia: {
      linkedin: "https://linkedin.com/in/dr-sarah-johnson",
      facebook: "https://facebook.com/dr.sarahjohnson",
      twitter: "https://twitter.com/dr_sarahjohnson",
      instagram: "https://instagram.com/dr.sarahjohnson",
    },
    contact: {
      primaryNumber: "+91 87654 32109",
      alternateNumber: "+91 87123 45678",
      whatsappNumber: "+91 87654 32109",
      email: "dr.sarah@tellyoudoc.com",
    },
    currentAddress: {
      addressLine1: "456, Greenwood Apartments",
      addressLine2: "Andheri West",
      pincode: "400053",
      state: "Maharashtra",
      district: "Mumbai",
      postOffice: "Andheri",
    },
    permanentAddressSameAsCurrent: false,
    permanentAddress: {
      addressLine1: "789, Oakville Heights",
      addressLine2: "Koramangala",
      pincode: "560034",
      state: "Karnataka",
      district: "Bengaluru",
      postOffice: "Koramangala",
    },
    medicalCertification: {
      registrationNumber: "MCI-78901-2010",
      medicalCouncil: "Medical Council of India",
      yearOfRegistration: "2010",
      yearsOfExperience: "10 years",
    },
    qualifications: [
      "MBBS - University of Mumbai (2007)",
      "MD in Radiology - AIIMS, Delhi (2010)",
      "Fellowship in MRI & CT Imaging - Stanford, USA (2012)",
    ],
    expertise: ["Radiology", "MRI", "CT Scan", "Ultrasound"],
    specialization: "Radiologist",
    practiceDetails: {
      hospitalName: "City Imaging Center",
      address: "789, Healthcare Hub, Bandra",
      designation: "Consultant Radiologist",
      department: "Radiology",
      pincode: "400050",
      state: "Maharashtra",
      district: "Mumbai",
      postOffice: "Bandra",
    },
  },
};

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal visibility states
  const [personalInfoModalVisible, setPersonalInfoModalVisible] =
    useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [medicalCertModalVisible, setMedicalCertModalVisible] = useState(false);
  const [qualificationsModalVisible, setQualificationsModalVisible] =
    useState(false);
  const [practiceModalVisible, setPracticeModalVisible] = useState(false);

  useEffect(() => {
    // Get doctor data from API
    const fetchDoctorData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.AdministratorService.getDoctorById(
          id
        );

        if (response.status === 200) {
          // Map the API response to the expected structure
          const doctorData = response.data.data;

          // Create a properly structured doctor object
          const mappedDoctor = {
            id: doctorData._id || doctorData.id,
            profilePhoto:
              doctorData.profileImage ||
              doctorData.profilePhoto ||
              "https://xsgames.co/randomusers/avatar.php?g=male",
            fullName:
              doctorData.name ||
              `${doctorData.firstName || ""} ${
                doctorData.middleName ? doctorData.middleName + " " : ""
              }${doctorData.lastName || ""}`.trim(),
            firstName:
              doctorData.firstName ||
              (doctorData.name ? doctorData.name.split(" ")[0] : ""),
            middleName: doctorData.middleName || "",
            lastName:
              doctorData.lastName ||
              (doctorData.name && doctorData.name.split(" ").length > 1
                ? doctorData.name.split(" ").slice(1).join(" ")
                : ""),
            gender: doctorData.gender || "Not specified",
            dateOfBirth:
              doctorData.dateOfBirth || doctorData.dob || "Not specified",
            isActive: doctorData.isActive ?? true,
            status:
              doctorData.status ||
              (doctorData.isActive ? "active" : "inactive"),
            subscription:
              doctorData.subscription || doctorData.isBetaPartner
                ? "Beta Partner"
                : "Not Subscribed",
            createdYear: doctorData.createdAt
              ? new Date(doctorData.createdAt).getFullYear()
              : null,

            // Map languages or set defaults
            languages: doctorData.languages || {
              understand: doctorData.languagesUnderstood || ["English"],
              speak: doctorData.languagesSpoken || ["English"],
              write: doctorData.languagesWritten || ["English"],
            },

            // Map social media or set defaults
            socialMedia: doctorData.socialMedia || {
              linkedin: doctorData.linkedin || "",
              facebook: doctorData.facebook || "",
              twitter: doctorData.twitter || "",
              instagram: doctorData.instagram || "",
            },

            // Map contact information or set defaults
            contact: doctorData.contact || {
              primaryNumber:
                doctorData.phone ||
                doctorData.contactNumber ||
                doctorData.primaryNumber ||
                "",
              alternateNumber:
                doctorData.alternateNumber || doctorData.secondaryPhone || "",
              whatsappNumber:
                doctorData.whatsappNumber || doctorData.phone || "",
              email: doctorData.email || "",
            },

            // Map address information
            currentAddress: doctorData.currentAddress ||
              doctorData.address || {
                addressLine1: doctorData.addressLine1 || "",
                addressLine2: doctorData.addressLine2 || "",
                pincode: doctorData.pincode || "",
                state: doctorData.state || "",
                district: doctorData.district || doctorData.city || "",
                postOffice: doctorData.postOffice || "",
              },

            permanentAddressSameAsCurrent:
              doctorData.permanentAddressSameAsCurrent || true,
            permanentAddress:
              doctorData.permanentAddress || doctorData.currentAddress || {},

            // Map medical certification
            medicalCertification: doctorData.medicalCertification ||
              doctorData.professionalDetails || {
                registrationNumber: doctorData.registrationNumber || "",
                medicalCouncil: doctorData.medicalCouncil || "",
                yearOfRegistration: doctorData.yearOfRegistration || "",
                yearsOfExperience:
                  doctorData.experience || doctorData.yearsOfExperience || "",
              },

            // Map qualifications
            qualifications:
              doctorData.qualifications || doctorData.qualification
                ? Array.isArray(doctorData.qualification)
                  ? doctorData.qualification
                  : [doctorData.qualification]
                : [],

            // Map expertise and specialization
            expertise:
              doctorData.expertise ||
              (doctorData.specialization &&
              Array.isArray(doctorData.specialization)
                ? doctorData.specialization
                : doctorData.specialization
                ? [doctorData.specialization]
                : []),

            specialization: doctorData.specialization
              ? Array.isArray(doctorData.specialization)
                ? doctorData.specialization[0]
                : doctorData.specialization
              : "",

            // Map practice details
            practiceDetails: doctorData.practiceDetails || {
              hospitalName:
                doctorData.hospitalName || doctorData.hospital || "",
              address: doctorData.practiceAddress || "",
              designation: doctorData.designation || "",
              department: doctorData.department || "",
              pincode: doctorData.practicePincode || doctorData.pincode || "",
              state: doctorData.practiceState || doctorData.state || "",
              district:
                doctorData.practiceDistrict ||
                doctorData.district ||
                doctorData.city ||
                "",
              postOffice:
                doctorData.practicePostOffice || doctorData.postOffice || "",
            },

            // Map professional details
            professionalDetails: doctorData.professionalDetails || {
              yearsOfExperience:
                doctorData.experience || doctorData.yearsOfExperience || "",
            },
          };

          setDoctor(mappedDoctor);
        }
      } catch (err) {
        setError(err.message);
        message.error("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);
  if (loading) {
    return (
      <AdminLayout>
        <div className="doctor-profile-container loading">
          <div className="loading-message">
            <p>Loading doctor profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  if (error || !doctor) {
    return (
      <AdminLayout>
        <div className="doctor-profile-container error">
          <h2>{error || "Doctor not found"}</h2>
          <p>The doctor profile you are looking for could not be found.</p>
          <Button type="primary" onClick={() => navigate("/admin/doctors")}>
            Back to Doctors List
          </Button>
        </div>
      </AdminLayout>
    );
  }
  const getStatusTag = (status) => {
    const statusColors = {
      true: "#0e9f6e", // Green for active
      false: "#e02424", // Red for inactive
      pending: "#c27803", // Amber for pending
    };

    // Convert boolean value to appropriate text display
    const statusText =
      status === true ? "Active" : status === false ? "Inactive" : status;

    return <Tag color={statusColors[status]}>{statusText}</Tag>;
  };
  const getSubscriptionBadge = (subscription) => {
    return subscription === "Beta Partner" ? (
      <Badge
        color="#0e9f6e"
        text={
          <span
            style={{
              color: "white",
              fontWeight: 500,
              background: "rgba(14, 159, 110, 0.8)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Beta Partner
          </span>
        }
        className="subscription-badge"
      />
    ) : (
      <Badge
        color="#d9d9d9"
        text="Not Subscribed"
        className="subscription-badge"
      />
    );
  };

  // Event Handlers
  const handlePersonalInfoSubmit = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      // In a real application, you would make an API call here
      // For now, we'll simulate a network request with a delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update doctor state with new values
      setDoctor((prev) => ({
        ...prev,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        languages: values.languages,
        socialMedia: values.socialMedia,
      }));

      setPersonalInfoModalVisible(false);
      message.success("Personal information updated successfully");
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  const handleContactInfoSubmit = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update doctor state with new values
      setDoctor((prev) => ({
        ...prev,
        contact: values.contact,
        currentAddress: values.currentAddress,
        permanentAddressSameAsCurrent: values.permanentAddressSameAsCurrent,
        permanentAddress: values.permanentAddressSameAsCurrent
          ? prev.currentAddress
          : values.permanentAddress,
      }));

      setContactModalVisible(false);
      message.success("Contact information updated successfully");
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Failed to update contact information");
    } finally {
      setSaving(false);
    }
  };

  const handleMedicalCertSubmit = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update doctor state with new values
      setDoctor((prev) => ({
        ...prev,
        medicalCertification: values.medicalCertification,
      }));

      setMedicalCertModalVisible(false);
      message.success("Medical certification updated successfully");
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Failed to update medical certification");
    } finally {
      setSaving(false);
    }
  };

  const handleQualificationsSubmit = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update doctor state with new values
      setDoctor((prev) => ({
        ...prev,
        qualifications: values.qualifications,
        expertise: values.expertise,
        specialization: values.specialization,
      }));

      setQualificationsModalVisible(false);
      message.success("Qualifications and expertise updated successfully");
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Failed to update qualifications and expertise");
    } finally {
      setSaving(false);
    }
  };

  const handlePracticeDetailsSubmit = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update doctor state with new values
      setDoctor((prev) => ({
        ...prev,
        practiceDetails: values.practiceDetails,
      }));

      setPracticeModalVisible(false);
      message.success("Practice details updated successfully");
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Failed to update practice details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="doctor-profile-container">
        {/* Back button */}{" "}
        <div className="back-navigation">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/doctors")}
            className="back-button"
            style={{ borderColor: "#0e9f6e", color: "#0e9f6e" }}
          >
            Back to Doctors List
          </Button>
        </div>{" "}


        {/* Header - Photo and basic info - Profile Overview */}
        <Card
          className="profile-card profile-header"
          style={{
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            overflow: "visible",
            background: "linear-gradient(135deg, #0e9f6e 0%, #057a55 100%)",
          }}
        >
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
              <div
                className="avatar-container"
                style={{
                  display: "inline-block",
                  position: "relative",
                  padding: "5px",
                  background: "white",
                  borderRadius: "50%",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                }}
              >
                <Avatar
                  src={
                    <Image
                      src={doctor.profilePhoto}
                      alt={doctor.fullName}
                      preview={false}
                    />
                  }
                  size={160}
                  className="profile-avatar"
                  style={{ border: "4px solid #ffffff" }}
                />
                <div
                  className="status-indicator"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background:
                      doctor.status === "active" ? "#0e9f6e" : "#e02424",
                    border: "3px solid white",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                  }}
                ></div>
              </div>
            </Col>
            <Col xs={24} sm={16} md={18}>
              <div className="doctor-header-info" style={{ padding: "0 10px" }}>
                <Title
                  level={2}
                  className="doctor-name"
                  style={{
                    marginBottom: "12px",
                    color: "white",
                    fontWeight: 700,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {doctor.fullName}
                </Title>
                <Space
                  size="middle"
                  className="doctor-badges"
                  style={{ marginBottom: "12px" }}
                >
                  {getStatusTag(doctor.isActive)}
                  {getSubscriptionBadge(doctor.subscription)}
                </Space>{" "}
                <Text
                  className="doctor-specialization"
                  style={{
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.95)",
                    fontWeight: 500,
                    marginBottom: "12px",
                    display: "block",
                  }}
                >
                  {doctor.specialization || "Specialization not specified"} •{" "}
                  {doctor.medicalCertification?.yearsOfExperience ||
                    doctor.professionalDetails?.yearsOfExperience ||
                    "N/A"}{" "}
                  Experience
                </Text>
                <div
                  className="header-contact-info"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    backdropFilter: "blur(10px)",
                    marginBottom: "16px",
                  }}
                >
                  <Space size="large">
                    <Text style={{ color: "white" }}>
                      <PhoneOutlined style={{ marginRight: "8px" }} />{" "}
                      {doctor?.contact?.primaryNumber}
                    </Text>
                    <Text style={{ color: "white" }}>
                      <MailOutlined style={{ marginRight: "8px" }} />{" "}
                      {doctor?.contact?.email}
                    </Text>
                  </Space>
                </div>
                <div
                  className="social-media-links"
                  style={{ marginTop: "8px", display: "flex", gap: "12px" }}
                >
                  {doctor?.socialMedia?.linkedin && (
                    <Tooltip title="LinkedIn Profile">
                      <a
                        href={doctor.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedinOutlined className="social-icon linkedin" />
                      </a>
                    </Tooltip>
                  )}
                  {doctor?.socialMedia?.facebook && (
                    <Tooltip title="Facebook Profile">
                      <a
                        href={doctor.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FacebookOutlined className="social-icon facebook" />
                      </a>
                    </Tooltip>
                  )}
                  {doctor?.socialMedia?.twitter && (
                    <Tooltip title="Twitter Profile">
                      <a
                        href={doctor.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterOutlined className="social-icon twitter" />
                      </a>
                    </Tooltip>
                  )}
                  {doctor?.socialMedia?.instagram && (
                    <Tooltip title="Instagram Profile">
                      <a
                        href={doctor.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramOutlined className="social-icon instagram" />
                      </a>
                    </Tooltip>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <div
            className="profile-header-badges"
            style={{
              position: "absolute",
              bottom: "-12px",
              right: "24px",
              display: "flex",
              gap: "12px",
            }}
          >
            {" "}
            <div
              style={{
                background: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MedicineBoxOutlined
                style={{ color: "#0e9f6e", marginRight: "6px" }}
              />
              <span style={{ color: "#0e9f6e", fontWeight: 500 }}>
                {doctor.medicalCertification?.registrationNumber ||
                  doctor.professionalDetails?.registrationNumber ||
                  "Not specified"}
              </span>
            </div>
            <div
              style={{
                background: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CalendarOutlined
                style={{ color: "#0e9f6e", marginRight: "6px" }}
              />
              <span style={{ color: "#0e9f6e", fontWeight: 500 }}>
                Since{" "}
                {doctor.medicalCertification?.yearOfRegistration ||
                  doctor.professionalDetails?.yearOfRegistration ||
                  "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Detailed information in tabs */}
        <Card className="profile-card profile-details">
          <Tabs defaultActiveKey="personal" className="profile-tabs">
            {/* Personal Details Tab */}
            <TabPane tab="Personal Details" key="personal">
              <div className="tab-content">
                {" "}
                <div className="section-header">
                  <Title level={4}>Personal Information</Title>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setPersonalInfoModalVisible(true)}
                    className="edit-button"
                  >
                    Edit
                  </Button>
                </div>
                <div className="section-container">
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3 }}
                    className="description-list"
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <UserOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          First Name
                        </>
                      }
                    >
                      {doctor.firstName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <UserOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Middle Name
                        </>
                      }
                    >
                      {doctor.middleName || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <UserOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Last Name
                        </>
                      }
                    >
                      {doctor.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <TeamOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Gender
                        </>
                      }
                    >
                      {doctor.gender}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <CalendarOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Date of Birth
                        </>
                      }
                    >
                      {doctor.dateOfBirth}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <Divider />
                <div className="section-title">
                  <Title level={4}>Languages</Title>
                </div>{" "}
                <div className="section-container">
                  <Descriptions
                    bordered
                    column={1}
                    className="description-list"
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <BookOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Understand
                        </>
                      }
                    >
                      {Array.isArray(doctor.languages?.understand) ? (
                        doctor.languages.understand.map((lang) => (
                          <Tag
                            key={`understand-${lang}`}
                            color="blue"
                            className="language-tag"
                          >
                            {lang}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="blue" className="language-tag">
                          English
                        </Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <MessageOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Speak
                        </>
                      }
                    >
                      {Array.isArray(doctor.languages?.speak) ? (
                        doctor.languages.speak.map((lang) => (
                          <Tag
                            key={`speak-${lang}`}
                            color="green"
                            className="language-tag"
                          >
                            {lang}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="green" className="language-tag">
                          English
                        </Tag>
                      )}
                    </Descriptions.Item>{" "}
                    <Descriptions.Item
                      label={
                        <>
                          <EditOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Write
                        </>
                      }
                    >
                      {Array.isArray(doctor.languages?.write) ? (
                        doctor.languages.write.map((lang) => (
                          <Tag
                            key={`write-${lang}`}
                            color="purple"
                            className="language-tag"
                          >
                            {lang}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="purple" className="language-tag">
                          English
                        </Tag>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <Divider />
                <div className="section-title">
                  <Title level={4}>Social Media Profiles</Title>
                </div>
                <div className="section-container">
                  <List
                    bordered
                    className="social-media-list"
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        icon: (
                          <LinkedinOutlined className="social-list-icon linkedin" />
                        ),
                        title: "LinkedIn",
                        url: doctor.socialMedia.linkedin,
                        subtitle: "Professional Network",
                      },
                      {
                        icon: (
                          <FacebookOutlined className="social-list-icon facebook" />
                        ),
                        title: "Facebook",
                        url: doctor.socialMedia.facebook,
                        subtitle: "Social Network",
                      },
                      {
                        icon: (
                          <TwitterOutlined className="social-list-icon twitter" />
                        ),
                        title: "Twitter",
                        url: doctor.socialMedia.twitter,
                        subtitle: "Microblogging Platform",
                      },
                      {
                        icon: (
                          <InstagramOutlined className="social-list-icon instagram" />
                        ),
                        title: "Instagram",
                        url: doctor.socialMedia.instagram,
                        subtitle: "Photo & Video Sharing",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            type="link"
                            icon={<GlobalOutlined />}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={item.icon}
                          title={
                            <span style={{ fontSize: "16px", fontWeight: 500 }}>
                              {item.title}
                            </span>
                          }
                          description={
                            <>
                              <div
                                style={{ color: "#666", marginBottom: "4px" }}
                              >
                                {item.subtitle}
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.url || "Not provided"}
                              </a>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </TabPane>
            {/* Contact & Address Tab */}
            <TabPane tab="Contact & Address" key="contact">
              <div className="tab-content">
                <div className="section-header">
                  <Title level={4}>
                    <PhoneOutlined
                      style={{ marginRight: 8, color: "#0e9f6e" }}
                    />{" "}
                    Contact Information
                  </Title>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setContactModalVisible(true)}
                    className="edit-button"
                  >
                    Edit
                  </Button>
                </div>

                <div className="section-container">
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2 }}
                    className="description-list"
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <PhoneOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Primary Number
                        </>
                      }
                    >
                      <a href={`tel:${doctor.contact.primaryNumber}`}>
                        {doctor.contact.primaryNumber}
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <PhoneOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Alternate Number
                        </>
                      }
                    >
                      {doctor.contact.alternateNumber ? (
                        <a href={`tel:${doctor.contact.alternateNumber}`}>
                          {doctor.contact.alternateNumber}
                        </a>
                      ) : (
                        "-"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <PhoneOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          WhatsApp Number
                        </>
                      }
                    >
                      <a
                        href={`https://wa.me/${doctor.contact.whatsappNumber.replace(
                          /\s+/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doctor.contact.whatsappNumber}
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <MailOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Email
                        </>
                      }
                    >
                      <a href={`mailto:${doctor.contact.email}`}>
                        {doctor.contact.email}
                      </a>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <Divider />

                <div className="section-title">
                  <Title level={4}>
                    <HomeOutlined
                      style={{ marginRight: 8, color: "#0e9f6e" }}
                    />{" "}
                    Current Address
                  </Title>
                </div>
                <div className="section-container address-container">
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2 }}
                    className="description-list"
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <EnvironmentOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Address Line 1
                        </>
                      }
                    >
                      {doctor.currentAddress.addressLine1}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <EnvironmentOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Address Line 2
                        </>
                      }
                    >
                      {doctor.currentAddress.addressLine2 || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <IdcardOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Pincode
                        </>
                      }
                    >
                      {doctor.currentAddress.pincode}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <GlobalOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          State
                        </>
                      }
                    >
                      {doctor.currentAddress.state}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <GlobalOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          District
                        </>
                      }
                    >
                      {doctor.currentAddress.district}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <MailOutlined
                            style={{ marginRight: 8, color: "#0e9f6e" }}
                          />{" "}
                          Post Office
                        </>
                      }
                    >
                      {doctor.currentAddress.postOffice || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                  <div className="address-map-link">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${doctor.currentAddress.addressLine1}, ${doctor.currentAddress.addressLine2}, ${doctor.currentAddress.district}, ${doctor.currentAddress.state}, ${doctor.currentAddress.pincode}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      <EnvironmentOutlined /> View on Map
                    </a>
                  </div>
                </div>

                <Divider />
                <div className="section-title">
                  <Title level={4}>
                    <HomeOutlined
                      style={{ marginRight: 8, color: "#0e9f6e" }}
                    />{" "}
                    Permanent Address
                  </Title>
                </div>
                {doctor.permanentAddressSameAsCurrent ? (
                  <div className="same-as-current">
                    <Checkbox
                      checked
                      disabled
                      className="same-as-current-checkbox"
                    >
                      <Text strong>Same as Current Address</Text>
                    </Checkbox>
                  </div>
                ) : doctor.permanentAddress ? (
                  <div className="section-container address-container">
                    <Descriptions
                      bordered
                      column={{ xs: 1, sm: 2 }}
                      className="description-list"
                    >
                      <Descriptions.Item
                        label={
                          <>
                            <EnvironmentOutlined
                              style={{ marginRight: 8, color: "#0e9f6e" }}
                            />{" "}
                            Address Line 1
                          </>
                        }
                      >
                        {doctor.permanentAddress.addressLine1}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <EnvironmentOutlined
                              style={{ marginRight: 8, color: "#0e9f6e" }}
                            />{" "}
                            Address Line 2
                          </>
                        }
                      >
                        {doctor.permanentAddress.addressLine2 || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <IdcardOutlined
                              style={{ marginRight: 8, color: "#0e9f6e" }}
                            />{" "}
                            Pincode
                          </>
                        }
                      >
                        {doctor.permanentAddress.pincode}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <GlobalOutlined
                              style={{ marginRight: 8, color: "#0e9f6e" }}
                            />{" "}
                            State
                          </>
                        }
                      >
                        {doctor.permanentAddress.state}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <GlobalOutlined
                              style={{ marginRight: 8, color: "#0e9f6e" }}
                            />{" "}
                            District
                          </>
                        }
                      >
                        {doctor.permanentAddress.district}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <MailOutlined
                              style={{ marginRight: 8, color: "#0e9f6e" }}
                            />{" "}
                            Post Office
                          </>
                        }
                      >
                        {doctor.permanentAddress.postOffice || "-"}
                      </Descriptions.Item>
                    </Descriptions>
                    <div className="address-map-link">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${doctor.permanentAddress.addressLine1}, ${doctor.permanentAddress.addressLine2}, ${doctor.permanentAddress.district}, ${doctor.permanentAddress.state}, ${doctor.permanentAddress.pincode}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        <EnvironmentOutlined /> View on Map
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="no-data">
                    <Text type="secondary">
                      No permanent address information provided
                    </Text>
                  </div>
                )}
              </div>
            </TabPane>

            {/* Medical Certification Tab */}
            <TabPane tab="Medical Certification" key="certification">
              <div className="tab-content">
                {" "}
                <div className="section-header">
                  <Title level={4}>Medical Certification</Title>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setMedicalCertModalVisible(true)}
                    className="edit-button"
                  >
                    Edit
                  </Button>
                </div>
                <Card className="certification-card">
                  {" "}
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2 }}
                    className="description-list"
                  >
                    <Descriptions.Item label="Registration Number">
                      {doctor.medicalCertification?.registrationNumber ||
                        doctor.professionalDetails?.registrationNumber ||
                        "Not specified"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Medical Council">
                      {doctor.medicalCertification?.medicalCouncil ||
                        "Not specified"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Year of Registration">
                      {doctor.medicalCertification?.yearOfRegistration ||
                        doctor.professionalDetails?.yearOfRegistration ||
                        "Not specified"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Years of Experience">
                      {doctor.medicalCertification?.yearsOfExperience ||
                        doctor.professionalDetails?.yearsOfExperience ||
                        "Not specified"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </div>
            </TabPane>

            {/* Qualifications & Expertise Tab */}
            <TabPane tab="Qualifications & Expertise" key="qualifications">
              <div className="tab-content">
                {" "}
                <div className="section-header">
                  <Title level={4}>Qualifications & Expertise</Title>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setQualificationsModalVisible(true)}
                    className="edit-button"
                  >
                    Edit
                  </Button>
                </div>
                <div className="section-title">
                  <Title level={5}>
                    <MedicineBoxOutlined
                      style={{ marginRight: 8, color: "#0e9f6e" }}
                    />{" "}
                    Specialization
                  </Title>
                </div>
                <div className="specialization section-container">
                  <Tag
                    color="magenta"
                    key="specialization"
                    className="specialization-tag"
                  >
                    {doctor.specialization}
                  </Tag>
                </div>
                <Divider />
                <div className="section-title">
                  <Title level={5}>
                    <TrophyOutlined
                      style={{ marginRight: 8, color: "#0e9f6e" }}
                    />{" "}
                    Areas of Expertise
                  </Title>
                </div>
                <div className="expertise-tags section-container">
                  {doctor.expertise.map((exp) => (
                    <Tag color="cyan" key={exp} className="expertise-tag">
                      {exp}
                    </Tag>
                  ))}
                </div>
                <Divider />
                <Title level={5}>Qualifications</Title>
                <List
                  bordered
                  className="qualifications-list"
                  dataSource={doctor.qualifications}
                  renderItem={(qualification) => (
                    <List.Item>
                      <GlobalOutlined className="qualification-icon" />{" "}
                      {qualification}
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>

            {/* Practice Details Tab */}
            <TabPane tab="Practice Details" key="practice">
              <div className="tab-content">
                {" "}
                <div className="section-header">
                  <Title level={4}>Practice Information</Title>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setPracticeModalVisible(true)}
                    className="edit-button"
                  >
                    Edit
                  </Button>
                </div>
                <Card className="practice-card">
                  <Title level={5}>
                    <HomeOutlined /> {doctor.practiceDetails.hospitalName}
                  </Title>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2 }}
                    className="description-list"
                  >
                    <Descriptions.Item label="Designation">
                      {doctor.practiceDetails.designation}
                    </Descriptions.Item>
                    <Descriptions.Item label="Department">
                      {doctor.practiceDetails.department}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                      {doctor.practiceDetails.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Pincode">
                      {doctor.practiceDetails.pincode}
                    </Descriptions.Item>
                    <Descriptions.Item label="State">
                      {doctor.practiceDetails.state}
                    </Descriptions.Item>
                    <Descriptions.Item label="District">
                      {doctor.practiceDetails.district}
                    </Descriptions.Item>
                    <Descriptions.Item label="Post Office">
                      {doctor.practiceDetails.postOffice}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Modals for editing information */}
        <PersonalInfoModal
          visible={personalInfoModalVisible}
          onCancel={() => setPersonalInfoModalVisible(false)}
          onSubmit={handlePersonalInfoSubmit}
          doctor={doctor}
          form={form}
          loading={saving}
        />

        {/* Contact Address Modal */}
        <ContactAddressModal
          visible={contactModalVisible}
          onCancel={() => setContactModalVisible(false)}
          onSubmit={handleContactInfoSubmit}
          doctor={doctor}
          form={form}
          loading={saving}
        />

        {/* Medical Certification Modal */}
        <MedicalCertificationModal
          visible={medicalCertModalVisible}
          onCancel={() => setMedicalCertModalVisible(false)}
          onSubmit={handleMedicalCertSubmit}
          doctor={doctor}
          form={form}
          loading={saving}
        />

        {/* Qualifications Modal */}
        <QualificationsModal
          visible={qualificationsModalVisible}
          onCancel={() => setQualificationsModalVisible(false)}
          onSubmit={handleQualificationsSubmit}
          doctor={doctor}
          form={form}
          loading={saving}
        />

        {/* Practice Details Modal */}
        <PracticeDetailsModal
          visible={practiceModalVisible}
          onCancel={() => setPracticeModalVisible(false)}
          onSubmit={handlePracticeDetailsSubmit}
          doctor={doctor}
          form={form}
          loading={saving}
        />{" "}
      </div>
    </AdminLayout>
  );
};

// Personal Information Modal
const PersonalInfoModal = ({
  visible,
  onCancel,
  onSubmit,
  doctor,
  form,
  loading,
}) => {
  // Set form values when modal becomes visible
  useEffect(() => {
    if (visible && doctor) {
      form.setFieldsValue({
        firstName: doctor.firstName,
        middleName: doctor.middleName,
        lastName: doctor.lastName,
        gender: doctor.gender,
        dateOfBirth: doctor.dateOfBirth,
        languages: doctor.languages,
        socialMedia: doctor.socialMedia,
      });
    }
  }, [visible, doctor, form]);
  return (
    <Modal
      visible={visible}
      title={
        <div className="modal-title-with-icon">
          <UserOutlined className="modal-title-icon" />
          Edit Personal Information
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          <SaveOutlined /> Save Changes
        </Button>,
      ]}
      className="green-theme-modal"
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="personalInfoForm"
        initialValues={{
          firstName: doctor?.firstName || "",
          middleName: doctor?.middleName || "",
          lastName: doctor?.lastName || "",
          gender: doctor?.gender || "",
          dateOfBirth: doctor?.dateOfBirth || "",
          languages: doctor?.languages || {
            understand: [],
            speak: [],
            write: [],
          },
          socialMedia: doctor?.socialMedia || {
            linkedin: "",
            facebook: "",
            twitter: "",
            instagram: "",
          },
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="middleName" label="Middle Name">
              <Input placeholder="Middle Name (optional)" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select Gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please enter date of birth" },
              ]}
            >
              <Input placeholder="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Languages</Divider>
        <Form.Item
          label="Languages You Understand"
          name={["languages", "understand"]}
        >
          <Select
            mode="tags"
            placeholder="Select languages"
            style={{ width: "100%" }}
          >
            {/* Official languages recognized in the 8th Schedule of the Indian Constitution */}
            <Select.Option value="English">English</Select.Option>
            <Select.Option value="Assamese">Assamese</Select.Option>
            <Select.Option value="Bengali">Bengali</Select.Option>
            <Select.Option value="Bodo">Bodo</Select.Option>
            <Select.Option value="Dogri">Dogri</Select.Option>
            <Select.Option value="Gujarati">Gujarati</Select.Option>
            <Select.Option value="Hindi">Hindi</Select.Option>
            <Select.Option value="Kannada">Kannada</Select.Option>
            <Select.Option value="Kashmiri">Kashmiri</Select.Option>
            <Select.Option value="Konkani">Konkani</Select.Option>
            <Select.Option value="Maithili">Maithili</Select.Option>
            <Select.Option value="Malayalam">Malayalam</Select.Option>
            <Select.Option value="Manipuri (Meitei)">
              Manipuri (Meitei)
            </Select.Option>
            <Select.Option value="Marathi">Marathi</Select.Option>
            <Select.Option value="Nepali">Nepali</Select.Option>
            <Select.Option value="Odia">Odia</Select.Option>
            <Select.Option value="Punjabi">Punjabi</Select.Option>
            <Select.Option value="Sanskrit">Sanskrit</Select.Option>
            <Select.Option value="Santali">Santali</Select.Option>
            <Select.Option value="Sindhi">Sindhi</Select.Option>
            <Select.Option value="Tamil">Tamil</Select.Option>
            <Select.Option value="Telugu">Telugu</Select.Option>
            <Select.Option value="Urdu">Urdu</Select.Option>

            {/* Other major languages and dialects */}
            <Select.Option value="Angika">Angika</Select.Option>
            <Select.Option value="Arunachali">Arunachali</Select.Option>
            <Select.Option value="Awadhi">Awadhi</Select.Option>
            <Select.Option value="Badaga">Badaga</Select.Option>
            <Select.Option value="Bagri">Bagri</Select.Option>
            <Select.Option value="Bajjika">Bajjika</Select.Option>
            <Select.Option value="Balti">Balti</Select.Option>
            <Select.Option value="Bhili">Bhili</Select.Option>
            <Select.Option value="Bhojpuri">Bhojpuri</Select.Option>
            <Select.Option value="Bhotia">Bhotia</Select.Option>
            <Select.Option value="Braj Bhasha">Braj Bhasha</Select.Option>
            <Select.Option value="Bundeli">Bundeli</Select.Option>
            <Select.Option value="Chhattisgarhi">Chhattisgarhi</Select.Option>
            <Select.Option value="Chakma">Chakma</Select.Option>
            <Select.Option value="Chambeali">Chambeali</Select.Option>
            <Select.Option value="Changthang">Changthang</Select.Option>
            <Select.Option value="Coorgi">Coorgi</Select.Option>
            <Select.Option value="Dakhini">Dakhini</Select.Option>
            <Select.Option value="Dhivehi">Dhivehi</Select.Option>
            <Select.Option value="Garhwali">Garhwali</Select.Option>
            <Select.Option value="Garo">Garo</Select.Option>
            <Select.Option value="Gondi">Gondi</Select.Option>
            <Select.Option value="Gujjari">Gujjari</Select.Option>
            <Select.Option value="Halabi">Halabi</Select.Option>
            <Select.Option value="Haryanvi">Haryanvi</Select.Option>
            <Select.Option value="Ho">Ho</Select.Option>
            <Select.Option value="Jaunsari">Jaunsari</Select.Option>
            <Select.Option value="Karbi">Karbi</Select.Option>
            <Select.Option value="Khasi">Khasi</Select.Option>
            <Select.Option value="Kodava">Kodava</Select.Option>
            <Select.Option value="Kokborok">Kokborok</Select.Option>
            <Select.Option value="Khandeshi">Khandeshi</Select.Option>
            <Select.Option value="Kumaoni">Kumaoni</Select.Option>
            <Select.Option value="Kurukh">Kurukh</Select.Option>

            {/* Additional languages and foreign languages */}
            <Select.Option value="French">French</Select.Option>
            <Select.Option value="Spanish">Spanish</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Languages You Speak" name={["languages", "speak"]}>
          <Select
            mode="tags"
            placeholder="Select languages"
            style={{ width: "100%" }}
          >
            {/* Official languages recognized in the 8th Schedule of the Indian Constitution */}
            <Select.Option value="English">English</Select.Option>
            <Select.Option value="Assamese">Assamese</Select.Option>
            <Select.Option value="Bengali">Bengali</Select.Option>
            <Select.Option value="Bodo">Bodo</Select.Option>
            <Select.Option value="Dogri">Dogri</Select.Option>
            <Select.Option value="Gujarati">Gujarati</Select.Option>
            <Select.Option value="Hindi">Hindi</Select.Option>
            <Select.Option value="Kannada">Kannada</Select.Option>
            <Select.Option value="Kashmiri">Kashmiri</Select.Option>
            <Select.Option value="Konkani">Konkani</Select.Option>
            <Select.Option value="Maithili">Maithili</Select.Option>
            <Select.Option value="Malayalam">Malayalam</Select.Option>
            <Select.Option value="Manipuri (Meitei)">
              Manipuri (Meitei)
            </Select.Option>
            <Select.Option value="Marathi">Marathi</Select.Option>
            <Select.Option value="Nepali">Nepali</Select.Option>
            <Select.Option value="Odia">Odia</Select.Option>
            <Select.Option value="Punjabi">Punjabi</Select.Option>
            <Select.Option value="Sanskrit">Sanskrit</Select.Option>
            <Select.Option value="Santali">Santali</Select.Option>
            <Select.Option value="Sindhi">Sindhi</Select.Option>
            <Select.Option value="Tamil">Tamil</Select.Option>
            <Select.Option value="Telugu">Telugu</Select.Option>
            <Select.Option value="Urdu">Urdu</Select.Option>

            {/* Other major languages and dialects */}
            <Select.Option value="Angika">Angika</Select.Option>
            <Select.Option value="Arunachali">Arunachali</Select.Option>
            <Select.Option value="Awadhi">Awadhi</Select.Option>
            <Select.Option value="Badaga">Badaga</Select.Option>
            <Select.Option value="Bagri">Bagri</Select.Option>
            <Select.Option value="Bajjika">Bajjika</Select.Option>
            <Select.Option value="Balti">Balti</Select.Option>
            <Select.Option value="Bhili">Bhili</Select.Option>
            <Select.Option value="Bhojpuri">Bhojpuri</Select.Option>
            <Select.Option value="Bhotia">Bhotia</Select.Option>
            <Select.Option value="Braj Bhasha">Braj Bhasha</Select.Option>
            <Select.Option value="Bundeli">Bundeli</Select.Option>
            <Select.Option value="Chhattisgarhi">Chhattisgarhi</Select.Option>
            <Select.Option value="Chakma">Chakma</Select.Option>
            <Select.Option value="Chambeali">Chambeali</Select.Option>
            <Select.Option value="Changthang">Changthang</Select.Option>
            <Select.Option value="Coorgi">Coorgi</Select.Option>
            <Select.Option value="Dakhini">Dakhini</Select.Option>
            <Select.Option value="Dhivehi">Dhivehi</Select.Option>
            <Select.Option value="Garhwali">Garhwali</Select.Option>
            <Select.Option value="Garo">Garo</Select.Option>
            <Select.Option value="Gondi">Gondi</Select.Option>
            <Select.Option value="Gujjari">Gujjari</Select.Option>
            <Select.Option value="Halabi">Halabi</Select.Option>
            <Select.Option value="Haryanvi">Haryanvi</Select.Option>
            <Select.Option value="Ho">Ho</Select.Option>
            <Select.Option value="Jaunsari">Jaunsari</Select.Option>
            <Select.Option value="Karbi">Karbi</Select.Option>
            <Select.Option value="Khasi">Khasi</Select.Option>
            <Select.Option value="Kodava">Kodava</Select.Option>
            <Select.Option value="Kokborok">Kokborok</Select.Option>
            <Select.Option value="Khandeshi">Khandeshi</Select.Option>
            <Select.Option value="Kumaoni">Kumaoni</Select.Option>
            <Select.Option value="Kurukh">Kurukh</Select.Option>

            {/* Additional languages and foreign languages */}
            <Select.Option value="French">French</Select.Option>
            <Select.Option value="Spanish">Spanish</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Languages You Write" name={["languages", "write"]}>
          <Select
            mode="tags"
            placeholder="Select languages"
            style={{ width: "100%" }}
          >
            {/* Official languages recognized in the 8th Schedule of the Indian Constitution */}
            <Select.Option value="English">English</Select.Option>
            <Select.Option value="Assamese">Assamese</Select.Option>
            <Select.Option value="Bengali">Bengali</Select.Option>
            <Select.Option value="Bodo">Bodo</Select.Option>
            <Select.Option value="Dogri">Dogri</Select.Option>
            <Select.Option value="Gujarati">Gujarati</Select.Option>
            <Select.Option value="Hindi">Hindi</Select.Option>
            <Select.Option value="Kannada">Kannada</Select.Option>
            <Select.Option value="Kashmiri">Kashmiri</Select.Option>
            <Select.Option value="Konkani">Konkani</Select.Option>
            <Select.Option value="Maithili">Maithili</Select.Option>
            <Select.Option value="Malayalam">Malayalam</Select.Option>
            <Select.Option value="Manipuri (Meitei)">
              Manipuri (Meitei)
            </Select.Option>
            <Select.Option value="Marathi">Marathi</Select.Option>
            <Select.Option value="Nepali">Nepali</Select.Option>
            <Select.Option value="Odia">Odia</Select.Option>
            <Select.Option value="Punjabi">Punjabi</Select.Option>
            <Select.Option value="Sanskrit">Sanskrit</Select.Option>
            <Select.Option value="Santali">Santali</Select.Option>
            <Select.Option value="Sindhi">Sindhi</Select.Option>
            <Select.Option value="Tamil">Tamil</Select.Option>
            <Select.Option value="Telugu">Telugu</Select.Option>
            <Select.Option value="Urdu">Urdu</Select.Option>

            {/* Other major languages and dialects */}
            <Select.Option value="Angika">Angika</Select.Option>
            <Select.Option value="Arunachali">Arunachali</Select.Option>
            <Select.Option value="Awadhi">Awadhi</Select.Option>
            <Select.Option value="Badaga">Badaga</Select.Option>
            <Select.Option value="Bagri">Bagri</Select.Option>
            <Select.Option value="Bajjika">Bajjika</Select.Option>
            <Select.Option value="Balti">Balti</Select.Option>
            <Select.Option value="Bhili">Bhili</Select.Option>
            <Select.Option value="Bhojpuri">Bhojpuri</Select.Option>
            <Select.Option value="Bhotia">Bhotia</Select.Option>
            <Select.Option value="Braj Bhasha">Braj Bhasha</Select.Option>
            <Select.Option value="Bundeli">Bundeli</Select.Option>
            <Select.Option value="Chhattisgarhi">Chhattisgarhi</Select.Option>
            <Select.Option value="Chakma">Chakma</Select.Option>
            <Select.Option value="Chambeali">Chambeali</Select.Option>
            <Select.Option value="Changthang">Changthang</Select.Option>
            <Select.Option value="Coorgi">Coorgi</Select.Option>
            <Select.Option value="Dakhini">Dakhini</Select.Option>
            <Select.Option value="Dhivehi">Dhivehi</Select.Option>
            <Select.Option value="Garhwali">Garhwali</Select.Option>
            <Select.Option value="Garo">Garo</Select.Option>
            <Select.Option value="Gondi">Gondi</Select.Option>
            <Select.Option value="Gujjari">Gujjari</Select.Option>
            <Select.Option value="Halabi">Halabi</Select.Option>
            <Select.Option value="Haryanvi">Haryanvi</Select.Option>
            <Select.Option value="Ho">Ho</Select.Option>
            <Select.Option value="Jaunsari">Jaunsari</Select.Option>
            <Select.Option value="Karbi">Karbi</Select.Option>
            <Select.Option value="Khasi">Khasi</Select.Option>
            <Select.Option value="Kodava">Kodava</Select.Option>
            <Select.Option value="Kokborok">Kokborok</Select.Option>
            <Select.Option value="Khandeshi">Khandeshi</Select.Option>
            <Select.Option value="Kumaoni">Kumaoni</Select.Option>
            <Select.Option value="Kurukh">Kurukh</Select.Option>

            {/* Additional languages and foreign languages */}
            <Select.Option value="French">French</Select.Option>
            <Select.Option value="Spanish">Spanish</Select.Option>
            <Select.Option value="Bengali">Bengali</Select.Option>
            <Select.Option value="French">French</Select.Option>
            <Select.Option value="Spanish">Spanish</Select.Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">Social Media</Divider>

        <Form.Item label="LinkedIn Profile" name={["socialMedia", "linkedin"]}>
          <Input
            prefix={<LinkedinOutlined className="social-icon linkedin" />}
            placeholder="LinkedIn URL"
          />
        </Form.Item>

        <Form.Item label="Facebook Profile" name={["socialMedia", "facebook"]}>
          <Input
            prefix={<FacebookOutlined className="social-icon facebook" />}
            placeholder="Facebook URL"
          />
        </Form.Item>

        <Form.Item label="Twitter Profile" name={["socialMedia", "twitter"]}>
          <Input
            prefix={<TwitterOutlined className="social-icon twitter" />}
            placeholder="Twitter URL"
          />
        </Form.Item>

        <Form.Item
          label="Instagram Profile"
          name={["socialMedia", "instagram"]}
        >
          <Input
            prefix={<InstagramOutlined className="social-icon instagram" />}
            placeholder="Instagram URL"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Contact & Address Modal
const ContactAddressModal = ({
  visible,
  onCancel,
  onSubmit,
  doctor,
  form,
  loading,
}) => {
  // Set form values when modal becomes visible
  useEffect(() => {
    if (visible && doctor) {
      form.setFieldsValue({
        contact: doctor.contact,
        currentAddress: doctor.currentAddress,
        permanentAddressSameAsCurrent: doctor.permanentAddressSameAsCurrent,
        permanentAddress: doctor.permanentAddress,
      });
    }
  }, [visible, doctor, form]);

  return (
    <Modal
      visible={visible}
      title={
        <div className="modal-title-with-icon">
          <PhoneOutlined className="modal-title-icon" />
          Edit Contact & Address Information
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          <SaveOutlined /> Save Changes
        </Button>,
      ]}
      width={800}
      destroyOnClose
      className="green-theme-modal"
    >
      <Form
        form={form}
        layout="vertical"
        name="contactAddressForm"
        initialValues={{
          contact: doctor?.contact || {
            primaryNumber: "",
            alternateNumber: "",
            whatsappNumber: "",
            email: "",
          },
          currentAddress: doctor?.currentAddress || {
            addressLine1: "",
            addressLine2: "",
            pincode: "",
            state: "",
            district: "",
            postOffice: "",
          },
          permanentAddressSameAsCurrent:
            doctor?.permanentAddressSameAsCurrent || false,
          permanentAddress: doctor?.permanentAddress || {
            addressLine1: "",
            addressLine2: "",
            pincode: "",
            state: "",
            district: "",
            postOffice: "",
          },
        }}
      >
        <div className="form-section">
          <div className="form-section-header">
            <PhoneOutlined className="form-section-icon" />
            <span>Contact Information</span>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["contact", "primaryNumber"]}
                label={
                  <span className="form-item-label">
                    <PhoneOutlined className="form-item-icon" /> Primary Number
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter primary phone number",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Primary Phone Number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["contact", "alternateNumber"]}
                label={
                  <span className="form-item-label">
                    <PhoneOutlined className="form-item-icon" /> Alternate
                    Number
                  </span>
                }
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Alternate Phone Number"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["contact", "whatsappNumber"]}
                label={
                  <span className="form-item-label">
                    <PhoneOutlined className="form-item-icon" /> WhatsApp Number
                  </span>
                }
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="WhatsApp Number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["contact", "email"]}
                label={
                  <span className="form-item-label">
                    <MailOutlined className="form-item-icon" /> Email
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email Address" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <HomeOutlined className="form-section-icon" />
            <span>Current Address</span>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["currentAddress", "addressLine1"]}
                label={
                  <span className="form-item-label">
                    <EnvironmentOutlined className="form-item-icon" /> Address
                    Line 1
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter address line 1" },
                ]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Address Line 1"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["currentAddress", "addressLine2"]}
                label={
                  <span className="form-item-label">
                    <EnvironmentOutlined className="form-item-icon" /> Address
                    Line 2
                  </span>
                }
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Address Line 2"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={["currentAddress", "pincode"]}
                label={
                  <span className="form-item-label">
                    <IdcardOutlined className="form-item-icon" /> Pincode
                  </span>
                }
                rules={[{ required: true, message: "Please enter pincode" }]}
              >
                <Input prefix={<IdcardOutlined />} placeholder="Pincode" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={["currentAddress", "state"]}
                label={
                  <span className="form-item-label">
                    <GlobalOutlined className="form-item-icon" /> State
                  </span>
                }
                rules={[{ required: true, message: "Please enter state" }]}
              >
                <Input prefix={<GlobalOutlined />} placeholder="State" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={["currentAddress", "district"]}
                label={
                  <span className="form-item-label">
                    <GlobalOutlined className="form-item-icon" /> District
                  </span>
                }
                rules={[{ required: true, message: "Please enter district" }]}
              >
                <Input prefix={<GlobalOutlined />} placeholder="District" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={["currentAddress", "postOffice"]}
            label={
              <span className="form-item-label">
                <MailOutlined className="form-item-icon" /> Post Office
              </span>
            }
          >
            <Input prefix={<MailOutlined />} placeholder="Post Office" />
          </Form.Item>
        </div>
        <div className="form-section">
          <div className="form-section-header">
            <HomeOutlined className="form-section-icon" />
            <span>Permanent Address</span>
          </div>

          <Form.Item
            name="permanentAddressSameAsCurrent"
            valuePropName="checked"
            className="same-address-checkbox"
          >
            <Checkbox>
              <span className="same-address-label">
                <CheckCircleOutlined className="same-address-icon" /> Same as
                Current Address
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.permanentAddressSameAsCurrent !==
              currentValues.permanentAddressSameAsCurrent
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue("permanentAddressSameAsCurrent") ? null : (
                <div className="permanent-address-form">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={["permanentAddress", "addressLine1"]}
                        label={
                          <span className="form-item-label">
                            <EnvironmentOutlined className="form-item-icon" />{" "}
                            Address Line 1
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please enter address line 1",
                          },
                        ]}
                      >
                        <Input
                          prefix={<EnvironmentOutlined />}
                          placeholder="Address Line 1"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["permanentAddress", "addressLine2"]}
                        label={
                          <span className="form-item-label">
                            <EnvironmentOutlined className="form-item-icon" />{" "}
                            Address Line 2
                          </span>
                        }
                      >
                        <Input
                          prefix={<EnvironmentOutlined />}
                          placeholder="Address Line 2"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name={["permanentAddress", "pincode"]}
                        label={
                          <span className="form-item-label">
                            <IdcardOutlined className="form-item-icon" />{" "}
                            Pincode
                          </span>
                        }
                        rules={[
                          { required: true, message: "Please enter pincode" },
                        ]}
                      >
                        <Input
                          prefix={<IdcardOutlined />}
                          placeholder="Pincode"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={["permanentAddress", "state"]}
                        label={
                          <span className="form-item-label">
                            <GlobalOutlined className="form-item-icon" /> State
                          </span>
                        }
                        rules={[
                          { required: true, message: "Please enter state" },
                        ]}
                      >
                        <Input
                          prefix={<GlobalOutlined />}
                          placeholder="State"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={["permanentAddress", "district"]}
                        label={
                          <span className="form-item-label">
                            <GlobalOutlined className="form-item-icon" />{" "}
                            District
                          </span>
                        }
                        rules={[
                          { required: true, message: "Please enter district" },
                        ]}
                      >
                        <Input
                          prefix={<GlobalOutlined />}
                          placeholder="District"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name={["permanentAddress", "postOffice"]}
                    label={
                      <span className="form-item-label">
                        <MailOutlined className="form-item-icon" /> Post Office
                      </span>
                    }
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Post Office"
                    />
                  </Form.Item>
                </div>
              );
            }}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

// Medical Certification Modal
const MedicalCertificationModal = ({
  visible,
  onCancel,
  onSubmit,
  doctor,
  form,
  loading,
}) => {
  // Set form values when modal becomes visible
  useEffect(() => {
    if (visible && doctor) {
      form.setFieldsValue({
        medicalCertification: doctor.medicalCertification,
      });
    }
  }, [visible, doctor, form]);

  return (
    <Modal
      visible={visible}
      title={
        <div className="modal-title-with-icon">
          <MedicineBoxOutlined className="modal-title-icon" />
          Edit Medical Certification
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          <SaveOutlined /> Save Changes
        </Button>,
      ]}
      width={600}
      className="green-theme-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="medicalCertForm"
        initialValues={{
          medicalCertification: doctor?.medicalCertification || {
            registrationNumber: "",
            medicalCouncil: "",
            yearOfRegistration: "",
            yearsOfExperience: "",
          },
        }}
      >
        <Form.Item
          name={["medicalCertification", "registrationNumber"]}
          label="Registration Number"
          rules={[
            { required: true, message: "Please enter registration number" },
          ]}
        >
          <Input placeholder="Registration Number" />
        </Form.Item>

        <Form.Item
          name={["medicalCertification", "medicalCouncil"]}
          label="Medical Council"
          rules={[{ required: true, message: "Please enter medical council" }]}
        >
          <Input placeholder="Medical Council" />
        </Form.Item>

        <Form.Item
          name={["medicalCertification", "yearOfRegistration"]}
          label="Year of Registration"
          rules={[
            { required: true, message: "Please enter year of registration" },
          ]}
        >
          <Input placeholder="Year of Registration" />
        </Form.Item>

        <Form.Item
          name={["medicalCertification", "yearsOfExperience"]}
          label="Years of Experience"
          rules={[
            { required: true, message: "Please enter years of experience" },
          ]}
        >
          <Input placeholder="Years of Experience" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Qualifications & Expertise Modal
const QualificationsModal = ({
  visible,
  onCancel,
  onSubmit,
  doctor,
  form,
  loading,
}) => {
  // Set form values when modal becomes visible
  useEffect(() => {
    if (visible && doctor) {
      form.setFieldsValue({
        specialization: doctor.specialization,
        expertise: doctor.expertise,
        qualifications: doctor.qualifications,
      });
    }
  }, [visible, doctor, form]);

  return (
    <Modal
      visible={visible}
      title={
        <div className="modal-title-with-icon">
          <TrophyOutlined className="modal-title-icon" />
          Edit Qualifications & Expertise
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          <SaveOutlined /> Save Changes
        </Button>,
      ]}
      width={700}
      className="green-theme-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="qualificationsForm"
        initialValues={{
          specialization: doctor?.specialization || "",
          expertise: doctor?.expertise || [],
          qualifications: doctor?.qualifications || [],
        }}
      >
        <Form.Item
          name="specialization"
          label="Specialization"
          rules={[
            { required: true, message: "Please enter your specialization" },
          ]}
        >
          <Input placeholder="Specialization" />
        </Form.Item>

        <Form.Item
          name="expertise"
          label="Areas of Expertise"
          rules={[
            {
              required: true,
              message: "Please add at least one area of expertise",
            },
          ]}
        >
          <Select mode="tags" placeholder="Add areas of expertise">
            <Select.Option value="Neurology">Neurology</Select.Option>
            <Select.Option value="Cardiology">Cardiology</Select.Option>
            <Select.Option value="Oncology">Oncology</Select.Option>
            <Select.Option value="Pediatrics">Pediatrics</Select.Option>
            <Select.Option value="Dermatology">Dermatology</Select.Option>
            <Select.Option value="Radiology">Radiology</Select.Option>
            <Select.Option value="MRI">MRI</Select.Option>
            <Select.Option value="CT Scan">CT Scan</Select.Option>
            <Select.Option value="Ultrasound">Ultrasound</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="qualifications"
          label="Qualifications"
          rules={[
            {
              required: true,
              message: "Please add at least one qualification",
            },
          ]}
        >
          <Select
            mode="tags"
            placeholder="Add qualifications"
            style={{ width: "100%" }}
          >
            {/* Users can input custom values */}
          </Select>
        </Form.Item>
        <Text type="secondary">
          Format your qualifications as: "DEGREE - INSTITUTION (YEAR)"
          <br />
          For example: "MBBS - AIIMS, Delhi (2004)"
        </Text>
      </Form>
    </Modal>
  );
};

// Practice Details Modal
const PracticeDetailsModal = ({
  visible,
  onCancel,
  onSubmit,
  doctor,
  form,
  loading,
}) => {
  // Set form values when modal becomes visible
  useEffect(() => {
    if (visible && doctor) {
      form.setFieldsValue({
        practiceDetails: doctor.practiceDetails,
      });
    }
  }, [visible, doctor, form]);

  return (
    <Modal
      visible={visible}
      title={
        <div className="modal-title-with-icon">
          <HomeOutlined className="modal-title-icon" />
          Edit Practice Details
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          <SaveOutlined /> Save Changes
        </Button>,
      ]}
      width={700}
      className="green-theme-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="practiceDetailsForm"
        initialValues={{
          practiceDetails: doctor?.practiceDetails || {
            hospitalName: "",
            address: "",
            designation: "",
            department: "",
            pincode: "",
            state: "",
            district: "",
            postOffice: "",
          },
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={["practiceDetails", "hospitalName"]}
              label="Hospital/Clinic Name"
              rules={[
                {
                  required: true,
                  message: "Please enter hospital/clinic name",
                },
              ]}
            >
              <Input placeholder="Hospital/Clinic Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={["practiceDetails", "address"]}
              label="Address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="Practice Address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={["practiceDetails", "designation"]}
              label="Designation"
              rules={[{ required: true, message: "Please enter designation" }]}
            >
              <Input placeholder="Designation" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={["practiceDetails", "department"]}
              label="Department"
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Input placeholder="Department" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={["practiceDetails", "pincode"]}
              label="Pincode"
              rules={[{ required: true, message: "Please enter pincode" }]}
            >
              <Input placeholder="Pincode" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={["practiceDetails", "state"]}
              label="State"
              rules={[{ required: true, message: "Please enter state" }]}
            >
              <Input placeholder="State" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={["practiceDetails", "district"]}
              label="District"
              rules={[{ required: true, message: "Please enter district" }]}
            >
              <Input placeholder="District" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name={["practiceDetails", "postOffice"]} label="Post Office">
          <Input placeholder="Post Office" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DoctorProfile;
