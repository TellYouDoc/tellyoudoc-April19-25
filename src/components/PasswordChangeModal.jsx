import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

const PasswordChangeModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    form.validateFields(['currentPassword', 'newPassword', 'confirmPassword'])
      .then(values => {
        if (values.newPassword !== values.confirmPassword) {
          message.error('New passwords do not match');
          return;
        }
        
        setLoading(true);
        // Simulate API call to send OTP
        setTimeout(() => {
          setLoading(false);
          setOtpSent(true);
          setShowOtpInput(true);
          message.success('OTP sent to your email');
        }, 1000);
      })
      .catch(err => {
        console.error('Validation failed:', err);
      });
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        // Simulate API call to verify OTP and change password
        setTimeout(() => {
          setLoading(false);
          message.success('Password changed successfully');
          form.resetFields();
          setShowOtpInput(false);
          setOtpSent(false);
          onCancel();
        }, 1000);
      })
      .catch(err => {
        console.error('Validation failed:', err);
      });
  };

  return (
    <Modal
      title="Change Password"
      open={visible}
      onCancel={() => {
        form.resetFields();
        setShowOtpInput(false);
        setOtpSent(false);
        onCancel();
      }}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        {showOtpInput && (
          <Form.Item
            name="otp"
            label="OTP"
            rules={[
              { required: true, message: 'Please enter the OTP' },
              { len: 6, message: 'OTP must be 6 digits' }
            ]}
          >
            <Input 
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }}
            />
          </Form.Item>
        )}

        <Form.Item className="form-actions">
          {!showOtpInput ? (
            <Button
              type="primary"
              onClick={handleSendOTP}
              loading={loading}
            >
              Send OTP
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={() => setShowOtpInput(false)}>
                Back
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={!otpSent}
              >
                Change Password
              </Button>
              <Button
                onClick={handleSendOTP}
                loading={loading}
                disabled={!otpSent}
              >
                Resend OTP
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordChangeModal;
