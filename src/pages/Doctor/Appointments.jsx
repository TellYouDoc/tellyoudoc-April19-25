import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/Doctor/Appointments.css';
import LoadingScreen from '../../components/LoadingScreen';
import { apiService } from '../../services/api';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showModal, setShowModal] = useState(false);
  const [dateSelectionMode, setDateSelectionMode] = useState('custom'); // 'custom' or 'weekly'
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    locationDetails: null,
    selectedDates: [], // For multiple date selection
    weeklyDays: {
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false
    },
    // Updated to support multiple months
    selectedMonths: [], // Array of {year: 2025, month: 4} objects
    purpose: ''
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // New pagination state variables
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'patientName', direction: 'ascending' });
  const [totalAppointments, setTotalAppointments] = useState(0);
  const recordsPerPageOptions = [5, 10, 15, 20];

  // Add state variables for real API data
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const [isLoadingToday, setIsLoadingToday] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get current date in YYYY-MM-DD format for HTML date input
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calendar related functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarWithMultiSelect = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    let days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false, isPast: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isPast = date < new Date(today.setHours(0, 0, 0, 0));
      const isSunday = date.getDay() === 0;

      days.push({
        day: i,
        date: new Date(year, month, i),
        isCurrentMonth: true,
        isToday:
          i === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear(),
        isPast,
        isSunday,
        isSelected:
          newAppointment.date ===
          `${year}-${(month + 1).toString().padStart(2, '0')}-${i
            .toString()
            .padStart(2, '0')}`,
        isMultiSelected: newAppointment.selectedDates.includes(
          `${year}-${(month + 1).toString().padStart(2, '0')}-${i
            .toString()
            .padStart(2, '0')}`
        ),
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarDate(newDate);
  };

  const handleDateClick = (date) => {
    if (!date || date.isPast) return;

    const year = date.date.getFullYear();
    const month = (date.date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');

    setNewAppointment({
      ...newAppointment,
      date: `${year}-${month}-${day}`,
    });
  };

  const handleMultiDateSelect = (day) => {
    if (!day || day.isPast) return;

    const year = day.date.getFullYear();
    const month = (day.date.getMonth() + 1).toString().padStart(2, '0');
    const dayString = day.day.toString().padStart(2, '0');
    const selectedDate = `${year}-${month}-${dayString}`;

    if (newAppointment.selectedDates.includes(selectedDate)) {
      setNewAppointment({
        ...newAppointment,
        selectedDates: newAppointment.selectedDates.filter(
          (date) => date !== selectedDate
        ),
      });
    } else {
      setNewAppointment({
        ...newAppointment,
        selectedDates: [...newAppointment.selectedDates, selectedDate],
      });
    }
  };

  const removeSelectedDate = (index) => {
    const updatedDates = [...newAppointment.selectedDates];
    updatedDates.splice(index, 1);
    setNewAppointment({
      ...newAppointment,
      selectedDates: updatedDates,
    });
  };

  const handleMonthChange = (e) => {
    const { value } = e.target;
    setNewAppointment({
      ...newAppointment,
      weeklyMonth: parseInt(value, 10),
    });
  };

  const toggleWeekday = (day) => {
    setNewAppointment({
      ...newAppointment,
      weeklyDays: {
        ...newAppointment.weeklyDays,
        [day]: !newAppointment.weeklyDays[day],
      },
    });
  };

  const getMonthName = (month) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month];
  };

  // Convert weekly selection to actual dates
  const generateDatesFromWeeklySelection = () => {
    const selectedDates = [];
    const daysMap = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };
    
    // Get selected days indices
    const selectedDayIndices = Object.entries(newAppointment.weeklyDays)
      .filter(([_, selected]) => selected)
      .map(([day, _]) => daysMap[day]);
    
    if (selectedDayIndices.length === 0) return [];
    
    // Loop through all selected months
    newAppointment.selectedMonths.forEach(({ year, month }) => {
      // Get the number of days in the month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Loop through all days in the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        
        // Check if this day matches any of the selected weekdays
        if (selectedDayIndices.includes(date.getDay())) {
          // Format as YYYY-MM-DD
          const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          selectedDates.push(formattedDate);
        }
      }
    });
    
    return selectedDates;
  };

  // Function to add a month/year combination
  const addMonthYear = () => {
    // Get selected month and year from dropdowns
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    const monthIndex = parseInt(monthSelect.value, 10);
    const year = parseInt(yearSelect.value, 10);
    
    // Check if this month/year combination is already selected
    const alreadyExists = newAppointment.selectedMonths.some(
      item => item.month === monthIndex && item.year === year
    );
    
    if (alreadyExists) {
      return; // Don't add duplicates
    }
    
    // Add the new month/year combination
    setNewAppointment({
      ...newAppointment,
      selectedMonths: [
        ...newAppointment.selectedMonths,
        { month: monthIndex, year: year }
      ]
    });
  };
  
  // Function to remove a month/year combination
  const removeMonthYear = (index) => {
    const updatedMonths = [...newAppointment.selectedMonths];
    updatedMonths.splice(index, 1);
    setNewAppointment({
      ...newAppointment,
      selectedMonths: updatedMonths
    });
  };
  
  // Get a range of years for the dropdown (current year + 5 years)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 5; i++) {
      years.push(currentYear + i);
    }
    
    return years;
  };

  // OpenStreetMap Nominatim API for location search (no API key required)
  const searchLocations = async (query) => {
    if (!query || query.length < 3) return;

    setIsSearchingLocations(true);

    try {
      // Using OpenStreetMap's Nominatim API which doesn't require an API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=10`,
        {
          headers: {
            Accept: 'application/json',
            // Important: Set a unique user agent as required by Nominatim usage policy
            'User-Agent': 'WebApp-MedicalAppointments',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();

      // Create a Map to store unique locations based on their main name
      const uniqueLocations = new Map();

      data.forEach(item => {
        const mainName = item.display_name.split(',')[0].trim();
        
        // Only add if this main name hasn't been seen yet
        if (!uniqueLocations.has(mainName)) {
          uniqueLocations.set(mainName, {
            id: item.place_id,
            name: mainName,
            address: item.display_name,
            coordinates: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
          });
        }
      });

      // Convert Map values to array and limit to 5 results
      const formattedLocations = Array.from(uniqueLocations.values()).slice(0, 5);

      setLocationSuggestions(formattedLocations);
      setShowSuggestions(formattedLocations.length > 0);
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Show fallback suggestions in case of error
      setLocationSuggestions([
        {
          id: 1,
          name: 'City Hospital',
          address: '123 Main St, City Center',
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
      ]);
    } finally {
      setIsSearchingLocations(false);
    }
  };

  // Use debouncing to avoid making too many API requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (newAppointment.location && newAppointment.location.length > 2) {
        searchLocations(newAppointment.location);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [newAppointment.location]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle location search
  const handleLocationSearch = (e) => {
    const query = e.target.value;
    setNewAppointment({
      ...newAppointment,
      location: query,
      locationDetails: null, // Clear location details when user starts typing again
    });

    if (query.length < 3) {
      setShowSuggestions(false);
      setLocationSuggestions([]); // Clear suggestions when input is too short
    }
  };

  // Select a location from suggestions
  const selectLocation = (location) => {
    setNewAppointment({
      ...newAppointment,
      location: location.address,
      locationDetails: location,
    });
    setShowSuggestions(false);
    setLocationSuggestions([]); // Clear the suggestions array
  };

  // Add click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-form-group')) {
        setShowSuggestions(false);
        setLocationSuggestions([]);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get filtered and sorted appointments based on active tab
  const getFilteredAndSortedAppointments = () => {
    let appointments;
    switch (activeTab) {
      case 'today':
        appointments = isLoadingToday ? [] : todayAppointments;
        break;
      case 'upcoming':
        appointments = isLoadingUpcoming ? [] : upcomingAppointments;
        break;
      case 'requests':
        appointments = isLoadingRequests ? [] : requestedAppointments;
        break;
      default:
        appointments = isLoadingToday ? [] : todayAppointments;
    }
  
    // Apply search filtering if search term exists
    if (searchTerm.trim() !== '') {
      appointments = appointments.filter(appointment => 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.purpose && appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  
    // Apply sorting
    if (sortConfig.key) {
      appointments = [...appointments].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
  
    return appointments;
  };
  

  // Get all filtered and sorted appointments
  const filteredAndSortedAppointments = getFilteredAndSortedAppointments();
  
  // Calculate total pages outside of render
  const totalAppointmentsCount = filteredAndSortedAppointments.length;
  
  // Effect to update total appointments when dependencies change
  useEffect(() => {
    setTotalAppointments(totalAppointmentsCount);
  }, [totalAppointmentsCount]);
  
  // Get paginated appointments
  const displayedAppointments = (() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return filteredAndSortedAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
  })();
  
  // Calculate page numbers
  const totalPages = Math.ceil(totalAppointments / recordsPerPage);
  
  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Handle records per page change
  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Status styling
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  // Open modal
  const openNewAppointmentModal = () => {
    setShowModal(true);
    const today = new Date();
    setCalendarDate(today);

    // Initialize with current date
    setNewAppointment({
      ...newAppointment,
      date: getCurrentDate(),
    });
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    // Reset form values
    setNewAppointment({
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      locationDetails: null,
      selectedDates: [],
      weeklyDays: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      },
      selectedMonths: [],
      purpose: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    });
  };

 // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Start loading state
  // setIsSubmitting(true);
   
  try {
    // Validate required fields
    if (!newAppointment.location.trim()) {
      throw new Error('Please enter a location');
    }
    
    // Validate end time is after start time
    if (
      newAppointment.startTime &&
      newAppointment.endTime &&
      newAppointment.startTime >= newAppointment.endTime
    ) {
      throw new Error('End time must be after start time');
    }
    
    let appointmentDates = [];
    
    if (dateSelectionMode === 'custom') {
      // If specific dates are selected, use those
      if (newAppointment.selectedDates.length > 0) {
        appointmentDates = newAppointment.selectedDates;
      } else if (newAppointment.date) {
        // If no multiple dates but a single date is set
        appointmentDates = [newAppointment.date];
      } else {
        throw new Error('Please select at least one date');
      }
    } else if (dateSelectionMode === 'weekly') {
      // Generate dates based on weekday selection
      appointmentDates = generateDatesFromWeeklySelection();
      
      if (appointmentDates.length === 0) {
        throw new Error('Please select at least one day of the week');
      }
    }
    
    // Show confirmation for many dates (optional)
    if (appointmentDates.length > 5) {
      const confirmMultiple = window.confirm(`You are about to create ${appointmentDates.length} appointment slots. Continue?`);
      if (!confirmMultiple) {
        return;
      }
    }
    
    // Format time slots to match the expected structure
    const formattedTimeSlots = [{
      startTime: newAppointment.startTime,
      endTime: newAppointment.endTime,
      maxPatients: 1 // Default value
    }];
    
    // Prepare appointment data with the structure matching React Native version
    const payload = {
      location: newAppointment.location,
      timeSlots: formattedTimeSlots,
    };
    
    // Add either recurrence or specific dates based on mode
    if (dateSelectionMode === 'weekly') {
      // Weekly recurrence
      const weekdayIndices = Object.entries(newAppointment.weeklyDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day, _]) => {
          // Convert day names to numbers (0=Sunday, 1=Monday, etc.)
          const daysMap = {
            sunday: 0, monday: 1, tuesday: 2, wednesday: 3, 
            thursday: 4, friday: 5, saturday: 6
          };
          return daysMap[day];
        });
      
      payload.recurrence = {
        pattern: "weekly",
        daysOfWeek: weekdayIndices
      };
      payload.specificDates = appointmentDates.sort();
    } else {
      // Specific dates
      payload.specificDates = appointmentDates;
    }
    
    console.log('Creating appointment:', payload);
    
    // Replace with your actual API call
    const response = await apiService.appointmentService.createAppointment(payload);
    
    if (response.status === 200) {
      alert('Appointment created successfully!');
      // Close the modal and reset form
      closeModal();
    } else {
      throw new Error("Creation failed: " + (response.data?.message || "Unknown error"));
    }
    
  } catch (error) {
    // Show error message
    alert(error.message || 'Failed to create appointment');
    console.error('Appointment creation error:', error);
  }
};

// Function to handle cancellation
const handleCancelAppointment = async (appointment) => {
  const patientName = appointment.patientName;
  const confirmCancel = window.confirm(`Are you sure you want to cancel appointment with ${patientName}?`);
  
  if (confirmCancel) {
    try {
      const data = {
        appointmentCreatedId: appointment.appointmentCreatedId,
        patientId: appointment.patientId
      };
      // Call the API service to cancel the appointment
      const response = await apiService.appointmentService.cancelAppointment(data);
      console.log("Cancelling appointment with data:", response);
          if (response.status === 200) {
            alert(`Appointment with ${patientName} has been cancelled.`);
            // You could refresh appointments here
            fetchAppointments();
          } else {
            alert("Cancellation failed: " + (response.data?.message || "Unknown error"));
          }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  }
};
// Function to handle accepting an appointment request
const handleAcceptAppointment = async (appointment) => {
  const appointmentId = appointment.id;
  const patientName = appointment.patientName;

  const confirmAccept = window.confirm(`Are you sure you want to accept appointment request from ${patientName}?`);
  
  if (confirmAccept) {
    try {
      // Show loading indicator for this specific appointment
      setIsLoadingRequests(true);
      
      // Prepare the data for the API call based on your original function
      const data = {
        appointmentCreatedId: appointment.id || null,
        patientId: appointment.patientId || null
      };
      console.log("Accepting appointment with data:", data);
      
      // Call the API service to accept the appointment
      const response = await apiService.appointmentService.acceptAppointment(data);
      
      if (response.status === 200) {
        alert(`Appointment with ${patientName} has been accepted.`);
        
        // Remove the accepted appointment from the list
        setRequestedAppointments(prev => prev.filter(item => item.id !== appointmentId));
        
        // Refresh appointment data to update the upcoming/today lists
        fetchAppointments();
      } else {
        alert("Failed to accept appointment: " + (response.data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error accepting appointment:", error);
      alert("Failed to accept appointment. Please try again.");
    } finally {
      setIsLoadingRequests(false);
    }
  }
};

// Function to handle declining an appointment request
const handleDeclineAppointment = async (appointment) => {
  const patientName = appointment.patientName;
  
  const confirmDecline = window.confirm(`Are you sure you want to decline appointment request from ${patientName}?`);
  
  if (confirmDecline) {
    try {
      // Show loading indicator 
      setIsLoadingRequests(true);
      
      // Prepare the data for the API call based on your original function
      const data = {
        appointmentCreatedId: appointment.id,
        patientId: appointment.patientId
      };
      
      // Call the API service to decline the appointment
      const response = await apiService.appointmentService.declineAppointment(data);
      
      if (response.status === 200) {
        alert(`Appointment request from ${patientName} has been declined.`);
        
       fetchAppointmentsRequests(); // Refresh the requests list
      } else {
        alert("Failed to decline appointment: " + (response.data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error declining appointment:", error);
      alert("Failed to decline appointment. Please try again.");
    } finally {
      setIsLoadingRequests(false);
    }
  }
};

const fetchAppointments = async () => {
  setIsLoadingToday(true);
  setIsLoadingUpcoming(true);
  
  try {
    const response = await apiService.appointmentService.getUpcomingAppointments();

    if (response.status === 200) {
      // Here's the fix: use response.data.appointments instead of response.data
      const appointmentsData = response.data.appointments || [];
      
      // Get today's date for comparison
      const today = new Date();
      const todayStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
      
      // Filter appointments for today and upcoming
      const todayAppts = [];
      const upcomingAppts = [];
      
      if (Array.isArray(appointmentsData)) {
        appointmentsData.forEach(appointment => {
          try {
            // Check if there are patients in the appointment
            const patient = appointment.patients && appointment.patients.length > 0 
              ? appointment.patients[0] 
              : null;
            
            // Format the appointment for our UI
            const formattedAppointment = {
              id: appointment._id || appointment.appointmentCreatedId,
              appointmentCreatedId: appointment.appointmentCreatedId,
              patientId: patient?.patientId,
              patientName: patient?.name || "No Patient",
              date: appointment.date,
              time: `${appointment.startTime} - ${appointment.endTime}`,
              startTime: appointment.startTime,
              endTime: appointment.endTime,
              purpose: patient?.symptoms?.[0] || "Consultation",
              status: "Confirmed",
              profileImage: patient?.profileImage,
              location: appointment.place || "Hospital",
              gender: patient?.gender || "N/A",
              age: patient?.age || "--"
            };
            
            // Check if appointment is today or upcoming
            if (appointment.date === todayStr) {
              todayAppts.push(formattedAppointment);
            } else {
              upcomingAppts.push(formattedAppointment);
            }
          } catch (innerError) {
            console.warn("Error processing appointment:", innerError, appointment);
            // Continue with next appointment
          }
        });
      } else {
        console.warn("appointmentsData is not an array:", appointmentsData);
      }
      
      // Update state with fetched appointments - THIS IS THE KEY PART THAT WAS MISSING
      setTodayAppointments(todayAppts);
      setUpcomingAppointments(upcomingAppts);
    } else {
      console.error("Error in API response:", response);
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    // Don't show alerts in production - use a more user-friendly notification
    // alert("Failed to load appointments. Please try again.");
  } finally {
    setIsLoadingToday(false);
    setIsLoadingUpcoming(false);
  }
};

const fetchAppointmentsRequests = async () => {
  setIsLoadingRequests(true);
  
  try {
    const response = await apiService.appointmentService.getAppointmentRequests();
    
    if (response.status === 200) {
      const requestsData = response.data.appointmentRequests || [];
      
      // Format appointment requests for our UI
      const formattedRequests = requestsData.map(request => ({
        id: request.appointmentCreatedId,
        patientName: request.patientDetails?.name || "Patient",
        patientId: request.patientId,
        requestDate: new Date(request.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        createdAt: request.createdAt,
        preferredDate: request.date,
        preferredTime: `${request.startTime} - ${request.endTime}`,
        purpose: request.symptoms?.[0] || "Consultation",
        status: request.bookingStatus || "Pending",
        profileImage: request.patientDetails?.profileImage,
        location: request.location || "Hospital",
        gender: request.patientDetails?.gender || "N/A"
      }));
      
      // Update state with fetched requests
      setRequestedAppointments(formattedRequests);
    }
  } catch (error) {
    console.error("Error fetching appointment requests:", error);
    alert("Failed to load appointment requests. Please try again.");
  } finally {
    setIsLoadingRequests(false);
  }
};

useEffect(() => {
  // Fetch appointments when the component mounts
  fetchAppointments();
  fetchAppointmentsRequests();
}, []);
const TodayAppointments = ({ appointments, onReschedule, onCancel }) => {
  if (appointments.length === 0) {
    return (
      <div className="empty-container">
        <i className="fas fa-calendar-times" style={{ fontSize: '60px', color: '#ccc' }}></i>
        <p className="empty-text">No appointments for today</p>
        <button className="create-button" onClick={() => openNewAppointmentModal()}>
          Create Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-cards-container">
      {appointments.map(appointment => (
        <div 
          key={appointment.id}
          className="appointment-card compact"
        >
          <div className="card-main-content">
            <div className="card-time-section">
              <div className="card-time-container">
                <i className="fas fa-clock" style={{ color: '#0e9f6e' }}></i>
                <span style={{ fontWeight: 500, color: '#333' }}>{appointment.time}</span>
              </div>
              <div className="card-location-container">
                <i className="fas fa-map-marker-alt" style={{ color: '#0e9f6e' }}></i>
                <span style={{ color: '#666' }}>{appointment.location || 'Hospital'}</span>
              </div>
            </div>

            {appointment.patientName && (
              <div className="card-patient-compact">
                <div className="patient-item">
                  {appointment.profileImage ? (
                    <img
                      src={appointment.profileImage}
                      alt={`${appointment.patientName}'s profile`}
                      className="patient-avatar"
                    />
                  ) : (
                    <div className="patient-avatar-placeholder">
                      {appointment.patientName.charAt(0)}
                    </div>
                  )}
                  <div className="patient-details">
                    <div className="patient-name">{appointment.patientName}</div>
                    <div className="patient-meta">
                      {appointment.age || '25'} yrs • {appointment.purpose || 'Consultation'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-actions-always-visible">
            {/* <button className="action-button reschedule" onClick={() => onReschedule(appointment)} title="Reschedule Appointment">
              <i className="fas fa-calendar-alt"></i>
              <span className="action-text">Reschedule</span>
            </button> */}
            {/* <button className="action-button cancel" onClick={() => onCancel(appointment)} title="Cancel Appointment">
              <i className="fas fa-times"></i>
              <span className="action-text">Cancel</span>
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

const UpcomingAppointments = ({ appointments, onReschedule, onCancel }) => {
  if (appointments.length === 0) {
    return (
      <div className="empty-container">
        <i className="fas fa-calendar-check" style={{ fontSize: '60px', color: '#ccc' }}></i>
        <p className="empty-text">No upcoming appointments</p>
        <button className="create-button" onClick={() => openNewAppointmentModal()}>
          Create Appointment
        </button>
      </div>
    );
  }

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(appointmentsByDate).sort((a, b) => {
    // Parse the dates in "Apr 21, 2025" format
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  return (
    <div className="appointment-cards-container">
      {sortedDates.map(date => (
        <div key={date}>
          <div className="date-header-container">
            <div className="date-header-text">{date}</div>
          </div>
          
          {appointmentsByDate[date].map(appointment => (
            <div 
              key={appointment.id}
              className="appointment-card compact"
            >
              <div className="card-main-content">
                <div className="card-time-section">
                  <div className="card-time-container">
                    <i className="fas fa-clock" style={{ color: '#0e9f6e' }}></i>
                    <span style={{ fontWeight: 500, color: '#333' }}>{appointment.time}</span>
                  </div>
                  <div className="card-location-container">
                    <i className="fas fa-map-marker-alt" style={{ color: '#0e9f6e' }}></i>
                    <span style={{ color: '#666' }}>{appointment.location || 'Hospital'}</span>
                  </div>
                </div>

                {appointment.patientName && (
                  <div className="card-patient-compact">
                    <div className="patient-item">
                      {appointment.profileImage ? (
                        <img
                          src={appointment.profileImage}
                          alt={`${appointment.patientName}'s profile`}
                          className="patient-avatar"
                        />
                      ) : (
                        <div className="patient-avatar-placeholder">
                          {appointment.patientName.charAt(0)}
                        </div>
                      )}
                      <div className="patient-details">
                        <div className="patient-name">{appointment.patientName}</div>
                        <div className="patient-meta">
                          {appointment.age || '25'} yrs • {appointment.purpose || 'Consultation'}
                          {appointment.status === 'Pending' && (
                            <span className="status-tag">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-actions-always-visible">
                {/* <button className="action-button reschedule" onClick={() => onReschedule(appointment)} title="Reschedule Appointment">
                  <i className="fas fa-calendar-alt"></i>
                  <span className="action-text">Reschedule</span>
                </button> */}
                <button className="action-button cancel" onClick={() => onCancel(appointment)} title="Cancel Appointment">
                  <i className="fas fa-times"></i>
                  <span className="action-text">Cancel</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const RequestAppointments = ({ appointments, onAccept, onDecline }) => {
  if (appointments.length === 0) {
    return (
      <div className="empty-container">
        <i className="fas fa-calendar-plus" style={{ fontSize: '60px', color: '#ccc' }}></i>
        <p className="empty-text">No appointment requests</p>
        <button className="create-button" onClick={() => openNewAppointmentModal()}>
          Create Appointment
        </button>
      </div>
    );
  }

  // Group by request date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = appointment.requestDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(appointmentsByDate).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  return (
    <div className="appointment-cards-container">
      {sortedDates.map(date => (
        <div key={date}>
          <div className="date-header-container">
            <div className="date-header-text">Requested on {date}</div>
          </div>
          
          {appointmentsByDate[date].map(appointment => (
            <div 
              key={appointment.id}
              className="appointment-card compact"
            >
              <div className="card-main-content">
                <div className="card-time-section">
                  <div className="card-time-container">
                    <i className="fas fa-calendar-day" style={{ color: '#0e9f6e' }}></i>
                    <span style={{ fontWeight: 500, color: '#333' }}>Preferred: {appointment.preferredDate}</span>
                  </div>
                  <div className="card-location-container">
                    <i className="fas fa-clock" style={{ color: '#0e9f6e' }}></i>
                    <span style={{ color: '#666' }}>{appointment.preferredTime}</span>
                  </div>
                </div>

                {appointment.patientName && (
                  <div className="card-patient-compact">
                    <div className="patient-item">
                      {appointment.profileImage ? (
                        <img
                          src={appointment.profileImage}
                          alt={`${appointment.patientName}'s profile`}
                          className="patient-avatar"
                        />
                      ) : (
                        <div className="patient-avatar-placeholder">
                          {appointment.patientName.charAt(0)}
                        </div>
                      )}
                      <div className="patient-details">
                        <div className="patient-name">{appointment.patientName}</div>
                        <div className="patient-meta">
                          {appointment.age || '25'} yrs • {appointment.purpose || 'Consultation'}
                          <span className="status-tag pending">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-actions-always-visible">
                <button className="action-button accept" onClick={() => onAccept(appointment)} title="Accept Request">
                  <i className="fas fa-check"></i>
                  <span className="action-text">Accept</span>
                </button>
                <button className="action-button cancel" onClick={() => onDecline(appointment)} title="Decline Request">
                  <i className="fas fa-times"></i>
                  <span className="action-text">Decline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-main">
        <div className="appointments-container">
          <div className="appointments-header">
            <h1>Appointments</h1>
            <button
              className="add-appointment-button"
              onClick={openNewAppointmentModal}
            >
              <i className="fas fa-plus"></i> New Appointment
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>Create New Appointment</h2>
                  <button
                    className="modal-close-button"
                    onClick={closeModal}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Select Date Mode</label>
                      <div className="date-selection-mode">
                        <button 
                          type="button"
                          className={`date-mode-button ${dateSelectionMode === 'custom' ? 'active' : ''}`}
                          onClick={() => setDateSelectionMode('custom')}
                        >
                          Custom Date
                        </button>
                        <button 
                          type="button"
                          className={`date-mode-button ${dateSelectionMode === 'weekly' ? 'active' : ''}`}
                          onClick={() => setDateSelectionMode('weekly')}
                        >
                          Weekly
                        </button>
                      </div>
                    </div>

                    {dateSelectionMode === 'custom' ? (
                      <div className="form-group calendar-wrapper">
                        <label>Select Date{newAppointment.selectedDates.length > 0 ? 's' : ''}</label>
                        <div className="date-display">
                          {newAppointment.selectedDates.length > 0 
                            ? `${newAppointment.selectedDates.length} date${newAppointment.selectedDates.length > 1 ? 's' : ''} selected` 
                            : formatDate(newAppointment.date)}
                        </div>

                        <div className="calendar">
                          <div className="calendar-header">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="calendar-nav-btn"
                              title="Previous Month"
                            >
                              <span className="nav-icon-default">&lt;</span>
                              <i className="fas fa-chevron-left nav-icon-hover"></i>
                            </button>
                            <div className="calendar-title">
                              {getMonthName(calendarDate.getMonth())}{' '}
                              {calendarDate.getFullYear()}
                            </div>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="calendar-nav-btn"
                              title="Next Month"
                            >
                              <span className="nav-icon-default">&gt;</span>
                              <i className="fas fa-chevron-right nav-icon-hover"></i>
                            </button>
                          </div>

                          <div className="calendar-grid">
                            <div className="calendar-weekday">Sun</div>
                            <div className="calendar-weekday">Mon</div>
                            <div className="calendar-weekday">Tue</div>
                            <div className="calendar-weekday">Wed</div>
                            <div className="calendar-weekday">Thu</div>
                            <div className="calendar-weekday">Fri</div>
                            <div className="calendar-weekday">Sat</div>

                            {generateCalendarWithMultiSelect(
                              calendarDate.getFullYear(),
                              calendarDate.getMonth()
                            ).map((day, index) => (
                              <div
                                key={index}
                                className={`calendar-day ${
                                  !day.isCurrentMonth ? 'inactive' : ''
                                } 
                                ${day.isToday ? 'today' : ''} 
                                ${day.isSelected ? 'selected' : ''} 
                                ${day.isPast ? 'past' : ''}
                                ${day.isSunday ? 'sunday' : ''}
                                ${day.isMultiSelected ? 'multi-selected' : ''}`}
                                onClick={() => handleMultiDateSelect(day)}
                              >
                                {day.day}
                              </div>
                            ))}
                          </div>
                        </div>

                        {newAppointment.selectedDates.length > 0 && (
                          <div className="selected-dates-container">
                            {newAppointment.selectedDates.map((date, index) => (
                              <div key={index} className="selected-date-badge">
                                {formatDate(date)}
                                <button 
                                  type="button" 
                                  className="remove-date-button"
                                  onClick={() => removeSelectedDate(index)}
                                  title="Remove date"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="weekly-mode-container">
                        <div className="form-group">
                          <label>Select Month & Year</label>
                          <div className="month-year-dropdown">
                            <select id="month-select" className="month-selector">
                              <option value="0">January</option>
                              <option value="1">February</option>
                              <option value="2">March</option>
                              <option value="3">April</option>
                              <option value="4">May</option>
                              <option value="5">June</option>
                              <option value="6">July</option>
                              <option value="7">August</option>
                              <option value="8">September</option>
                              <option value="9">October</option>
                              <option value="10">November</option>
                              <option value="11">December</option>
                            </select>
                            
                            <select id="year-select">
                              {getYearOptions().map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                            
                            <button 
                              type="button" 
                              onClick={addMonthYear}
                              title="Add Month/Year"
                            >
                              Add
                            </button>
                          </div>
                          
                          {newAppointment.selectedMonths.length > 0 && (
                            <div className="selected-month-year-chips">
                              {newAppointment.selectedMonths.map((item, index) => (
                                <div key={index} className="month-year-badge">
                                  {getMonthName(item.month)} {item.year}
                                  <button 
                                    type="button" 
                                    className="remove-month-button"
                                    onClick={() => removeMonthYear(index)}
                                    title="Remove month"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Select Days of Week</label>
                          <div className="weekday-selector">
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.sunday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('sunday')}
                            >
                              S
                            </button>
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.monday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('monday')}
                            >
                              M
                            </button>
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.tuesday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('tuesday')}
                            >
                              T
                            </button>
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.wednesday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('wednesday')}
                            >
                              W
                            </button>
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.thursday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('thursday')}
                            >
                              T
                            </button>
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.friday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('friday')}
                            >
                              F
                            </button>
                            <button
                              type="button"
                              className={`weekday-button ${newAppointment.weeklyDays.saturday ? 'selected' : ''}`}
                              onClick={() => toggleWeekday('saturday')}
                            >
                              S
                            </button>
                          </div>
                        </div>

                        {(Object.values(newAppointment.weeklyDays).some(day => day) && 
                           newAppointment.selectedMonths.length > 0) && (
                          <div className="selected-dates-info">
                            <p>This will schedule appointments on all selected days for the specified months.</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Time Selection */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={newAppointment.startTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="endTime">End Time</label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={newAppointment.endTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Location Selection */}
                    <div className="form-group location-form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Search for a location..."
                        value={newAppointment.location}
                        onChange={handleLocationSearch}
                        autoComplete="off"
                        required
                      />
                      
                      {isSearchingLocations && (
                        <div className="location-loading">
                          <div className="loading-spinner"></div>
                          <span>Searching locations...</span>
                        </div>
                      )}
                      
                      {showSuggestions && locationSuggestions.length > 0 && (
                        <ul className="location-suggestions">
                          {locationSuggestions.map((location) => (
                            <li 
                              key={location.id} 
                              onClick={() => selectLocation(location)}
                              title={location.address}
                            >
                              <strong>{location.name}</strong>
                              <span className="suggestion-address">{location.address}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {/* Purpose Field */}
                    {/* <div className="form-group">
                      <label htmlFor="purpose">Appointment Purpose</label>
                      <input
                        type="text"
                        id="purpose"
                        name="purpose"
                        placeholder="e.g., Follow-up Consultation, Mammogram, Check-up"
                        value={newAppointment.purpose}
                        onChange={handleInputChange}
                        required
                      />
                    </div> */}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="modal-cancel-button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="modal-submit-button">
                      Create Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="appointments-tabs">
            <button
              className={`tab-button ${
                activeTab === 'today' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('today')}
            >
              Today
            </button>
            <button
              className={`tab-button ${
                activeTab === 'upcoming' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`tab-button ${
                activeTab === 'requests' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          </div>

          {isLoading ? (
            <LoadingScreen show={isLoading} message='Loading appointments...' />
          ) : (
            <div className="appointments-table-container">
              <div className="table-controls">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search by patient name or purpose..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              {/* Card-based layout container */}
              {activeTab === 'today' && (
                <TodayAppointments 
                  appointments={displayedAppointments} 
                  onReschedule={(appointment) => {
                    // Replace with actual reschedule function
                    alert(`Reschedule appointment for ${appointment.patientName}`);
                  }}
                  onCancel={(appointment) => handleCancelAppointment(appointment)}
                />
              )}
              
              {activeTab === 'upcoming' && (
                <UpcomingAppointments 
                  appointments={filteredAndSortedAppointments} 
                  onReschedule={(appointment) => {
                    // Replace with actual reschedule function
                    alert(`Reschedule appointment for ${appointment.patientName}`);
                  }}
                  onCancel={(appointment) => handleCancelAppointment(appointment)}
                />
              )}
              
              {activeTab === 'requests' && (
                <RequestAppointments 
                  appointments={filteredAndSortedAppointments} 
                  onAccept={(appointment) => handleAcceptAppointment(appointment)}
                  onDecline={(appointment) => handleDeclineAppointment(appointment)}
                />
              )}
              
              {filteredAndSortedAppointments.length > recordsPerPage && (
                <div className="pagination-container">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt; Prev
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;