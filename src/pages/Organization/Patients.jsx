import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Organization/Patients.css"; // Use the proper path for organization styles
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
  Radio
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
  HeartFilled
} from "@ant-design/icons";
import OrganizationLayout from "../../components/OrganizationLayout";
import apiService from "../../services/api";
import "../../styles/Administrator/Patients.css"; // Reusing Administrator styles for consistency

const { Title, Text } = Typography;
const { Option } = Select;

const statusColors = {
  active: "success",
  inactive: "error",
  cured: "cyan",
  deceased: "black"
};

// Custom status tag classes that match our CSS
const statusClasses = {
  active: "status-tag-active",
  inactive: "status-tag-inactive",
  cured: "status-tag-cured",
  deceased: "status-tag-deceased"
};

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pinCodeFilter, setPinCodeFilter] = useState("all");
  const [availablePinCodes, setAvailablePinCodes] = useState([
    "781001",
    "781005",
    "781019",
  ]); // Default PIN codes
  const [filterLoading, setFilterLoading] = useState(false);

  // Pagination and loading states
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
    showTotal: (total) => `Total ${total} patients`,
  });

  // Filter patients based on search text and status filter
  const filteredPatients = patients.filter((patient) => {
    const search = searchText.toLowerCase();
    
    // Check if patient matches search text
    const matchesSearch =
      patient.name.toLowerCase().includes(search) ||
      patient.gender.toLowerCase().includes(search) ||
      patient.status.toLowerCase().includes(search) ||
      String(patient.age).includes(search) ||
      (patient.phoneNumber && patient.phoneNumber.includes(search));

    // Check if patient matches status filter
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    // Check if patient matches pin code filter
    const matchesPinCode =
      pinCodeFilter === "all" || patient.pinCode === pinCodeFilter;

    // Return true only if all conditions are met
    return matchesSearch && matchesStatus && matchesPinCode;
  });
  // Mock function to fetch patients (replace with actual API call)
  const fetchPatients = () => {
    setLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockPatients = [
        {
          id: "1",
          patientId: "PAT001",
          name: "Jane Smith",
          firstName: "Jane",
          lastName: "Smith",
          age: 42,
          gender: "Female",
          status: "active",
          joinedDate: "2023-04-15",
          createdAt: "2023-04-15T10:30:00Z",
          healthConditions: ["Hypertension", "Diabetes"],
          pinCode: "781001",
          phoneNumber: "+91 98765 43210",
          email: "jane.smith@example.com",
          address: "123 Main Street, Guwahati, Assam",
          doctor: {
            id: "D001",
            name: "Dr. Priya Sharma",
            specialization: "Oncologist",
            email: "priya.sharma@tellyoudoc.com",
            phoneNumber: "+91 98765 98765"
          },
          visits: [
            { date: "2023-10-21", reason: "Regular Checkup", notes: "Patient is responding well to treatment." },
            { date: "2023-08-15", reason: "Follow-up", notes: "Blood work shows improvement." },
            { date: "2023-06-10", reason: "Initial Consultation", notes: "Recommended diet and lifestyle changes." }
          ],
          medicalReports: {
            mastalgia: ["Mild mastalgia reported", "No significant findings in mammogram"],
            breastHealth: ["Fibrocystic changes noted", "Regular self-examination recommended"],
            cancerHistory: {
              personal: ["No personal history of cancer"],
              family: ["Mother diagnosed with breast cancer at age 65"],
              geneticTesting: ["BRCA1/2 negative"]
            }
          }
        },
        {
          id: "2",
          patientId: "PAT002",
          name: "Maria Johnson",
          firstName: "Maria",
          lastName: "Johnson",
          age: 35,
          gender: "Female",
          status: "active",
          joinedDate: "2023-05-20",
          createdAt: "2023-05-20T14:45:00Z",
          healthConditions: ["Asthma"],
          pinCode: "781005",
          phoneNumber: "+91 87654 32109",
          email: "maria.johnson@example.com",
          address: "45 Park Avenue, Guwahati, Assam",
          doctor: {
            id: "D002",
            name: "Dr. Rajiv Kumar",
            specialization: "Breast Surgeon",
            email: "rajiv.kumar@tellyoudoc.com",
            phoneNumber: "+91 87654 87654"
          },
          visits: [
            { date: "2023-11-10", reason: "Regular Screening", notes: "No abnormalities detected." },
            { date: "2023-05-20", reason: "Initial Visit", notes: "Patient enrolled in screening program." }
          ],
          medicalReports: {
            mastalgia: ["No mastalgia reported"],
            breastHealth: ["Normal mammogram results", "No lumps or abnormalities detected"],
            cancerHistory: {
              personal: ["No personal history of cancer"],
              family: ["No family history of cancer"],
              geneticTesting: ["Not performed"]
            }
          }
        },
        {
          id: "3",
          patientId: "PAT003",
          name: "Sarah Williams",
          firstName: "Sarah",
          lastName: "Williams",
          age: 52,
          gender: "Female",
          status: "cured",
          joinedDate: "2023-02-10",
          createdAt: "2023-02-10T09:15:00Z",
          healthConditions: ["Breast Cancer (In Remission)"],
          pinCode: "781019",
          phoneNumber: "+91 76543 21098",
          email: "sarah.williams@example.com",
          address: "78 River Road, Guwahati, Assam",
          doctor: {
            id: "D003",
            name: "Dr. Ananya Sen",
            specialization: "Medical Oncologist",
            email: "ananya.sen@tellyoudoc.com",
            phoneNumber: "+91 76543 76543"
          },
          visits: [
            { date: "2023-09-05", reason: "Follow-up After Treatment", notes: "Cancer in remission. Patient recovering well." },
            { date: "2023-06-15", reason: "Post-Treatment Evaluation", notes: "Treatment completed successfully." },
            { date: "2023-03-20", reason: "Treatment Planning", notes: "Starting radiation therapy next week." },
            { date: "2023-02-10", reason: "Initial Diagnosis", notes: "Early stage breast cancer detected. Treatment options discussed." }
          ],
          medicalReports: {
            mastalgia: ["Post-treatment mild discomfort"],
            breastHealth: ["Regular follow-up mammograms recommended", "Surgical site healing well"],
            cancerHistory: {
              personal: ["Stage 2 breast cancer diagnosed Feb 2023", "Successfully treated with surgery and radiation"],
              family: ["Sister diagnosed with breast cancer at age 48"],
              geneticTesting: ["BRCA2 mutation positive"]
            }
          }
        },
        {
          id: "4",
          patientId: "PAT004",
          name: "Lisa Brown",
          firstName: "Lisa",
          lastName: "Brown",
          age: 38,
          gender: "Female",
          status: "inactive",
          joinedDate: "2023-06-30",
          createdAt: "2023-06-30T11:20:00Z",
          healthConditions: [],
          pinCode: "781001",
          phoneNumber: "+91 65432 10987",
          email: "lisa.brown@example.com",
          address: "22 Lake View, Guwahati, Assam",
          doctor: {
            id: "D001",
            name: "Dr. Priya Sharma",
            specialization: "Oncologist",
            email: "priya.sharma@tellyoudoc.com",
            phoneNumber: "+91 98765 98765"
          },
          visits: [
            { date: "2023-07-15", reason: "Initial Screening", notes: "No concerns found. Patient didn't return for follow-up." }
          ],
          medicalReports: {
            mastalgia: ["No mastalgia reported"],
            breastHealth: ["Normal findings", "Recommended annual screening"],
            cancerHistory: {
              personal: ["No personal history of cancer"],
              family: ["No known family history of cancer"],
              geneticTesting: ["Not performed"]
            }
          }
        },
        {
          id: "5",
          patientId: "PAT005",
          name: "Emily Davis",
          firstName: "Emily",
          lastName: "Davis",
          age: 61,
          gender: "Female",
          status: "deceased",
          joinedDate: "2022-12-15",
          createdAt: "2022-12-15T16:40:00Z",
          healthConditions: ["Metastatic Breast Cancer"],
          pinCode: "781005",
          phoneNumber: "+91 54321 09876",
          email: "emily.davis@example.com",
          address: "105 Hill Street, Guwahati, Assam",
          doctor: {
            id: "D002",
            name: "Dr. Rajiv Kumar",
            specialization: "Breast Surgeon",
            email: "rajiv.kumar@tellyoudoc.com",
            phoneNumber: "+91 87654 87654"
          },
          visits: [
            { date: "2023-02-28", reason: "Palliative Care Consultation", notes: "Patient's condition deteriorating." },
            { date: "2023-01-15", reason: "Follow-up", notes: "Cancer has spread to lungs and liver." },
            { date: "2022-12-15", reason: "Initial Assessment", notes: "Late-stage metastatic breast cancer diagnosed." }
          ],
          medicalReports: {
            mastalgia: ["Severe pain reported in left breast"],
            breastHealth: ["Multiple tumors detected", "Metastasis confirmed in imaging"],
            cancerHistory: {
              personal: ["Stage 4 metastatic breast cancer diagnosed Dec 2022", "Previous history of stage 1 breast cancer 10 years ago"],
              family: ["Mother and maternal aunt had breast cancer"],
              geneticTesting: ["BRCA1 mutation positive"]
            }
          }
        }
      ];

      setPatients(mockPatients);
      setTotalPatients(mockPatients.length);
      setPagination({
        ...pagination,
        total: mockPatients.length
      });
      setLoading(false);
      setFilterLoading(false);
    }, 1000);
  };

  // Load patients on component mount and when filters change
  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, pinCodeFilter]);

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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          {name}
          {record.status === "cured" && (
            <Tooltip title="Cured">
              <HeartFilled style={{ color: '#13c2c2' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Health Condition",
      dataIndex: "healthConditions",
      key: "healthConditions",
      render: (conditions) =>
        conditions && conditions.length > 0 ? (
          conditions.map((cond, idx) => (
            <Tag color="processing" key={idx}>
              {cond}
            </Tag>
          ))
        ) : (
          <Tag color="default">Healthy</Tag>
        ),    
    },    
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (doctor) => doctor ? doctor.name : "Not Assigned",
    },    
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={statusColors[status]} className={statusClasses[status]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size="small">          
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {}}
            className="view-button"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <OrganizationLayout>
      <div style={{ padding: "24px" }}>        
        <div style={{ 
          marginBottom: "24px", 
          display: "flex", 
          alignItems: "center" 
        }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Patient Management</Title>
            <Text type="secondary">
              Manage patients who are undergoing breast cancer screening
            </Text>
          </div>
        </div>        
        {/* Filter Section */}
        <div className="filter-section">
          <Input
            placeholder="Search patients..."
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
            style={{ width: 140 }}
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
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="cured">Cured</Option>
            <Option value="deceased">Deceased</Option>
          </Select>

          {/* PIN Code Filter */}
          <Select
            value={pinCodeFilter}
            onChange={(value) => {
              setFilterLoading(true);
              setPinCodeFilter(value);
            }}
            style={{ width: 180 }}
            placeholder="PIN Code"
            suffixIcon={
              filterLoading && pinCodeFilter !== "all" ? (
                <LoadingOutlined spin />
              ) : (
                <FilterOutlined />
              )
            }
            disabled={loading}
          >
            <Option value="all">All PIN Codes</Option>
            {availablePinCodes.map((pinCode) => (
              <Option key={pinCode} value={pinCode}>
                {pinCode}
              </Option>
            ))}
          </Select>
        </div>        
        
        {/* Patient Table */}        
        <Table
          columns={columns}
          dataSource={filteredPatients}
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
                    No patients found
                  </span>
                }
              />
            ),
          }}
          className="patient-table"
        />
      </div>
    </OrganizationLayout>
  );
};

export default Patients;