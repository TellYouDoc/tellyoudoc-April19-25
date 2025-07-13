import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RoutesList.css';

const RoutesList = () => {
  const routes = {
    public: [
      {
        path: '/',
        name: 'Home (Root)',
        description: 'Landing page - redirects to /Home if authenticated',
        access: 'Public'
      },
      {
        path: '/Home',
        name: 'Home',
        description: 'Main home page',
        access: 'Public'
      },
      {
        path: '/login',
        name: 'Login',
        description: 'Doctor login page - redirects to dashboard if authenticated',
        access: 'Public'
      },
      {
        path: '/privacy',
        name: 'Privacy Policy',
        description: 'Privacy policy page',
        access: 'Public'
      },
      {
        path: '/terms',
        name: 'Terms & Conditions',
        description: 'Terms and conditions page',
        access: 'Public'
      },
      {
        path: '/partner',
        name: 'Partner',
        description: 'Partner information page',
        access: 'Public'
      }
    ],
    doctor: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        description: 'Doctor dashboard - main overview',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/patients',
        name: 'Patients',
        description: 'List of all patients',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/patients/:id',
        name: 'Patient Profile',
        description: 'Individual patient profile page',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/appointments',
        name: 'Appointments',
        description: 'Manage appointments',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/reports',
        name: 'Reports',
        description: 'View and manage reports',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/settings',
        name: 'Settings',
        description: 'Doctor account settings',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/profile',
        name: 'Profile',
        description: 'Doctor profile management',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/mammo-list',
        name: 'Mammography List',
        description: 'List of mammography records',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/notifications',
        name: 'Notifications',
        description: 'View notifications',
        access: 'Doctor (Authenticated)'
      },
      {
        path: '/mammo-profile/:id',
        name: 'Mammography Profile',
        description: 'Individual mammography profile',
        access: 'Doctor (Authenticated)'
      }
    ],
    admin: [
      {
        path: '/admin',
        name: 'Admin Login',
        description: 'Administrator login page',
        access: 'Admin'
      },
      {
        path: '/admin/dashboard',
        name: 'Admin Dashboard',
        description: 'Administrator main dashboard',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/administrators',
        name: 'Administrators',
        description: 'Manage administrator accounts',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/doctors',
        name: 'Doctors',
        description: 'Manage doctor accounts',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/doctors/:id',
        name: 'Doctor Profile (Admin)',
        description: 'View doctor profile from admin panel',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/patients',
        name: 'Patients (Admin)',
        description: 'Manage patient accounts',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/appointments',
        name: 'Appointments (Admin)',
        description: 'Manage all appointments',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/reports',
        name: 'Reports (Admin)',
        description: 'View all reports',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/notifications',
        name: 'Notifications (Admin)',
        description: 'Manage notifications',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/content',
        name: 'Content Management',
        description: 'Manage website content',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/terms-conditions',
        name: 'Terms & Conditions (Admin)',
        description: 'Manage terms and conditions',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/faqs',
        name: 'FAQs (Admin)',
        description: 'Manage frequently asked questions',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/privacy-policy',
        name: 'Privacy Policy (Admin)',
        description: 'Manage privacy policy',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/subscription',
        name: 'Beta Partners',
        description: 'Manage beta partner subscriptions',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/activity-logs',
        name: 'Activity Logs',
        description: 'View system activity logs',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/settings',
        name: 'Settings (Admin)',
        description: 'System settings',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/subscribers',
        name: 'Subscribers',
        description: 'Manage subscribers',
        access: 'Admin (Authenticated)'
      },
      {
        path: '/admin/organizations',
        name: 'Organizations',
        description: 'Manage organizations',
        access: 'Admin (Authenticated)'
      }
    ],
    organization: [
      {
        path: '/organization',
        name: 'Organization Login',
        description: 'Organization login page',
        access: 'Organization'
      },
      {
        path: '/organization/dashboard',
        name: 'Organization Dashboard',
        description: 'Organization main dashboard',
        access: 'Organization'
      },
      {
        path: '/organization/administrators',
        name: 'Organization Administrators',
        description: 'Manage organization administrators',
        access: 'Organization'
      },
      {
        path: '/organization/doctors',
        name: 'Organization Doctors',
        description: 'Manage organization doctors',
        access: 'Organization'
      },
      {
        path: '/organization/patients',
        name: 'Organization Patients',
        description: 'Manage organization patients',
        access: 'Organization'
      },
      {
        path: '/organization/screening',
        name: 'Screenings',
        description: 'Manage screenings',
        access: 'Organization'
      }
    ],
    account: [
      {
        path: '/doctor/delete-account',
        name: 'Delete Doctor Account',
        description: 'Doctor account deletion page',
        access: 'Public'
      },
      {
        path: '/patient/delete-account',
        name: 'Delete Patient Account',
        description: 'Patient account deletion page',
        access: 'Public'
      }
    ]
  };

  const getAccessColor = (access) => {
    if (access.includes('Public')) return '#28a745';
    if (access.includes('Doctor')) return '#007bff';
    if (access.includes('Admin')) return '#dc3545';
    if (access.includes('Organization')) return '#ffc107';
    return '#6c757d';
  };

  return (
    <div className="routes-list-container">
      <div className="routes-header">
        <h1>Application Routes</h1>
        <p>A comprehensive list of all available routes in the TellYouDoc application</p>
      </div>

      <div className="routes-content">
        {Object.entries(routes).map(([category, categoryRoutes]) => (
          <div key={category} className="route-category">
            <h2 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)} Routes
              <span className="route-count">({categoryRoutes.length})</span>
            </h2>
            
            <div className="routes-grid">
              {categoryRoutes.map((route) => (
                <div key={route.path} className="route-card">
                  <div className="route-header">
                    <h3 className="route-name">{route.name}</h3>
                    <span 
                      className="access-badge"
                      style={{ backgroundColor: getAccessColor(route.access) }}
                    >
                      {route.access}
                    </span>
                  </div>
                  
                  <p className="route-description">{route.description}</p>
                  
                  <div className="route-path">
                    <code>{route.path}</code>
                  </div>
                  
                  <div className="route-actions">
                    <Link 
                      to={route.path} 
                      className="route-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Route
                    </Link>
                    <button 
                      className="copy-path-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(route.path);
                        // You could add a toast notification here
                      }}
                    >
                      Copy Path
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="routes-footer">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">
              {Object.values(routes).flat().length}
            </span>
            <span className="stat-label">Total Routes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {Object.keys(routes).length}
            </span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
        
        <div className="access-legend">
          <h4>Access Levels:</h4>
          <div className="legend-items">
            <span className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#28a745' }}></span>
              Public
            </span>
            <span className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#007bff' }}></span>
              Doctor
            </span>
            <span className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#dc3545' }}></span>
              Admin
            </span>
            <span className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
              Organization
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesList; 