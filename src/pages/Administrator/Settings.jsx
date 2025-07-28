import React, { useState, useEffect, useRef } from "react";
import {
  Tabs,
  Form,
  Input,
  Switch,
  Select,
  Button,
  InputNumber,
  Card,
  message,
  TimePicker,
  Radio,
  Space,
  Modal,
  Alert,
  List,
  Avatar,
  Badge,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import '../../styles/Administrator/Settings.css';
import { useLocation } from "react-router-dom";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const AdminSettings = () => {
  const [form] = Form.useForm();
  const tabsRef = useRef(null);
  const location = useLocation();
  
  // Dummy notifications data - replace with your actual notifications
  const [notifications] = useState([
    {
      id: 1,
      title: "New Doctor Registration",
      description: "Dr. Sarah Smith has registered as a new doctor",
      type: "info",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      title: "System Update",
      description: "System maintenance scheduled for tonight",
      type: "warning",
      time: "5 hours ago",
      read: true
    },
    // Add more notifications as needed
  ]);

  // Handle URL params for direct navigation
  useEffect(() => {
    if (location.hash === '#notifications') {
      // Change to notifications tab and scroll into view
      setTimeout(() => {
        if (tabsRef.current) {
          tabsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const handleSave = (values) => {
    message.success("Settings updated successfully");
  };

  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");

  // States for password change
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [changePasswordStatus, setChangePasswordStatus] = useState({ type: '', message: '' });

  // Handle password change modal
  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
    setChangePasswordStatus({ type: '', message: '' });
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
    setChangePasswordStatus({ type: '', message: '' });
  };

  // Handle OTP modal
  const showOtpModal = () => {
    setIsOtpModalVisible(true);
    setIsPasswordModalVisible(false);
  };

  const handleOtpCancel = () => {
    setIsOtpModalVisible(false);
    otpForm.resetFields();
  };

  // Handle password change submission
  const handlePasswordSubmit = async (values) => {
    try {
      // Validate passwords match
      if (values.newPassword !== values.confirmPassword) {
        setChangePasswordStatus({
          type: 'error',
          message: 'New passwords do not match!'
        });
        return;
      }

      // TODO: Add API call to verify current password and send OTP
      
      // Show success and open OTP modal
      message.success('OTP sent to your email');
      showOtpModal();
    } catch (error) {
      setChangePasswordStatus({
        type: 'error',
        message: 'Failed to process password change request'
      });
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (values) => {
    try {
      // TODO: Add API call to verify OTP

      // Close modal and show success
      setIsOtpModalVisible(false);
      message.success('Password changed successfully');
      otpForm.resetFields();
    } catch (error) {
      message.error('Failed to verify OTP');
    }
  };

  // Update the Change Password button in the Account Settings tab
  const passwordChangeButton = (
    <Form.Item label="Change Password">
      <Button type="primary" onClick={showPasswordModal}>
        Change Password
      </Button>
    </Form.Item>
  );

  // Add Password Change Modal
  const passwordChangeModal = (
    <Modal
      title="Change Password"
      open={isPasswordModalVisible}
      onCancel={handlePasswordCancel}
      footer={null}
    >
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordSubmit}
      >
        {changePasswordStatus.message && (
          <Alert
            message={changePasswordStatus.message}
            type={changePasswordStatus.type}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter current password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter new password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Please confirm new password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  // Add OTP Verification Modal
  const otpVerificationModal = (
    <Modal
      title="OTP Verification"
      open={isOtpModalVisible}
      onCancel={handleOtpCancel}
      footer={null}
    >
      <Form
        form={otpForm}
        layout="vertical"
        onFinish={handleOtpSubmit}
      >
        <Form.Item
          label="Enter OTP"
          name="otp"
          rules={[
            { required: true, message: 'Please enter OTP' },
            { len: 6, message: 'OTP must be 6 digits' }
          ]}
        >
          <Input maxLength={6} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Verify OTP
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <AdminLayout>
      <div className="settings-container">
        <h1 className="settings-title">System Settings</h1>
        <Tabs 
          defaultActiveKey={location.hash === '#notifications' ? 'notifications' : 'account'}
          ref={tabsRef}
        >
          <TabPane tab={<span><UserOutlined />Account Settings</span>} key="account">
            <Card title="Profile Settings">
              <Form
                layout="vertical"
                initialValues={{
                  username: adminData.username || "",
                  email: adminData.email || "",
                }}
                onFinish={handleSave}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: "Username is required" }]}
                >
                  <Input prefix={<UserOutlined />} disabled />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email format" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                {passwordChangeButton}
                <Form.Item label="Two-Factor Authentication" name="2fa">
                  <Switch />
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                System
              </span>
            }
            key="system"
          >
            <Card title="System Configuration">
              <Form layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="System Timezone"
                  name="timezone"
                  initialValue="Asia/Kolkata"
                >
                  <Select>
                    <Option value="Asia/Kolkata">India (IST)</Option>
                    <Option value="UTC">UTC</Option>
                    <Option value="America/New_York">US Eastern</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Date Format"
                  name="dateFormat"
                  initialValue="DD/MM/YYYY"
                >
                  <Select>
                    <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                    <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Maintenance Mode" name="maintenance">
                  <Switch />
                </Form.Item>
                <Form.Item
                  label="System Language"
                  name="language"
                  initialValue="en"
                >
                  <Select>
                    <Option value="en">English</Option>
                    <Option value="hi">Hindi</Option>
                    <Option value="bn">Bengali</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Security
              </span>
            }
            key="security"
          >
            <Card title="Security Settings">
              <Form layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Session Timeout (minutes)"
                  name="sessionTimeout"
                  initialValue={30}
                >
                  <InputNumber min={5} max={120} />
                </Form.Item>
                <Form.Item
                  label="Maximum Login Attempts"
                  name="maxLoginAttempts"
                  initialValue={5}
                >
                  <InputNumber min={3} max={10} />
                </Form.Item>
                <Form.Item
                  label="Password Expiry (days)"
                  name="passwordExpiry"
                  initialValue={90}
                >
                  <InputNumber min={30} max={180} />
                </Form.Item>
                <Form.Item label="IP Whitelist" name="ipWhitelist">
                  <TextArea
                    placeholder="Enter IP addresses (one per line)"
                    rows={4}
                  />
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            }
            key="notifications"
          >
            <Card title="Notification Preferences">
              <Form layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Email Notifications"
                  name="emailNotifications"
                  initialValue={["system", "security"]}
                >
                  <Select mode="multiple">
                    <Option value="system">System Updates</Option>
                    <Option value="security">Security Alerts</Option>
                    <Option value="users">User Activities</Option>
                    <Option value="reports">Reports</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Push Notifications" name="pushEnabled">
                  <Switch defaultChecked />
                </Form.Item>
                <Form.Item
                  label="Notification Display Duration (seconds)"
                  name="displayDuration"
                  initialValue={5}
                >
                  <InputNumber min={3} max={10} />
                </Form.Item>
              </Form>
            </Card>

            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Recent Notifications</span>
                  <Badge count={notifications.filter(n => !n.read).length} />
                </div>
              }
              style={{ marginTop: 24 }}
            >
              <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: item.read ? '#d9d9d9' : 'var(--primary-color)'
                          }}
                          icon={<BellOutlined />}
                        />
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.title}</span>
                          <small style={{ color: 'var(--text-secondary)' }}>{item.time}</small>
                        </div>
                      }
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                User Management
              </span>
            }
            key="users"
          >
            <Card title="User Settings">
              <Form layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Default User Role"
                  name="defaultRole"
                  initialValue="user"
                >
                  <Select>
                    <Option value="user">User</Option>
                    <Option value="moderator">Moderator</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="User Registration"
                  name="registrationType"
                  initialValue="approval"
                >
                  <Radio.Group>
                    <Radio value="open">Open Registration</Radio>
                    <Radio value="approval">Requires Approval</Radio>
                    <Radio value="closed">Closed</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Verification Requirements"
                  name="verificationReqs"
                  initialValue={["email"]}
                >
                  <Select mode="multiple">
                    <Option value="email">Email Verification</Option>
                    <Option value="phone">Phone Verification</Option>
                    <Option value="document">Document Verification</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Content
              </span>
            }
            key="content"
          >
            <Card title="Content Settings">
              <Form layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Maximum File Upload Size (MB)"
                  name="maxFileSize"
                  initialValue={10}
                >
                  <InputNumber min={1} max={50} />
                </Form.Item>
                <Form.Item
                  label="Allowed File Types"
                  name="allowedTypes"
                  initialValue={["pdf", "doc", "jpg"]}
                >
                  <Select mode="multiple">
                    <Option value="pdf">PDF</Option>
                    <Option value="doc">DOC/DOCX</Option>
                    <Option value="jpg">JPG/JPEG</Option>
                    <Option value="png">PNG</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Content Approval Required" name="approvalReq">
                  <Switch defaultChecked />
                </Form.Item>
                <Form.Item
                  label="Auto-backup Frequency"
                  name="backupFreq"
                  initialValue="daily"
                >
                  <Select>
                    <Option value="hourly">Hourly</Option>
                    <Option value="daily">Daily</Option>
                    <Option value="weekly">Weekly</Option>
                    <Option value="monthly">Monthly</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </div>
      {passwordChangeModal}
      {otpVerificationModal}
    </AdminLayout>
  );
};

export default AdminSettings;
