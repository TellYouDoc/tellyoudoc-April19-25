import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Button,
    Typography,
    Tag,
    Alert,
    Space,
    Modal,
    Input,
} from "antd";
import {
    BarChartOutlined,
    UserOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    TrophyOutlined,
    ReloadOutlined,
    MedicineBoxOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import apiService from "../../services/api";
import "../../styles/Administrator/AppointmentAnalytics.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

const { Text, Title } = Typography;

// Styles to match ActivityLogs theme
const customStyles = {
    pageContainer: {
        padding: "var(--spacing-6)",
        minHeight: "100vh",
        color: "var(--text-primary)",
    },
    header: {
        background: "var(--background-secondary)",
        padding: "24px",
        borderRadius: "var(--radius)",
        marginBottom: "var(--spacing-6)",
        border: "1px solid var(--border-color)",
    },
    headerContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "24px",
    },
    headerLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    title: {
        color: "var(--text-primary)",
        fontSize: "24px",
        fontWeight: "600",
        margin: "0",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    subtitle: {
        color: "var(--text-secondary)",
        fontSize: "14px",
        margin: "0",
        maxWidth: "600px",
    },
    headerRight: {
        display: "flex",
        gap: "16px",
        alignItems: "center",
    },
    statsCard: {
        background: "var(--background-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-sm)",
        transition: "var(--transition-normal)",
        "&:hover": {
            boxShadow: "var(--shadow-md)",
            transform: "translateY(-2px)",
        },
    },
    chartCard: {
        background: "var(--background-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-sm)",
        transition: "var(--transition-normal)",
        marginBottom: "var(--spacing-6)",
        "&:hover": {
            boxShadow: "var(--shadow-md)",
            transform: "translateY(-2px)",
        },
    },
    table: {
        backgroundColor: "var(--background-primary)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)",
    },
};

const AppointmentAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false);
    const [specializationsModalVisible, setSpecializationsModalVisible] =
        useState(false);
    const [leaderboardSearchText, setLeaderboardSearchText] = useState("");
    const [specializationsSearchText, setSpecializationsSearchText] =
        useState("");
    const [locationsSearchText, setLocationsSearchText] = useState("");

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response =
                await apiService.AdministratorService.getAppointmentStatistics();
            setAnalyticsData(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    if (loading) {
        return (
            <AdminLayout>
                <div style={customStyles.pageContainer}>
                    <Card style={customStyles.statsCard}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <div className="loading-spinner"></div>
                            <Text style={{ color: "var(--text-secondary)" }}>
                                Loading analytics data...
                            </Text>
                        </div>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div style={customStyles.pageContainer}>
                    <Alert
                        message="Error Loading Data"
                        description={error}
                        type="error"
                        showIcon
                        action={
                            <Button
                                size="small"
                                danger
                                icon={<ReloadOutlined />}
                                onClick={fetchAnalyticsData}
                            >
                                Retry
                            </Button>
                        }
                        style={{ marginBottom: "var(--spacing-6)" }}
                    />
                </div>
            </AdminLayout>
        );
    }

    if (!analyticsData) {
        return (
            <AdminLayout>
                <div style={customStyles.pageContainer}>
                    <Card style={customStyles.statsCard}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px",
                            }}
                        >
                            <Text style={{ color: "var(--text-secondary)" }}>
                                No analytics data available
                            </Text>
                        </div>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    const {
        overall,
        leaderboard,
        patientDemographics,
        statusDistribution,
        trends,
        specializationStats,
        locationStats,
    } = analyticsData;

    // Prepare data for charts
    const statusChartData = statusDistribution.map((item) => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count,
        color:
            item._id === "complete"
                ? "#00C49F"
                : item._id === "booked"
                    ? "#0088FE"
                    : "#FF8042",
    }));

    const trendsChartData = trends.map((item) => ({
        name: `Week ${item._id.week}`,
        total: item.totalAppointments,
        completed: item.completedAppointments,
        cancelled: item.cancelledAppointments,
    }));

    const specializationChartData = specializationStats.map((item) => ({
        name: item._id[0] || "Other",
        appointments: item.totalAppointments,
        completionRate: item.completionRate,
    }));

    return (
        <AdminLayout>
            <div style={customStyles.pageContainer}>
                {/* Header Section */}
                <Card style={customStyles.header}>
                    <div style={customStyles.headerContent}>
                        <div style={customStyles.headerLeft}>
                            <Title level={2} style={customStyles.title}>
                                <BarChartOutlined style={{ color: "var(--primary-color)" }} />
                                Appointment Analytics
                            </Title>
                            <Text style={customStyles.subtitle}>
                                Comprehensive overview of appointment statistics and performance
                                metrics
                            </Text>
                        </div>
                        <div style={customStyles.headerRight}>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={fetchAnalyticsData}
                                type="primary"
                                size="middle"
                            >
                                Refresh Data
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={customStyles.statsCard}>
                            <Statistic
                                title="Total Appointments"
                                value={overall?.totalAppointments || 0}
                                prefix={<CalendarOutlined style={{ color: "var(--info)" }} />}
                                valueStyle={{ color: "var(--primary-color)" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={customStyles.statsCard}>
                            <Statistic
                                title="Completed"
                                value={overall?.completedAppointments || 0}
                                prefix={
                                    <CheckCircleOutlined style={{ color: "var(--success)" }} />
                                }
                                valueStyle={{ color: "var(--success)" }}
                                suffix={
                                    <Text
                                        style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                                    >
                                        ({(overall?.completionRate || 0).toFixed(1)}%)
                                    </Text>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={customStyles.statsCard}>
                            <Statistic
                                title="Cancelled"
                                value={overall?.cancelledAppointments || 0}
                                prefix={
                                    <CloseCircleOutlined style={{ color: "var(--danger)" }} />
                                }
                                valueStyle={{ color: "var(--danger)" }}
                                suffix={
                                    <Text
                                        style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                                    >
                                        ({(overall?.cancellationRate || 0).toFixed(1)}%)
                                    </Text>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={customStyles.statsCard}>
                            <Statistic
                                title="Active Doctors"
                                value={overall?.doctorCount || 0}
                                prefix={
                                    <UserOutlined style={{ color: "var(--secondary-color)" }} />
                                }
                                valueStyle={{ color: "var(--secondary-color)" }}
                                suffix={
                                    <Text
                                        style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                                    >
                                        {overall?.patientCount || 0} patients
                                    </Text>
                                }
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Leaderboard Section */}
                <Card
                    style={customStyles.chartCard}
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Space>
                                <TrophyOutlined style={{ color: "var(--warning)" }} />
                                <Title
                                    level={4}
                                    style={{ margin: 0, color: "var(--text-primary)" }}
                                >
                                    Doctor Leaderboard (Top 10)
                                </Title>
                            </Space>
                            {leaderboard && leaderboard.length > 0 && (
                                <Button
                                    type="primary"
                                    onClick={() => setLeaderboardModalVisible(true)}
                                    style={{
                                        background: "var(--primary-color)",
                                        borderColor: "var(--primary-color)",
                                    }}
                                >
                                    View All Doctors
                                </Button>
                            )}
                        </div>
                    }
                >
                    {leaderboard && leaderboard.length > 0 ? (
                        <Table
                            dataSource={leaderboard.slice(0, 10)}
                            pagination={false}
                            rowKey="_id"
                            style={customStyles.table}
                            columns={[
                                {
                                    title: "Rank",
                                    dataIndex: "rank",
                                    key: "rank",
                                    width: 80,
                                    render: (_, record, index) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            {index === 0 && (
                                                <TrophyOutlined style={{ color: "#ffd700" }} />
                                            )}
                                            {index === 1 && (
                                                <TrophyOutlined style={{ color: "#c0c0c0" }} />
                                            )}
                                            {index === 2 && (
                                                <TrophyOutlined style={{ color: "#cd7f32" }} />
                                            )}
                                            <Text strong>#{index + 1}</Text>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Doctor",
                                    dataIndex: "doctorName",
                                    key: "doctorName",
                                    render: (name) => (
                                        <Text strong style={{ color: "var(--text-primary)" }}>
                                            {name || "N/A"}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Specialization",
                                    dataIndex: "specialization",
                                    key: "specialization",
                                    render: (specializations) => (
                                        <div>
                                            {specializations && specializations.length > 0 ? (
                                                <>
                                                    {specializations.slice(0, 2).map((spec, idx) => (
                                                        <Tag
                                                            key={idx}
                                                            color="blue"
                                                            style={{ marginBottom: "4px" }}
                                                        >
                                                            {spec}
                                                        </Tag>
                                                    ))}
                                                    {specializations.length > 2 && (
                                                        <Tag color="geekblue">
                                                            +{specializations.length - 2}
                                                        </Tag>
                                                    )}
                                                </>
                                            ) : (
                                                <Text
                                                    style={{
                                                        color: "var(--text-secondary)",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    No specialization
                                                </Text>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    title: "Total Appointments",
                                    dataIndex: "totalAppointments",
                                    key: "totalAppointments",
                                    align: "center",
                                    render: (count) => (
                                        <Text strong style={{ color: "var(--primary-color)" }}>
                                            {count || 0}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completed",
                                    dataIndex: "completedAppointments",
                                    key: "completedAppointments",
                                    align: "center",
                                    render: (count) => (
                                        <Text style={{ color: "var(--success)" }}>
                                            {count || 0}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completion Rate",
                                    dataIndex: "completionRate",
                                    key: "completionRate",
                                    align: "center",
                                    render: (rate) => {
                                        const actualRate = rate || 0;
                                        const color =
                                            actualRate >= 75
                                                ? "success"
                                                : actualRate >= 50
                                                    ? "warning"
                                                    : "error";
                                        return <Tag color={color}>{actualRate.toFixed(1)}%</Tag>;
                                    },
                                },
                            ]}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "200px",
                                color: "var(--text-secondary)",
                            }}
                        >
                            <TrophyOutlined
                                style={{
                                    fontSize: "48px",
                                    marginBottom: "16px",
                                    color: "var(--text-light)",
                                }}
                            />
                            <Text
                                style={{ fontSize: "16px", color: "var(--text-secondary)" }}
                            >
                                No doctor performance data available
                            </Text>
                            <Text
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-light)",
                                    marginTop: "8px",
                                }}
                            >
                                Leaderboard will appear when appointment data is available
                            </Text>
                        </div>
                    )}
                </Card>

                {/* Charts Section */}
                <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
                    {/* Status Distribution Chart */}
                    <Col xs={24} lg={12}>
                        <Card
                            style={customStyles.chartCard}
                            title={
                                <Space>
                                    <BarChartOutlined style={{ color: "var(--primary-color)" }} />
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "var(--text-primary)" }}
                                    >
                                        Appointment Status Distribution
                                    </Title>
                                </Space>
                            }
                        >
                            {statusChartData && statusChartData.length > 0 ? (
                                <div style={{ height: "350px" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name} ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {statusChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "350px",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    <BarChartOutlined
                                        style={{
                                            fontSize: "48px",
                                            marginBottom: "16px",
                                            color: "var(--text-light)",
                                        }}
                                    />
                                    <Text
                                        style={{ fontSize: "16px", color: "var(--text-secondary)" }}
                                    >
                                        No status distribution data available
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "14px",
                                            color: "var(--text-light)",
                                            marginTop: "8px",
                                        }}
                                    >
                                        Chart will appear when appointment status data is available
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* Trends Chart */}
                    <Col xs={24} lg={12}>
                        <Card
                            style={customStyles.chartCard}
                            title={
                                <Space>
                                    <CalendarOutlined style={{ color: "var(--info)" }} />
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "var(--text-primary)" }}
                                    >
                                        Weekly Trends
                                    </Title>
                                </Space>
                            }
                        >
                            {trendsChartData && trendsChartData.length > 0 ? (
                                <div style={{ height: "350px" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendsChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="total"
                                                stroke="var(--primary-color)"
                                                name="Total"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="completed"
                                                stroke="var(--success)"
                                                name="Completed"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="cancelled"
                                                stroke="var(--danger)"
                                                name="Cancelled"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "350px",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    <CalendarOutlined
                                        style={{
                                            fontSize: "48px",
                                            marginBottom: "16px",
                                            color: "var(--text-light)",
                                        }}
                                    />
                                    <Text
                                        style={{ fontSize: "16px", color: "var(--text-secondary)" }}
                                    >
                                        No weekly trends data available
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "14px",
                                            color: "var(--text-light)",
                                            marginTop: "8px",
                                        }}
                                    >
                                        Trends chart will appear when weekly appointment data is
                                        available
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Additional Statistics */}
                <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
                    {/* Patient Demographics */}
                    <Col xs={24} lg={12}>
                        <Card
                            style={customStyles.chartCard}
                            title={
                                <Space>
                                    <TeamOutlined style={{ color: "var(--secondary-color)" }} />
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "var(--text-primary)" }}
                                    >
                                        Patient Demographics
                                    </Title>
                                </Space>
                            }
                        >
                            {patientDemographics && patientDemographics.length > 0 ? (
                                <div style={{ padding: "16px 0" }}>
                                    {patientDemographics.map((demo, index) => (
                                        <div
                                            key={demo._id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "12px 16px",
                                                background:
                                                    index % 2 === 0
                                                        ? "var(--background-secondary)"
                                                        : "var(--background-primary)",
                                                borderRadius: "var(--radius)",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        borderRadius: "50%",
                                                        backgroundColor:
                                                            index === 0 ? "var(--info)" : "var(--warning)",
                                                    }}
                                                ></div>
                                                <Text strong style={{ color: "var(--text-primary)" }}>
                                                    {demo._id || "Unknown"}
                                                </Text>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <Text
                                                    style={{
                                                        color: "var(--primary-color)",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {demo.count || 0} patients
                                                </Text>
                                                <br />
                                                <Text
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    Avg age: {(demo.averageAge || 0).toFixed(1)}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "200px",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    <TeamOutlined
                                        style={{
                                            fontSize: "48px",
                                            marginBottom: "16px",
                                            color: "var(--text-light)",
                                        }}
                                    />
                                    <Text
                                        style={{ fontSize: "16px", color: "var(--text-secondary)" }}
                                    >
                                        No patient demographics data available
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "14px",
                                            color: "var(--text-light)",
                                            marginTop: "8px",
                                        }}
                                    >
                                        Demographics will appear when patient data is available
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* Top Specializations */}
                    <Col xs={24} lg={12}>
                        <Card
                            style={customStyles.chartCard}
                            title={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Space>
                                        <MedicineBoxOutlined style={{ color: "var(--success)" }} />
                                        <Title
                                            level={4}
                                            style={{ margin: 0, color: "var(--text-primary)" }}
                                        >
                                            Top 5 Specializations
                                        </Title>
                                    </Space>
                                    {specializationChartData &&
                                        specializationChartData.length > 0 && (
                                            <Button
                                                type="primary"
                                                onClick={() => setSpecializationsModalVisible(true)}
                                                style={{
                                                    background: "var(--primary-color)",
                                                    borderColor: "var(--primary-color)",
                                                }}
                                            >
                                                View All
                                            </Button>
                                        )}
                                </div>
                            }
                        >
                            {specializationChartData && specializationChartData.length > 0 ? (
                                <div style={{ padding: "16px 0" }}>
                                    {specializationChartData.slice(0, 5).map((spec, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "12px 16px",
                                                background:
                                                    index % 2 === 0
                                                        ? "var(--background-secondary)"
                                                        : "var(--background-primary)",
                                                borderRadius: "var(--radius)",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                }}
                                            >
                                                <MedicineBoxOutlined
                                                    style={{ color: "var(--primary-color)" }}
                                                />
                                                <Text strong style={{ color: "var(--text-primary)" }}>
                                                    {spec.name || "Unknown Specialization"}
                                                </Text>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <Text
                                                    style={{
                                                        color: "var(--primary-color)",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {spec.appointments || 0} appointments
                                                </Text>
                                                <br />
                                                <Text
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    {(spec.completionRate || 0).toFixed(1)}% completion
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "200px",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    <MedicineBoxOutlined
                                        style={{
                                            fontSize: "48px",
                                            marginBottom: "16px",
                                            color: "var(--text-light)",
                                        }}
                                    />
                                    <Text
                                        style={{ fontSize: "16px", color: "var(--text-secondary)" }}
                                    >
                                        No specialization data available
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "14px",
                                            color: "var(--text-light)",
                                            marginTop: "8px",
                                        }}
                                    >
                                        Top specializations will appear when doctor data is
                                        available
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Location Statistics */}
                <Card
                    style={customStyles.chartCard}
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Space>
                                <EnvironmentOutlined style={{ color: "var(--danger)" }} />
                                <Title
                                    level={4}
                                    style={{ margin: 0, color: "var(--text-primary)" }}
                                >
                                    Top 10 Location Performance
                                </Title>
                            </Space>
                            {locationStats && locationStats.length > 0 && (
                                <Button
                                    type="primary"
                                    onClick={() => setLocationModalVisible(true)}
                                    style={{
                                        background: "var(--primary-color)",
                                        borderColor: "var(--primary-color)",
                                    }}
                                >
                                    View All Locations
                                </Button>
                            )}
                        </div>
                    }
                >
                    {locationStats && locationStats.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {locationStats.slice(0, 10).map((location) => (
                                <Col xs={24} sm={12} lg={8} key={location._id}>
                                    <Card
                                        size="small"
                                        style={{
                                            background: "var(--background-secondary)",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: "var(--radius)",
                                        }}
                                        title={
                                            <Text
                                                strong
                                                style={{ color: "var(--text-primary)" }}
                                                ellipsis
                                            >
                                                {location._id || "Unknown Location"}
                                            </Text>
                                        }
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text style={{ color: "var(--text-secondary)" }}>
                                                    Total Appointments:
                                                </Text>
                                                <Text strong style={{ color: "var(--text-primary)" }}>
                                                    {location.totalAppointments || 0}
                                                </Text>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text style={{ color: "var(--text-secondary)" }}>
                                                    Completed:
                                                </Text>
                                                <Text strong style={{ color: "var(--success)" }}>
                                                    {location.completedAppointments || 0}
                                                </Text>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text style={{ color: "var(--text-secondary)" }}>
                                                    Doctors:
                                                </Text>
                                                <Text strong style={{ color: "var(--primary-color)" }}>
                                                    {location.doctorCount || 0}
                                                </Text>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text style={{ color: "var(--text-secondary)" }}>
                                                    Patients:
                                                </Text>
                                                <Text
                                                    strong
                                                    style={{ color: "var(--secondary-color)" }}
                                                >
                                                    {location.patientCount || 0}
                                                </Text>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text style={{ color: "var(--text-secondary)" }}>
                                                    Completion Rate:
                                                </Text>
                                                <Tag
                                                    color={
                                                        (location.completionRate || 0) >= 75
                                                            ? "success"
                                                            : (location.completionRate || 0) >= 50
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {(location.completionRate || 0).toFixed(1)}%
                                                </Tag>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "200px",
                                color: "var(--text-secondary)",
                            }}
                        >
                            <EnvironmentOutlined
                                style={{
                                    fontSize: "48px",
                                    marginBottom: "16px",
                                    color: "var(--text-light)",
                                }}
                            />
                            <Text
                                style={{ fontSize: "16px", color: "var(--text-secondary)" }}
                            >
                                No location performance data available
                            </Text>
                            <Text
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-light)",
                                    marginTop: "8px",
                                }}
                            >
                                Location statistics will appear when appointment data is
                                available
                            </Text>
                        </div>
                    )}
                </Card>
            </div>

            {/* All Doctors Leaderboard Modal */}
            <Modal
                title={
                    <Space>
                        <TrophyOutlined style={{ color: "var(--warning)" }} />
                        <Title
                            level={4}
                            style={{ margin: 0, color: "var(--text-primary)" }}
                        >
                            Complete Doctor Leaderboard
                        </Title>
                    </Space>
                }
                open={leaderboardModalVisible}
                onCancel={() => {
                    setLeaderboardModalVisible(false);
                    setLeaderboardSearchText("");
                }}
                footer={[
                    <Button
                        key="close"
                        onClick={() => {
                            setLeaderboardModalVisible(false);
                            setLeaderboardSearchText("");
                        }}
                        style={{
                            background: "var(--background-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                        }}
                    >
                        Close
                    </Button>,
                ]}
                width={1400}
                style={{ top: 20 }}
            >
                {leaderboard && leaderboard.length > 0 ? (
                    <div>
                        <div style={{ marginBottom: "16px" }}>
                            <Input
                                placeholder="Search doctors by name..."
                                prefix={
                                    <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                                }
                                value={leaderboardSearchText}
                                onChange={(e) => setLeaderboardSearchText(e.target.value)}
                                style={{
                                    background: "var(--background-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-primary)",
                                }}
                                size="large"
                            />
                        </div>
                        <Table
                            dataSource={leaderboard
                                .filter(
                                    (doctor) =>
                                        (doctor.doctorName || "")
                                            .toLowerCase()
                                            .includes(leaderboardSearchText.toLowerCase()) ||
                                        (doctor.specialization || []).some((spec) =>
                                            spec
                                                .toLowerCase()
                                                .includes(leaderboardSearchText.toLowerCase())
                                        )
                                )
                                .map((doctor, index) => ({
                                    key: doctor._id,
                                    rank: index + 1,
                                    doctorName: doctor.doctorName || "N/A",
                                    specialization: doctor.specialization || [],
                                    totalAppointments: doctor.totalAppointments || 0,
                                    completedAppointments: doctor.completedAppointments || 0,
                                    cancelledAppointments: doctor.cancelledAppointments || 0,
                                    completionRate: doctor.completionRate || 0,
                                    cancellationRate: doctor.cancellationRate || 0,
                                }))}
                            columns={[
                                {
                                    title: "Rank",
                                    dataIndex: "rank",
                                    key: "rank",
                                    width: 80,
                                    sorter: (a, b) => a.rank - b.rank,
                                    render: (rank, record, index) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            {index === 0 && (
                                                <TrophyOutlined style={{ color: "#ffd700" }} />
                                            )}
                                            {index === 1 && (
                                                <TrophyOutlined style={{ color: "#c0c0c0" }} />
                                            )}
                                            {index === 2 && (
                                                <TrophyOutlined style={{ color: "#cd7f32" }} />
                                            )}
                                            <Text strong>#{rank}</Text>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Doctor Name",
                                    dataIndex: "doctorName",
                                    key: "doctorName",
                                    sorter: (a, b) => a.doctorName.localeCompare(b.doctorName),
                                    render: (name) => (
                                        <Text strong style={{ color: "var(--text-primary)" }}>
                                            {name}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Specializations",
                                    dataIndex: "specialization",
                                    key: "specialization",
                                    render: (specializations) => (
                                        <div>
                                            {specializations && specializations.length > 0 ? (
                                                <>
                                                    {specializations.slice(0, 2).map((spec, idx) => (
                                                        <Tag
                                                            key={idx}
                                                            color="blue"
                                                            style={{ marginBottom: "4px" }}
                                                        >
                                                            {spec}
                                                        </Tag>
                                                    ))}
                                                    {specializations.length > 2 && (
                                                        <Tag color="geekblue">
                                                            +{specializations.length - 2}
                                                        </Tag>
                                                    )}
                                                </>
                                            ) : (
                                                <Text
                                                    style={{
                                                        color: "var(--text-secondary)",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    No specialization
                                                </Text>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    title: "Total Appointments",
                                    dataIndex: "totalAppointments",
                                    key: "totalAppointments",
                                    align: "center",
                                    sorter: (a, b) => a.totalAppointments - b.totalAppointments,
                                    render: (count) => (
                                        <Text strong style={{ color: "var(--primary-color)" }}>
                                            {count.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completed",
                                    dataIndex: "completedAppointments",
                                    key: "completedAppointments",
                                    align: "center",
                                    sorter: (a, b) =>
                                        a.completedAppointments - b.completedAppointments,
                                    render: (count) => (
                                        <Text style={{ color: "var(--success)" }}>
                                            {count.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Cancelled",
                                    dataIndex: "cancelledAppointments",
                                    key: "cancelledAppointments",
                                    align: "center",
                                    sorter: (a, b) =>
                                        a.cancelledAppointments - b.cancelledAppointments,
                                    render: (count) => (
                                        <Text style={{ color: "var(--danger)" }}>
                                            {count.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completion Rate",
                                    dataIndex: "completionRate",
                                    key: "completionRate",
                                    align: "center",
                                    sorter: (a, b) => a.completionRate - b.completionRate,
                                    render: (rate) => {
                                        const color =
                                            rate >= 75 ? "success" : rate >= 50 ? "warning" : "error";
                                        return <Tag color={color}>{rate.toFixed(1)}%</Tag>;
                                    },
                                },
                                {
                                    title: "Cancellation Rate",
                                    dataIndex: "cancellationRate",
                                    key: "cancellationRate",
                                    align: "center",
                                    sorter: (a, b) => a.cancellationRate - b.cancellationRate,
                                    render: (rate) => (
                                        <Text style={{ color: "var(--text-secondary)" }}>
                                            {rate.toFixed(1)}%
                                        </Text>
                                    ),
                                },
                            ]}
                            scroll={{ x: 1200 }}
                            pagination={{
                                pageSize: 20,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} doctors`,
                                style: {
                                    marginTop: "16px",
                                },
                            }}
                            style={{
                                background: "var(--background-primary)",
                                borderRadius: "var(--radius)",
                            }}
                            className="leaderboard-table"
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <TrophyOutlined
                            style={{
                                fontSize: "48px",
                                marginBottom: "16px",
                                color: "var(--text-light)",
                            }}
                        />
                        <Text style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                            No doctor data available
                        </Text>
                    </div>
                )}
            </Modal>

            {/* All Specializations Modal */}
            <Modal
                title={
                    <Space>
                        <MedicineBoxOutlined style={{ color: "var(--success)" }} />
                        <Title
                            level={4}
                            style={{ margin: 0, color: "var(--text-primary)" }}
                        >
                            All Specializations Statistics
                        </Title>
                    </Space>
                }
                open={specializationsModalVisible}
                onCancel={() => {
                    setSpecializationsModalVisible(false);
                    setSpecializationsSearchText("");
                }}
                footer={[
                    <Button
                        key="close"
                        onClick={() => {
                            setSpecializationsModalVisible(false);
                            setSpecializationsSearchText("");
                        }}
                        style={{
                            background: "var(--background-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                        }}
                    >
                        Close
                    </Button>,
                ]}
                width={1200}
                style={{ top: 20 }}
            >
                {specializationChartData && specializationChartData.length > 0 ? (
                    <div>
                        <div style={{ marginBottom: "16px" }}>
                            <Input
                                placeholder="Search specializations..."
                                prefix={
                                    <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                                }
                                value={specializationsSearchText}
                                onChange={(e) => setSpecializationsSearchText(e.target.value)}
                                style={{
                                    background: "var(--background-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-primary)",
                                }}
                                size="large"
                            />
                        </div>
                        <Table
                            dataSource={specializationChartData
                                .filter((spec) =>
                                    (spec.name || "")
                                        .toLowerCase()
                                        .includes(specializationsSearchText.toLowerCase())
                                )
                                .map((spec, index) => ({
                                    key: index,
                                    rank: index + 1,
                                    name: spec.name || "Unknown Specialization",
                                    appointments: spec.appointments || 0,
                                    completionRate: spec.completionRate || 0,
                                }))}
                            columns={[
                                {
                                    title: "Rank",
                                    dataIndex: "rank",
                                    key: "rank",
                                    width: 80,
                                    sorter: (a, b) => a.rank - b.rank,
                                    render: (rank) => (
                                        <Text strong style={{ color: "var(--text-primary)" }}>
                                            #{rank}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Specialization",
                                    dataIndex: "name",
                                    key: "name",
                                    sorter: (a, b) => a.name.localeCompare(b.name),
                                    render: (name) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                            }}
                                        >
                                            <MedicineBoxOutlined
                                                style={{ color: "var(--primary-color)" }}
                                            />
                                            <Text strong style={{ color: "var(--text-primary)" }}>
                                                {name}
                                            </Text>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Total Appointments",
                                    dataIndex: "appointments",
                                    key: "appointments",
                                    align: "center",
                                    sorter: (a, b) => a.appointments - b.appointments,
                                    render: (count) => (
                                        <Text strong style={{ color: "var(--primary-color)" }}>
                                            {count.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completion Rate",
                                    dataIndex: "completionRate",
                                    key: "completionRate",
                                    align: "center",
                                    sorter: (a, b) => a.completionRate - b.completionRate,
                                    render: (rate) => {
                                        const color =
                                            rate >= 75 ? "success" : rate >= 50 ? "warning" : "error";
                                        return <Tag color={color}>{rate.toFixed(1)}%</Tag>;
                                    },
                                },
                                {
                                    title: "Performance",
                                    key: "performance",
                                    align: "center",
                                    render: (_, record) => {
                                        const { appointments, completionRate } = record;
                                        if (appointments >= 50 && completionRate >= 80) {
                                            return <Tag color="gold">Excellent</Tag>;
                                        } else if (appointments >= 25 && completionRate >= 70) {
                                            return <Tag color="green">Good</Tag>;
                                        } else if (appointments >= 10 && completionRate >= 60) {
                                            return <Tag color="blue">Average</Tag>;
                                        } else {
                                            return <Tag color="orange">Needs Improvement</Tag>;
                                        }
                                    },
                                },
                            ]}
                            scroll={{ x: 800 }}
                            pagination={{
                                pageSize: 15,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} specializations`,
                                style: {
                                    marginTop: "16px",
                                },
                            }}
                            style={{
                                background: "var(--background-primary)",
                                borderRadius: "var(--radius)",
                            }}
                            className="specializations-table"
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <MedicineBoxOutlined
                            style={{
                                fontSize: "48px",
                                marginBottom: "16px",
                                color: "var(--text-light)",
                            }}
                        />
                        <Text style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                            No specialization data available
                        </Text>
                    </div>
                )}
            </Modal>

            {/* All Locations Modal */}
            <Modal
                title={
                    <Space>
                        <EnvironmentOutlined style={{ color: "var(--danger)" }} />
                        <Title
                            level={4}
                            style={{ margin: 0, color: "var(--text-primary)" }}
                        >
                            All Location Statistics
                        </Title>
                    </Space>
                }
                open={locationModalVisible}
                onCancel={() => {
                    setLocationModalVisible(false);
                    setLocationsSearchText("");
                }}
                footer={[
                    <Button
                        key="close"
                        onClick={() => {
                            setLocationModalVisible(false);
                            setLocationsSearchText("");
                        }}
                        style={{
                            background: "var(--background-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                        }}
                    >
                        Close
                    </Button>,
                ]}
                width={1200}
                style={{ top: 20 }}
            >
                {locationStats && locationStats.length > 0 ? (
                    <div>
                        <div style={{ marginBottom: "16px" }}>
                            <Input
                                placeholder="Search locations..."
                                prefix={
                                    <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                                }
                                value={locationsSearchText}
                                onChange={(e) => setLocationsSearchText(e.target.value)}
                                style={{
                                    background: "var(--background-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-primary)",
                                }}
                                size="large"
                            />
                        </div>
                        <Table
                            dataSource={locationStats
                                .filter((location) =>
                                    (location._id || "")
                                        .toLowerCase()
                                        .includes(locationsSearchText.toLowerCase())
                                )
                                .map((location, index) => ({
                                    key: index,
                                    location: location._id || "Unknown Location",
                                    totalAppointments: location.totalAppointments || 0,
                                    completedAppointments: location.completedAppointments || 0,
                                    doctorCount: location.doctorCount || 0,
                                    patientCount: location.patientCount || 0,
                                    completionRate: location.completionRate || 0,
                                }))}
                            columns={[
                                {
                                    title: "Location",
                                    dataIndex: "location",
                                    key: "location",
                                    sorter: (a, b) => a.location.localeCompare(b.location),
                                    render: (text) => (
                                        <Text strong style={{ color: "var(--text-primary)" }}>
                                            {text}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Total Appointments",
                                    dataIndex: "totalAppointments",
                                    key: "totalAppointments",
                                    sorter: (a, b) => a.totalAppointments - b.totalAppointments,
                                    render: (value) => (
                                        <Text style={{ color: "var(--text-primary)" }}>
                                            {value.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completed",
                                    dataIndex: "completedAppointments",
                                    key: "completedAppointments",
                                    sorter: (a, b) =>
                                        a.completedAppointments - b.completedAppointments,
                                    render: (value) => (
                                        <Text style={{ color: "var(--success)" }}>
                                            {value.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Doctors",
                                    dataIndex: "doctorCount",
                                    key: "doctorCount",
                                    sorter: (a, b) => a.doctorCount - b.doctorCount,
                                    render: (value) => (
                                        <Text style={{ color: "var(--primary-color)" }}>
                                            {value.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Patients",
                                    dataIndex: "patientCount",
                                    key: "patientCount",
                                    sorter: (a, b) => a.patientCount - b.patientCount,
                                    render: (value) => (
                                        <Text style={{ color: "var(--secondary-color)" }}>
                                            {value.toLocaleString()}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Completion Rate",
                                    dataIndex: "completionRate",
                                    key: "completionRate",
                                    sorter: (a, b) => a.completionRate - b.completionRate,
                                    render: (value) => (
                                        <Tag
                                            color={
                                                value >= 75
                                                    ? "success"
                                                    : value >= 50
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {value.toFixed(1)}%
                                        </Tag>
                                    ),
                                },
                            ]}
                            scroll={{ x: 800 }}
                            pagination={{
                                pageSize: 20,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} locations`,
                                style: {
                                    marginTop: "16px",
                                },
                            }}
                            style={{
                                background: "var(--background-primary)",
                                borderRadius: "var(--radius)",
                            }}
                            className="location-stats-table"
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <EnvironmentOutlined
                            style={{
                                fontSize: "48px",
                                marginBottom: "16px",
                                color: "var(--text-light)",
                            }}
                        />
                        <Text style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                            No location data available
                        </Text>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
};

export default AppointmentAnalytics;
