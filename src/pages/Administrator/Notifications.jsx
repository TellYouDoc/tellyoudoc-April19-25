import React, { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Table,
  Tag,
  Space,
  Modal,
  message,
  Radio,
  Card,
  Tooltip,
  Divider
} from 'antd';
import {
  BellOutlined,
  UserOutlined,
  UploadOutlined,
  SendOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  HistoryOutlined,
  MailOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/AdminLayout';
import dayjs from 'dayjs';
import '../../styles/Administrator/Notifications.css';
import { useLocation } from 'react-router-dom';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data for users
const mockUsers = [
  { id: 'USER001', name: 'John Doe', role: 'patient', lastActive: '2025-05-10T14:25:00', email: 'john.doe@example.com' },
  { id: 'USER002', name: 'Dr. Sarah Smith', role: 'doctor', lastActive: '2025-05-15T09:30:00', email: 'dr.smith@example.com' },
  { id: 'USER003', name: 'Michael Johnson', role: 'patient', lastActive: '2025-05-12T16:45:00', email: 'michael.j@example.com' },
  { id: 'USER004', name: 'Dr. Rajesh Kumar', role: 'doctor', lastActive: '2025-05-14T11:15:00', email: 'dr.kumar@example.com' },
  { id: 'USER005', name: 'Emily Wilson', role: 'patient', lastActive: '2025-05-16T13:20:00', email: 'emily.w@example.com' }
];

// Mock notification history
const mockNotificationHistory = [
  {
    id: 'NOT001',
    title: 'New Doctor Joined',
    content: 'We are pleased to welcome Dr. Emily Chen to our growing team of specialists!',
    sentAt: '2025-05-15T10:00:00',
    status: 'sent',
    targetedUsers: 'All Users',
    recipients: 1250,
    delivered: 1220,
    opened: 980,
    sentBy: 'Admin'
  },
  {
    id: 'NOT002',
    title: 'Scheduled Maintenance',
    content: 'Our system will be down for scheduled maintenance on May 20, 2025, from 2 AM to 4 AM EST.',
    sentAt: '2025-05-14T15:30:00',
    status: 'sent',
    targetedUsers: 'All Users',
    recipients: 1250,
    delivered: 1210,
    opened: 850,
    sentBy: 'System'
  },
  {
    id: 'NOT003',
    title: 'Your Appointment Reminder',
    content: 'This is a reminder that you have an appointment with Dr. Smith tomorrow at 10 AM.',
    sentAt: '2025-05-13T09:15:00',
    status: 'sent',
    targetedUsers: 'Selected Patients',
    recipients: 45,
    delivered: 45,
    opened: 42,
    sentBy: 'Admin'
  },
  {
    id: 'NOT004',
    title: 'New Feature Available',
    content: 'We have launched a new feature - video consultation! Try it now.',
    scheduledFor: '2025-05-20T09:00:00',
    status: 'scheduled',
    targetedUsers: 'All Users',
    recipients: 0,
    delivered: 0,
    opened: 0,
    sentBy: 'Admin'
  },
  {
    id: 'NOT005',
    title: 'Health Tip of the Week',
    content: 'Stay hydrated! Drinking enough water is crucial for your overall health and wellbeing.',
    sentAt: '2025-05-10T08:00:00',
    status: 'sent',
    targetedUsers: 'All Patients',
    recipients: 950,
    delivered: 940,
    opened: 720,
    sentBy: 'System'
  },
  {
    id: 'NOT006',
    title: 'Holiday Hours',
    content: 'We will be operating on reduced hours during the upcoming holiday on May 25.',
    scheduledFor: '2025-05-22T10:00:00',
    status: 'scheduled',
    targetedUsers: 'All Users',
    recipients: 0,
    delivered: 0,
    opened: 0,
    sentBy: 'Admin'
  }
];

// Mock email history
const mockEmailHistory = [
  {
    id: 'EMAIL001',
    subject: 'Welcome to TellYouDoc',
    content: 'Welcome to our healthcare platform...',
    sentAt: '2025-05-15T10:00:00',
    status: 'sent',
    to: 'john.doe@example.com',
    recipientType: 'manual',
    sentBy: 'Admin'
  },
  {
    id: 'EMAIL002',
    subject: 'Appointment Confirmation',
    content: 'Your appointment has been scheduled...',
    sentAt: '2025-05-14T15:30:00',
    status: 'sent',
    to: 'Selected Users (5)',
    recipientType: 'users',
    sentBy: 'System'
  }
];

// Status map for styling
const statusMap = {
  sent: { color: 'green', icon: <CheckCircleOutlined />, label: 'Sent' },
  scheduled: { color: 'blue', icon: <ClockCircleOutlined />, label: 'Scheduled' },
  failed: { color: 'red', icon: <CloseCircleOutlined />, label: 'Failed' },
  draft: { color: 'gray', icon: <InfoCircleOutlined />, label: 'Draft' }
};

function Notifications() {  const [mainTab, setMainTab] = useState('push');
  const [pushTab, setPushTab] = useState('compose');
  const [emailTab, setEmailTab] = useState('compose');
  const location = useLocation();
  const tabsRef = useRef(null);

  // Add auto-navigation support when coming from notification bell
  useEffect(() => {
    // Parse active tab from URL hash
    const hash = location.hash.replace('#', '');
    if (hash) {
      if (hash.startsWith('push-')) {
        setMainTab('push');
        setPushTab(hash.replace('push-', ''));
      } else if (hash.startsWith('email-')) {
        setMainTab('email');
        setEmailTab(hash.replace('email-', ''));
      }
    }

    // Scroll the tabs into view if specified
    if (tabsRef.current) {
      setTimeout(() => {
        tabsRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const [notificationForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduledTime, setScheduledTime] = useState(null);
  const [emailRecipientType, setEmailRecipientType] = useState('manual');

  // Load histories when component mounts
  useEffect(() => {
    fetchNotificationHistory();
    fetchEmailHistory();
  }, []);

  // Fetch notification history
  const fetchNotificationHistory = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      setTimeout(() => {
        setNotificationHistory(mockNotificationHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching notification history:', error);
      message.error('Failed to load notification history');
      setLoading(false);
    }
  };

  // Fetch email history
  const fetchEmailHistory = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setEmailHistory(mockEmailHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching email history:', error);
      message.error('Failed to load email history');
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (scheduleType === 'scheduled' && !scheduledTime) {
      message.error('Please select a scheduled time');
      return;
    }

    setLoading(true);
    
    // In a real app, this would be an API call to send or schedule the notification
    setTimeout(() => {
      const newNotification = {
        id: `NOT${Math.floor(1000 + Math.random() * 9000)}`,
        title: values.title,
        content: values.content,
        status: scheduleType === 'immediate' ? 'sent' : 'scheduled',
        targetedUsers: getTargetUserText(values),
        recipients: scheduleType === 'immediate' ? getEstimatedRecipients(values) : 0,
        delivered: scheduleType === 'immediate' ? getEstimatedDelivered(values) : 0,
        opened: scheduleType === 'immediate' ? getEstimatedOpened(values) : 0,
        sentBy: 'Admin'
      };

      if (scheduleType === 'immediate') {
        newNotification.sentAt = new Date().toISOString();
        message.success('Notification sent successfully!');
      } else {
        newNotification.scheduledFor = scheduledTime.toISOString();
        message.success('Notification scheduled successfully!');
      }

      setNotificationHistory([newNotification, ...notificationHistory]);
      notificationForm.resetFields();
      setImageUrl('');
      setScheduledTime(null);
      setScheduleType('immediate');
      setTargetType('all');
      setLoading(false);
      
      // Switch to history tab after sending/scheduling
      setPushTab('history');
    }, 1000);
  };

  // Handle email form submission
  const handleEmailSubmit = (values) => {
    setLoading(true);
    
    // In a real app, this would be an API call to send the email
    setTimeout(() => {
      const newEmail = {
        id: `EMAIL${Math.floor(1000 + Math.random() * 9000)}`,
        subject: values.subject,
        content: values.content,
        status: 'sent',
        to: emailRecipientType === 'manual' ? values.to : `Selected Users (${values.users?.length || 0})`,
        recipientType: emailRecipientType,
        sentAt: new Date().toISOString(),
        sentBy: 'Admin'
      };

      setEmailHistory([newEmail, ...emailHistory]);
      emailForm.resetFields();
      setLoading(false);
      message.success('Email sent successfully!');
      setEmailTab('history');
    }, 1000);
  };

  // Get estimated recipients based on targeting options
  const getEstimatedRecipients = (values) => {
    switch (targetType) {
      case 'all':
        return 1250; // Mock number of all users
      case 'role':
        return values.targetRole === 'patient' ? 950 : 300; // Mock numbers
      case 'specific':
        return (values.specificUsers || []).length;
      case 'conditions':
        return 500; // Mock number based on conditions
      default:
        return 0;
    }
  };

  // Get estimated deliveries (slightly less than recipients to simulate real-world scenarios)
  const getEstimatedDelivered = (values) => {
    return Math.floor(getEstimatedRecipients(values) * 0.98);
  };

  // Get estimated opens (significantly less than deliveries to simulate real-world scenarios)
  const getEstimatedOpened = (values) => {
    return Math.floor(getEstimatedDelivered(values) * 0.75);
  };

  // Get text representation of the targeted users
  const getTargetUserText = (values) => {
    switch (targetType) {
      case 'all':
        return 'All Users';
      case 'role':
        return values.targetRole === 'patient' ? 'All Patients' : 'All Doctors';
      case 'specific':
        return `Selected Users (${(values.specificUsers || []).length})`;
      case 'conditions':
        return 'Users Based on Conditions';
      default:
        return 'Unknown';
    }
  };

  // Handle image upload
  const handleImageUpload = ({ fileList }) => {
    if (fileList.length > 0) {
      // In a real app, this would be an API call to upload the image
      const file = fileList[0];
      // Mock image URL (in a real app, this would be the URL returned from the server)
      setImageUrl('https://example.com/mock-image.jpg');
      message.success('Image uploaded successfully');
    } else {
      setImageUrl('');
    }
  };

  // View notification details
  const handleViewDetails = (record) => {
    setSelectedNotification(record);
    setPreviewVisible(true);
  };

  // Delete notification (only for scheduled notifications)
  const handleDeleteNotification = (record) => {
    Modal.confirm({
      title: 'Cancel Scheduled Notification',
      content: 'Are you sure you want to cancel this scheduled notification?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // In a real app, this would be an API call to delete the notification
        setNotificationHistory(notificationHistory.filter(n => n.id !== record.id));
        message.success('Scheduled notification cancelled');
      }
    });
  };

  // Render the target users section
  const renderTargetUsersSection = () => {
    switch (targetType) {
      case 'all':
        return (
          <div className="all-users-section">
            <p>This notification will be sent to all users (estimated 1,250 recipients).</p>
          </div>
        );
      case 'role':
        return (
          <Form.Item name="targetRole" label="Select User Role" rules={[{ required: true, message: 'Please select a user role' }]}>
            <Radio.Group>
              <Radio.Button value="patient">All Patients</Radio.Button>
              <Radio.Button value="doctor">All Doctors</Radio.Button>
            </Radio.Group>
          </Form.Item>
        );
      case 'specific':
        return (
          <Form.Item name="specificUsers" label="Select Specific Users" rules={[{ required: true, message: 'Please select at least one user' }]}>
            <Select
              mode="multiple"
              placeholder="Search and select users"
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {mockUsers.map(user => (
                <Option key={user.id} value={user.id}>{user.name} ({user.role})</Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'conditions':
        return (
          <>
            <Form.Item name="userActivity" label="User Activity">
              <Select defaultValue="any">
                <Option value="any">Any activity level</Option>
                <Option value="active">Active in the last 7 days</Option>
                <Option value="inactive">Inactive for more than 30 days</Option>
              </Select>
            </Form.Item>
            <Form.Item name="userProperties" label="User Properties">
              <Select mode="multiple" placeholder="Select properties">
                <Option value="has_appointments">Has Upcoming Appointments</Option>
                <Option value="completed_profile">Completed Profile</Option>
                <Option value="new_user">New Users (30 days)</Option>
              </Select>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  // Columns for the notification history table
  const historyColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="notification-time">
            {record.sentAt ? `Sent: ${dayjs(record.sentAt).format('MMM DD, YYYY HH:mm')}` : 
            `Scheduled: ${dayjs(record.scheduledFor).format('MMM DD, YYYY HH:mm')}`}
          </div>
        </div>
      )
    },
    {
      title: 'Target',
      dataIndex: 'targetedUsers',
      key: 'targetedUsers',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className="notification-status">
          <span className="notification-status-icon">{statusMap[status].icon}</span>
          <Tag color={statusMap[status].color}>
            {statusMap[status].label}
          </Tag>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      width: 120,
      render: (text, record) => (
        <div>
          <div>{text.toLocaleString()}</div>
          {record.status === 'sent' && (
            <div className="notification-recipients">
              {record.opened.toLocaleString()} opened ({Math.round((record.opened / record.delivered) * 100)}%)
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {record.status === 'scheduled' && (
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteNotification(record)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Columns for the email history table
  const emailHistoryColumns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="email-time">
            {dayjs(record.sentAt).format('MMM DD, YYYY HH:mm')}
          </div>
        </div>
      )
    },
    {
      title: 'Recipients',
      dataIndex: 'to',
      key: 'to',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusMap[status].color}>
          {statusMap[status].label}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View
        </Button>
      ),
    },
  ];

  // Preview the notification before sending
  const previewNotification = () => {
    try {
      // Validate form fields first
      notificationForm.validateFields()
        .then(values => {
          setPreviewVisible(true);
          setSelectedNotification({
            ...values,
            status: 'preview',
            imageUrl
          });
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    } catch (error) {
      message.error('Please complete all required fields before preview');
    }
  };

  // Render notification details for preview modal
  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;
    
    const isPreview = selectedNotification.status === 'preview';
    const notification = {
      ...selectedNotification,
      sentAt: selectedNotification.sentAt || new Date().toISOString(),
      scheduledFor: selectedNotification.scheduledFor || (scheduledTime ? scheduledTime.toISOString() : null)
    };

    return (
      <div className="notification-preview">
        <div className="notification-preview-title">
          {notification.title}
        </div>
        
        {(notification.imageUrl || (!isPreview && selectedNotification.imageUrl)) && (
          <img 
            src={notification.imageUrl || selectedNotification.imageUrl} 
            alt="Notification" 
            className="notification-preview-image" 
          />
        )}
        
        <div className="notification-preview-content">
          {notification.content}
        </div>
        
        <div className="notification-preview-metadata">
          {notification.status !== 'preview' ? (
            <div>
              {notification.status === 'sent' 
                ? `Sent on ${dayjs(notification.sentAt).format('MMM DD, YYYY HH:mm')}` 
                : `Scheduled for ${dayjs(notification.scheduledFor).format('MMM DD, YYYY HH:mm')}`}
            </div>
          ) : scheduleType === 'immediate' ? (
            <div>Will be sent immediately</div>
          ) : (
            <div>Will be sent on {scheduledTime ? scheduledTime.format('MMM DD, YYYY HH:mm') : 'selected date'}</div>
          )}
        </div>
        
        {!isPreview && (
          <div style={{ marginTop: '20px' }}>
            <Divider />
            <p><strong>Target Users:</strong> {notification.targetedUsers}</p>
            
            {notification.status === 'sent' && (
              <>
                <p><strong>Recipients:</strong> {notification.recipients.toLocaleString()}</p>
                <p><strong>Delivered:</strong> {notification.delivered.toLocaleString()}</p>
                <p><strong>Opened:</strong> {notification.opened.toLocaleString()} ({Math.round((notification.opened / notification.delivered) * 100)}%)</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-notifications-container">
        <div className="admin-notifications-header">
          <div className="admin-notifications-title">
            <h1>Notifications Management</h1>
            <p>Manage push notifications and emails</p>
          </div>
        </div>

        <div className="admin-notifications-content">
          <Tabs activeKey={mainTab} onChange={setMainTab}>
            <TabPane 
              tab={
                <span>
                  <BellOutlined /> Push Notifications
                </span>
              } 
              key="push"
            >
              <Tabs activeKey={pushTab} onChange={setPushTab} ref={tabsRef}>
                <TabPane 
                  tab={
                    <span>
                      <SendOutlined /> Compose Notification
                    </span>
                  } 
                  key="compose"
                >
                  {/* Compose Notification Form */}
                  <Form
                    form={notificationForm}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="compose-notification-form"
                  >
                    <Card title={<><BellOutlined /> Notification Content</>} bordered={false}>
                      <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter a notification title' }]}
                      >
                        <Input placeholder="Enter notification title" maxLength={100} />
                      </Form.Item>
                      
                      <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please enter notification content' }]}
                      >
                        <TextArea 
                          placeholder="Enter notification content" 
                          autoSize={{ minRows: 3, maxRows: 6 }}
                          maxLength={500}
                          showCount
                        />
                      </Form.Item>
                      
                      <Form.Item
                        name="image"
                        label="Notification Image (Optional)"
                      >
                        <Upload
                          listType="picture"
                          maxCount={1}
                          onChange={handleImageUpload}
                          beforeUpload={() => false} // Prevent actual upload, we'd handle it in handleImageUpload
                        >
                          <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                      </Form.Item>
                    </Card>

                    {/* Target Users Section */}
                    <Card 
                      title={<><UsergroupAddOutlined /> Target Users</>} 
                      className="target-users-section" 
                      bordered={false}
                    >
                      <Form.Item 
                        name="targetType" 
                        label="Send To"
                        initialValue="all"
                      >
                        <Radio.Group 
                          value={targetType} 
                          onChange={e => setTargetType(e.target.value)}
                          className="section-radio-group"
                          buttonStyle="solid"
                        >
                          <Space size="middle" wrap>
                            <Radio.Button value="all">
                              <TeamOutlined /> All Users
                            </Radio.Button>
                            <Radio.Button value="role">
                              <UserOutlined /> By Role
                            </Radio.Button>
                            <Radio.Button value="specific">
                              <UsergroupAddOutlined /> Specific Users
                            </Radio.Button>
                            <Radio.Button value="conditions">
                              <InfoCircleOutlined /> By Conditions
                            </Radio.Button>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                      {renderTargetUsersSection()}
                    </Card>

                    {/* Schedule Section */}
                    <Card 
                      title={<><ScheduleOutlined /> Delivery Schedule</>} 
                      className="schedule-section"
                      bordered={false}
                    >
                      <Form.Item 
                        name="scheduleType" 
                        label="When to Send"
                        initialValue="immediate"
                      >
                        <Radio.Group 
                          value={scheduleType} 
                          onChange={e => setScheduleType(e.target.value)}
                          className="section-radio-group"
                          buttonStyle="solid"
                        >
                          <Space size="middle">
                            <Radio.Button value="immediate">
                              <SendOutlined /> Send Immediately
                            </Radio.Button>
                            <Radio.Button value="scheduled">
                              <CalendarOutlined /> Schedule for Later
                            </Radio.Button>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                      
                      {scheduleType === 'scheduled' && (
                        <Form.Item
                          name="scheduledTime"
                          label="Select Date & Time"
                          rules={[{ required: true, message: 'Please select a date and time' }]}
                        >
                          <DatePicker 
                            showTime 
                            format="YYYY-MM-DD HH:mm" 
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            onChange={setScheduledTime}
                          />
                        </Form.Item>
                      )}
                    </Card>

                    <div className="form-actions">
                      <Button onClick={() => notificationForm.resetFields()}>
                        Clear
                      </Button>
                      <Button onClick={previewNotification}>
                        Preview
                      </Button>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        {scheduleType === 'immediate' ? 'Send Now' : 'Schedule'}
                      </Button>
                    </div>
                  </Form>
                </TabPane>
                
                <TabPane 
                  tab={
                    <span>
                      <HistoryOutlined /> Notification History
                    </span>
                  } 
                  key="history"
                >
                  {/* Notification History Table */}
                  {loading ? (
                    <div className="loading-message">Loading...</div>
                  ) : (
                    <Table 
                      columns={historyColumns} 
                      dataSource={notificationHistory} 
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  )}
                </TabPane>
              </Tabs>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <MailOutlined /> Email Notifications
                </span>
              } 
              key="email"
            >
              <Tabs activeKey={emailTab} onChange={setEmailTab}>
                <TabPane 
                  tab={
                    <span>
                      <SendOutlined /> Compose Email
                    </span>
                  } 
                  key="compose"
                >
                  <Form
                    form={emailForm}
                    layout="vertical"
                    onFinish={handleEmailSubmit}
                    className="compose-email-form"
                  >
                    <Card title={<><MailOutlined /> Email Content</>} bordered={false}>
                      <Form.Item
                        name="recipientType"
                        label="Send To"
                        initialValue="manual"
                      >
                        <Radio.Group 
                          value={emailRecipientType} 
                          onChange={e => setEmailRecipientType(e.target.value)}
                          className="section-radio-group"
                          buttonStyle="solid"
                        >
                          <Space size="middle">
                            <Radio.Button value="manual">
                              <MailOutlined /> Manual Email
                            </Radio.Button>
                            <Radio.Button value="users">
                              <TeamOutlined /> Select Users
                            </Radio.Button>
                          </Space>
                        </Radio.Group>
                      </Form.Item>

                      {emailRecipientType === 'manual' ? (
                        <Form.Item
                          name="to"
                          label="Recipient Email"
                          rules={[
                            { required: true, message: 'Please enter recipient email' },
                            { type: 'email', message: 'Please enter a valid email' }
                          ]}
                        >
                          <Input placeholder="Enter recipient email" />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          name="users"
                          label="Select Recipients"
                          rules={[{ required: true, message: 'Please select at least one recipient' }]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Search and select users"
                            style={{ width: '100%' }}
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {mockUsers.map(user => (
                              <Option key={user.id} value={user.id}>{user.name} ({user.email})</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                      
                      <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[{ required: true, message: 'Please enter email subject' }]}
                      >
                        <Input placeholder="Enter email subject" maxLength={200} />
                      </Form.Item>
                      
                      <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please enter email content' }]}
                      >
                        <TextArea 
                          placeholder="Enter email content" 
                          autoSize={{ minRows: 6, maxRows: 12 }}
                          maxLength={5000}
                          showCount
                        />
                      </Form.Item>
                      
                      <Form.Item
                        name="attachments"
                        label="Attachments (Optional)"
                      >
                        <Upload
                          listType="text"
                          multiple
                          maxCount={5}
                          beforeUpload={() => false}
                        >
                          <Button icon={<UploadOutlined />}>Add Attachments</Button>
                        </Upload>
                      </Form.Item>
                    </Card>

                    <div className="form-actions">
                      <Button onClick={() => emailForm.resetFields()}>
                        Clear
                      </Button>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Send Email
                      </Button>
                    </div>
                  </Form>
                </TabPane>
                
                <TabPane 
                  tab={
                    <span>
                      <HistoryOutlined /> Email History
                    </span>
                  } 
                  key="history"
                >
                  {loading ? (
                    <div className="loading-message">Loading...</div>
                  ) : (
                    <Table 
                      columns={emailHistoryColumns} 
                      dataSource={emailHistory} 
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  )}
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </div>

        {/* Preview Modal */}
        <Modal
          title="Notification Preview"
          visible={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={600}
        >
          {renderNotificationDetails()}
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default Notifications;