# KYC Admin Panel - Frontend Developer Guide

## Overview
Complete JavaScript/React developer guide for building KYC admin panel with both management and monitoring capabilities.

## API Base URL
```javascript
const API_BASE = "/api/v1/admin/kyc";
```

## Authentication
```javascript
const headers = {
  'Authorization': `Bearer ${adminToken}`,
  'Content-Type': 'application/json'
};
```

---

## 📋 KYC Management APIs

### 1. KYC Overview Dashboard
```javascript
// GET /api/v1/admin/kyc/overview
const fetchKycOverview = async () => {
  const response = await fetch(`${API_BASE}/overview`, { headers });
  return await response.json();
};

// Response Structure:
{
  success: true,
  data: {
    totalDoctors: 1500,
    pendingVerifications: 45,
    approvedDoctors: 1200,
    rejectedDoctors: 255,
    verificationInProgress: 12
  }
}
```

### 2. Get Pending KYC Records
```javascript
// GET /api/v1/admin/kyc/pending?page=1&limit=10
const fetchPendingKyc = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE}/pending?page=${page}&limit=${limit}`, { headers });
  return await response.json();
};

// Response includes pagination and doctor records
```

### 3. Get All KYC Records
```javascript
// GET /api/v1/admin/kyc/all?page=1&limit=10&status=pending
const fetchAllKyc = async (page = 1, limit = 10, status = '') => {
  let url = `${API_BASE}/all?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  
  const response = await fetch(url, { headers });
  return await response.json();
};
```

### 4. Get Doctor KYC Details
```javascript
// GET /api/v1/admin/kyc/:doctorId
const fetchDoctorKyc = async (doctorId) => {
  const response = await fetch(`${API_BASE}/${doctorId}`, { headers });
  return await response.json();
};

// Returns complete doctor profile with verification data
```

### 5. Approve KYC
```javascript
// POST /api/v1/admin/kyc/:doctorId/approve
const approveKyc = async (doctorId, adminNotes, adminId) => {
  const response = await fetch(`${API_BASE}/${doctorId}/approve`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      adminNotes,
      adminId
    })
  });
  return await response.json();
};

// Usage:
// approveKyc('doctor123', 'All documents verified', 'admin456');
```

### 6. Reject KYC
```javascript
// POST /api/v1/admin/kyc/:doctorId/reject
const rejectKyc = async (doctorId, reason, adminNotes, adminId) => {
  const response = await fetch(`${API_BASE}/${doctorId}/reject`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      reason,
      adminNotes,
      adminId
    })
  });
  return await response.json();
};

// Usage:
// rejectKyc('doctor123', 'Invalid license', 'License expired', 'admin456');
```

### 7. Request Additional Information
```javascript
// POST /api/v1/admin/kyc/:doctorId/request-additional-info
const requestAdditionalInfo = async (doctorId, requiredFields, message, adminId) => {
  const response = await fetch(`${API_BASE}/${doctorId}/request-additional-info`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      requiredFields,
      message,
      adminId
    })
  });
  return await response.json();
};

// Usage:
// requestAdditionalInfo('doctor123', ['medical_license'], 'Upload clearer image', 'admin456');
```

### 8. Retry Verification
```javascript
// POST /api/v1/admin/kyc/:doctorId/retry-verification
const retryVerification = async (doctorId, adminId) => {
  const response = await fetch(`${API_BASE}/${doctorId}/retry-verification`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ adminId })
  });
  return await response.json();
};
```

### 9. Bulk Approve
```javascript
// POST /api/v1/admin/kyc/bulk/approve
const bulkApprove = async (doctorIds, adminNotes, adminId) => {
  const response = await fetch(`${API_BASE}/bulk/approve`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      doctorIds,
      adminNotes,
      adminId
    })
  });
  return await response.json();
};

// Usage:
// bulkApprove(['doc1', 'doc2'], 'Batch verification', 'admin456');
```

---

## 📊 KYC Monitoring APIs

### 1. KYC Statistics
```javascript
// GET /api/v1/admin/kyc/monitoring/statistics
const fetchKycStatistics = async () => {
  const response = await fetch(`${API_BASE}/monitoring/statistics`, { headers });
  return await response.json();
};

// Response includes comprehensive stats
```

### 2. KYC Trends
```javascript
// GET /api/v1/admin/kyc/monitoring/trends?period=7d
const fetchKycTrends = async (period = '7d') => {
  const response = await fetch(`${API_BASE}/monitoring/trends?period=${period}`, { headers });
  return await response.json();
};
```

### 3. Performance Metrics
```javascript
// GET /api/v1/admin/kyc/monitoring/performance
const fetchPerformanceMetrics = async () => {
  const response = await fetch(`${API_BASE}/monitoring/performance`, { headers });
  return await response.json();
};
```

### 4. Error Analysis
```javascript
// GET /api/v1/admin/kyc/monitoring/errors?limit=50
const fetchKycErrors = async (limit = 50) => {
  const response = await fetch(`${API_BASE}/monitoring/errors?limit=${limit}`, { headers });
  return await response.json();
};
```

### 5. System Health
```javascript
// GET /api/v1/admin/kyc/monitoring/health
const fetchSystemHealth = async () => {
  const response = await fetch(`${API_BASE}/monitoring/health`, { headers });
  return await response.json();
};
```

### 6. Monitoring Report
```javascript
// GET /api/v1/admin/kyc/monitoring/report?startDate=2023-01-01&endDate=2023-12-31
const fetchMonitoringReport = async (startDate, endDate) => {
  const response = await fetch(`${API_BASE}/monitoring/report?startDate=${startDate}&endDate=${endDate}`, { headers });
  return await response.json();
};
```

### 7. Real-time Metrics
```javascript
// GET /api/v1/admin/kyc/monitoring/metrics
const fetchRealTimeMetrics = async () => {
  const response = await fetch(`${API_BASE}/monitoring/metrics`, { headers });
  return await response.json();
};
```

---

## 🔧 React Components Examples

### KYC Management Dashboard
```javascript
function KycDashboard() {
  const [overview, setOverview] = useState(null);
  const [pendingRecords, setPendingRecords] = useState([]);
  
  useEffect(() => {
    fetchKycOverview().then(setOverview);
    fetchPendingKyc().then(data => setPendingRecords(data.records));
  }, []);

  const handleApprove = async (doctorId) => {
    await approveKyc(doctorId, 'Approved by admin', 'admin123');
    // Refresh data
    fetchPendingKyc().then(data => setPendingRecords(data.records));
  };

  const handleReject = async (doctorId, reason) => {
    await rejectKyc(doctorId, reason, 'Rejected by admin', 'admin123');
    // Refresh data
    fetchPendingKyc().then(data => setPendingRecords(data.records));
  };

  return (
    <div>
      {overview && (
        <div className="overview-cards">
          <div>Pending: {overview.data.pendingVerifications}</div>
          <div>Approved: {overview.data.approvedDoctors}</div>
          <div>Rejected: {overview.data.rejectedDoctors}</div>
        </div>
      )}
      
      <div className="pending-records">
        {pendingRecords.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p>Status: {doctor.kycStatus}</p>
            <button onClick={() => handleApprove(doctor.id)}>
              Approve
            </button>
            <button onClick={() => handleReject(doctor.id, 'Invalid docs')}>
              Reject
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### KYC Doctor Details Modal
```javascript
function DoctorKycModal({ doctorId, onClose }) {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorKyc(doctorId)
      .then(data => {
        setDoctorData(data);
        setLoading(false);
      });
  }, [doctorId]);

  const handleRequestInfo = async () => {
    await requestAdditionalInfo(
      doctorId, 
      ['medical_license'], 
      'Please upload clearer image',
      'admin123'
    );
    onClose();
  };

  const handleRetryVerification = async () => {
    await retryVerification(doctorId, 'admin123');
    onClose();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>KYC Details: {doctorData.doctor.name}</h2>
        
        <div className="verification-status">
          <p>Status: {doctorData.kycStatus}</p>
          <p>IDFY Status: {doctorData.idfyVerification?.status}</p>
          <p>Aadhaar Status: {doctorData.aadhaarVerification?.status}</p>
        </div>

        <div className="actions">
          <button onClick={handleRequestInfo}>
            Request Additional Info
          </button>
          <button onClick={handleRetryVerification}>
            Retry Verification
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
```

### KYC Monitoring Dashboard
```javascript
function KycMonitoringDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    // Load monitoring data
    fetchKycStatistics().then(setStatistics);
    fetchKycTrends('7d').then(setTrends);
    fetchSystemHealth().then(setHealth);
  }, []);

  return (
    <div>
      <h2>KYC Monitoring Dashboard</h2>
      
      {statistics && (
        <div className="stats-grid">
          <div>Total Processed: {statistics.data.totalProcessed}</div>
          <div>Success Rate: {statistics.data.successRate}%</div>
          <div>Avg Processing Time: {statistics.data.avgProcessingTime}s</div>
        </div>
      )}

      {health && (
        <div className="health-status">
          <h3>System Health</h3>
          <div>IDFY API: {health.data.idfy.status}</div>
          <div>Database: {health.data.database.status}</div>
          <div>Queue: {health.data.queue.status}</div>
        </div>
      )}

      {trends && (
        <div className="trends-chart">
          {/* Integrate with your preferred chart library */}
          <h3>7-Day Trends</h3>
          <p>Daily Average: {trends.data.dailyAverage}</p>
        </div>
      )}
    </div>
  );
}
```

### Bulk Operations Component
```javascript
function BulkOperations() {
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [bulkAction, setBulkAction] = useState('approve');

  const handleBulkOperation = async () => {
    if (bulkAction === 'approve') {
      await bulkApprove(selectedDoctors, 'Bulk approval', 'admin123');
    }
    // Add other bulk operations as needed
    
    setSelectedDoctors([]);
  };

  return (
    <div className="bulk-operations">
      <h3>Bulk Operations</h3>
      
      <div className="selected-count">
        Selected: {selectedDoctors.length} doctors
      </div>

      <select 
        value={bulkAction} 
        onChange={(e) => setBulkAction(e.target.value)}
      >
        <option value="approve">Bulk Approve</option>
      </select>

      <button 
        onClick={handleBulkOperation}
        disabled={selectedDoctors.length === 0}
      >
        Execute Bulk Operation
      </button>
    </div>
  );
}
```

### Error Handling Utility
```javascript
const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    return error.response.data.message || defaultMessage;
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return 'Network error. Please check your connection.';
  } else {
    console.error('Error:', error.message);
    return error.message || defaultMessage;
  }
};

// Usage in components:
const handleApprove = async (doctorId) => {
  try {
    await approveKyc(doctorId, 'Approved', 'admin123');
    // Success handling
  } catch (error) {
    const errorMessage = handleApiError(error, 'Failed to approve KYC');
    alert(errorMessage);
  }
};
```

---

## 🎯 Key Implementation Notes

### Status Values
- `pending`: Awaiting admin review
- `approved`: KYC approved by admin
- `rejected`: KYC rejected by admin
- `additional_info_requested`: Admin requested more information
- `in_progress`: Verification in progress

### Error Handling
All API calls should include proper error handling for:
- Network errors
- Authentication failures
- Validation errors
- Server errors

### Real-time Updates
Consider implementing WebSocket connections for real-time updates on:
- New KYC submissions
- Status changes
- System alerts

### Performance Considerations
- Implement pagination for large datasets
- Use debouncing for search inputs
- Cache frequently accessed data
- Lazy load components when possible

---

This guide provides all necessary APIs and React component examples for building a complete KYC admin panel with both management and monitoring capabilities.
