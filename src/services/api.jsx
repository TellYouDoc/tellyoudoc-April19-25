import axios from 'axios';

// Environment configuration
const DEV_URL = '/api/v1'; // Using relative URL for dev to work with the proxy
const PROD_URL = 'https://tellyoudoc-breastcancer-74gcc.ondigitalocean.app/api/v1';

// Determine if we're in development mode based on the environment
const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_URL = "/api/v1";

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Get token from cookie or localStorage as fallback
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        // First try to get token from cookie
        let accessToken = getCookie('AccessToken');

        // If not in cookie, try localStorage as fallback
        if (!accessToken) {
            accessToken = localStorage.getItem('AccessToken');
        }

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
        const originalRequest = error.config;        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from cookie
                const getCookie = (name) => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                    return null;
                };

                // Extract token from cookie
                const refreshToken = getCookie('RefreshToken');

                // Use token to get a new access token
                const response = await axios.post(`${BASE_URL}/auth/refresh-token-doctor`, {
                    RefreshToken: refreshToken,
                });

                const { AccessToken, newRefreshToken } = response.data;

                // Store the new tokens in cookies
                document.cookie = `AccessToken=${AccessToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
                document.cookie = `RefreshToken=${newRefreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, logout user by clearing cookies
                document.cookie = 'AccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
                document.cookie = 'RefreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
                localStorage.removeItem('UserData');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth Service
const authService = {
    generateOTP: async (data) => {
        return api.post('/auth/generate-otp', data);
    },
    verifyOTP: async (data) => {
        return api.post('/auth/doctor/verify-otp', data);
    },
    refreshToken: async (refreshToken) => {
        return api.post('/auth/refresh-token-doctor', { RefreshToken: refreshToken });
    },
    verifyUpdateOTP: async (data) => {
        return api.post('/auth/verify-update-otp', data);
    },
    updatePhoneNumber: async (data) => {
        return api.post('/auth/update-phone-number', data);
    },
    updateWhatsappNumber: async (data) => {
        return api.post('/auth/update-whatsapp-number', data);
    },
    updateAlternateNumber: async (data) => {
        return api.post('/auth/update-alternate-number', data);
    },
    updateEmail: async (data) => {
        return api.post('/auth/update-email', data);
    },
    updatePassword: async (data) => {
        return api.post('/auth/update-password', data);
    },
};

// Doctor Service
const doctorService = {
    getProfile: () => api.get('/doctor/get-profile'),
    getDoctorProfile: () => api.get('/doctor/get-profile'),
    getDoctorPhoneNumber: () => api.get('/doctor/get-phone-number'),

    updateProfile: (data) => api.patch('/doctor/update-profile', data),
    updateProfileImage: (formData) => api.patch('/doctor/update-profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateContact: (data) => api.patch('/doctor/update-contact', data),
    createProfile: (profileData) => api.post('/doctor/create-profile', profileData),

    updatePracticeInfo: (id, data) => api.patch(`/doctor/update-practice/${id}`, data),
    addPracticeInfo: (data) => api.post('/doctor/add-practice', data),
    deletePracticeInfo: (id) => api.delete(`/doctor/remove-practice/${id}`),
};

// Patient-Doctor Connection Service
const patientDoctorService = {
    getPatientRequests: () => api.get('/patient-doctor/patient-requests'),
    getPatientRequestById: (patientId) => api.get(`/patient-doctor/patient/${patientId}`),

    acceptPatientRequest: (requestId) => api.put(`/patient-doctor/accept`, { requestId }),
    rejectPatientRequest: (requestId) => api.put(`/patient-doctor/decline`, { requestId }),

    getMyPatients: () => api.get('/patient-doctor/my-patients'),
    getPatientProfile: (id) => api.get(`/patient-doctor/patient-profile/${id}`),


    // Patient Prescription and Report Data
    getPescriptions: (patientId) => api.get(`health/doctor/prescriptions?patientId=${patientId}`),
    getReports: (patientId) => api.get(`health/doctor/reports?patientId=${patientId}`),

    // Note Data
    getNotes: (patientId) => api.get(`/health/notes?patientId=${patientId}`),
    addNote: (data) => api.post('/health/notes', data),
    updateNote: (data) => api.put('/health/notes/update', data),
    deleteNote: (noteId) => api.delete(`/health/notes/delete?noteId=${noteId}`),

    // Patient questions data
    getMastalgiaChart: (duration, patientId) => api.get(`patient/questions/mastalgia-chart?duration=${duration}&patientId=${patientId}`),
    getBreastHealthDates: (patientId) => api.get(
        `patient/questions/breast-health?patientId=${patientId}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    ),
    getBreastHealth: (patientId, date) => api.get(
        `patient/questions/breast-health/date?date=${date}&patientId=${patientId}`, {
        headers: {
            "Content-Type": "application/json",
        },
    }
    ),
    getFamilyHistory: (patientId) => api.get(`patient/questions/familyMedicalHistory?patientId=${patientId}`),
    getPersonalMedicalHistory: (patientId) => api.get(`patient/questions/personalMedicalHistory?patientId=${patientId}`),
    getBiopsyData: (patientId) => api.get(`patient/questions/cancer-history/breast/testsBiopsiesSurgery?patientId=${patientId}`),
    getComorbidities: (patientId) => api.get(`patient/questions/cancer-history/comorbid?patientId=${patientId}`),
    getPastMedicationHistory: (patientId) => api.get(`patient/questions/pastMedicationHistory?patientId=${patientId}`),
    getMedicalHistory: (patientId) => api.get(`patient/questions/health-history?patientId=${patientId}`),
    getLifestyleHistory: (patientId) => api.get(`patient/questions/lifeStyle?patientId=${patientId}`),




};

// Appointment Service
const appointmentService = {
    createAppointment: (data) => api.post('/appointments/doctor/slots', data),
    rescheduleAppointment: (appointmentId, data) => api.put(`/appointments/${appointmentId}`, data),
    cancelAppointment: (data) => api.post(`/appointments/doctor/update/status/cancel`, data),
    getCreatedAppointmentsSlots: () => api.get('/appointments/doctor/slots'),

    getAppointmentRequests: () => api.get('/appointments/doctor/requests'),
    getUpcomingAppointments: () => api.get('/appointments/doctor/upcoming'),

    acceptAppointment: (data) => api.post(`/appointments/doctor/update/status/booked`, data),
    declineAppointment: (data) => api.post(`/appointments/doctor/update/status/cancel`, data),

    // Method to create appointment slots
    createAppointmentSlots: (payload) => api.post(`/appointments/doctor/slots`, payload),
};

// Create the API service object
const apiService = {
    authService,
    doctorService,
    patientDoctorService,
    appointmentService,
};

// Export both as named export and default
export { apiService };
export default apiService;