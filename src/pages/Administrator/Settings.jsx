import React, { useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Card,
  message,
  Modal,
  Alert,
  Steps,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import '../../styles/Administrator/Settings.css';

const { TabPane } = Tabs;

const AdminSettings = () => {

  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");

  // States for merged password change modal
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [passwordForm] = Form.useForm();
  const [changePasswordStatus, setChangePasswordStatus] = useState({ type: '', message: '' });

  // Handle password change modal
  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
    setCurrentStep(0);
    setChangePasswordStatus({ type: '', message: '' });
    passwordForm.resetFields();
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
    setCurrentStep(0);
    passwordForm.resetFields();
    setChangePasswordStatus({ type: '', message: '' });
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

      // Show success and move to OTP step
      message.success('OTP sent to your email');
      setCurrentStep(1);
      setChangePasswordStatus({ type: '', message: '' });
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
      setIsPasswordModalVisible(false);
      setCurrentStep(0);
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to verify OTP');
    }
  };

  // Steps configuration
  const steps = [
    {
      title: 'Change Password',
      icon: <LockOutlined />,
    },
    {
      title: 'OTP Verification',
      icon: <SafetyOutlined />,
    },
  ];

  return (
    <AdminLayout>
      <div className="settings-container">
        <h1 className="settings-title">System Settings</h1>
        <Tabs defaultActiveKey="account">
          <TabPane tab={<span><UserOutlined />Account Settings</span>} key="account">
            <Card title="Profile Settings">
              <Form
                layout="vertical"
                initialValues={{
                  username: adminData.username || "",
                  email: adminData.email || "",
                }}
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
                <Form.Item label="Change Password">
                  <Button type="primary" onClick={showPasswordModal}>
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Merged Password Change and OTP Modal */}
      <Modal
        title={
          <div style={{ paddingRight: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <Steps current={currentStep} size="small">
                {steps.map((step, index) => (
                  <Steps.Step key={index} title={step.title} icon={step.icon} />
                ))}
              </Steps>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              {currentStep === 0 ? "Change Password" : "OTP Verification"}
            </div>
          </div>
        }
        open={isPasswordModalVisible}
        onCancel={handlePasswordCancel}
        footer={null}
        width={500}
        closable={true}
      >
        {currentStep === 0 ? (
          // Password Change Step
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
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        ) : (
          // OTP Verification Step
          <Form
            layout="vertical"
            onFinish={handleOtpSubmit}
          >
            <div style={{ marginBottom: 16 }}>
              <Alert
                message="OTP Sent"
                description="We've sent a 6-digit OTP to your email address. Please enter it below to complete the password change."
                type="info"
                showIcon
              />
            </div>
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
                Verify OTP & Change Password
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                onClick={() => {
                  setCurrentStep(0);
                  setChangePasswordStatus({ type: '', message: '' });
                }}
                block
              >
                ← Back to Password Change
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminSettings;
