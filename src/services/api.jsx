import axios from "axios";

// Environment configuration
// const DEV_URL = "https://staging.api.tellyoudoc.com/api/v1"; //   Using relative URL for dev to work with the proxy
const DEV_URL = "http://172.16.14.108:3000/api/v1"; // Use relative URL to work with Vite proxy
// const PROD_URL = "https://staging.api.tellyoudoc.com/api/v1";
const PROD_URL = "http://172.16.14.108:3000/api/v1";

// Determine if we're in development mode based on the environment
const isDevelopment = import.meta.env.MODE === "development";
const BASE_URL = isDevelopment ? DEV_URL : PROD_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Console log the base URL
console.log("Base URL: ", BASE_URL);

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Get token from cookie or localStorage as fallback
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    // First try to get token from cookie
    let accessToken = getCookie("AccessToken");

    // If not in cookie, try localStorage as fallback
    if (!accessToken) {
      accessToken = localStorage.getItem("AccessToken");
    }

    console.log("Access Token: ", accessToken);

    // If token exists, add it to headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from cookie
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(";").shift();
          return null;
        };

        // Extract token from cookie
        const refreshToken = getCookie("RefreshToken");

        // Use token to get a new access token
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token-doctor`,
          {
            RefreshToken: refreshToken,
          }
        );

        const { AccessToken, newRefreshToken } = response.data;

        // Store the new tokens in cookies
        document.cookie = `AccessToken=${AccessToken}; path=/; max-age=${
          60 * 60 * 24 * 30
        }; samesite=strict`;
        document.cookie = `RefreshToken=${newRefreshToken}; path=/; max-age=${
          60 * 60 * 24 * 30
        }; samesite=strict`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user by clearing cookies
        document.cookie =
          "AccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
        document.cookie =
          "RefreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
        localStorage.removeItem("UserData");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth Service
const authService = {
  generateOTP: async (data) => {
    return api.post("/auth/generate-otp", data);
  },
  verifyOTP: async (data) => {
    return api.post("/auth/doctor/verify-otp", data);
  },
  refreshToken: async (refreshToken) => {
    return api.post("/auth/refresh-token-doctor", {
      RefreshToken: refreshToken,
    });
  },
  verifyUpdateOTP: async (data) => {
    return api.post("/auth/verify-update-otp", data);
  },
  updatePhoneNumber: async (data) => {
    return api.post("/auth/update-phone-number", data);
  },
  updateWhatsappNumber: async (data) => {
    return api.post("/auth/update-whatsapp-number", data);
  },
  updateAlternateNumber: async (data) => {
    return api.post("/auth/update-alternate-number", data);
  },
  updateEmail: async (data) => {
    return api.post("/auth/update-email", data);
  },
  updatePassword: async (data) => {
    return api.post("/auth/update-password", data);
  },
};

// Homepage Service
const homePageService = {
  contactUs: async (data) => {
    return api.post("/contact-us", data);
  },
};

// OTP send and verify service
const betaRegistration = {
  initialRegistration: async (data) => {
    return api.post("/beta-partner/init", data);
  },
  verifyEmailOTP: async (data) => {
    return api.post("/beta-partner/verify-email", data);
  },
  verifyPhoneOTP: async (data) => {
    return api.post("/beta-partner/verify-phone", data);
  },
  registerBeta: async (data) => {
    return api.post("/beta-partner/register", data);
  },
  resendEmailOTP: async (data) => {
    return api.post("/beta-partner/resend-email-otp", data);
  },
  resendPhoneOTP: async (data) => {
    return api.post("/beta-partner/resend-phone-otp", data);
  },
};

// Doctor Service
const doctorService = {
  getProfile: () => api.get("/doctor/get-profile"),
  getDoctorProfile: () => api.get("/doctor/get-profile"),
  getDoctorPhoneNumber: () => api.get("/doctor/get-phone-number"),

  updateProfile: (data) => api.patch("/doctor/update-profile", data),
  updateProfileImage: (formData) =>
    api.patch("/doctor/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateContact: (data) => api.patch("/doctor/update-contact", data),
  createProfile: (profileData) =>
    api.post("/doctor/create-profile", profileData),

  updatePracticeInfo: (id, data) =>
    api.patch(`/doctor/update-practice/${id}`, data),
  addPracticeInfo: (data) => api.post("/doctor/add-practice", data),
  deletePracticeInfo: (id) => api.delete(`/doctor/remove-practice/${id}`),

  requestApp: (data) => api.post("/request-app", data),
};

// Patient-Doctor Connection Service
const patientDoctorService = {
  getPatientRequests: () => api.get("/patient-doctor/patient-requests"),
  getPatientRequestById: (patientId) =>
    api.get(`/patient-doctor/patient/${patientId}`),

  acceptPatientRequest: (requestId) =>
    api.put(`/patient-doctor/accept`, { requestId }),
  rejectPatientRequest: (requestId) =>
    api.put(`/patient-doctor/decline`, { requestId }),

  getMyPatients: () => api.get("/patient-doctor/my-patients"),
  getPatientProfile: (id) => api.get(`/patient-doctor/patient-profile/${id}`),

  // Patient Prescription and Report Data
  getPescriptions: (patientId) =>
    api.get(`health/doctor/prescriptions?patientId=${patientId}`),
  getReports: (patientId) =>
    api.get(`health/doctor/reports?patientId=${patientId}`),

  // Note Data
  getNotes: (patientId) => api.get(`/health/notes?patientId=${patientId}`),
  addNote: (data) => api.post("/health/notes", data),
  updateNote: (data) => api.put("/health/notes/update", data),
  deleteNote: (noteId) => api.delete(`/health/notes/delete?noteId=${noteId}`),

  // Patient questions data
  getMastalgiaChart: (duration, patientId) =>
    api.get(
      `patient/questions/mastalgia-chart?duration=${duration}&patientId=${patientId}`
    ),
  getBreastHealthDates: (patientId) =>
    api.get(`patient/questions/breast-health?patientId=${patientId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  getBreastHealth: (patientId, date) =>
    api.get(
      `patient/questions/breast-health/date?date=${date}&patientId=${patientId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  getFamilyHistory: (patientId) =>
    api.get(`patient/questions/familyMedicalHistory?patientId=${patientId}`),
  getPersonalMedicalHistory: (patientId) =>
    api.get(`patient/questions/personalMedicalHistory?patientId=${patientId}`),
  getBiopsyData: (patientId) =>
    api.get(
      `patient/questions/cancer-history/breast/testsBiopsiesSurgery?patientId=${patientId}`
    ),
  getComorbidities: (patientId) =>
    api.get(`patient/questions/cancer-history/comorbid?patientId=${patientId}`),
  getPastMedicationHistory: (patientId) =>
    api.get(`patient/questions/pastMedicationHistory?patientId=${patientId}`),
  getMedicalHistory: (patientId) =>
    api.get(`patient/questions/health-history?patientId=${patientId}`),
  getLifestyleHistory: (patientId) =>
    api.get(`patient/questions/lifeStyle?patientId=${patientId}`),
};

// Appointment Service
const appointmentService = {
  createAppointment: (data) => api.post("/appointments/doctor/slots", data),
  rescheduleAppointment: (appointmentId, data) =>
    api.put(`/appointments/${appointmentId}`, data),
  cancelAppointment: (data) =>
    api.post(`/appointments/doctor/update/status/cancel`, data),
  getCreatedAppointmentsSlots: () => api.get("/appointments/doctor/slots"),

  getAppointmentRequests: () => api.get("/appointments/doctor/requests"),
  getUpcomingAppointments: () => api.get("/appointments/doctor/upcoming"),

  acceptAppointment: (data) =>
    api.post(`/appointments/doctor/update/status/booked`, data),
  declineAppointment: (data) =>
    api.post(`/appointments/doctor/update/status/cancel`, data),

  // Method to create appointment slots
  createAppointmentSlots: (payload) =>
    api.post(`/appointments/doctor/slots`, payload),
};

const AdministratorService = {
  // Login
  login: (data) => api.post("/admin/auth/login", data),

  // Create Administrator
  createAdministrator: (data) => api.post("/admin/users", data),
  // Get all Administrators
  getAllAdministrators: (page, limit) =>
    api.get("/admin/users", { params: { page, limit } }),
  // Delete Administrator
  deleteAdministrator: (adminId) => api.delete(`/admin/users/${adminId}`),
  // Change Administrator permissions
  changeAdministratorPermissions: (adminId, data) =>
    api.patch(`/admin/users/${adminId}/permissions`, data),

  // Get Doctors
  getAllDoctors: (page, limit, search, status) =>
    api.get("/admin/doctors/doctors", {
      params: { page, limit, search, status },
    }),
  // Get Doctor by ID
  getDoctorById: (doctorId) => api.get(`/admin/doctors/${doctorId}`),

  // Get Beta Partners
  getBetaPartners: (page, limit, search, status) =>
    api.get("/admin/beta-partner", { params: { page, limit, search, status } }),
  // Approve Beta Partner
  approveRejectSingleBetaPartner: (partnerId, data) =>
    api.patch(`/admin/beta-partner/${partnerId}/status`, data),
  // Approve Multiple Beta Partners
  approveRejectMultipleBetaPartners: (data) =>
    api.patch(`/admin/beta-partner/bulk-update`, data),
  // Delete Draft Beta Partner
  deleteDraftBetaPartner: (partnerId) =>
    api.delete(`/admin/beta-partner/drafts/${partnerId}`),
  // Get Patients
  getAllPatients: (data) => api.get("/admin/patients", { params: data }),
  // Toggle Active Status
  togglePatientStatus: (patientId, data) =>
    api.patch(`/admin/patients/${patientId}/status`, data),
  // Get Patient by ID
  getPatientById: (patientId) => api.get(`/admin/patients/${patientId}`), // Not Implemented

  // Subscriber Management - API placeholder for future implementation
  // Get all subscribers
  getAllSubscribers: (data) => api.get("/admin/subscribers", { params: data }),
  // Toggle subscriber status
  toggleSubscriberStatus: (subscriberId, data) =>
    api.patch(`/admin/subscribers/${subscriberId}/status`, data),
  // Change subscriber type
  changeSubscriberType: (subscriberId, data) =>
    api.patch(`/admin/subscribers/${subscriberId}/type`, data),
  // Get subscriber by ID
  getSubscriberById: (subscriberId) =>
    api.get(`/admin/subscribers/${subscriberId}`),

  // Update Doctor Status
  updateDoctorStatus: (doctorId, data) =>
    api.patch(`/admin/doctors/${doctorId}/status`, data),

  // Get Slots by Doctor ID
  getSlotsByDoctorId: (doctorId) =>
    api.get(`/admin/appointments/slots/${doctorId}`),

  // Get Appointments by Doctor ID
  getAppointmentsByDoctorId: (doctorId, statuses) =>
    api.get(`/admin/appointments/statuses/${doctorId}`, {
      params: statuses || {},
    }),

  // Specialization Management
  // Get all specializations
  getAllSpecializations: (page, limit) => {
    const params = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    return api.get("/admin/content/doctor/specializations", { params });
  },
  // Create specialization
  createSpecialization: (data) =>
    api.post("/admin/content/doctor/specializations", data),
  // Update specialization
  updateSpecialization: (documentId, specializationId, data) =>
    api.put(
      `/admin/content/doctor/specializations/${documentId}/update/${specializationId}`,
      data
    ),
  // Delete specialization
  deleteSpecialization: (documentId, specializationId) =>
    api.delete(
      `/admin/content/doctor/specializations/${documentId}/remove/${specializationId}`
    ),
  // Get specialization by ID
  getSpecializationById: (specializationId) =>
    api.get(`/admin/content/doctor/specializations/${specializationId}`),

  // Content Management - Terms and Conditions
  // Get terms and conditions content
  getTermsAndConditions: () => api.get("/admin/content/terms-and-conditions"),
  // Update terms and conditions content
  updateTermsAndConditions: (data) =>
    api.put("/admin/content/terms-and-conditions", data),
  // Get terms and conditions content for public display
  getPublicTermsAndConditions: () => api.get("/content/terms-and-conditions"),

  // Terminal Command Execution
  executeCommand: async (command, timeout = 30000) =>
    api.post("/admin/monitoring/terminal/exec", { command, timeout }),
  // WebSocket Monitoring
  getWebSocketStatus: () => api.get("/admin/monitoring/websocket/status"),
  getWebSocketConnections: (params = {}) =>
    api.get("/admin/monitoring/websocket/connections", { params }),
  disconnectWebSocketUser: (userId) =>
    api.post(`/admin/monitoring/websocket/disconnect/${userId}`),
  sendWebSocketRegistrationReminders: () =>
    api.post("/admin/monitoring/websocket/broadcast/registration-reminder"),
  getWebSocketAnalytics: (params = {}) =>
    api.get("/admin/monitoring/websocket/analytics", { params }),

  // Activity Logs Management
  getActivityLogs: (params = {}) =>
    api.get("/admin/activity/activity-logs", { params }),
  getActivityLogsStats: (params = {}) =>
    api.get("/admin/activity/activity-logs/stats", { params }),
  getUserActivityLogs: (userId, params = {}) =>
    api.get(`/admin/activity/activity-logs/user/${userId}`, { params }),
};

// Create the API service object
const apiService = {
  authService,
  homePageService,
  doctorService,
  betaRegistration,
  patientDoctorService,
  appointmentService,
  AdministratorService,
};

// Export both as named export and default
export { apiService };
export default apiService;
