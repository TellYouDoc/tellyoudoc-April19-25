import { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    message,
    Popconfirm,
    Tooltip,
    Typography,
    Tag,
    Empty,
    Select,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    MedicineBoxOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";

const { Text } = Typography;
const { TextArea } = Input;

import apiService from "../../services/api";

// Custom styles to match website theme
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
    createButton: {
        background: "var(--primary-color)",
        borderColor: "var(--primary-color)",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        height: "38px",
        borderRadius: "var(--radius)",
        transition: "all var(--transition-normal)",
    },
    table: {
        background: "var(--background-primary)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--border-color)",
        padding: "var(--spacing-4)",
        overflowX: "auto",
        width: "100%",
    },
    actionButton: {
        borderRadius: "var(--radius)",
    },
    modal: {
        ".ant-modal": {
            margin: "0",
            padding: "0",
        },
        ".ant-modal-content": {
            padding: "24px",
            background: "var(--background-primary)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            margin: "0",
        },
        ".ant-modal-header": {
            padding: "0 0 16px 0",
            background: "transparent",
            border: "none",
            marginBottom: "8px",
            borderBottom: "1px solid var(--border-color)",
        },
        ".ant-modal-title": {
            color: "var(--text-primary)",
            fontSize: "var(--font-size-xl)",
            fontWeight: "600",
        },
        ".ant-modal-body": {
            padding: "24px 0",
            margin: "0",
        },
        ".ant-modal-close": {
            top: "24px",
            right: "24px",
        },
        ".ant-form-item-label > label": {
            color: "var(--text-primary)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "500",
        },
    },
    popconfirmButton: {
        minWidth: "60px",
        height: "32px",
        padding: "4px 15px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    },
    searchSection: {
        display: "flex",
        gap: "16px",
        alignItems: "center",
    },
    searchBar: {
        width: "300px",
        ".ant-input-affix-wrapper": {
            background: "var(--background-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius)",
            "&:hover, &:focus": {
                borderColor: "var(--primary-color)",
            },
        },
        ".ant-input": {
            background: "transparent",
        },
    },
    formSection: {
        marginBottom: "24px",
    },
    formDescription: {
        color: "var(--text-secondary)",
        fontSize: "var(--font-size-sm)",
        marginBottom: "16px",
    },
    specializationItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-color)",
        marginBottom: "12px",
        background: "var(--background-secondary)",
    },
    specializationTitle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "var(--text-primary)",
        fontWeight: "500",
    },
    specializationDescription: {
        color: "var(--text-secondary)",
        fontSize: "var(--font-size-sm)",
        marginTop: "4px",
    },
};

function Specializations() {
    // State management
    const [specializations, setSpecializations] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewDetailsModalVisible, setIsViewDetailsModalVisible] = useState(false);
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filteredSpecializations, setFilteredSpecializations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalSpecializations, setTotalSpecializations] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Add page size state
    const [specializationList, setSpecializationList] = useState([{ specializationName: "", description: "" }]);
    const [sortOrder, setSortOrder] = useState("none"); // "none", "asc", "desc", "latest", "old"

    // Sort specializations function (defined before useEffect)
    const sortSpecializations = (data, order) => {
        if (order === "none") return data;

        return [...data].sort((a, b) => {
            if (order === "asc") {
                // A to Z (ascending alphabetical)
                const nameA = (a.specializationName || "").toLowerCase().trim();
                const nameB = (b.specializationName || "").toLowerCase().trim();
                return nameA.localeCompare(nameB);
            } else if (order === "desc") {
                // Z to A (descending alphabetical)
                const nameA = (a.specializationName || "").toLowerCase().trim();
                const nameB = (b.specializationName || "").toLowerCase().trim();
                return nameA.localeCompare(nameB) * -1; // Reverse the comparison
            } else if (order === "latest") {
                // Sort by createdAt date (newest first)
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA; // Descending order (newest first)
            } else if (order === "old") {
                // Sort by createdAt date (oldest first)
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateA - dateB; // Ascending order (oldest first)
            }
            return 0;
        });
    };

    // Table columns configuration
    const columns = [
        {
            title: "Sl No",
            key: "index",
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 60,
            fixed: "left",
        },
        {
            title: "Specialization",
            dataIndex: "specializationName",
            key: "specializationName",
            width: 150,
            ellipsis: true,
            render: (name) => (
                <Tooltip title={name}>
                    <span style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                        {name}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 250,
            render: (description) => (
                <div style={{
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: "1.4"
                }}>
                    {description || "No description provided"}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<InfoCircleOutlined />}
                        onClick={() => handleViewDetails(record)}
                        style={customStyles.actionButton}
                        className="btn-premium btn-sm btn-outline"
                    >
                        View
                    </Button>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={customStyles.actionButton}
                        className="btn-premium btn-sm btn-outline"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this specialization?"
                        description="This action cannot be undone and may affect doctors using this specialization."
                        onConfirm={() => handleDelete(record.documentId, record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                            className: "btn-premium",
                            style: {
                                ...customStyles.popconfirmButton,
                                background: "var(--primary-color)",
                                borderColor: "var(--primary-color)",
                                color: "white",
                            },
                        }}
                        cancelButtonProps={{
                            className: "btn-premium",
                            style: {
                                ...customStyles.popconfirmButton,
                                background: "transparent",
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)",
                            },
                        }}
                        placement="topRight"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            style={customStyles.actionButton}
                            className="btn-premium btn-sm btn-outline"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Fetch specializations function
    const fetchSpecializations = async () => {
        try {
            setIsLoading(true);
            // Fetch all specializations without pagination
            const response = await apiService.AdministratorService.getAllSpecializations();

            console.log("Response : " + JSON.stringify(response.data, null, 2));

            if (response && response.status === 200) {
                // Handle the response structure based on the API
                const responseData = response.data.data;

                // The API returns multiple documents, each with their own specializations array
                if (responseData && Array.isArray(responseData.specializations) && responseData.specializations.length > 0) {
                    // Combine all specializations from all documents and add parent document's createdAt
                    const allSpecializations = responseData.specializations.reduce((acc, doc) => {
                        if (doc.specializations && Array.isArray(doc.specializations)) {
                            // Add parent document's createdAt and _id to each specialization
                            const specializationsWithDate = doc.specializations.map(spec => ({
                                ...spec,
                                createdAt: doc.createdAt,
                                updatedAt: doc.updatedAt,
                                documentId: doc._id // Add parent document ID
                            }));
                            return [...acc, ...specializationsWithDate];
                        }
                        return acc;
                    }, []);

                    if (allSpecializations.length > 0) {
                        setSpecializations(allSpecializations);
                        // Apply initial sorting
                        const sortedSpecializations = sortSpecializations(allSpecializations, sortOrder);
                        setFilteredSpecializations(sortedSpecializations);
                        setTotalSpecializations(sortedSpecializations.length);
                    } else {
                        setSpecializations([]);
                        setFilteredSpecializations([]);
                        setTotalSpecializations(0);
                    }
                } else {
                    // Fallback: ensure we always have an array
                    setSpecializations([]);
                    setFilteredSpecializations([]);
                    setTotalSpecializations(0);
                }
            }
        } catch (error) {
            console.error("Error fetching specializations:", error);
            message.error(
                "Failed to fetch specializations: " +
                (error.message || "Unknown error")
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecializations();
    }, []); // Remove currentPage dependency

    // Add new specialization field
    const addSpecializationField = () => {
        setSpecializationList([...specializationList, { specializationName: "", description: "" }]);
    };

    // Remove specialization field
    const removeSpecializationField = (index) => {
        if (specializationList.length > 1) {
            const newList = specializationList.filter((_, i) => i !== index);
            setSpecializationList(newList);
        }
    };

    // Update specialization field
    const updateSpecializationField = (index, field, value) => {
        const newList = [...specializationList];
        newList[index][field] = value;
        setSpecializationList(newList);
    };

    // Create new specializations
    const handleCreate = async () => {
        try {
            // Validate that all specialization names are filled
            const validSpecializations = specializationList.filter(
                spec => spec.specializationName.trim() !== ""
            );

            if (validSpecializations.length === 0) {
                message.error("Please add at least one specialization");
                return;
            }

            setIsLoading(true);

            const newSpecializations = {
                specializations: validSpecializations.map(spec => ({
                    specializationName: spec.specializationName.trim(),
                    description: spec.description.trim() || ""
                }))
            };

            const response = await apiService.AdministratorService.createSpecialization(newSpecializations);

            if (response && response.status === 201) {
                message.success(`${validSpecializations.length} specialization(s) created successfully`);
                setIsCreateModalVisible(false);
                setSpecializationList([{ specializationName: "", description: "" }]);

                // Fetch updated specializations after creation
                await fetchSpecializations();
            }
        } catch (error) {
            console.error("Error creating specializations:", error);
            message.error(
                "Failed to create specializations: " + (error.message || "Unknown error")
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Update specialization
    const handleUpdate = async (values) => {
        try {
            setIsLoading(true);

            const updateData = {
                specializationName: values.specializationName,
                description: values.description || ""
            };

            const response = await apiService.AdministratorService.updateSpecialization(
                selectedSpecialization.documentId,
                selectedSpecialization._id,
                updateData
            );

            if (response && response.status === 200) {
                message.success("Specialization updated successfully");
                setIsEditModalVisible(false);
                form.resetFields();
                setSelectedSpecialization(null);

                // Fetch updated specializations after update
                await fetchSpecializations();
            }
        } catch (error) {
            console.error("Error updating specialization:", error);
            message.error(
                "Failed to update specialization: " + (error.message || "Unknown error")
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Delete specialization
    const handleDelete = async (documentId, specializationId) => {
        try {
            setIsLoading(true);

            const response = await apiService.AdministratorService.deleteSpecialization(documentId, specializationId);

            if (response && response.status === 200) {
                message.success("Specialization deleted successfully");

                // Fetch updated specializations after deletion
                await fetchSpecializations();
            }
        } catch (error) {
            console.error("Error deleting specialization:", error);
            message.error(
                "Failed to delete specialization: " + (error.message || "Unknown error")
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (specialization) => {
        setSelectedSpecialization(specialization);
        form.setFieldsValue({
            specializationName: specialization.specializationName,
            description: specialization.description || ""
        });
        setIsEditModalVisible(true);
    };

    // Handle view details
    const handleViewDetails = (specialization) => {
        setSelectedSpecialization(specialization);
        setIsViewDetailsModalVisible(true);
    };

    // Helper function to format dates consistently
    const formatDate = (dateString) => {
        if (!dateString) {
            return "N/A";
        }

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }

            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch {
            return "Invalid Date";
        }
    };

    // Search handler
    const handleSearch = (value) => {
        setSearchText(value);
        filterSpecializations(value);
    };

    // Sort handler
    const handleSort = (order) => {
        setSortOrder(order);
        // Pass the new order directly to filterSpecializations
        filterSpecializations(searchText, order);
    };



    const filterSpecializations = (text, order = sortOrder) => {
        // Ensure specializations is always an array
        const specializationsArray = Array.isArray(specializations) ? specializations : [];
        let filtered = [...specializationsArray];

        if (text) {
            const searchLower = text.toLowerCase();
            filtered = filtered.filter(
                (spec) =>
                    spec && spec.specializationName &&
                    spec.specializationName.toLowerCase().includes(searchLower) ||
                    (spec && spec.description && spec.description.toLowerCase().includes(searchLower))
            );
        }

        // Apply sorting with the provided order (or current sortOrder as fallback)
        filtered = sortSpecializations(filtered, order);

        setFilteredSpecializations(filtered);
        setTotalSpecializations(filtered.length);
        setCurrentPage(1); // Reset to first page when filtering or changing page size
    };

    return (
        <AdminLayout>
            <div style={customStyles.pageContainer} className="premium-scrollbar">
                <div style={customStyles.header}>
                    <div style={customStyles.headerLeft}>
                        <h1 style={customStyles.title}>Doctor Specializations</h1>
                        <Text type="secondary">
                            Manage doctor specializations and their descriptions
                        </Text>
                    </div>
                    <div style={customStyles.headerRight}>
                        <div style={customStyles.searchSection}>
                            <Input
                                placeholder="Search by specialization name or description"
                                prefix={
                                    <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                                }
                                onChange={(e) => handleSearch(e.target.value)}
                                value={searchText}
                                style={customStyles.searchBar}
                                className="form-control-premium"
                            />
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <Select
                                value={sortOrder}
                                onChange={handleSort}
                                style={{
                                    width: 120,
                                    cursor: "pointer",
                                }}
                                placeholder="Sort by"
                                dropdownStyle={{
                                    background: "var(--background-primary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius)",
                                }}
                            >
                                <Select.Option value="none">None</Select.Option>
                                <Select.Option value="asc">A to Z</Select.Option>
                                <Select.Option value="desc">Z to A</Select.Option>
                                <Select.Option value="latest">Latest</Select.Option>
                                <Select.Option value="old">Old</Select.Option>
                            </Select>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalVisible(true)}
                            style={customStyles.createButton}
                            className="btn-premium"
                        >
                            Add Specializations
                        </Button>
                    </div>
                </div>

                {/* Style the table */}
                <div
                    style={customStyles.table}
                    className="premium-card premium-table-responsive"
                >
                    <Table
                        columns={columns}
                        dataSource={Array.isArray(filteredSpecializations) ? filteredSpecializations : []}
                        rowKey="_id"
                        pagination={{
                            pageSize: pageSize,
                            current: currentPage,
                            onChange: (page) => setCurrentPage(page),
                            onShowSizeChange: (current, size) => {
                                setPageSize(size);
                                setCurrentPage(1); // Reset to first page when changing page size
                            },
                            total: totalSpecializations,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '25', '50', '100', '200'],
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} specializations`,
                        }}
                        size="middle"
                        loading={isLoading}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No specializations found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ),
                        }}
                        style={{
                            '.ant-pagination-options .ant-select': {
                                cursor: 'pointer',
                            },
                            '.ant-pagination-options .ant-select-selector': {
                                cursor: 'pointer !important',
                                width: '100% !important',
                                height: '100% !important',
                            },
                            '.ant-pagination-options .ant-select-focused .ant-select-selector': {
                                borderColor: 'var(--primary-color) !important',
                                boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2) !important',
                            },
                        }}
                    />
                </div>

                {/* Create Modal */}
                <Modal
                    title={
                        <div>
                            <div style={{ marginBottom: "8px" }}>Add Multiple Specializations</div>
                            <Text
                                type="secondary"
                                style={{ fontSize: "var(--font-size-sm)" }}
                            >
                                Create multiple doctor specializations at once
                            </Text>
                        </div>
                    }
                    open={isCreateModalVisible}
                    onCancel={() => {
                        setIsCreateModalVisible(false);
                        setSpecializationList([{ specializationName: "", description: "" }]);
                    }}
                    footer={null}
                    styles={customStyles.modal}
                    width={800}
                    centered
                >
                    <div style={customStyles.formSection}>
                        <Text strong style={{ display: "block", marginBottom: "16px" }}>
                            Specialization Information
                        </Text>
                        <Text type="secondary" style={{ display: "block", marginBottom: "24px" }}>
                            Add multiple specializations. You can add more fields using the "Add Another" button.
                        </Text>

                        {specializationList.map((spec, index) => (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius)",
                                    padding: "16px",
                                    marginBottom: "16px",
                                    background: "var(--background-secondary)"
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <Text strong style={{ color: "var(--text-primary)" }}>
                                        Specialization {index + 1}
                                    </Text>
                                    {specializationList.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeSpecializationField(index)}
                                            size="small"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                <div style={{ marginBottom: "12px" }}>
                                    <Text style={{ display: "block", marginBottom: "4px", color: "var(--text-primary)" }}>
                                        Specialization Name *
                                    </Text>
                                    <Input
                                        prefix={<MedicineBoxOutlined className="site-form-item-icon" />}
                                        placeholder="e.g., Cardiologist, Dermatologist"
                                        className="form-control-premium"
                                        value={spec.specializationName}
                                        onChange={(e) => updateSpecializationField(index, "specializationName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Text style={{ display: "block", marginBottom: "4px", color: "var(--text-primary)" }}>
                                        Description (Optional)
                                    </Text>
                                    <TextArea
                                        placeholder="Enter a brief description of this specialization"
                                        rows={3}
                                        className="form-control-premium"
                                        showCount
                                        maxLength={500}
                                        value={spec.description}
                                        onChange={(e) => updateSpecializationField(index, "description", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={addSpecializationField}
                            style={{
                                width: "100%",
                                marginBottom: "24px",
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)"
                            }}
                            className="btn-premium btn-outline"
                        >
                            Add Another Specialization
                        </Button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                        <Button
                            onClick={() => {
                                setIsCreateModalVisible(false);
                                setSpecializationList([{ specializationName: "", description: "" }]);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleCreate}
                            className="btn-premium"
                            loading={isLoading}
                        >
                            Create {specializationList.length} Specialization(s)
                        </Button>
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    title={
                        <div>
                            <div style={{ marginBottom: "8px" }}>Edit Specialization</div>
                            <Text
                                type="secondary"
                                style={{ fontSize: "var(--font-size-sm)" }}
                            >
                                Modify specialization information
                            </Text>
                        </div>
                    }
                    open={isEditModalVisible}
                    onCancel={() => {
                        setIsEditModalVisible(false);
                        form.resetFields();
                        setSelectedSpecialization(null);
                    }}
                    footer={null}
                    styles={customStyles.modal}
                    width={600}
                    centered
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        requiredMark="optional"
                    >
                        <div style={customStyles.formSection}>
                            <Text strong style={{ display: "block", marginBottom: "16px" }}>
                                Specialization Information
                            </Text>
                            <Form.Item
                                name="specializationName"
                                label="Specialization Name"
                                rules={[
                                    { required: true, message: "Please enter the specialization name!" },
                                    { min: 2, message: "Specialization name must be at least 2 characters!" },
                                ]}
                                tooltip="Enter the name of the medical specialization"
                            >
                                <Input
                                    prefix={<MedicineBoxOutlined className="site-form-item-icon" />}
                                    placeholder="e.g., Cardiologist, Dermatologist"
                                    className="form-control-premium"
                                />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    { max: 500, message: "Description cannot exceed 500 characters!" },
                                ]}
                                tooltip="Optional description of the specialization"
                            >
                                <TextArea
                                    placeholder="Enter a brief description of this specialization (optional)"
                                    rows={4}
                                    className="form-control-premium"
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item className="flex justify-end">
                            <Space>
                                <Button
                                    onClick={() => {
                                        setIsEditModalVisible(false);
                                        form.resetFields();
                                        setSelectedSpecialization(null);
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="btn-premium"
                                    loading={isLoading}
                                >
                                    Update Specialization
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* View Details Modal */}
                <Modal
                    title={
                        <div>
                            <div style={{ marginBottom: "8px" }}>Specialization Details</div>
                            <Text
                                type="secondary"
                                style={{ fontSize: "var(--font-size-sm)" }}
                            >
                                Complete information about this specialization
                            </Text>
                        </div>
                    }
                    open={isViewDetailsModalVisible}
                    onCancel={() => setIsViewDetailsModalVisible(false)}
                    footer={[
                        <Button
                            key="close"
                            onClick={() => setIsViewDetailsModalVisible(false)}
                        >
                            Close
                        </Button>,
                    ]}
                    styles={customStyles.modal}
                    width={500}
                    centered
                >
                    {selectedSpecialization && (
                        <div style={{ padding: "16px 0" }}>
                            <div style={{ marginBottom: "24px" }}>
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        padding: "16px",
                                        background: "var(--background-secondary)",
                                        borderRadius: "var(--radius)",
                                        border: "1px solid var(--border-color)",
                                    }}
                                >
                                    <MedicineBoxOutlined
                                        style={{ color: "var(--primary-color)", fontSize: "20px" }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontWeight: "600",
                                                color: "var(--text-primary)",
                                                fontSize: "16px",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {selectedSpecialization.specializationName}
                                        </div>
                                        <div
                                            style={{
                                                color: "var(--text-secondary)",
                                                fontSize: "14px",
                                            }}
                                        >
                                            Medical Specialization
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gap: "16px" }}>
                                <div style={customStyles.specializationItem}>
                                    <div>
                                        <div style={customStyles.specializationTitle}>
                                            <InfoCircleOutlined /> Description
                                        </div>
                                        <div style={customStyles.specializationDescription}>
                                            {selectedSpecialization.description || "No description provided"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}

export default Specializations;