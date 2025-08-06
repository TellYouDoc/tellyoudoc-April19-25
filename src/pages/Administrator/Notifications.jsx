import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  message,
  Typography,
  Space,
  Badge
} from 'antd';
import {
  SendOutlined,
  BellOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';
// import { apiService } from '../../services/api.jsx';
import '../../styles/Administrator/Notifications.css';
import AdminLayout from '../../components/AdminLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
    borderRadius: "var(--radius)",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  notificationCountBox: {
    background: "var(--background-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius)",
    padding: "16px 20px",
    minWidth: "120px",
    textAlign: "center",
    boxShadow: "var(--shadow-sm)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  notificationCountBoxHover: {
    boxShadow: "var(--shadow-md)",
    transform: "translateY(-2px)",
    borderColor: "var(--primary-color)",
  },
  countNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--primary-color)",
    marginBottom: "4px",
    display: "block",
  },
  countLabel: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "500",
  },
  formCard: {
    background: "var(--background-primary)",
    border: "var(--card-border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-sm)",
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  formSection: {
    marginBottom: "24px",
  },
  formItem: {
    marginBottom: "20px",
  },
  submitButton: {
    background: "var(--primary-color)",
    borderColor: "var(--primary-color)",
    color: "white",
    height: "44px",
    borderRadius: "var(--radius)",
    fontWeight: "500",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  submitButtonHover: {
    background: "var(--primary-dark)",
    borderColor: "var(--primary-dark)",
    transform: "translateY(-1px)",
    boxShadow: "var(--shadow-md)",
  }
};

const Notifications = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock data for notification counts - replace with actual API calls
  const [notificationCounts] = useState({
    doctor: 2,
    patient: 3
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post('/admin/notifications/send', {
      //   title: values.title,
      //   message: values.message,
      //   targetAudience: values.targetAudience,
      //   scheduledFor: values.scheduledFor,
      //   priority: values.priority || 'normal'
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      message.success('Notification sent successfully!');
      form.resetFields();
    } catch {
      message.error('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountBoxClick = (type) => {
    // TODO: Navigate to specific notification history or filter
    console.log(`Clicked ${type} notifications`);
  };

  return (
    <AdminLayout>
      <div style={customStyles.pageContainer} className="premium-scrollbar">
        <div style={customStyles.header}>
          <div style={customStyles.headerLeft}>
            <h1 style={customStyles.title}>
              <BellOutlined style={{ marginRight: 8, color: "var(--primary-color)" }} />
              Notifications
            </h1>
            <Text type="secondary">
              Send Firebase notifications to specific users or all users
            </Text>
          </div>
          <div style={customStyles.headerRight}>
            <div
              style={customStyles.notificationCountBox}
              className="notification-count-box doctor-count"
              onClick={() => handleCountBoxClick('doctor')}
            >
              <span style={customStyles.countNumber}>{notificationCounts.doctor}</span>
              <span style={customStyles.countLabel}>
                <UserOutlined style={{ marginRight: 4 }} />
                Doctor
              </span>
            </div>
            <div
              style={customStyles.notificationCountBox}
              className="notification-count-box patient-count"
              onClick={() => handleCountBoxClick('patient')}
            >
              <span style={customStyles.countNumber}>{notificationCounts.patient}</span>
              <span style={customStyles.countLabel}>
                <TeamOutlined style={{ marginRight: 4 }} />
                Patient
              </span>
            </div>
          </div>
        </div>

        <div style={customStyles.formCard} className="premium-card">
          <div style={customStyles.formSection}>
            <Text strong style={{ display: "block", marginBottom: "16px", fontSize: "16px" }}>
              Compose New Notification
            </Text>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                targetAudience: 'all',
                priority: 'normal'
              }}
              requiredMark="optional"
            >
              <Form.Item
                name="title"
                label="Notification Title"
                rules={[
                  { required: true, message: 'Please enter notification title' },
                  { max: 100, message: 'Title must be less than 100 characters' }
                ]}
                style={customStyles.formItem}
                tooltip="Enter a clear and concise title for the notification"
              >
                <Input
                  placeholder="Enter notification title"
                  prefix={<BellOutlined className="site-form-item-icon" />}
                  className="form-control-premium"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Notification Message"
                rules={[
                  { required: true, message: 'Please enter notification message' },
                  { max: 500, message: 'Message must be less than 500 characters' }
                ]}
                style={customStyles.formItem}
                tooltip="Provide detailed information for the notification"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter notification message"
                  showCount
                  maxLength={500}
                  className="form-control-premium"
                  style={{ resize: 'vertical' }}
                />
              </Form.Item>

              <Form.Item
                name="targetAudience"
                label="Target Audience"
                rules={[{ required: true, message: 'Please select target audience' }]}
                style={customStyles.formItem}
                tooltip="Choose who should receive this notification"
              >
                <Select
                  placeholder="Select target audience"
                  className="form-control-premium"
                  size="large"
                >
                  <Option value="all">All Users</Option>
                  <Option value="patients">Patients Only</Option>
                  <Option value="doctors">Doctors Only</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="priority"
                label="Priority Level"
                style={customStyles.formItem}
                tooltip="Set the priority level for this notification"
              >
                <Select
                  placeholder="Select priority"
                  className="form-control-premium"
                  size="large"
                >
                  <Option value="low">Low Priority</Option>
                  <Option value="normal">Normal Priority</Option>
                  <Option value="high">High Priority</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="scheduledFor"
                label="Schedule (Optional)"
                style={customStyles.formItem}
                tooltip="Leave empty to send immediately, or set a future date/time"
              >
                <Input
                  type="datetime-local"
                  placeholder="Leave empty to send immediately"
                  className="form-control-premium"
                  size="large"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: "32px", marginBottom: "0" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  size="large"
                  block
                  style={customStyles.submitButton}
                  className="btn-premium"
                >
                  {loading ? 'Sending Notification...' : 'Send Notification'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;