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
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/Organizations.css";
import apiService from "../../services/api";

// Define status colors for badges
const verificationStatusColors = {
  Pending: "gold",
  Verified: "green",
  Rejected: "red",
};

const accountStatusColors = {
  active: "success",
  inactive: "error",
};

const Organizations = () => {
  // State variables
  const [organizations, setOrganizations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [organizationTypeFilter, setOrganizationTypeFilter] = useState("all");
  const [ownershipTypeFilter, setOwnershipTypeFilter] = useState("all");
  const [verificationStatusFilter, setVerificationStatusFilter] = useState("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState("all");
  const [filterLoading, setFilterLoading] = useState(false);

  // API-related states
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter organizations based on search text and filters
  const filteredOrganizations = organizations.filter((org) => {
    const search = searchText.toLowerCase();
    
    // Check if organization matches search text
    const matchesSearch =
      org.name.toLowerCase().includes(search) ||
      org.id.toLowerCase().includes(search) ||
      org.organizationType.toLowerCase().includes(search) ||
      (org.otherOrganizationType && org.otherOrganizationType.toLowerCase().includes(search)) ||
      org.ownershipType.toLowerCase().includes(search) ||
      (org.otherOwnershipType && org.otherOwnershipType.toLowerCase().includes(search));
      
    // Check if organization matches organization type filter
    const matchesOrgType = organizationTypeFilter === "all" || 
      (organizationTypeFilter === "Other" ? 
        org.organizationType === "Other" : 
        org.organizationType === organizationTypeFilter);

    // Check if organization matches ownership type filter
    const matchesOwnershipType = ownershipTypeFilter === "all" || 
      (ownershipTypeFilter === "Other" ? 
        org.ownershipType === "Other" : 
        org.ownershipType === ownershipTypeFilter);

    // Check if organization matches verification status filter
    const matchesVerificationStatus =
      verificationStatusFilter === "all" || org.verificationStatus === verificationStatusFilter;
    
    // Check if organization matches account status filter
    const matchesAccountStatus =
      accountStatusFilter === "all" || 
      (accountStatusFilter === "active" ? org.isActive : !org.isActive);

    // Return true only if all conditions are met
    return matchesSearch && matchesOrgType && matchesOwnershipType && 
           matchesVerificationStatus && matchesAccountStatus;
  });

  // Get all organizations
  const getAllOrganizations = async () => {
    try {
      setLoading(true);
      
      // Data to send in the API request
      const data = {
        page: currentPage,
        limit: 10,
        ...(organizationTypeFilter !== "all" && { organizationType: organizationTypeFilter }),
        ...(ownershipTypeFilter !== "all" && { ownershipType: ownershipTypeFilter }),
        ...(verificationStatusFilter !== "all" && { verificationStatus: verificationStatusFilter }),
        ...(accountStatusFilter !== "all" && { isActive: accountStatusFilter === "active" }),
      };

      // Log the request payload with filters
      console.log("Request payload with filters:", data);

      // Mock API call since we don't have the actual endpoint yet
      // In a real implementation, you would use:
      // const response = await apiService.AdministratorService.getAllOrganizations(data);
      
      // For now, let's generate mock data
      const mockResponse = generateMockOrganizationData();
      
      // Process the API response
      if (mockResponse) {
        setOrganizations(mockResponse.organizations);
        setTotalOrganizations(mockResponse.pagination.totalCount);
        setPagination(mockResponse.pagination);
      } else {
        // If no organization data or error status, set empty array
        setOrganizations([]);
        message.warning("No organizations found");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      message.error("Failed to fetch organizations");
      setOrganizations([]);
    } finally {
      // Reset loading states
      setLoading(false);
      setFilterLoading(false);
    }
  };

  // Mock data generation function (remove in real implementation)
  const generateMockOrganizationData = () => {
    const organizations = [];
    const organizationTypes = ["Hospital", "Clinic", "Diagnostic Center", "Research Institution", "NGO", "Other"];
    const ownershipTypes = ["Private", "Public", "Government", "Trust", "Society", "Other"];
    const verificationStatuses = ["Pending", "Verified", "Rejected"];
    
    const names = [
      "City Hospital", "Metro Diagnostics", "Health First Clinic", "Dr. Patel Associates",
      "Medical Research Center", "Community Health NGO", "Regional Cancer Center", 
      "Primary Care Clinic", "Wellness Diagnostic Services", "Government Medical College",
      "Heart & Vascular Institute", "Children's Healthcare Center", "Women's Wellness Clinic",
      "Medical Associates Group", "Care Network Hospitals"
    ];

    // Generate 25 mock organizations
    for (let i = 1; i <= 25; i++) {
      const organizationType = organizationTypes[Math.floor(Math.random() * organizationTypes.length)];
      const ownershipType = ownershipTypes[Math.floor(Math.random() * ownershipTypes.length)];
      const verificationStatus = verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)];
      const name = names[Math.floor(Math.random() * names.length)] + " " + i;
      
      organizations.push({
        id: `ORG-${(10000 + i).toString()}`,
        name: name,
        organizationType: organizationType,
        otherOrganizationType: organizationType === "Other" ? "Medical Outreach Center" : null,
        ownershipType: ownershipType,
        otherOwnershipType: ownershipType === "Other" ? "Foundation" : null,
        verificationStatus: verificationStatus,
        verificationDate: verificationStatus !== "Pending" ? new Date() : null,
        verifiedBy: verificationStatus === "Verified" ? "admin-123" : null,
        isActive: Math.random() > 0.2, // 80% are active
        currentSubscription: `SUB-${(20000 + i).toString()}`,
      });
    }

    return {
      organizations: organizations,
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

  // Fetch organizations on component mount and when page or filters change
  useEffect(() => {
    // Create a variable to track if the component is mounted
    let isMounted = true;
    
    // Define a function to handle filter changes
    const handleFilterChange = () => {
      if (isMounted) {
        getAllOrganizations();
      }
    };
    
    // Reset to first page when filters change
    if (currentPage !== 1 && (
      organizationTypeFilter !== "all" || 
      ownershipTypeFilter !== "all" || 
      verificationStatusFilter !== "all" || 
      accountStatusFilter !== "all"
    )) {
      setCurrentPage(1);
    } else {
      handleFilterChange();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentPage, organizationTypeFilter, ownershipTypeFilter, verificationStatusFilter, accountStatusFilter]);

  // Handle verification status change
  const handleVerificationStatusChange = async (orgId, newStatus) => {
    try {
      setLoading(true);
      
      // Object to send
      const data = {
        verificationStatus: newStatus,
        verificationDate: new Date(),
        verifiedBy: "admin-123", // In real app, use actual admin ID
      };

      // In a real implementation, use:
      // const response = await apiService.AdministratorService.updateOrganizationVerification(orgId, data);
      
      // Simulate API call success
      setTimeout(() => {
        message.success(`Organization verification status updated to ${newStatus}`);
  
        // Update the organization verification status in state
        const updatedOrganizations = organizations.map((org) =>
          org.id === orgId
            ? { ...org, verificationStatus: newStatus, verificationDate: new Date(), verifiedBy: "admin-123" }
            : org
        );
        
        setOrganizations(updatedOrganizations);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error updating organization verification status:", error);
      message.error("Failed to update organization verification status");
      setLoading(false);
    }
  };

  // Handle account status change
  const handleAccountStatusChange = async (orgId, newActiveStatus) => {
    try {
      setLoading(true);
      
      // Object to send
      const data = {
        isActive: newActiveStatus,
      };

      // In a real implementation, use:
      // const response = await apiService.AdministratorService.toggleOrganizationStatus(orgId, data);
      
      // Simulate API call success
      setTimeout(() => {
        message.success(
          `Organization account status updated to ${newActiveStatus ? "active" : "inactive"}`
        );
  
        // Update the organization status in state
        const updatedOrganizations = organizations.map((org) =>
          org.id === orgId
            ? { ...org, isActive: newActiveStatus }
            : org
        );
        
        setOrganizations(updatedOrganizations);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error updating organization account status:", error);
      message.error("Failed to update organization account status");
      setLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (date) => {
    if (!date) return "-";
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
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
    },    {
      title: "Organization Type",
      key: "organizationType",
      align: "left",
      render: (_, record) => (
        <div>
          {record.organizationType === "Other" ? (
            <>
              <span className="type-label">Other:</span>
              <div className="custom-type-name">{record.otherOrganizationType || "Not specified"}</div>
            </>
          ) : (
            <span className="standard-type">{record.organizationType}</span>
          )}
        </div>
      ),
    },
    {
      title: "Ownership Type",
      key: "ownershipType",
      align: "left",
      render: (_, record) => (
        <div>
          {record.ownershipType === "Other" ? (
            <>
              <span className="type-label">Other:</span>
              <div className="custom-type-name">{record.otherOwnershipType || "Not specified"}</div>
            </>
          ) : (
            <span className="standard-type">{record.ownershipType}</span>
          )}
        </div>
      ),
    },{
      title: "Verification Status",
      dataIndex: "verificationStatus",
      key: "verificationStatus",
      align: "left",
      render: (status, record) => (
        <div>
          <Tooltip 
            title={
              status === "Verified" 
                ? `Verified on: ${formatDate(record.verificationDate)} by Admin ID: ${record.verifiedBy}` 
                : status === "Rejected"
                ? `Rejected on: ${formatDate(record.verificationDate)}`
                : "Awaiting verification"
            }
          >
            <Tag color={verificationStatusColors[status]}>{status}</Tag>
          </Tooltip>
          {record.verificationDate && status !== "Pending" && (
            <div className="verification-date">
              {formatDate(record.verificationDate)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Account Status",
      key: "accountStatus",
      align: "left",
      render: (_, record) => (
        <Tag color={accountStatusColors[record.isActive ? "active" : "inactive"]}>
          {record.isActive ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          {/* View Button */}
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              className="action-icon-button"
              // TODO: Add router link to organization profile page
            />
          </Tooltip>

          {/* Verification Buttons */}
          {record.verificationStatus === "Pending" && (
            <>
              <Tooltip title="Verify">
                <Popconfirm
                  title="Verify Organization"
                  description="Are you sure you want to verify this organization?"
                  onConfirm={() => handleVerificationStatusChange(record.id, "Verified")}
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                >
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    size="small"
                    className="action-icon-button success"
                  />
                </Popconfirm>
              </Tooltip>
              
              <Tooltip title="Reject">
                <Popconfirm
                  title="Reject Verification"
                  description="Are you sure you want to reject this organization's verification?"
                  onConfirm={() => handleVerificationStatusChange(record.id, "Rejected")}
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                >
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    size="small"
                    className="action-icon-button"
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}

          {/* Account Status Toggle Button */}
          {record.isActive ? (
            <Tooltip title="Deactivate">
              <Popconfirm
                title="Deactivate Account"
                description="Are you sure you want to deactivate this organization's account?"
                onConfirm={() => handleAccountStatusChange(record.id, false)}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Button
                  danger
                  icon={<StopOutlined />}
                  size="small"
                  className="action-icon-button"
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Activate">
              <Popconfirm
                title="Activate Account"
                description="Are you sure you want to activate this organization's account?"
                onConfirm={() => handleAccountStatusChange(record.id, true)}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  className="action-icon-button success"
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <AdminLayout>
      <div className="organizations-container">
        <div className="organizations-header">
          <h1 className="organizations-title">Organizations Management</h1>
          <div className="organizations-header-actions">
            {/* Search Bar with integrated Filter Button */}
            <Input
              placeholder="Search organizations..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              className="search-input"
              suffix={
                <Popover
                  placement="bottomRight"
                  title={
                    <div className="filter-title">
                      Filter Organizations
                      {(organizationTypeFilter !== 'all' || ownershipTypeFilter !== 'all' || 
                        verificationStatusFilter !== 'all' || accountStatusFilter !== 'all') && (
                        <Tag color="blue" style={{ marginLeft: '8px' }}>Active</Tag>
                      )}
                    </div>
                  }
                  content={
                    <div className="filter-form">
                      <div className="filter-form-item">
                        <label>Organization Type</label>
                        <Select
                          value={organizationTypeFilter}
                          onChange={(value) => setOrganizationTypeFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All Types</Select.Option>
                          <Select.Option value="Hospital">Hospital</Select.Option>
                          <Select.Option value="Clinic">Clinic</Select.Option>
                          <Select.Option value="Diagnostic Center">Diagnostic Center</Select.Option>
                          <Select.Option value="Research Institution">Research Institution</Select.Option>
                          <Select.Option value="NGO">NGO</Select.Option>
                          <Select.Option value="Other">Other</Select.Option>
                        </Select>
                      </div>
                      
                      <div className="filter-form-item">
                        <label>Ownership Type</label>
                        <Select
                          value={ownershipTypeFilter}
                          onChange={(value) => setOwnershipTypeFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All Ownership Types</Select.Option>
                          <Select.Option value="Private">Private</Select.Option>
                          <Select.Option value="Public">Public</Select.Option>
                          <Select.Option value="Government">Government</Select.Option>
                          <Select.Option value="Trust">Trust</Select.Option>
                          <Select.Option value="Society">Society</Select.Option>
                          <Select.Option value="Other">Other</Select.Option>
                        </Select>
                      </div>
                      
                      <div className="filter-form-item">
                        <label>Verification Status</label>
                        <Select
                          value={verificationStatusFilter}
                          onChange={(value) => setVerificationStatusFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All Status</Select.Option>
                          <Select.Option value="Pending">Pending</Select.Option>
                          <Select.Option value="Verified">Verified</Select.Option>
                          <Select.Option value="Rejected">Rejected</Select.Option>
                        </Select>
                      </div>
                      
                      <div className="filter-form-item">
                        <label>Account Status</label>
                        <Select
                          value={accountStatusFilter}
                          onChange={(value) => setAccountStatusFilter(value)}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="all">All</Select.Option>
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                      </div>
                      
                      <div className="filter-button-group">
                        <Button 
                          type="primary" 
                          icon={filterLoading ? <LoadingOutlined /> : <FilterOutlined />} 
                          onClick={() => {
                            setFilterLoading(true);
                            getAllOrganizations();
                          }}
                          className="filter-button"
                          disabled={filterLoading}
                        >
                          {filterLoading ? 'Applying...' : 'Apply Filters'}
                        </Button>
                        
                        {(organizationTypeFilter !== 'all' || ownershipTypeFilter !== 'all' || 
                          verificationStatusFilter !== 'all' || accountStatusFilter !== 'all') && (
                          <Button 
                            onClick={() => {
                              setOrganizationTypeFilter('all');
                              setOwnershipTypeFilter('all');
                              setVerificationStatusFilter('all');
                              setAccountStatusFilter('all');
                              setFilterLoading(true);
                              setTimeout(() => {
                                getAllOrganizations();
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
                >
                  <Button 
                    type="text" 
                    icon={<FilterOutlined />} 
                    className={`filter-icon-button ${
                      organizationTypeFilter !== 'all' || 
                      ownershipTypeFilter !== 'all' || 
                      verificationStatusFilter !== 'all' || 
                      accountStatusFilter !== 'all' ? 'filtered' : ''}`}
                    title={
                      organizationTypeFilter !== 'all' || 
                      ownershipTypeFilter !== 'all' || 
                      verificationStatusFilter !== 'all' || 
                      accountStatusFilter !== 'all'
                      ? 'Filters Active' 
                      : 'Filter Organizations'
                    }
                  />
                </Popover>
              }
            />
          </div>
        </div>
        
        {/* Organizations Table */}
        <Table
          columns={columns}
          dataSource={filteredOrganizations}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalCount,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} organizations`,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          className="organizations-table"
        />
      </div>
    </AdminLayout>
  );
};

export default Organizations;