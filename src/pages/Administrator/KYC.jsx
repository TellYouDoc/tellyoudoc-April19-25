import React, { useState, useEffect } from 'react';
import { FaUserCheck, FaUserTimes, FaClock, FaEye, FaDownload } from 'react-icons/fa';
import '../../styles/Administrator/KYC.css';
import AdminLayout from '../../components/AdminLayout';

const KYC = () => {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockKYCData = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0123',
        status: 'pending',
        submittedDate: '2024-01-15',
        documents: ['medical_license.pdf', 'id_proof.pdf', 'address_proof.pdf'],
        notes: 'Documents submitted, awaiting verification'
      },
      {
        id: 2,
        doctorName: 'Dr. Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1-555-0124',
        status: 'approved',
        submittedDate: '2024-01-10',
        approvedDate: '2024-01-12',
        documents: ['medical_license.pdf', 'id_proof.pdf'],
        notes: 'All documents verified successfully'
      },
      {
        id: 3,
        doctorName: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1-555-0125',
        status: 'rejected',
        submittedDate: '2024-01-08',
        rejectedDate: '2024-01-11',
        documents: ['medical_license.pdf', 'id_proof.pdf'],
        notes: 'Medical license expired, please provide updated license'
      }
    ];

    setTimeout(() => {
      setKycData(mockKYCData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setKycData(prev => prev.map(item =>
      item.id === id
        ? {
          ...item,
          status: newStatus,
          [newStatus === 'approved' ? 'approvedDate' : 'rejectedDate']: new Date().toISOString().split('T')[0]
        }
        : item
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'approved':
        return <FaUserCheck className="status-icon approved" />;
      case 'rejected':
        return <FaUserTimes className="status-icon rejected" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredData = kycData.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="kyc-container">
        <div className="loading">Loading KYC data...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="kyc-container">
        <div className="kyc-header">
          <h1>KYC Management</h1>
          <p>Manage doctor verification and Know Your Customer processes</p>
        </div>

        <div className="kyc-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by doctor name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="kyc-stats">
          <div className="stat-card">
            <div className="stat-number">{kycData.filter(item => item.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{kycData.filter(item => item.status === 'approved').length}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{kycData.filter(item => item.status === 'rejected').length}</div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{kycData.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        <div className="kyc-table-container">
          <table className="kyc-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Documents</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className={`kyc-row ${item.status}`}>
                  <td>
                    <div className="doctor-info">
                      <div className="doctor-name">{item.doctorName}</div>
                      <div className="doctor-id">ID: {item.id}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{item.email}</div>
                      <div>{item.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(item.status)}
                      <span className={`status-text ${item.status}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <div>Submitted: {item.submittedDate}</div>
                      {item.approvedDate && <div>Approved: {item.approvedDate}</div>}
                      {item.rejectedDate && <div>Rejected: {item.rejectedDate}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="documents-list">
                      {item.documents.map((doc, index) => (
                        <div key={index} className="document-item">
                          <FaDownload className="download-icon" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="notes-cell">
                      {item.notes}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => console.log('View details for:', item.id)}
                      >
                        <FaEye />
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <button
                            className="action-btn approve-btn"
                            onClick={() => handleStatusUpdate(item.id, 'approved')}
                          >
                            <FaUserCheck />
                          </button>
                          <button
                            className="action-btn reject-btn"
                            onClick={() => handleStatusUpdate(item.id, 'rejected')}
                          >
                            <FaUserTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="no-data">
            <p>No KYC records found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default KYC; 