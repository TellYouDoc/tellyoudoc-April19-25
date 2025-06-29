import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  message,
  Select,
  Popconfirm,
  Tooltip,
  Popover,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
  SwapOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/Subscribers.css";
import apiService from "../../services/api";

// Define status and subscription type colors for badges
const statusColors = {
  active: "success",
  inactive: "error",
};

const subscriptionTypeLabels = {
  individual: "Individual",
  organization: "Organization",
};

const Subscribers = () => {  // State variables
  const [subscribers, setSubscribers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");  const [expiryFilter, setExpiryFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");
  const [filterLoading, setFilterLoading] = useState(false);

  // API-related states
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });  // Filter subscribers based on search text, type filter, status filter, and expiry filter
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const search = searchText.toLowerCase();
    
    // Check if subscriber matches search text
    const matchesSearch =
      subscriber.name.toLowerCase().includes(search) ||
      subscriber.email.toLowerCase().includes(search) ||
      subscriber.id.toLowerCase().includes(search) ||
      subscriber.status.toLowerCase().includes(search) ||
      subscriber.type.toLowerCase().includes(search) ||
      subscriber.planDetails.name.toLowerCase().includes(search);
      
    // Check if subscriber matches type filter
    let matchesType = true;
    if (typeFilter === "beta") {
      // Special case for Beta Partners filter
      matchesType = subscriber.planDetails.name === "Beta Partner";
    } else {
      matchesType = typeFilter === "all" || subscriber.type === typeFilter;
    }

    // Check if subscriber matches status filter
    const matchesStatus =
      statusFilter === "all" || subscriber.status === statusFilter;
        // Check if subscriber matches expiry filter
    let matchesExpiry = true;
    if (expiryFilter !== "all") {
      const expiryStatus = getExpiryStatus(subscriber.expiryDate);
      if (expiryFilter === "expired") {
        matchesExpiry = expiryStatus === "expired";
      } else if (expiryFilter === "expiring") {
        matchesExpiry = expiryStatus === "expiring-soon";
      } else if (expiryFilter === "valid") {
        matchesExpiry = expiryStatus === "valid";
      }
    }
    
    // Check if subscriber matches feature filter
    let matchesFeature = true;
    if (featureFilter !== "all") {
      if (subscriber.type === "individual") {
        // Individuals don't have features, so they don't match specific feature filters
        matchesFeature = false;
      } else {
        // For organizations, check if they have the selected feature
        const features = subscriber.features || [];
        if (featureFilter === "treatment") {
          matchesFeature = features.includes("Treatment");
        } else if (featureFilter === "screening") {
          matchesFeature = features.includes("Screening");
        } else if (featureFilter === "both") {
          matchesFeature = features.includes("Treatment") && features.includes("Screening");
        }
      }
    }

    // Return true only if all conditions are met
    return matchesSearch && matchesType && matchesStatus && matchesExpiry && matchesFeature;
  });

  // Get all subscribers
  const getAllSubscribers = async () => {
    try {
      setLoading(true);
        // Data to send in the API request
      const data = {
        page: currentPage,
        limit: 10,
        // Include type filter if it's not set to 'all'
        ...(typeFilter !== "all" && { type: typeFilter }),
        // Include status filter if it's not set to 'all'
        ...(statusFilter !== "all" && { status: statusFilter }),
        // Include expiry filter if it's not set to 'all'
        ...(expiryFilter !== "all" && { expiryStatus: expiryFilter }),
      };

      // Log the request payload with filters
      console.log("Request payload with filters:", data);

      // Mock API call since we don't have the actual endpoint yet
      // In a real implementation, you would use:
      // const response = await apiService.AdministratorService.getAllSubscribers(data);
      
      // For now, let's generate mock data
      const mockResponse = generateMockSubscriberData();
      
      // Process the API response
      if (mockResponse) {
        setSubscribers(mockResponse.subscribers);
        setTotalSubscribers(mockResponse.pagination.totalCount);
        setPagination(mockResponse.pagination);
      } else {
        // If no subscriber data or error status, set empty array
        setSubscribers([]);
        message.warning("No subscribers found");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      message.error("Failed to fetch subscribers");
      setSubscribers([]);
    } finally {
      // Reset loading states
      setLoading(false);
      setFilterLoading(false);
    }
  };
  // Mock data generation function (remove in real implementation)
  const generateMockSubscriberData = () => {
    const subscribers = [];
    const types = ["individual", "organization"];
    const statuses = ["active", "inactive"];
    const names = [
      "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", 
      "Tech Solutions Inc.", "Healthcare Partners", "Global Education Ltd", 
      "Digital Innovations", "Robert Wilson", "Jessica Taylor",
      "City Hospital", "Metro Diagnostics", "Health First Clinic", "Dr. Patel Associates"
    ];
    
    // Define plan names
    const planNames = {
      individual: ["Basic Plan", "Premium Plan", "Gold Plan"],
      organization: ["Team Plan", "Enterprise Plan", "Corporate Plan", "Beta Partner"]
    };
    
    const getRandomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Generate 25 mock subscribers
    for (let i = 1; i <= 25; i++) {
      const isOrg = i % 3 === 0; // Every third entry is an organization
      const name = names[Math.floor(Math.random() * names.length)];
      const type = isOrg ? "organization" : "individual";
      const email = isOrg 
        ? `info@${name.toLowerCase().replace(/\s+/g, '')}.com` 
        : `${name.toLowerCase().replace(/\s+/g, '')}@example.com`;
      
      // Generate subscription dates
      const today = new Date();
      const startDate = getRandomDate(
        new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        today
      );
      
      // Expiry dates - some in past, some soon, some in future
      let expiryDate;
      if (i % 5 === 0) { // Expired
        expiryDate = getRandomDate(
          new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
          new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        );
      } else if (i % 4 === 0) { // Expiring soon (within 30 days)
        expiryDate = getRandomDate(
          today,
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
        );
      } else { // Valid
        expiryDate = getRandomDate(
          new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
          new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
        );
      }

      // Determine plan name - make sure we have some Beta Partners
      let planName;
      if (isOrg && (i === 3 || i === 9 || i === 15)) {
        planName = "Beta Partner"; // Ensure some organizations are Beta Partners
      } else {
        const plans = planNames[type];
        planName = plans[Math.floor(Math.random() * plans.length)];
      }      // Generate features for organizations (Treatment and/or Screening)
      let features = [];
      if (isOrg) {
        // Randomly select features for organizations
        if (Math.random() > 0.7) {
          features = ["Treatment", "Screening"]; // Both features
        } else if (Math.random() > 0.5) {
          features = ["Treatment"]; // Only Treatment
        } else {
          features = ["Screening"]; // Only Screening
        }
      }

      subscribers.push({
        id: `SUB-${(10000 + i).toString()}`,
        name: name,
        email: email,
        type: type,
        status: i % 7 === 0 ? "inactive" : "active",
        startDate: startDate,
        expiryDate: expiryDate,
        planDetails: {
          name: planName,
          planFeatures: isOrg ? ["Unlimited users", "Premium support", "Custom features"] : ["Single user", "Standard support", "Basic features"]
        },
        features: features,
        users: isOrg ? Math.floor(Math.random() * 50) + 5 : 1,
        paymentMethod: Math.random() > 0.5 ? "Credit Card" : "PayPal",
        billingCycle: Math.random() > 0.7 ? "Annual" : "Monthly"
      });
    }

    return {
      subscribers: subscribers,
      pagination: {
        totalCount: 25,
        page: currentPage,
        limit: 10,
        totalPages: 3,
        hasNextPage: currentPage < 3,
        hasPrevPage: currentPage > 1,
      }
    };
  };
  // Fetch subscribers on component mount and when page or filters change
  useEffect(() => {
    // Create a variable to track if the component is mounted
    let isMounted = true;
    
    // Define a function to handle filter changes
    const handleFilterChange = () => {
      if (isMounted) {
        getAllSubscribers();
      }
    };
      // Reset to first page when filters change
    if (currentPage !== 1 && (statusFilter !== "all" || typeFilter !== "all" || expiryFilter !== "all" || featureFilter !== "all")) {
      setCurrentPage(1);
    } else {
      handleFilterChange();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentPage, statusFilter, typeFilter, expiryFilter, featureFilter]);

  // Handle status change
  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      setLoading(true);
      
      // Object to send
      const data = {
        status: newStatus ? "active" : "inactive",
      };

      // In a real implementation, use:
      // const response = await apiService.AdministratorService.toggleSubscriberStatus(subscriberId, data);
      
      // Simulate API call success
      setTimeout(() => {
        message.success(
          `Subscriber status updated to ${newStatus ? "active" : "inactive"}`
        );
  
        // Update the subscriber status in state
        const updatedSubscribers = subscribers.map((subscriber) =>
          subscriber.id === subscriberId
            ? { ...subscriber, status: newStatus ? "active" : "inactive" }
            : subscriber
        );
        
        setSubscribers(updatedSubscribers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error updating subscriber status:", error);
      message.error("Failed to update subscriber status");
      setLoading(false);
    }
  };

  // Handle subscription type change
  const handleTypeChange = async (subscriberId, newType) => {
    try {
      setLoading(true);
      
      // Object to send
      const data = {
        type: newType,
      };

      // In a real implementation, use:
      // const response = await apiService.AdministratorService.changeSubscriberType(subscriberId, data);
      
      // Simulate API call success
      setTimeout(() => {
        message.success(
          `Subscription type changed to ${subscriptionTypeLabels[newType]}`
        );
  
        // Update the subscriber type in state
        const updatedSubscribers = subscribers.map((subscriber) =>
          subscriber.id === subscriberId
            ? { ...subscriber, type: newType }
            : subscriber
        );
        
        setSubscribers(updatedSubscribers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error updating subscriber type:", error);
      message.error("Failed to update subscriber type");
      setLoading(false);
    }
  };

  // Check if a date is expired or expiring soon
  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expDate = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return "expired";
    } else if (daysUntilExpiry <= 30) {
      return "expiring-soon";
    }
    return "valid";
  };

  // Format date to readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  // Column Configurations for the table
  const columns = [
    {
      title: "SL No",
      key: "slNo",
      width: 70,
      render: (_, __, index) => index + 1 + (currentPage - 1) * 10,
      align: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (text, record) => (
        <div>
          {text}
          <span 
            className={`subscription-badge ${record.type}`}
          >
            {subscriptionTypeLabels[record.type]}
          </span>
        </div>
      ),
    },    {      
      title: "Plan Details",
      key: "plan",
      align: "left",
      render: (_, record) => (
        <div>
          <div className={`plan-name ${record.planDetails.name === "Beta Partner" ? "beta-partner" : ""}`}>
            {record.planDetails.name === "Beta Partner" ? (
              <span>
                <Tag color="blue">Beta</Tag> {record.planDetails.name}
              </span>
            ) : (
              record.planDetails.name
            )}
          </div>
          {/* Add expiry date information */}
          <Tooltip 
            title={
              getExpiryStatus(record.expiryDate) === "expired" ? "Subscription expired" : 
              getExpiryStatus(record.expiryDate) === "expiring-soon" ? "Expiring soon" : 
              "Active subscription"
            }
          >
            <div className={`expiry-date ${getExpiryStatus(record.expiryDate)}`}>
              <CalendarOutlined style={{ marginRight: 5 }} />
              Expires: {formatDate(record.expiryDate)}
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Features",
      key: "features",
      align: "left",
      render: (_, record) => {
        if (record.type === "individual") {
          return <span className="no-features">-</span>;
        } else {
          return (
            <div className="features-container">
              {record.features.map((feature, index) => (
                <Tag color={feature === "Treatment" ? "green" : "purple"} key={index}>
                  {feature}
                </Tag>
              ))}
            </div>
          );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
      align: "left",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="primary"
            icon={<EyeOutlined className="action-button-icon" />}
            className="action-button action-button-primary"
            // TODO: Add router link to subscriber profile page
          >
            View
          </Button>

          {/* Status toggle buttons */}
          {record.status === "active" && (
            <Popconfirm
              title="Deactivate Subscription"
              description="Are you sure you want to deactivate this subscription?"
              onConfirm={() => handleStatusChange(record.id, false)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                danger
                icon={<StopOutlined className="action-button-icon" />}
                className="action-button"
              >
                Deactivate
              </Button>
            </Popconfirm>
          )}
          {record.status === "inactive" && (
            <Popconfirm
              title="Activate Subscription"
              description="Are you sure you want to activate this subscription?"
              onConfirm={() => handleStatusChange(record.id, true)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined className="action-button-icon" />}
                className="action-button action-button-success"
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
      align: "left",
    },
  ];

  return (
    <AdminLayout>
      <div className="subscribers-container">
        <div className="subscribers-header">
          <h1 className="subscribers-title">Subscription Management</h1>
          <div className="subscribers-header-actions">
            {/* Search Bar with integrated Filter Button */}
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              className="search-input"
              suffix={
                <Popover
                  placement="bottomRight"                  title={
                    <div className="filter-title">
                      Filter Subscribers
                      {(typeFilter !== 'all' || statusFilter !== 'all' || expiryFilter !== 'all' || featureFilter !== 'all') && (
                        <Tag color="blue" style={{ marginLeft: '8px' }}>Active</Tag>
                      )}
                    </div>
                  }
                  content={
                    <div className="filter-form">
                      <div className="filter-form-item">
                        <label>Subscriber Type</label>
                        <Select
                          value={typeFilter}
                          onChange={(value) => setTypeFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All Types</Select.Option>
                          <Select.Option value="individual">Individual</Select.Option>
                          <Select.Option value="organization">Organization</Select.Option>
                          <Select.Option value="beta">Beta Partners</Select.Option>
                        </Select>
                      </div>
                      
                      <div className="filter-form-item">
                        <label>Status</label>
                        <Select
                          value={statusFilter}
                          onChange={(value) => setStatusFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All Status</Select.Option>
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                      </div>
                        <div className="filter-form-item">
                        <label>Expiry Status</label>
                        <Select
                          value={expiryFilter}
                          onChange={(value) => setExpiryFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All</Select.Option>
                          <Select.Option value="expired">Expired</Select.Option>
                          <Select.Option value="expiring">Expiring Soon</Select.Option>
                          <Select.Option value="valid">Valid</Select.Option>
                        </Select>
                      </div>
                        <div className="filter-form-item">
                        <label>Features</label>
                        <Select
                          value={featureFilter}
                          onChange={(value) => setFeatureFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All Features</Select.Option>
                          <Select.Option value="treatment">Treatment</Select.Option>
                          <Select.Option value="screening">Screening</Select.Option>
                          <Select.Option value="both">Treatment & Screening</Select.Option>
                        </Select>
                      </div>
                      <div className="filter-button-group">
                        <Button 
                          type="primary" 
                          icon={filterLoading ? <LoadingOutlined /> : <FilterOutlined />} 
                          onClick={() => {
                            setFilterLoading(true);
                            getAllSubscribers();
                          }}
                          className="filter-button"
                          disabled={filterLoading}
                        >
                          {filterLoading ? 'Applying...' : 'Apply Filters'}
                        </Button>
                          {(typeFilter !== 'all' || statusFilter !== 'all' || expiryFilter !== 'all' || featureFilter !== 'all') && (
                          <Button 
                            onClick={() => {
                              setTypeFilter('all');
                              setStatusFilter('all');
                              setExpiryFilter('all');
                              setFeatureFilter('all');
                              setFilterLoading(true);
                              setTimeout(() => {
                                getAllSubscribers();
                              }, 100);
                            }}
                            disabled={filterLoading}
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                  trigger="click"
                >                  <Button 
                  type="text" 
                  icon={<FilterOutlined />} 
                  className={`filter-icon-button ${typeFilter !== 'all' || statusFilter !== 'all' || expiryFilter !== 'all' || featureFilter !== 'all' ? 'filtered' : ''}`}
                  title={
                    typeFilter !== 'all' || statusFilter !== 'all' || expiryFilter !== 'all' || featureFilter !== 'all'
                    ? 'Filters Active' 
                    : 'Filter Subscribers'
                  }
                />
                </Popover>
              }
            />
          </div>
        </div>
        
        {/* Subscribers Table */}
        <Table
          columns={columns}
          dataSource={filteredSubscribers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalCount,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} subscribers`,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          className="subscribers-table"
        />
      </div>
    </AdminLayout>
  );
};

export default Subscribers;