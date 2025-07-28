import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Tag,
  Space,
  message,
  Tooltip,
  Typography,
  Select,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/BetaPartners.css";
import apiService from "../../services/api";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Styles to match Administrators.jsx
const customStyles = {
  pageContainer: {
    padding: "var(--spacing-6)",
    minHeight: "100vh",
    color: "var(--text-primary)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-6)",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  headerRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "var(--font-size-2xl)",
    fontWeight: "600",
    margin: "0",
  },
  searchSection: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  searchBar: {
    width: "300px",
    ".ant-input-prefix": {
      marginRight: "12px",
    },
    input: {
      background: "var(--background-secondary)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius)",
      color: "var(--text-primary)",
      height: "40px",
      "&:hover, &:focus": {
        borderColor: "var(--primary-color)",
        boxShadow: "none",
      },
    },
  },
  filterSelect: {
    minWidth: "140px",
    ".ant-select-selector": {
      background: "var(--background-secondary) !important",
      border: "1px solid var(--border-color) !important",
      borderRadius: "var(--radius) !important",
      height: "40px !important",
      "&:hover": {
        borderColor: "var(--primary-color) !important",
      },
    },
    ".ant-select-selection-item": {
      color: "var(--text-primary)",
      lineHeight: "38px !important",
    },
    ".ant-select-arrow": {
      color: "var(--text-secondary)",
    },
  },
  table: {
    backgroundColor: "var(--background-primary)",
    borderRadius: "var(--radius)",
    padding: "var(--spacing-4)",
  },
  statusTag: {
    pending: {
      color: "var(--warning-color)",
      background: "var(--warning-bg)",
      border: "1px solid var(--warning-border)",
    },
    approved: {
      color: "var(--success-color)",
      background: "var(--success-bg)",
      border: "1px solid var(--success-border)",
    },
    rejected: {
      color: "var(--error-color)",
      background: "var(--error-bg)",
      border: "1px solid var(--error-border)",
    },
    draft: {
      color: "var(--text-secondary)",
      background: "#f5f5f5",
      border: "1px solid #d9d9d9",
    },
  },
  formSection: {
    marginBottom: "32px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    background: "var(--background-secondary)",
    padding: "16px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border-color)",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "500",
  },
  infoValue: {
    color: "var(--text-primary)",
    fontSize: "var(--font-size-base)",
  },
  reasonText: {
    background: "var(--background-secondary)",
    padding: "16px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    fontSize: "var(--font-size-base)",
    lineHeight: "1.6",
  },
  modal: {
    header: {
      borderBottom: "1px solid var(--border-color)",
      padding: "16px 24px",
      marginBottom: "0",
    },
    body: {
      padding: "24px",
    },
    footer: {
      marginTop: "0",
      borderTop: "1px solid var(--border-color)",
      padding: "16px 24px",
    },
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  bulkActions: {
    padding: "12px",
    background: "#f5f5f5",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
};

const BetaPartners = () => {
  // State management
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBetaPartners, setTotalBetaPartners] = useState(0);
  const [reviewNotes, setReviewNotes] = useState(""); // New state for review notes
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [currentPartnerId, setCurrentPartnerId] = useState(null);

  // Handler functions with API simulation
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    // Will be handled by useEffect fetchBetaPartners
  };

  const handleSearch = async (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page on search
    await fetchFilteredPartners(value, currentStatus);
  };

  const handleStatusChange = async (status) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Reset to first page on filter
    await fetchFilteredPartners(searchText, status);
  };

  // Combined function for both search and filter with API simulation
  const fetchFilteredPartners = async (searchValue, status) => {
    setIsLoading(true);
    try {
      // Simulate API call with search and filter parameters
      // Actual API call would be something like:
      const response = await apiService.AdministratorService.getBetaPartners({
        page: currentPage,
        limit: 10,
        search: searchValue,
        status: status !== "all" ? status : undefined,
      });

      // For now, filter the existing data locally
      let filtered = [...data];

      // Text search simulation
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        filtered = filtered.filter(
          (partner) =>
            partner.firstName?.toLowerCase().includes(searchLower) ||
            partner.lastName?.toLowerCase().includes(searchLower) ||
            partner.email?.toLowerCase().includes(searchLower) ||
            partner.specialization?.toLowerCase().includes(searchLower) ||
            partner.city?.toLowerCase().includes(searchLower) ||
            partner.qualification?.toLowerCase().includes(searchLower) ||
            partner.hospitalName?.toLowerCase().includes(searchLower)
        );
      }

      // Status filter simulation
      if (status !== "all") {
        filtered = filtered.filter((partner) => partner.status === status);
      }

      setFilteredData(filtered);
      // In real API, would update total count from response
      setTotalBetaPartners(filtered.length);
    } catch (error) {
      console.error("Error filtering beta partners:", error);
      message.error("Failed to filter beta partners");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Beta Partners data from API
  const fetchBetaPartners = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.AdministratorService.getBetaPartners(
        currentPage,
        10
      );

      if (response.status === 200 && response.data.data.betaPartners) {
        const formattedData = response.data.data.betaPartners.map(
          (partner) => ({
            id: partner._id,
            firstName:
              partner.firstName ||
              (partner.fullName ? partner.fullName.split(" ")[0] : ""),
            middleName: partner.middleName || "",
            lastName:
              partner.lastName ||
              (partner.fullName
                ? partner.fullName.split(" ").slice(1).join(" ")
                : ""),
            specialization: partner.specialization || "",
            qualification: partner.qualification || "",
            city: partner.city || "",
            state: partner.state || "",
            mobile: partner.mobileNumber || "",
            email: partner.email || "",
            hospitalName: partner.hospitalName || "",
            experience: partner.experience || "",
            reason: partner.reason || "",
            reviewNotes: partner.reviewNotes || "",
            appliedOn: partner.registrationDate,
            status: partner.registrationStatus || "pending",
          })
        );

        setData(formattedData);
        await fetchFilteredPartners(searchText, currentStatus); // Apply current filters to new data
        setTotalBetaPartners(response.data.data.pagination.totalCount);
      }
    } catch (error) {
      console.error("Error fetching beta partners:", error);
      message.error("Failed to load beta partners");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data on mount and when page changes
  React.useEffect(() => {
    fetchBetaPartners();
  }, []); // Empty dependency array for initial load

  // Effect to handle search and filter debouncing
  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (data.length > 0) {
        // Only filter if we have data
        fetchFilteredPartners(searchText, currentStatus);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchText, currentStatus, data]);

  // Effect to handle pagination
  React.useEffect(() => {
    if (currentPage > 1) {
      // Only fetch for page changes after initial load
      fetchBetaPartners();
    }
  }, [currentPage]);

  // Add this function for handling draft deletion
  const handleDeleteDraft = async (id) => {
    try {
      setIsLoading(true);
      // In real implementation, this would be an API call
      const response =
        await apiService.AdministratorService.deleteDraftBetaPartner(id);

      if (response.status === 200) {
        message.success("Draft application deleted successfully");
        // Update local state to remove the deleted draft
        const updatedData = data.filter((partner) => partner.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Draft application deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      message.error("Failed to delete draft application");
    } finally {
      setIsLoading(false);
    }
  };
  // Function to handle bulk approve action with optional notes
  const handleBulkApprove = async (notes = "") => {
    try {
      setIsLoading(true);

      // Get the actual IDs of the selected rows
      const selectedIds = selectedRowKeys;

      // In real implementation, this would be an API call to update multiple partners
      // Send all IDs together as an array along with the review notes
      const requestData = {
        ids: selectedIds,
        registrationStatus: "approved",
        reviewNotes: notes,
      };


      const response =
        await apiService.AdministratorService.approveRejectMultipleBetaPartners(
          requestData
        );


      if (response && response.status === 200) {
        // For now, update local state
        const updatedData = [...data].map((partner) =>
          selectedRowKeys.includes(partner.id)
            ? { ...partner, status: "approved", reviewNotes: notes }
            : partner
        );
        setData(updatedData);
        setFilteredData(
          updatedData.filter((partner) =>
            currentStatus === "all" ? true : partner.status === currentStatus
          )
        ); // Reset selected rows
        setSelectedRowKeys([]);

        // Close both the review modal and the details modal if open
        setIsReviewModalVisible(false);
        if (selectedPartner && selectedRowKeys.includes(selectedPartner.id)) {
          setIsModalVisible(false);
        }

        // Reset review notes after submission
        setReviewNotes("");
        message.success("Selected applications approved successfully");
      }
    } catch (error) {
      console.error("Error approving applications:", error);
      message.error("Failed to approve selected applications");
    } finally {
      setIsLoading(false);
    }
  };
  // Function to handle bulk reject action with required notes
  const handleBulkReject = async (notes) => {
    if (!notes || !notes.trim()) {
      message.error("A reason is required for rejections");
      return;
    }

    try {
      setIsLoading(true);

      // Get the actual IDs of the selected rows
      const selectedIds = selectedRowKeys;

      // In real implementation, this would be an API call to update multiple partners
      // Send all IDs together as an array along with the review notes
      const requestData = {
        ids: selectedIds,
        registrationStatus: "rejected",
        reviewNotes: notes,
      };


      const response =
        await apiService.AdministratorService.approveRejectMultipleBetaPartners(
          requestData
        );


      if (response && response.status === 200) {
        // For now, update local state
        const updatedData = [...data].map((partner) =>
          selectedRowKeys.includes(partner.id)
            ? { ...partner, status: "rejected", reviewNotes: notes }
            : partner
        );
        setData(updatedData);
        setFilteredData(
          updatedData.filter((partner) =>
            currentStatus === "all" ? true : partner.status === currentStatus
          )
        ); // Reset selected rows
        setSelectedRowKeys([]);

        // Close both the review modal and the details modal if open
        setIsReviewModalVisible(false);
        if (selectedPartner && selectedRowKeys.includes(selectedPartner.id)) {
          setIsModalVisible(false);
        }

        // Reset review notes after submission
        setReviewNotes("");
        message.success("Selected applications rejected successfully");
      }
    } catch (error) {
      console.error("Error rejecting applications:", error);
      message.error("Failed to reject selected applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsLoading(true);
      // In real implementation, this would be an API call to delete multiple partners
      /* const response = await Promise.all(
        selectedRowKeys.map(id => apiService.AdministratorService.deleteBetaPartner(id))
      ); */

      // For now, update local state
      const updatedData = data.filter(
        (partner) => !selectedRowKeys.includes(partner.id)
      );
      setData(updatedData);
      setFilteredData(
        updatedData.filter((partner) =>
          currentStatus === "all" ? true : partner.status === currentStatus
        )
      );
      setSelectedRowKeys([]);
      message.success("Selected draft applications deleted successfully");
    } catch (error) {
      console.error("Error deleting applications:", error);
      message.error("Failed to delete selected applications");
    } finally {
      setIsLoading(false);
    }
  };

  // Selection of Rows
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      // If there are already selected rows, check if we can add new selections
      if (selectedRowKeys.length > 0 && keys.length > selectedRowKeys.length) {
        // Get the first selected row's status type (draft or non-draft)
        const firstSelectedRow = data.find(
          (row) => row.id === selectedRowKeys[0]
        );
        const isDraft = firstSelectedRow.status === "draft";

        // Check if any new selection violates the constraint
        const newSelections = selectedRows.filter(
          (row) => !selectedRowKeys.includes(row.id)
        );
        const hasInvalidSelection = newSelections.some(
          (row) =>
            (isDraft && row.status !== "draft") ||
            (!isDraft && row.status === "draft")
        );

        if (hasInvalidSelection) {
          message.error(
            "Cannot mix draft and non-draft applications in selection"
          );
          return;
        }
      }
      setSelectedRowKeys(keys);
    },
    getCheckboxProps: (record) => ({
      disabled: !["pending", "draft"].includes(record.status),
      name: record.name,
    }),
    hideSelectAll: true, // This removes the select all checkbox from the table header
  };

  // Approve or Reject single application
  const updatePartnerStatus = async (id, status, notes = "") => {

    try {
      setIsLoading(true); // Data to be sent to the API
      const requestData = {
        registrationStatus: status,
        reviewNotes: notes,
      };

      // In real implementation, this would be an API call to update a partner's status
      const response =
        await apiService.AdministratorService.approveRejectSingleBetaPartner(
          id,
          requestData
        );


      if (response && response.status === 200) {
        // Update local state with the new status
        const updatedData = data.map((partner) =>
          partner.id === id
            ? { ...partner, status, reviewNotes: notes }
            : partner
        );
        setData(updatedData);
        setFilteredData(
          updatedData.filter((partner) =>
            currentStatus === "all" ? true : partner.status === currentStatus
          )
        );

        // Close both the review modal and the details modal if open
        setIsReviewModalVisible(false);
        if (selectedPartner && selectedPartner.id === id) {
          setIsModalVisible(false);
        }

        // Reset review notes after submission
        setReviewNotes("");
        message.success(`Application ${status} successfully`);
      }
    } catch (error) {
      console.error(`Error ${status} application:`, error);
      message.error(`Failed to ${status} application`);
    } finally {
      setIsLoading(false);
    }
  };

  // Open the review modal for approve/reject action
  const openReviewModal = (id, type) => {
    setCurrentPartnerId(id);
    setActionType(type);
    setReviewNotes(""); // Clear previous notes
    setIsReviewModalVisible(true);
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
      align: "center",
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Text style={{ fontWeight: 500 }}>
          {`${record.firstName} ${
            record.middleName ? record.middleName + " " : ""
          }${record.lastName}`}
        </Text>
      ),
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      render: (text) => text || "Not specified",
      sorter: (a, b) =>
        (a.specialization || "").localeCompare(b.specialization || ""),
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
      render: (text) => text || "Not specified",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text) => text || "Not specified",
      sorter: (a, b) => (a.city || "").localeCompare(b.city || ""),
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      key: "appliedOn",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      sorter: (a, b) => moment(a.appliedOn).unix() - moment(b.appliedOn).unix(),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const statusDisplay =
          record.status.charAt(0).toUpperCase() + record.status.slice(1);
        return (
          <Tag style={customStyles.statusTag[record.status]}>
            {statusDisplay}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined style={{ color: "var(--text-primary)" }} />}
            onClick={() => {
              setSelectedPartner(record);
              setIsModalVisible(true);
            }}
            style={{
              borderColor: "var(--border-color)",
              background: "transparent",
            }}
            className="btn-premium btn-sm"
            title="View details"
          />{" "}
          {record.status === "pending" && (
            <>
              <Button
                icon={<CheckOutlined style={{ color: "#fff" }} />}
                className="btn-premium btn-sm"
                style={{
                  background: "var(--success-color)",
                  borderColor: "var(--success-color)",
                  color: "#fff",
                }}
                onClick={() => openReviewModal(record.id, "approve")}
                title="Approve application"
              />
              <Button
                icon={<CloseOutlined style={{ color: "#fff" }} />}
                className="btn-premium btn-sm"
                style={{
                  background: "var(--error-color)",
                  borderColor: "var(--error-color)",
                  color: "#fff",
                }}
                onClick={() => openReviewModal(record.id, "reject")}
                title="Reject application"
              />
            </>
          )}
          {record.status === "draft" && (
            <Popconfirm
              title="Delete Draft"
              description="Are you sure you want to delete this draft application? This action cannot be undone."
              onConfirm={() => handleDeleteDraft(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{
                danger: true,
              }}
              overlayStyle={{ maxWidth: "300px" }}
              placement="left"
            >
              {" "}
              <Button
                icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                type="default"
                className="btn-premium btn-sm"
                style={{
                  borderColor: "#ff4d4f",
                  background: "transparent",
                }}
                title="Delete draft"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];
  return (
    <AdminLayout>
      <div style={customStyles.pageContainer} className="premium-scrollbar">
        <div style={customStyles.header}>
          <div style={customStyles.headerLeft}>
            <h1 style={customStyles.title}>Beta Partners</h1>
            <Text type="secondary">
              Manage beta partner applications and requests
            </Text>
          </div>
          <div style={customStyles.headerRight}>
            <div style={customStyles.searchSection}>
              <Input
                placeholder="Search by name, email or specialization"
                prefix={
                  <SearchOutlined
                    style={{ color: "var(--text-secondary)", fontSize: "16px" }}
                  />
                }
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={customStyles.searchBar}
                size="large"
              />
              <Select
                defaultValue="all"
                onChange={handleStatusChange}
                style={customStyles.filterSelect}
                size="large"
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
            </div>
          </div>
        </div>
        <div style={customStyles.table}>
          {selectedRowKeys.length > 0 && (
            <div className="bulk-actions mb-3">
              <Space>
                <span>{selectedRowKeys.length} items selected</span>
                {/* Check if the selection is draft or non-draft */}
                {data.find((row) => row.id === selectedRowKeys[0])?.status ===
                "draft" ? (
                  // Show delete button for drafts
                  <Button
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: "Delete Selected Drafts",
                        content: `Are you sure you want to delete ${selectedRowKeys.length} draft applications? This action cannot be undone.`,
                        okText: "Delete",
                        cancelText: "Cancel",
                        okButtonProps: { danger: true },
                        onOk: handleBulkDelete,
                      });
                    }}
                  >
                    Delete Selected Drafts
                  </Button>
                ) : (
                  // Show approve/reject buttons for non-drafts
                  <>
                    <Button
                      type="primary"
                      style={{
                        background: "var(--success-color)",
                        borderColor: "var(--success-color)",
                      }}
                      onClick={() => {
                        // For bulk approve, set the action type and show the review modal
                        setActionType("approve");
                        setCurrentPartnerId(null); // Null means bulk operation
                        setReviewNotes("");
                        setIsReviewModalVisible(true);
                      }}
                    >
                      Approve Selected
                    </Button>
                    <Button
                      danger
                      onClick={() => {
                        // For bulk reject, set the action type and show the review modal
                        setActionType("reject");
                        setCurrentPartnerId(null); // Null means bulk operation
                        setReviewNotes("");
                        setIsReviewModalVisible(true);
                      }}
                    >
                      Reject Selected
                    </Button>
                  </>
                )}
              </Space>
            </div>
          )}
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: 10,
              onChange: handlePageChange,
              showSizeChanger: false,
            }}
            className="premium-table-responsive"
            loading={isLoading}
            rowSelection={rowSelection}
          />
        </div>{" "}
        <Modal
          title={
            <div style={{ padding: "4px 0" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Beta Partner Details
              </div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Review application details and manage partner status
              </Text>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={
            selectedPartner?.status === "pending"
              ? [
                  <Space key="actions">
                    <Button
                      type="primary"
                      style={{
                        background: "var(--success-color)",
                        borderColor: "var(--success-color)",
                      }}
                      onClick={() =>
                        openReviewModal(selectedPartner.id, "approve")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      style={{
                        background: "var(--error-color)",
                        borderColor: "var(--error-color)",
                        color: "#fff",
                      }}
                      onClick={() =>
                        openReviewModal(selectedPartner.id, "reject")
                      }
                    >
                      Reject
                    </Button>
                  </Space>,
                ]
              : [
                  <Button
                    key="close"
                    onClick={() => setIsModalVisible(false)}
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                    className="btn-premium"
                  >
                    Close
                  </Button>,
                ]
          }
          styles={customStyles.modal}
          width={800}
          maskClosable={false}
          destroyOnClose
        >
          {" "}
          {selectedPartner && (
            <div>
              {/* Status Banner */}
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "24px",
                  background:
                    customStyles.statusTag[selectedPartner.status].background,
                  border: customStyles.statusTag[selectedPartner.status].border,
                  borderRadius: "var(--radius)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text
                    style={{
                      color:
                        customStyles.statusTag[selectedPartner.status].color,
                      fontWeight: "600",
                      fontSize: "var(--font-size-base)",
                    }}
                  >
                    {selectedPartner.status === "draft"
                      ? "DRAFT APPLICATION"
                      : `${selectedPartner.status.toUpperCase()} APPLICATION`}
                  </Text>
                  <div
                    style={{
                      color:
                        customStyles.statusTag[selectedPartner.status].color,
                      opacity: 0.8,
                      fontSize: "var(--font-size-sm)",
                      marginTop: "4px",
                    }}
                  >
                    {selectedPartner.appliedOn
                      ? `Applied on ${moment(selectedPartner.appliedOn).format(
                          "DD MMM YYYY [at] HH:mm"
                        )}`
                      : "Application not submitted yet"}
                  </div>
                </div>
                {selectedPartner.status === "draft" && (
                  <Popconfirm
                    title="Delete Draft"
                    description="Are you sure you want to delete this draft application?"
                    onConfirm={() => {
                      handleDeleteDraft(selectedPartner.id);
                      setIsModalVisible(false);
                    }}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{
                      danger: true,
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      title="Delete draft"
                    >
                      Delete Draft
                    </Button>
                  </Popconfirm>
                )}
              </div>

              {/* Personal Information */}
              <div style={customStyles.formSection}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  Personal Information
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Full Name</div>
                    <div style={customStyles.infoValue}>
                      {`${selectedPartner.firstName} ${
                        selectedPartner.middleName
                          ? selectedPartner.middleName + " "
                          : ""
                      }${selectedPartner.lastName}`}
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Email Address</div>
                    <div style={customStyles.infoValue}>
                      <a
                        href={`mailto:${selectedPartner.email}`}
                        style={{ color: "var(--primary-color)" }}
                      >
                        {selectedPartner.email}
                      </a>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Mobile Number</div>
                    <div style={customStyles.infoValue}>
                      <a
                        href={`tel:${selectedPartner.mobile}`}
                        style={{ color: "var(--primary-color)" }}
                      >
                        {selectedPartner.mobile}
                      </a>
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Location</div>
                    <div style={customStyles.infoValue}>
                      {`${selectedPartner.city}, ${selectedPartner.state}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div style={customStyles.formSection}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  Professional Information
                </Text>
                <div style={customStyles.infoGrid}>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Specialization</div>
                    <div style={customStyles.infoValue}>
                      {selectedPartner.specialization}
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Qualification</div>
                    <div style={customStyles.infoValue}>
                      {selectedPartner.qualification}
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Experience</div>
                    <div style={customStyles.infoValue}>
                      {selectedPartner.experience} years
                    </div>
                  </div>
                  <div style={customStyles.infoItem}>
                    <div style={customStyles.infoLabel}>Hospital/Clinic</div>
                    <div style={customStyles.infoValue}>
                      {selectedPartner.hospitalName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Statement */}
              <div style={customStyles.formSection}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  Reason for Application
                </Text>
                <div
                  style={{
                    ...customStyles.reasonText,
                    position: "relative",
                    paddingLeft: "24px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      background: "var(--primary-color)",
                      opacity: 0.5,
                      borderRadius: "4px",
                      margin: "16px 0",
                    }}
                  />
                  {selectedPartner.reason}
                </div>
              </div>

              {/* Show review notes for rejected applications */}
              {selectedPartner.status === "rejected" &&
                selectedPartner.reviewNotes && (
                  <div style={customStyles.formSection}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "16px",
                        fontSize: "var(--font-size-lg)",
                        color: "var(--error-color)",
                      }}
                    >
                      Rejection Reason
                    </Text>
                    <div
                      style={{
                        ...customStyles.reasonText,
                        position: "relative",
                        paddingLeft: "24px",
                        borderColor: "var(--error-border)",
                        background: "var(--error-bg)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          background: "var(--error-color)",
                          opacity: 0.5,
                          borderRadius: "4px",
                          margin: "16px 0",
                        }}
                      />
                      {selectedPartner.reviewNotes}
                    </div>
                  </div>
                )}

              {/* Show review notes for approved applications if provided */}
              {selectedPartner.status === "approved" &&
                selectedPartner.reviewNotes && (
                  <div style={customStyles.formSection}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "16px",
                        fontSize: "var(--font-size-lg)",
                        color: "var(--success-color)",
                      }}
                    >
                      Approval Notes
                    </Text>
                    <div
                      style={{
                        ...customStyles.reasonText,
                        position: "relative",
                        paddingLeft: "24px",
                        borderColor: "var(--success-border)",
                        background: "var(--success-bg)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          background: "var(--success-color)",
                          opacity: 0.5,
                          borderRadius: "4px",
                          margin: "16px 0",
                        }}
                      />
                      {selectedPartner.reviewNotes}
                    </div>
                  </div>
                )}
            </div>
          )}
        </Modal>
        {/* Review Notes Modal */}
        <Modal
          title={
            <div style={{ padding: "4px 0" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {actionType === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </div>{" "}
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {currentPartnerId === null
                  ? actionType === "approve"
                    ? "Optionally add review notes for these approvals"
                    : "Please provide a reason for rejecting these applications"
                  : actionType === "approve"
                  ? "Optionally add review notes for this approval"
                  : "Please provide a reason for rejecting this application"}
              </Text>
            </div>
          }
          open={isReviewModalVisible}
          onCancel={() => setIsReviewModalVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsReviewModalVisible(false)}
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              style={{
                background:
                  actionType === "approve"
                    ? "var(--success-color)"
                    : "var(--error-color)",
                borderColor:
                  actionType === "approve"
                    ? "var(--success-color)"
                    : "var(--error-color)",
              }}
              onClick={() => {
                // For rejections, validate that review notes are provided
                if (
                  actionType === "reject" &&
                  (!reviewNotes || !reviewNotes.trim())
                ) {
                  message.error("A reason is required for rejections");
                  return;
                }

                // Handle bulk operations vs single operations
                if (currentPartnerId === null) {
                  // Bulk operation
                  if (actionType === "approve") {
                    handleBulkApprove(reviewNotes);
                  } else {
                    handleBulkReject(reviewNotes);
                  }
                } else {
                  // Single partner operation
                  updatePartnerStatus(
                    currentPartnerId,
                    actionType === "approve" ? "approved" : "rejected",
                    reviewNotes
                  );
                }
              }}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>,
          ]}
          styles={customStyles.modal}
          width={600}
          maskClosable={false}
          destroyOnClose
        >
          <div style={{ marginBottom: "16px" }}>
            <Text
              type={actionType === "approve" ? "success" : "danger"}
              strong
              style={{
                fontSize: "15px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {" "}
              {currentPartnerId === null
                ? actionType === "approve"
                  ? `You are about to approve ${selectedRowKeys.length} beta partner applications`
                  : `You are about to reject ${selectedRowKeys.length} beta partner applications`
                : actionType === "approve"
                ? "You are about to approve this beta partner application"
                : "You are about to reject this beta partner application"}
            </Text>

            <div style={{ marginTop: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <Text strong>
                  {actionType === "approve"
                    ? "Review Notes (Optional)"
                    : "Rejection Reason (Required)"}
                </Text>
              </div>
              <TextArea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "Add any additional notes about this approval (optional)"
                    : "Please provide a reason for rejecting this application"
                }
                rows={4}
                required={actionType === "reject"}
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--background-secondary)",
                  color: "var(--text-primary)",
                }}
              />
              {actionType === "reject" && !reviewNotes && (
                <Text
                  type="danger"
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  A reason is required for rejections
                </Text>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default BetaPartners;
