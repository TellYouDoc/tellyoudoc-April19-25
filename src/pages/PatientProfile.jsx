import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, Sector } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/PatientProfile.css';
import '../styles/FamilyStructure.css';
import '../styles/FamilyCancerHistory.css';
import '../styles/CancerMedical.css';
import '../styles/CancerOverview.css';
import '../styles/Health.css';
import '../styles/Wellness.css';
import '../styles/Addiction.css';
import FileViewer from '../components/FileViewer';

// Import icons
import { FaTrash } from 'react-icons/fa';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaFemale, FaHeartbeat, FaFemale as FaBreast, FaHospital, FaStickyNote, FaRibbon, FaRunning, FaAppleAlt, FaSmoking, FaClipboardList, FaBaby } from 'react-icons/fa';
import { MdMedicalServices, MdPersonalInjury, MdMedication, MdHealthAndSafety, MdOutlineMood } from 'react-icons/md';
import { BsFillFileEarmarkMedicalFill, BsClipboardPulse } from 'react-icons/bs';
import { GiMedicines, GiBodyHeight, GiWeightScale } from 'react-icons/gi';
import { TbChartHistogram, TbChartPie } from 'react-icons/tb';
import { RiMentalHealthFill } from 'react-icons/ri';

import apiService from '../services/api';


const PatientProfile = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('medical');
  const [activeMedicalTab, setActiveMedicalTab] = useState('mastalgia');
  const [activePersonalTab, setActivePersonalTab] = useState('cancer');
  const [activeCancerTab, setActiveCancerTab] = useState('overview');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [viewerFile, setViewerFile] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState(false);

  // Collapsable sections state
  const [expandedSections, setExpandedSections] = useState({
    painLevel: true,
    painDistribution: false,
    menstrualCorrelation: false,
    painInsights: false
  });

  // Pain Chart states
  const [chartDuration, setChartDuration] = useState('1month');
  const [showLineGraph, setShowLineGraph] = useState(false);
  const [activeBreast, setActiveBreast] = useState('left');

  // Mock pain data (this would come from your API)
  const [painData, setPainData] = useState([]);

  // Pain Distribution data with percentages based on duration
  const [painDistributionData, setPainDistributionData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Menstrual Correlation data
  const [menstrualCorrData, setMenstrualCorrData] = useState([]);

  // Calendar related states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateSymptoms, setSelectedDateSymptoms] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const [expandedCategories, setExpandedCategories] = useState({
    vision: false,
    cancer: false,
    musculoskeletal: false,
    gastrointestinal: false,
    respiratory: false,
    neurological: false,
    urological: false,
    diabetic: false,
    cardiac: false
  });
  // Menstrual history state
  const [menstrualHistory, setMenstrualHistory] = useState({
    status: '', // 'Started' or 'Not Started'
    startedAtAge: 0, // numeric value
    cycle: '', // 'Regular' or 'Irregular'
    menopause: {
      status: '', // 'Yes' or 'No'
      age: 0 // numeric value, default 50
    }
  });

  // Reproductive history state
  const [reproductiveHistory, setReproductiveHistory] = useState({
    pregnancy: '', // 'Yes' or 'No'
    pregnanciesCount: 0, // numeric value
    firstPregnancyBefore30: '', // 'Yes' or 'No'
    miscarriages: 0, // numeric value
    abortions: 0, // numeric value
    motherhood: '', // 'Yes' or 'No'
    motherhoodDetails: {
      ageAtFirstChild: 0, // numeric value
      numberOfChildren: 0, // numeric value
      breastfed: '', // 'Yes' or 'No'
      breastfeedingDuration: '' // string value
    },
    pregnancyDetails: {
      numberOfPregnancies: 0,
      ageAtFirstPregnancy: 0,
      complications: ''
    }
  });

  // Health data state for personal tab's health section
  const [healthData, setHealthData] = useState({
    chronicConditions: {
      vision: [],
      cancer: [],
      musculoskeletal: [],
      gastrointestinal: [],
      respiratory: [],
      neurological: [],
      urological: [],
      diabetic: [],
      cardiac: []
    },
    infectiousDiseases: [],
    vaccinations: [],
    surgeryHistory: '',
    allergies: [],
    alternativeMedicine: [],
    menstruation: '',
    menstruationCycle: '',
    reproductiveHealth: [],
    hospitalization: {
      reason: '',
      duration: ''
    },
    emotional: {
      psychiatricConditions: [],
      psychiatricAdmission: '',
      mentalHealth: {},
      socialEngagement: '',
      trauma: {
        childhood: '',
        recent: []
      },
      handlingEmotions: '',
      neurologicalConditions: []
    }
  });

  // Cancer family history data
  const [familyCancerHistory, setFamilyCancerHistory] = useState({
    immediate: {
      breastCancer: [
        { relation: "", age: "" }
      ],
      ovarianCancer: [
        { relation: "", age: "" }
      ],
      cervicalCancer: [
        { relation: "", age: "" }
      ],
      otherCancer: []
    },
    extended: {
      breastCancer: [
        { relation: "", age: "" },
      ],
      ovarianCancer: [
        { relation: "", age: "" }
      ],
      cervicalCancer: [
        { relation: "", age: "" }
      ],
      otherCancer: [
        { relation: "", age: "", type: "" },
      ]
    },
    summary: {
      breastCancer: 0,
      ovarianCancer: 0,
      cervicalCancer: 0,
      otherCancer: 0
    }
  });

  const [familyStructure, setFamilyStructure] = useState({
    children: {
      son: { total: 0, alive: 0, deceased: 0 },
      daughter: { total: 0, alive: 0, deceased: 0 }
    },
    siblings: {
      brother: { total: 0, alive: 0, deceased: 0 },
      sister: { total: 0, alive: 0, deceased: 0 }
    },
    parents: {
      father: { status: '', age: 0 },
      mother: { status: '', age: 0 }
    }
  });

  const [comorbidities, setComorbidities] = useState({
    hasComorbidities: false,
    list: [],
    other: ""
  });

  const [medications, setMedications] = useState({
    past: [],
    ongoing: []
  });

  const [lifestyleData, setLifestyleData] = useState({
    addiction: {
      smokingFrequency: "N/A",
      alcoholFrequency: "N/A",
      coffeeFrequency: "N/A",
      teaFrequency: "N/A",
      edibleTobaccoFrequency: "N/A",
      edibleTobaccooption: [],
      edibleTobaccoOther: "",
      prescriptionDrugMention: "",
      whichSocialMedia: [],
      otherSocialMedia: "",
      sMediaDurationPerDay: "N/A",
      shoppingMode: []
    },
    wellness: {
      dietType: "N/A",
      regularStress: "No",
      stressType: [],
      otherStressType: "",
      workingType: "N/A",
      hoursSpentSitting: "N/A",
      sleepDuration: "N/A",
      sleepInterruption: "N/A"
    }
  });

  const [testData, setTestData] = useState({
    BreastRelatedTests: { anyBreastCancerTests: "No", breastCancerTestRecords: [] },
    Biopsy: { anyBiopsies: "No", biopsyRecords: [] },
    Surgeries: { breastSurgeries: "No", breastSurgeryRecords: [] }
  });

  // Toggle function for collapsable sections
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Toggle line graph function
  const toggleLineGraph = () => {
    setShowLineGraph(!showLineGraph);
  };

  // ✅ Fetch prescription data
  const fetchPrescriptionData = async () => {
    try {
      const response = await apiService.patientDoctorService.getPescriptions(id);
      const PrescriptionData = response.data?.data || response.data || [];

      // Only proceed if we have data and it's an array
      if (PrescriptionData && Array.isArray(PrescriptionData) && PrescriptionData.length > 0) {
        setPatient(prev => ({
          ...prev,
          prescriptionFiles: PrescriptionData.map((item) => ({
            id: item._id,
            name: item.fileName || item.s3Key.split('/').pop() || "Prescription",
            uploadDate: item.createdAt,
            uri: item.fileUri,
          })),
        }));
      } else {
        console.log("No prescription files found or invalid data format");
        setPatient(prev => ({
          ...prev,
          prescriptionFiles: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching prescription data:", error);
    }
  };
  // ✅ Fetch reports data
  const fetchReportsData = async () => {
    try {
      const response = await apiService.patientDoctorService.getReports(id);
      const reportsData = response.data?.data || response.data || [];

      // Only proceed if we have data and it's an array
      setPatient(prev => ({
        ...prev,
        reportFiles: reportsData.map((item) => ({
          id: item._id,
          name: item.fileName || item.s3Key.split('/').pop() || "Report",
          uploadDate: item.createdAt,
          uri: item.fileUri,
        })),
      }));
    } catch (error) {
      console.error("Error fetching reports data:", error);
    }
  };

  // ✅ Fetch breast health data for the selected date
  const fetchBreastHealthForDate = async (date) => {
    try {
      const formatDate = (date) => {
        // Ensure we're working with a Date object
        const dateObj = new Date(date);
        // Make sure the date is valid
        if (isNaN(dateObj.getTime())) {
          console.error("Invalid date provided:", date);
          return null;
        }
        // Use UTC date to avoid timezone issues
        return new Date(
          Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
        ).toISOString().split("T")[0];
      };
      const dateStr = formatDate(date);
      const response = await apiService.patientDoctorService.getBreastHealth(id, dateStr);
      const data = response?.data;

      // If we have data for this date, format it to match our symptom data structure
      if (data) {
        // Create a properly formatted structure for the selected date
        const formattedSymptom = {
          breast: {
            lump: {
              left: data.lumpSide?.includes('Left') ? (data.lumpType?.left || ['Hard'])[0] : 'None',
              right: data.lumpSide?.includes('Right') ? (data.lumpType?.right || ['Hard'])[0] : 'None',
              leftImage: data.lumpImage && data.lumpImage.length > 0 ? data.lumpImage[0]?.left : null,
              rightImage: data.lumpImage && data.lumpImage.length > 0 ? data.lumpImage[0]?.right : null,
            },
            pain: {
              painRating: data.painLevel || 0,
              painLocations: [...(data.leftBreastLocations || []), ...(data.rightBreastLocations || [])]
            },
            rashes: {
              hasRashes: data.haveRashes === 'Yes',
              image: data.rasheImage && data.rasheImage.length > 0 ? data.rasheImage[0] : null,
            },
            symmetry: data.haveBreastSymmetry || 'Symmetric',
            swelling: {
              left: data.swellingSide?.includes('Left') || false,
              right: data.swellingSide?.includes('Right') || false,
              leftImage: data.swellingImage?.left != null ? data.swellingImage?.left : null,
              rightImage: data.swellingImage?.right != null ? data.swellingImage?.right : null,
            },
            itching: data.itchingSide || []
          },
          nipple: {
            inversion: {
              left: data.leftNippleInversion || 'Normal',
              right: data.rightNippleInversion || 'Normal'
            },
            discharge: {
              type: data.nippleDischarge || 'None',
              details: data.unusualNippleDischargeColor || ''
            }
          }
        };

        setSelectedDateSymptoms(formattedSymptom);
      } else {
        setSelectedDateSymptoms(null);
      }
    } catch (error) {
      console.error("Error fetching breast health data for date:", error);
      setSelectedDateSymptoms(null);
    }
  };

  // ✅ Fetch Notes data
  const fetchNotesData = async () => {
    try {
      setNotesLoading(true);
      const response = await apiService.patientDoctorService.getNotes(id);
      if (response.data) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes data:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  // ✅ Fetch Family History data
  const fetchFamilyHistoryData = async () => {
    try {
      const response = await apiService.patientDoctorService.getFamilyHistory(id);
      const data = response.data?.data || response.data || {};

      // Initialize counters for summary
      let breastCancerCount = 0;
      let ovarianCancerCount = 0;
      let cervicalCancerCount = 0;
      let otherCancerCount = 0;

      // Process and format the data
      const formattedData = {
        immediate: {
          breastCancer: [],
          ovarianCancer: [],
          cervicalCancer: [],
          otherCancer: []
        },
        extended: {
          breastCancer: [],
          ovarianCancer: [],
          cervicalCancer: [],
          otherCancer: []
        },
        summary: {
          breastCancer: 0,
          ovarianCancer: 0,
          cervicalCancer: 0,
          otherCancer: 0
        }
      };

      // Process breast cancer records
      if (data.breastCancer === "Yes" && Array.isArray(data.breastCancerRecords)) {
        data.breastCancerRecords.forEach(record => {
          const cancerRecord = {
            relation: record.relation,
            age: record.ageOfDiagnosis || "Unknown"
          };

          if (record.familySide === "Immediate") {
            formattedData.immediate.breastCancer.push(cancerRecord);
          } else {
            formattedData.extended.breastCancer.push(cancerRecord);
          }
          breastCancerCount++;
        });
      }

      // Process ovarian cancer records
      if (data.ovarianCancer === "Yes" && Array.isArray(data.ovarianCancerRecords)) {
        data.ovarianCancerRecords.forEach(record => {
          const cancerRecord = {
            relation: record.relation,
            age: record.ageOfDiagnosis || "Unknown"
          };

          if (record.familySide === "Immediate") {
            formattedData.immediate.ovarianCancer.push(cancerRecord);
          } else {
            formattedData.extended.ovarianCancer.push(cancerRecord);
          }
          ovarianCancerCount++;
        });
      }

      // Process cervical cancer records
      if (data.cervicalCancer === "Yes" && Array.isArray(data.cervicalCancerRecords)) {
        data.cervicalCancerRecords.forEach(record => {
          const cancerRecord = {
            relation: record.relation + (record.relationSide ? ` (${record.relationSide})` : ''),
            age: record.ageOfDiagnosis || "Unknown"
          };

          if (record.familySide === "Immediate") {
            formattedData.immediate.cervicalCancer.push(cancerRecord);
          } else {
            formattedData.extended.cervicalCancer.push(cancerRecord);
          }
          cervicalCancerCount++;
        });
      }

      // Process other cancer records
      if (data.otherCancer === "Yes" && Array.isArray(data.otherCancerRecords)) {
        data.otherCancerRecords.forEach(record => {
          const cancerRecord = {
            relation: record.relation,
            age: record.ageOfDiagnosis || "Unknown",
            type: record.cancerType || "Unknown"
          };

          if (record.familySide === "Immediate") {
            formattedData.immediate.otherCancer.push(cancerRecord);
          } else {
            formattedData.extended.otherCancer.push(cancerRecord);
          }
          otherCancerCount++;
        });
      }

      // Update summary counts
      formattedData.summary = {
        breastCancer: breastCancerCount,
        ovarianCancer: ovarianCancerCount,
        cervicalCancer: cervicalCancerCount,
        otherCancer: otherCancerCount
      };

      // Set the formatted data to state
      setFamilyCancerHistory(formattedData);
    }
    catch (error) {
      console.error("Error fetching family history data:", error);
    }
  };

  // ✅ Fetch Personal Medical History data
  const fetchPersonalMedicalHistory = async () => {
    try {
      const response = await apiService.patientDoctorService.getPersonalMedicalHistory(id);
      const data = response.data?.data || response.data || {};

      // Process menstrual history data
      if (data.MenstrualHistory) {
        const menstrualData = data.MenstrualHistory;
        setMenstrualHistory({
          status: menstrualData.menstruationStarted === "Yes" ? "Started" : "Not Started",
          startedAtAge: parseInt(menstrualData.menstruationStartedAge) || 0,
          cycle: menstrualData.menstrualcycle === "Yes" ? "Regular" : "Irregular",
          menopause: {
            status: menstrualData.menopause || "No",
            age: parseInt(menstrualData.ageofmenopause) || 0
          }
        });
      }

      // Process reproductive history data
      if (data.ReproductiveHistory) {
        const reproData = data.ReproductiveHistory;
        setReproductiveHistory({
          pregnancy: reproData.pregnancy || "No",
          pregnanciesCount: parseInt(reproData.numofpregnancy) || 0,
          firstPregnancyBefore30: reproData.firstpregbef30 || "No",
          miscarriages: parseInt(reproData.numofmiscarriage) || 0,
          abortions: parseInt(reproData.numofabortion) || 0,
          motherhood: reproData.mother || "No",
          motherhoodDetails: {
            ageAtFirstChild: parseInt(reproData.ageofmotherhood) || 0,
            numberOfChildren: parseInt(reproData.numofkids) || 0,
            breastfed: reproData.breastfed || "No",
            breastfeedingDuration: reproData.duration || "None"
          },
          pregnancyDetails: {
            numberOfPregnancies: parseInt(reproData.numofpregnancy) || 0,
            ageAtFirstPregnancy: parseInt(reproData.ageofmotherhood) || 0,
            complications: reproData.miscarragies === "Yes" || reproData.abortions === "Yes"
              ? `Miscarriages: ${reproData.numofmiscarriage || 0}, Abortions: ${reproData.numofabortion || 0}`
              : "None"
          }
        });
      }
    }
    catch (error) {
      console.error("Error fetching personal medical history data:", error);
    }
  };

  // ✅ Fetch Comorbidities data
  const fetchComorbidities = async () => {
    try {
      const response = await apiService.patientDoctorService.getComorbidities(id);
      const data = response.data;

      if (data) {
        // Update comorbidities state
        setComorbidities({
          hasComorbidities: data.comorbid === "Yes",
          list: data.comorbidList || [],
          other: data.otherComorbid || ""
        });

        // Update medications state if medication records exist
        if (data.medicationRecords) {
          setMedications({
            past: data.medicationRecords.pastMedicationInfo || [],
            ongoing: data.medicationRecords.ongoingMedicationsInfo || []
          });
        }

        // Also update the patient object with medication count for summary display
        setPatient(prev => ({
          ...prev,
          medications: data.medicationRecords?.ongoingMedicationsInfo || [],
          biopsyCount: prev.biopsyCount || 0 // Keep existing biopsy count if present
        }));
      }
    } catch (error) {
      console.error("Error fetching comorbidities data:", error);
    }
  };

  // ✅ Fetch Health data for personal tab's health section
  const fetchHealthData = async () => {
    try {
      const response = await apiService.patientDoctorService.getMedicalHistory(id);
      const data = response.data?.data || response.data || {};

      if (data) {
        const { emotionalHistory, medicalHistory } = data;

        // Helper function to process arrays containing "Other"/"Others" values
        const processOtherValues = (array, otherValue) => {
          if (!array || !Array.isArray(array) || !otherValue) return array || [];

          const result = [...array];
          // Find and remove "Other" or "Others" entries
          const otherIndex = result.findIndex(item =>
            item === "Other" || item === "Others" || item === "other_treatments"
          );

          if (otherIndex !== -1) {
            result.splice(otherIndex, 1);
            // Add the actual value instead
            if (otherValue && otherValue.trim()) {
              result.push(otherValue);
            }
          }

          return result;
        };

        // Process psychiatric conditions
        const psychiatricConditions = processOtherValues(
          emotionalHistory?.psychiatricName,
          emotionalHistory?.psychiatricNameOther
        );

        // Process neurological conditions
        const neurologicalConditions = processOtherValues(
          emotionalHistory?.neurologName,
          emotionalHistory?.neurologNameOther
        );

        // Process recent trauma
        const recentTrauma = processOtherValues(
          emotionalHistory?.recentTraumaName,
          emotionalHistory?.recentTraumaNameOther
        );

        // Process infectious diseases
        const infectiousDiseases = processOtherValues(
          medicalHistory?.infectname,
          medicalHistory?.infectnameOther
        );

        // Process allergies if needed
        const allergies = medicalHistory?.allergiesname || [];

        // Process alternative medicine
        const alternativeMedicine = processOtherValues(
          medicalHistory?.alterMedname,
          medicalHistory?.alterMednamementions
        );

        // Process reproductive health conditions
        const reproductiveHealthConditions = processOtherValues(
          medicalHistory?.reproductiveHealthCondition,
          medicalHistory?.reproductiveHealthConditionOther
        );

        // Add this code to your fetchHealthData function after your existing vision and cancer processing
        // Inside the if (medicalHistory?.chronicConditionRecord) { ... } block

        // Process musculoskeletal conditions
        const musculoskeletalConditions = processOtherValues(
          medicalHistory.chronicConditionRecord.musculoskeletalType,
          medicalHistory.chronicConditionRecord.musculoskeletalTypeOther
        );

        // Process gastrointestinal conditions
        const gastrointestinalConditions = processOtherValues(
          medicalHistory.chronicConditionRecord.gasType,
          medicalHistory.chronicConditionRecord.gasTypeOther
        );

        // Process respiratory conditions
        const respiratoryConditions = processOtherValues(
          medicalHistory.chronicConditionRecord.resType,
          medicalHistory.chronicConditionRecord.resTypeOther
        );

        // Process neurological conditions (if any)
        const neurologicalConditionsDis = processOtherValues(
          medicalHistory.chronicConditionRecord.neuroType,
          medicalHistory.chronicConditionRecord.neuroTypeOther
        );

        // Process urological conditions (if any)
        const urologicalConditions = processOtherValues(
          medicalHistory.chronicConditionRecord.urologicalType,
          medicalHistory.chronicConditionRecord.urologicalTypeOther
        );

        // Process diabetic conditions (if any)
        const diabeticConditions = processOtherValues(
          medicalHistory.chronicConditionRecord.diabatType,
          medicalHistory.chronicConditionRecord.diabatTypeOther
        );

        // Process cardiac conditions (if any)
        const cardiacConditions = processOtherValues(
          medicalHistory.chronicConditionRecord.cardType,
          medicalHistory.chronicConditionRecord.cardTypeOther
        );
        // Process chronic condition records if they exist
        let visionConditions = [];
        let cancerConditions = [];

        if (medicalHistory?.chronicConditionRecord) {
          // Process vision conditions
          visionConditions = processOtherValues(
            medicalHistory.chronicConditionRecord.visionCondition,
            medicalHistory.chronicConditionRecord.visionConditionOther
          );

          // Process cancer types
          cancerConditions = processOtherValues(
            medicalHistory.chronicConditionRecord.cancerType,
            medicalHistory.chronicConditionRecord.cancerTypeOther
          );
        }

        // Create a structured healthData object from the API response with processed values
        setHealthData({
          // Update the chronicConditions section in your setHealthData call
          chronicConditions: {
            vision: visionConditions,
            cancer: cancerConditions,
            musculoskeletal: musculoskeletalConditions,
            gastrointestinal: gastrointestinalConditions,
            respiratory: respiratoryConditions,
            neurological: neurologicalConditionsDis,
            urological: urologicalConditions,
            diabetic: diabeticConditions,
            cardiac: cardiacConditions
          },
          infectiousDiseases: infectiousDiseases,
          vaccinations: medicalHistory?.selectedVaccine || [],
          surgeryHistory: medicalHistory?.surgeryname || '',
          allergies: allergies,
          alternativeMedicine: alternativeMedicine,
          menstruation: medicalHistory?.menstruation || '',
          menstruationCycle: medicalHistory?.menstruationCycle || '',
          reproductiveHealth: reproductiveHealthConditions || [],
          hospitalization: {
            reason: medicalHistory?.hospitalizationDetails || '',
            duration: medicalHistory?.hospitalizationnameDuration
              ? `${medicalHistory.hospitalizationnameDuration} ${medicalHistory.hospitalizationnameDurationname || 'Month'}`
              : ''
          },
          emotional: {
            psychiatricConditions: psychiatricConditions,
            psychiatricAdmission: emotionalHistory?.psychiatricAdmissionTime || '',
            mentalHealth: emotionalHistory?.mentalHistoryRelation?.length > 0
              ? [emotionalHistory.mentalHistoryRelation]
              : [],
            socialEngagement: emotionalHistory?.socialLife || '',
            trauma: {
              childhood: emotionalHistory?.childhoodTraumaName || '',
              recent: recentTrauma
            },
            handlingEmotions: emotionalHistory?.ability || '',
            neurologicalConditions: neurologicalConditions
          }
        });
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  // ✅ Fetch Lifestyle data
  const fetchLifestyleData = async () => {
    try {
      const response = await apiService.patientDoctorService.getLifestyleHistory(id);
      const data = response.data?.data || response.data || {};
      setLifestyleData({
        addiction: data.addiction || {
          smokingFrequency: "N/A",
          alcoholFrequency: "N/A",
          coffeeFrequency: "N/A",
          teaFrequency: "N/A",
          edibleTobaccoFrequency: "N/A",
          edibleTobaccooption: [],
          edibleTobaccoOther: "",
          prescriptionDrugMention: "",
          whichSocialMedia: [],
          otherSocialMedia: "",
          sMediaDurationPerDay: "N/A",
          shoppingMode: []
        },
        wellness: data.wellness || {
          dietType: "N/A",
          regularStress: "No",
          stressType: [],
          otherStressType: "",
          workingType: "N/A",
          hoursSpentSitting: "N/A",
          sleepDuration: "N/A",
          sleepInterruption: "N/A"
        }
      });
    } catch (error) {
      console.error("Error fetching lifestyle data:", error);
    }
  };

  // ✅ Fetch Test, Biopsy & Surgery data
  const fetchTestData = async () => {
    try {
      const response = await apiService.patientDoctorService.getBiopsyData(id);
      const data = response.data?.data || response.data || {};
      setTestData({
        Biopsy: {
          anyBiopsies: data.anyBiopsies || "No",
          biopsyRecords: data.biopsyRecords || []
        },
        Surgeries: {
          breastSurgeries: data.anyBreastSurgeries || "No",
          breastSurgeryRecords: data.breastSurgeryRecords || []
        },
        BreastRelatedTests: {
          anyBreastCancerTests: data.anyBreastCancerTest || "No",
          breastCancerTestRecords: data.breastCancerTestRecords || []
        },
      });
    } catch (error) {
      console.error("Error fetching test data:", error);
    }
  };

  // Unified data fetching
  useEffect(() => {
    setIsLoading(true);

    const fetchAllData = async () => {
      try {
        // Fetch patient profile data
        const patientResponse = await apiService.patientDoctorService.getPatientProfile(id);
        setPatient(prev => ({
          ...prev,
          ...patientResponse.data
        }));

        // Fetch breast health dates for calendar marking
        const breastHealthDatesResponse = await apiService.patientDoctorService.getBreastHealthDates(id);
        const breastHealthDates = breastHealthDatesResponse.data?.data || [];

        // Mark dates in calendar
        const markedDates = breastHealthDates.reduce((acc, item) => {
          const date = new Date(item.date).toISOString().split('T')[0];
          acc[date] = { marked: true, dotColor: '#00BFFF' };
          return acc;
        }, {});

        setMarkedDates(markedDates);

        // Set latest date as selected date if available
        const dates = Object.keys(markedDates);
        if (dates.length > 0) {
          const datesObjects = dates.map(date => new Date(date));
          const latestDate = new Date(Math.max(...datesObjects));
          setSelectedDate(latestDate);

          // Fetch breast health data for the latest date
          await fetchBreastHealthForDate(latestDate);
        }

        // Fetch mastalgia chart data
        await fetchMastalgiaChartData();

        // Fetch brest health data
        await fetchBreastHealthForDate(selectedDate);

        // Fetch prescription data
        await fetchPrescriptionData();

        // Fetch reports data
        await fetchReportsData();

        // Fetch notes data
        await fetchNotesData();

        // Fetch family history data
        await fetchFamilyHistoryData();

        // Fetch personal medical history data
        await fetchPersonalMedicalHistory();

        // Fetch comorbidities data
        await fetchComorbidities();

        // Fetch health data
        await fetchHealthData();

        // Fetch lifestyle data
        await fetchLifestyleData();

        // Fetch test data
        await fetchTestData();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to fetch mastalgia chart data
    const fetchMastalgiaChartData = async () => {
      try {
        const response = await apiService.patientDoctorService.getMastalgiaChart(chartDuration, id);
        const data = response.data?.normalizedEntries || [];

        // Format data for pain level chart display
        const formattedData = data.map((entry) => {
          // Convert date to readable format
          const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          // Extract pain levels (assuming values between 0-5)
          const painLevel = entry.painLevel !== undefined ? parseInt(entry.painLevel) : 0;

          // Determine breast side
          const isLeftSide = entry.painBreastSide?.includes('Left') || false;
          const isRightSide = entry.painBreastSide?.includes('Right') || false;

          return {
            date: formattedDate,
            // Set values for chart display
            leftPain: isLeftSide ? painLevel : 0,
            rightPain: isRightSide ? painLevel : 0,
            // Store period day information for coloring
            periodDay: entry.periodDay?.toLowerCase() === 'yes',
            // Store original data for tooltips
            rawData: {
              typeOfPain: entry.typeOfPain,
              onsetOfPain: entry.onsetOfPain,
              durationOfPain: entry.painDuration,
              reliefMeasure: entry.specificPainRelief,
              selectedLeftLocations: entry.selectedLeftLocations || [],
              selectedRightLocations: entry.selectedRightLocations || []
            }
          };
        });

        // Sort data by date
        const sortedData = formattedData.sort((a, b) =>
          new Date(a.originalDate || a.date) - new Date(b.originalDate || b.date)
        );

        setPainData(sortedData);

        // Calculate menstrual correlation data from the normalized entries
        if (data.length > 0) {
          // Count entries by pain level during period days
          const painLevelCounts = {
            veryLow: 0,
            low: 0,
            medium: 0,
            high: 0,
            veryHigh: 0
          };

          let totalPeriodDays = 0;

          // Count the occurrences of each pain level during period days
          data.forEach(entry => {
            if (entry.periodDay?.toLowerCase() === 'yes') {
              totalPeriodDays++;
              const painLevel = entry.painLevel !== undefined ? parseInt(entry.painLevel) : 0;

              if (painLevel === 0 || painLevel === 1) {
                painLevelCounts.veryLow++;
              } else if (painLevel === 2) {
                painLevelCounts.low++;
              } else if (painLevel === 3) {
                painLevelCounts.medium++;
              } else if (painLevel === 4) {
                painLevelCounts.high++;
              } else if (painLevel === 5) {
                painLevelCounts.veryHigh++;
              }
            }
          });

          // Convert counts to percentages
          const getPercentage = (count) => (totalPeriodDays > 0) ? Math.round((count / totalPeriodDays) * 100) : 0;

          const menstrualFormattedData = [
            { name: 'Very High', value: getPercentage(painLevelCounts.veryHigh), color: '#ef4444' },
            { name: 'High', value: getPercentage(painLevelCounts.high), color: '#fb923c' },
            { name: 'Medium', value: getPercentage(painLevelCounts.medium), color: '#facc15' },
            { name: 'Low', value: getPercentage(painLevelCounts.low), color: '#a3e635' },
            { name: 'Very Low', value: getPercentage(painLevelCounts.veryLow), color: '#4ade80' }
          ];

          setMenstrualCorrData(menstrualFormattedData);
          setPainDistributionData(menstrualFormattedData);
        }
      } catch (error) {
        console.error("Error fetching mastalgia chart data:", error);
        setPainData([]);
      }
    };

    fetchAllData();
  }, [id]);

  // Fetch breast health data when selected date changes
  useEffect(() => {
    fetchBreastHealthForDate(selectedDate);
  }, [selectedDate]);

  // Fetch mastalgia chart data when chart duration changes
  useEffect(() => {
    if (!id) return;

    const fetchMastalgiaChartDataForDuration = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.patientDoctorService.getMastalgiaChart(chartDuration, id);
        const data = response.data?.normalizedEntries || [];

        // Process chart data (same logic as in the main fetch function)
        // ... (processing code omitted for brevity)

        // Format data for pain level chart display
        const formattedData = data.map((entry) => {
          // Convert date to readable format
          const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          // Extract pain levels (assuming values between 0-5)
          const painLevel = entry.painLevel !== undefined ? parseInt(entry.painLevel) : 0;

          // Determine breast side
          const isLeftSide = entry.painBreastSide?.includes('Left') || false;
          const isRightSide = entry.painBreastSide?.includes('Right') || false;

          return {
            date: formattedDate,
            // Set values for chart display
            leftPain: isLeftSide ? painLevel : 0,
            rightPain: isRightSide ? painLevel : 0,
            // Store period day information for coloring
            periodDay: entry.periodDay?.toLowerCase() === 'yes',
            // Store original data for tooltips
            rawData: {
              typeOfPain: entry.typeOfPain,
              onsetOfPain: entry.onsetOfPain,
              durationOfPain: entry.painDuration,
              reliefMeasure: entry.specificPainRelief,
              selectedLeftLocations: entry.selectedLeftLocations || [],
              selectedRightLocations: entry.selectedRightLocations || []
            }
          };
        });

        // Sort data by date
        const sortedData = formattedData.sort((a, b) =>
          new Date(a.originalDate || a.date) - new Date(b.originalDate || b.date)
        );

        setPainData(sortedData);

        // Calculate menstrual correlation data from the normalized entries
        if (data.length > 0) {
          // Count entries by pain level during period days
          const painLevelCounts = {
            veryLow: 0,
            low: 0,
            medium: 0,
            high: 0,
            veryHigh: 0
          };

          let totalPeriodDays = 0;

          // Count the occurrences of each pain level during period days
          data.forEach(entry => {
            if (entry.periodDay?.toLowerCase() === 'yes') {
              totalPeriodDays++;
              const painLevel = entry.painLevel !== undefined ? parseInt(entry.painLevel) : 0;

              if (painLevel === 0 || painLevel === 1) {
                painLevelCounts.veryLow++;
              } else if (painLevel === 2) {
                painLevelCounts.low++;
              } else if (painLevel === 3) {
                painLevelCounts.medium++;
              } else if (painLevel === 4) {
                painLevelCounts.high++;
              } else if (painLevel === 5) {
                painLevelCounts.veryHigh++;
              }
            }
          });

          // Convert counts to percentages
          const getPercentage = (count) => (totalPeriodDays > 0) ? Math.round((count / totalPeriodDays) * 100) : 0;

          const menstrualFormattedData = [
            { name: 'Very High', value: getPercentage(painLevelCounts.veryHigh), color: '#ef4444' },
            { name: 'High', value: getPercentage(painLevelCounts.high), color: '#fb923c' },
            { name: 'Medium', value: getPercentage(painLevelCounts.medium), color: '#facc15' },
            { name: 'Low', value: getPercentage(painLevelCounts.low), color: '#a3e635' },
            { name: 'Very Low', value: getPercentage(painLevelCounts.veryLow), color: '#4ade80' }
          ];

          setMenstrualCorrData(menstrualFormattedData);
          setPainDistributionData(menstrualFormattedData);
        }
      } catch (error) {
        console.error("Error fetching mastalgia chart data for duration:", error);
        setPainData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMastalgiaChartDataForDuration();
  }, [chartDuration, id]);

  const addNote = () => {
    setIsEditMode(false);
    setNoteText('');
    setShowNoteModal(true);
  };

  // Function to edit a note
  const editNote = (note) => {
    setIsEditMode(true);
    setSelectedNote(note);
    setNoteText(note.note);
    setShowNoteModal(true);
  };

  // Function to handle note save
  const handleNoteSave = async () => {
    if (!noteText.trim()) {
      alert("Please enter a note.");
      return;
    }

    try {
      if (isEditMode && selectedNote) {
        // Update existing note
        const updatedNote = {
          note: noteText.trim(),
          noteId: selectedNote._id
        };
        await apiService.patientDoctorService.updateNote(updatedNote);
      } else {
        // Add new note
        const newNoteEntry = {
          note: noteText.trim(),
          patientId: id
        };
        await apiService.patientDoctorService.addNote(newNoteEntry);
      }
      // Refresh notes data
      await fetchNotesData();
      // Close modal and reset state
      setShowNoteModal(false);
      setNoteText('');
      setSelectedNote(null);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  // Function to open delete confirmation
  const deleteNote = (note) => {
    setSelectedNote(note);
    setShowDeleteConfirmation(true);
  };

  // Function to handle note deletion
  const handleNoteDelete = async () => {
    try {
      await apiService.patientDoctorService.deleteNote(selectedNote._id);
      // Refresh notes data
      await fetchNotesData();
      setShowDeleteConfirmation(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  // Function to format the date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Sort notes by date
  const handleSortNotes = () => {
    const sorted = [...notes].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortAscending ? dateA - dateB : dateB - dateA;
    });
    setNotes(sorted);
    setSortAscending(!sortAscending);
  };

  // Function to get color based on pain level
  const getPainColor = (level) => {
    switch (level) {
      case 0: return '#4ade80'; // No pain - green
      case 1: return '#a3e635'; // Very mild - light green
      case 2: return '#facc15'; // Mild - yellow
      case 3: return '#fb923c'; // Moderate - orange
      case 4: return '#f87171'; // Severe - light red
      case 5: return '#ef4444'; // Very severe - red
      default: return '#4ade80';
    }
  };

  // Customize the chart tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pain-chart-tooltip">
          <p className="tooltip-date">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || getPainColor(entry.value) }}>
              {entry.name}: {entry.value} {entry.value === 1 ? 'point' : 'points'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleCategoryExpand = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Function for active shape in pie chart - modified to not show text in the center
  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Custom bar label component to show percentages
  const CustomBarLabel = (props) => {
    const { x, y, width, value, height } = props;
    return (
      <text
        x={x + width + 10}
        y={y + height / 2}
        fill="#1e293b"
        alignmentBaseline="middle"
        fontSize={14}
      >
        {`${value}%`}
      </text>
    );
  };

  // Function to render the chart based on toggle state
  const renderPainChart = () => {
    try {
      if (!painData || painData.length === 0) {
        return <div>No data available</div>;
      }

      const dataKey = activeBreast === 'left' ? 'leftPain' : 'rightPain';
      const name = `${activeBreast === 'left' ? 'Left' : 'Right'} Breast Pain`;

      // Always use ComposedChart which can show both bar and line
      return (
        <ComposedChart data={painData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={Math.floor(painData.length / 10) || 0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 12 }}
          />        <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Show the bar chart with colors based only on pain level */}
          <Bar
            dataKey={dataKey}
            name={`${name} (Bar)`}
          >
            {painData.map((entry, index) => {
              const painValue = entry[dataKey];
              // Use only pain level for coloring (no special color for period days)
              const barColor = getPainColor(painValue);

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={barColor}
                />
              );
            })}
          </Bar>

          {/* Conditionally show the line */}
          {showLineGraph && (
            <Line
              type="monotone"
              dataKey={dataKey}
              name={`${name} (Line)`}
              stroke="#06BE21" // Green color as in your mobile app
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ComposedChart>
      );
    } catch (error) {
      console.error("Error rendering pain chart:", error);
      return <div>Error rendering chart. Please check console for details.</div>;
    }
  };

  const viewFile = (url) => {
    console.log("File URL:", url.uri);

    if (!url) {
      alert(`Cannot open file: ${file.name}. File URL not found.`);
      return;
    }
    // Open the file in the FileViewer
    setViewerFile(url.uri);
    setShowFileViewer(true);
  };

  // Modified version of getFileIcon function to show image thumbnails

  const getFileIcon = (fileType, fileUrl) => {
    // Check if it's an image file and we have a URL
    const isImage = fileType &&
      (fileType.toLowerCase().includes('image') ||
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl));

    if (isImage && fileUrl) {
      // Return image thumbnail
      return (
        <img
          src={fileUrl}
          alt="File thumbnail"
          className="file-thumbnail"
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
      );
    }

    // If not an image or no URL, fall back to the icon rendering
    if (!fileType) {
      return <i className="far fa-file" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    }

    // The rest of your existing icon logic
    const type = fileType.toLowerCase();

    if (type.includes('pdf')) {
      return <i className="far fa-file-pdf" style={{ fontSize: '24px', color: '#dc3545' }}></i>;
    } else if (type.includes('doc') || type.includes('word')) {
      return <i className="far fa-file-word" style={{ fontSize: '24px', color: '#0d6efd' }}></i>;
    } else if (type.includes('xls') || type.includes('excel') || type.includes('sheet')) {
      return <i className="far fa-file-excel" style={{ fontSize: '24px', color: '#198754' }}></i>;
    } else if (type.includes('ppt') || type.includes('presentation')) {
      return <i className="far fa-file-powerpoint" style={{ fontSize: '24px', color: '#fd7e14' }}></i>;
    } else if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) {
      return <i className="far fa-file-archive" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    } else if (type.includes('txt') || type.includes('text')) {
      return <i className="far fa-file-alt" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    } else if (type.includes('html') || type.includes('code')) {
      return <i className="far fa-file-code" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    } else if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) {
      return <i className="far fa-file-audio" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    } else if (type.includes('video') || type.includes('mp4') || type.includes('mov')) {
      return <i className="far fa-file-video" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    } else {
      return <i className="far fa-file" style={{ fontSize: '24px', color: '#6c757d' }}></i>;
    }
  };
  // Function to download file
  const downloadFile = (url) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url.uri;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Cannot download file: ${file.name}. File URL not found.`);
    }
  };


  return (
    <div className="patient-profile-container">
      {/* Note Add/Edit Modal */}
      {showNoteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Note' : 'Add New Note'}</h2>
              <button
                className="modal-close-button"
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                  setSelectedNote(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Note Text:</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note here..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-cancel-button"
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                  setSelectedNote(null);
                }}
              >
                Cancel
              </button>
              <button
                className="modal-submit-button"
                onClick={handleNoteSave}
                disabled={!noteText.trim()}
              >
                {isEditMode ? 'Save Changes' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Delete Note</h2>
              <button
                className="modal-close-button"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setSelectedNote(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this note?</p>
              <p className="delete-note-preview">{selectedNote?.text}</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-cancel-button"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setSelectedNote(null);
                }}
              >
                Cancel
              </button>
              <button
                className="modal-delete-button"
                onClick={handleNoteDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {showFileViewer && viewerFile && (
        <FileViewer
          file={viewerFile}
          onClose={() => {
            setShowFileViewer(false);
            setViewerFile(null);
          }}
        />
      )}

      {isLoading ? (
        <LoadingScreen show={isLoading} message="Loading Patient Profile..." />
      ) : (
        <>

          <div className="patient-profile-content">

            {/* Patient Header Card */}
            <div className="patient-header-card">
              <div className="patient-header-info">
                <img
                  src={patient?.profileImage}
                  className="patient-avatar"
                />
                <div className="patient-basic-info">
                  <h3 className="patient-name">{patient?.firstName + " " + (patient?.middleName ? patient?.middleName + " " : "") + patient?.lastName || 'N/A'}</h3>
                  <div className="patient-attributes">
                    <span className="patient-gender">{patient?.gender}</span>
                    <span className="attribute-separator">•</span>
                    <span className="patient-age">{patient?.age} years</span>
                    <span className="attribute-separator">•</span>
                    <div className="status-badge">{patient?.isActive ? "Active" : "Inactive"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Tab Navigation */}
            <div className="profile-tabs">
              <button
                className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                <MdMedicalServices className="icon-margin-right" /> Medical
              </button>
              <button
                className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <MdPersonalInjury className="icon-margin-right" /> Personal
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">

              {/* ✅❤️ Medical Tab Content */}
              {activeTab === 'medical' && (
                <div className="medical-content">
                  {/* Medical Sub Tabs */}
                  <div className="medical-subtabs">
                    <button
                      className={`subtab-button ${activeMedicalTab === 'mastalgia' ? 'active' : ''}`}
                      onClick={() => setActiveMedicalTab('mastalgia')}
                    >
                      <FaHeartbeat className="icon-margin-right" /> Mastalgia
                    </button>
                    <button
                      className={`subtab-button ${activeMedicalTab === 'breast' ? 'active' : ''}`}
                      onClick={() => setActiveMedicalTab('breast')}
                    >
                      <FaBreast className="icon-margin-right" /> Breast
                    </button>
                    <button
                      className={`subtab-button ${activeMedicalTab === 'prescription' ? 'active' : ''}`}
                      onClick={() => setActiveMedicalTab('prescription')}
                    >
                      <MdMedication className="icon-margin-right" /> Prescription
                    </button>
                    <button
                      className={`subtab-button ${activeMedicalTab === 'reports' ? 'active' : ''}`}
                      onClick={() => setActiveMedicalTab('reports')}
                    >
                      <BsFillFileEarmarkMedicalFill className="icon-margin-right" /> Reports
                    </button>
                    <button
                      className={`subtab-button ${activeMedicalTab === 'treatment' ? 'active' : ''}`}
                      onClick={() => setActiveMedicalTab('treatment')}
                    >
                      <GiMedicines className="icon-margin-right" /> Treatment
                    </button>
                  </div>

                  {/* Medical Sub Tab Content */}
                  <div className="subtab-content">
                    {/* ✅ Mastalgia Chart Tab */}
                    {activeMedicalTab === 'mastalgia' && (
                      <div className="mastalgia-content">
                        <div className="details-section">
                          <h2><FaHeartbeat className="icon-margin-right" /> Mastalgia Information</h2>

                          {/* Collapsable section: Pain Level Chart */}
                          <div className="collapsable-section">
                            <div
                              className="collapsable-header"
                              onClick={() => toggleSection('painLevel')}
                            >
                              <h3><TbChartHistogram className="icon-margin-right" /> Pain Level Chart</h3>
                              <span className={`collapse-icon ${expandedSections.painLevel ? 'expanded' : ''}`}>
                                &#9650;
                              </span>
                            </div>
                            <div className={`collapsable-content ${expandedSections.painLevel ? 'expanded' : ''}`}>
                              <div className="info-card">
                                {/* Chart Controls */}
                                <div className="chart-controls">
                                  <div className="chart-duration">
                                    <label htmlFor="duration-select">Duration:</label>
                                    <select
                                      id="duration-select"
                                      value={chartDuration}
                                      onChange={(e) => setChartDuration(e.target.value)}
                                    >
                                      <option value="1month">1 Month</option>
                                      <option value="2months">2 Month</option>
                                      <option value="3months">3 Month</option>
                                      <option value="6months">6 Month</option>
                                    </select>
                                  </div>

                                  <div className="line-graph-toggle">
                                    <label htmlFor="line-toggle" onClick={toggleLineGraph}>Line Graph:</label>
                                    <div className="toggle-switch" onClick={toggleLineGraph}>
                                      <input
                                        type="checkbox"
                                        id="line-toggle"
                                        checked={showLineGraph}
                                        onChange={toggleLineGraph}
                                      />
                                      <span className="toggle-slider"></span>
                                    </div>
                                  </div>
                                </div>

                                {/* Breast Selection */}
                                <div className="breast-selection">
                                  <button
                                    className={`breast-button ${activeBreast === 'left' ? 'active' : ''}`}
                                    onClick={() => setActiveBreast('left')}
                                  >
                                    Left Breast
                                  </button>
                                  <button
                                    className={`breast-button ${activeBreast === 'right' ? 'active' : ''}`}
                                    onClick={() => setActiveBreast('right')}
                                  >
                                    Right Breast
                                  </button>
                                </div>

                                {/* Pain Level Color Legend */}
                                <div className="pain-level-legend">
                                  <div className="legend-title">Pain Level:</div>
                                  <div className="legend-items">
                                    <div className="legend-item">
                                      <div className="legend-color" style={{ backgroundColor: getPainColor(0) }}></div>
                                      <span>0 - None</span>
                                    </div>
                                    <div className="legend-item">
                                      <div className="legend-color" style={{ backgroundColor: getPainColor(1) }}></div>
                                      <span>1 - Very low</span>
                                    </div>
                                    <div className="legend-item">
                                      <div className="legend-color" style={{ backgroundColor: getPainColor(2) }}></div>
                                      <span>2 - Low</span>
                                    </div>
                                    <div className="legend-item">
                                      <div className="legend-color" style={{ backgroundColor: getPainColor(3) }}></div>
                                      <span>3 - Medium</span>
                                    </div>
                                    <div className="legend-item">
                                      <div className="legend-color" style={{ backgroundColor: getPainColor(4) }}></div>
                                      <span>4 - High</span>
                                    </div>
                                    <div className="legend-item">
                                      <div className="legend-color" style={{ backgroundColor: getPainColor(5) }}></div>
                                      <span>5 - Very high</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Pain Chart */}
                                <div className="pain-chart">
                                  <ResponsiveContainer width="100%" height={300}>
                                    {renderPainChart()}
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Collapsable section: Pain Distribution */}
                          <div className="collapsable-section">
                            <div
                              className="collapsable-header"
                              onClick={() => toggleSection('painDistribution')}
                            >
                              <h3><TbChartPie className="icon-margin-right" /> Pain Distribution</h3>
                              <span className={`collapse-icon ${expandedSections.painDistribution ? 'expanded' : ''}`}>
                                &#9650;
                              </span>
                            </div>
                            <div className={`collapsable-content ${expandedSections.painDistribution ? 'expanded' : ''}`}>
                              <div className="info-card">
                                <div className="pain-distribution-info">
                                  <h4>Pain Intensity Distribution</h4>
                                  <p>This chart shows the percentage distribution of pain intensity levels over the {chartDuration.toLowerCase()} period.</p>
                                </div>

                                {/* Duration selector for pie chart */}
                                <div className="chart-controls">
                                  <div className="chart-duration">
                                    <label htmlFor="pie-duration-select">Duration:</label>
                                    <select
                                      id="pie-duration-select"
                                      value={chartDuration}
                                      onChange={(e) => setChartDuration(e.target.value)}
                                    >
                                      <option value="1month">1 Month</option>
                                      <option value="2months">2 Month</option>
                                      <option value="3months">3 Month</option>
                                      <option value="6months">6 Month</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="pain-distribution-chart">
                                  <ResponsiveContainer width="100%" height={300}>
                                    {(() => {
                                      try {
                                        return (
                                          <PieChart>
                                            <Pie
                                              activeIndex={activeIndex}
                                              activeShape={renderActiveShape}
                                              data={painDistributionData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={0}
                                              outerRadius={90}
                                              paddingAngle={1}
                                              dataKey="value"
                                              onMouseEnter={(_, index) => setActiveIndex(index)}
                                              isAnimationActive={false}
                                            >
                                              {painDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={1} />
                                              ))}
                                            </Pie>
                                            <Tooltip
                                              formatter={(value) => `${value}%`}
                                              labelFormatter={(index) => painDistributionData[index]?.name || ''}
                                            />
                                            <Legend
                                              layout="vertical"
                                              verticalAlign="middle"
                                              align="right"
                                              formatter={(value, entry, index) => (
                                                <span style={{ color: '#1e293b' }}>
                                                  {value.replace(' Pain', '')}: {painDistributionData[index]?.value}%
                                                </span>
                                              )}
                                            />
                                          </PieChart>
                                        );
                                      } catch (error) {
                                        console.error("Error rendering pain distribution chart:", error);
                                        return <div>Error rendering chart. Please check console for details.</div>;
                                      }
                                    })()}
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Collapsable section: Menstrual Correlation */}
                          <div className="collapsable-section">
                            <div
                              className="collapsable-header"
                              onClick={() => toggleSection('menstrualCorrelation')}
                            >
                              <h3><FaFemale className="icon-margin-right" /> Menstrual Correlation</h3>
                              <span className={`collapse-icon ${expandedSections.menstrualCorrelation ? 'expanded' : ''}`}>
                                &#9650;
                              </span>
                            </div>
                            <div className={`collapsable-content ${expandedSections.menstrualCorrelation ? 'expanded' : ''}`}>
                              <div className="info-card">
                                <div className="menstrual-correlation-info">
                                  <h4>Pain Intensity During Menstrual Cycle</h4>
                                  <p>This chart shows the correlation between pain intensity and menstrual cycle phases.</p>
                                </div>

                                <div className="menstrual-correlation-chart">
                                  <ResponsiveContainer width="100%" height={300}>
                                    {(() => {
                                      try {
                                        return (
                                          <BarChart
                                            layout="vertical"
                                            data={menstrualCorrData}
                                            margin={{ top: 20, right: 60, left: 80, bottom: 20 }}
                                          >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                            <YAxis
                                              dataKey="name"
                                              type="category"
                                              tickLine={false}
                                              axisLine={false}
                                              width={80}
                                            />
                                            <Tooltip
                                              formatter={(value) => [`${value}%`, 'Frequency']}
                                              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                            />
                                            <Bar
                                              dataKey="value"
                                              name="Frequency"
                                              label={<CustomBarLabel />}
                                              isAnimationActive={false}
                                            >
                                              {menstrualCorrData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                              ))}
                                            </Bar>
                                          </BarChart>
                                        );
                                      } catch (error) {
                                        console.error("Error rendering menstrual correlation chart:", error);
                                        return <div>Error rendering chart. Please check console for details.</div>;
                                      }
                                    })()}
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Collapsable section: Pain Insights */}
                          <div className="collapsable-section">
                            <div
                              className="collapsable-header"
                              onClick={() => toggleSection('painInsights')}
                            >
                              <h3><RiMentalHealthFill className="icon-margin-right" /> Pain Insights</h3>
                              <span className={`collapse-icon ${expandedSections.painInsights ? 'expanded' : ''}`}>
                                &#9650;
                              </span>
                            </div>
                            <div className={`collapsable-content ${expandedSections.painInsights ? 'expanded' : ''}`}>
                              <div className="info-card">
                                {(() => {
                                  const getMaxCategory = (data) => {
                                    const entries = Object.entries(data);
                                    if (entries.length === 0) return { key: '-', value: 0 };

                                    const maxEntry = entries.reduce((max, entry) =>
                                      entry[1] > max[1] ? entry : max, entries[0]
                                    );
                                    return { key: maxEntry[0], value: maxEntry[1] };
                                  };

                                  // Calculate percentages based on pain data
                                  if (!painData || painData.length === 0) {
                                    return (
                                      <div className="no-data-message">
                                        <p>No pain insights data available</p>
                                      </div>
                                    );
                                  }

                                  const painTypePercentage = {
                                    burning: (painData.filter(d => d.rawData?.typeOfPain === "Burning").length / painData.length) * 100,
                                    dull: (painData.filter(d => d.rawData?.typeOfPain === "Dull").length / painData.length) * 100,
                                    sharp: (painData.filter(d => d.rawData?.typeOfPain === "Sharp").length / painData.length) * 100,
                                    shooting: (painData.filter(d => d.rawData?.typeOfPain === "Shooting").length / painData.length) * 100,
                                    other: (painData.filter(d => d.rawData?.typeOfPain === "Other").length / painData.length) * 100,
                                  };

                                  const reliefMeasurePercentage = {
                                    coldCompress: (painData.filter(d => d.rawData?.reliefMeasure === "Cold Compress").length / painData.length) * 100,
                                    rest: (painData.filter(d => d.rawData?.reliefMeasure === "Rest").length / painData.length) * 100,
                                    medication: (painData.filter(d => d.rawData?.reliefMeasure === "Medication").length / painData.length) * 100,
                                    massage: (painData.filter(d => d.rawData?.reliefMeasure === "Massage").length / painData.length) * 100,
                                    no: (painData.filter(d => d.rawData?.reliefMeasure === "No").length / painData.length) * 100,
                                    other: (painData.filter(d => d.rawData?.reliefMeasure === "Other").length / painData.length) * 100,
                                  };

                                  const onsetOfPainPercentage = {
                                    sudden: (painData.filter(d => d.rawData?.onsetOfPain === "Sudden").length / painData.length) * 100,
                                    gradual: (painData.filter(d => d.rawData?.onsetOfPain === "Gradual").length / painData.length) * 100,
                                  };

                                  const durationOfPainPercentage = {
                                    short: (painData.filter(d => d.rawData?.durationOfPain === "Short").length / painData.length) * 100,
                                    long: (painData.filter(d => d.rawData?.durationOfPain === "Long").length / painData.length) * 100,
                                  };

                                  // Get maximum value categories
                                  const maxPainType = getMaxCategory(painTypePercentage);
                                  const maxReliefMeasure = getMaxCategory(reliefMeasurePercentage);
                                  const maxOnsetOfPain = getMaxCategory(onsetOfPainPercentage);
                                  const maxDurationOfPain = getMaxCategory(durationOfPainPercentage);

                                  // Format the keys for better display
                                  const formatKey = (key) => {
                                    if (!key) return '-';
                                    // Convert camelCase to Title Case
                                    return key.charAt(0).toUpperCase() +
                                      key.slice(1).replace(/([A-Z])/g, ' $1').trim();
                                  };

                                  return (
                                    <div className="pain-insights-table">
                                      <div className="insights-header">
                                        <div className="header-cell">Pain Sign</div>
                                        <div className="header-cell">Type</div>
                                        <div className="header-cell">Value (%)</div>
                                      </div>

                                      <div className="insights-row">
                                        <div className="row-cell">Pain Type</div>
                                        <div className="row-cell">{formatKey(maxPainType.key)}</div>
                                        <div className="row-cell">{maxPainType.value.toFixed()}%</div>
                                      </div>

                                      <div className="insights-row">
                                        <div className="row-cell">Relief Measure</div>
                                        <div className="row-cell">{formatKey(maxReliefMeasure.key)}</div>
                                        <div className="row-cell">{maxReliefMeasure.value.toFixed()}%</div>
                                      </div>

                                      <div className="insights-row">
                                        <div className="row-cell">Onset of Pain</div>
                                        <div className="row-cell">{formatKey(maxOnsetOfPain.key)}</div>
                                        <div className="row-cell">{maxOnsetOfPain.value.toFixed()}%</div>
                                      </div>

                                      <div className="insights-row">
                                        <div className="row-cell">Duration</div>
                                        <div className="row-cell">{formatKey(maxDurationOfPain.key)}</div>
                                        <div className="row-cell">{maxDurationOfPain.value.toFixed()}%</div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ✅  Breast Tab */}
                    {activeMedicalTab === 'breast' && (
                      <div className="breast-content">

                        {/* Symptom Calendar Section */}
                        <div className="details-section">
                          <h2><FaCalendarAlt className="icon-margin-right" /> Symptom Calendar</h2>
                          <div className="info-card">
                            <p className="calendar-info">Dates highlighted in green indicate days with recorded symptoms. Click on a date to view details.</p>

                            <div className="symptom-calendar-container">
                              <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                className="symptom-calendar"
                                tileClassName={({ date }) => {
                                  // Convert the calendar date to a consistent string format
                                  // Make sure to handle timezone issues by using UTC date
                                  const calendarDateStr = new Date(
                                    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                                  ).toISOString().split('T')[0];

                                  // Check if this date exists in markedDates
                                  if (markedDates && markedDates[calendarDateStr] && markedDates[calendarDateStr].marked) {
                                    return 'has-api-data';
                                  }
                                  return null;
                                }}
                                onClickDay={(date) => {
                                  setSelectedDate(date);
                                }}
                                minDetail="month"
                                maxDate={new Date()}
                                // Show April by default
                                defaultActiveStartDate={new Date('2025-04-01')}
                              />
                            </div>

                            {selectedDateSymptoms && (
                              <div className="selected-date-symptoms">
                                <h3>Symptoms on {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>

                                <div className="symptom-sections">
                                  {/* Breast Symptoms Section */}
                                  <div className="symptom-section">
                                    <h4>Breast Symptoms</h4>

                                    {/* 1. Lump */}
                                    <div className="symptom-category">
                                      <h5>1. Lump</h5>
                                      <div className="symptom-detail">
                                        <div className="symptom-side">
                                          <strong>Left:</strong> {selectedDateSymptoms.breast.lump.left || 'None'}
                                          {selectedDateSymptoms.breast.lump.leftImage ? (
                                            <button className="view-image-btn"
                                              onClick={() => {
                                                setViewerFile(selectedDateSymptoms.breast.lump.leftImage);
                                                setShowFileViewer(true);
                                              }}>View Image</button>
                                          ) : (
                                            <span className="no-image">No Image</span>
                                          )}
                                        </div>
                                        <div className="symptom-side">
                                          <strong>Right:</strong> {selectedDateSymptoms.breast.lump.right || 'None'}
                                          {selectedDateSymptoms.breast.lump.rightImage ? (
                                            <button className="view-image-btn" onClick={() => {
                                              setViewerFile(selectedDateSymptoms.breast.lump.rightImage);
                                              setShowFileViewer(true);
                                            }}>View Image</button>
                                          ) : (
                                            <span className="no-image">No Image</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* 2. Pain */}
                                    <div className="symptom-category">
                                      <h5>2. Pain</h5>
                                      <div className="symptom-detail">
                                        <p><strong>Pain Rating:</strong> {selectedDateSymptoms.breast.pain.painRating}/5</p>
                                        <p><strong>Pain Locations:</strong> {selectedDateSymptoms.breast.pain.painLocations.join(', ')}</p>
                                      </div>
                                    </div>

                                    {/* 3. Rashes */}
                                    <div className="symptom-category">
                                      <h5>3. Rashes</h5>
                                      <div className="symptom-detail">
                                        <p><strong>Present:</strong> {selectedDateSymptoms.breast.rashes.hasRashes ? 'Yes' : 'No'}</p>
                                        {selectedDateSymptoms.breast.rashes.hasRashes && (
                                          <>
                                            {selectedDateSymptoms.breast.rashes.image ? (
                                              <button className="view-image-btn"
                                                onClick={() => {
                                                  setViewerFile(selectedDateSymptoms.breast.rashes.image);
                                                  setShowFileViewer(true);
                                                }}
                                              >View Image</button>
                                            ) : (
                                              <span className="no-image">No Image</span>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* 4. Symmetry */}
                                    <div className="symptom-category">
                                      <h5>4. Symmetry</h5>
                                      <div className="symptom-detail">
                                        <p>{selectedDateSymptoms.breast.symmetry}</p>
                                      </div>
                                    </div>

                                    {/* 5. Swelling */}
                                    <div className="symptom-category">
                                      <h5>5. Swelling</h5>
                                      <div className="symptom-detail">
                                        <div className="symptom-side">
                                          <strong>Left:</strong> {selectedDateSymptoms.breast.swelling.left ? 'Yes' : 'No'}
                                          {selectedDateSymptoms.breast.swelling.left && (
                                            <>
                                              {selectedDateSymptoms.breast.swelling.leftImage ? (
                                                <button className="view-image-btn"
                                                  onClick={() => {
                                                    setViewerFile(selectedDateSymptoms.breast.swelling.leftImage);
                                                    setShowFileViewer(true);
                                                  }}>View Image</button>
                                              ) : (
                                                <span className="no-image">No Image</span>
                                              )}
                                            </>
                                          )}
                                        </div>
                                        <div className="symptom-side">
                                          <strong>Right:</strong> {selectedDateSymptoms.breast.swelling.right ? 'Yes' : 'No'}
                                          {selectedDateSymptoms.breast.swelling.right && (
                                            <>
                                              {selectedDateSymptoms.breast.swelling.rightImage ? (
                                                <button className="view-image-btn"
                                                  onClick={() => {
                                                    setViewerFile(selectedDateSymptoms.breast.swelling.rightImage);
                                                    setShowFileViewer(true);
                                                  }}
                                                >View Image</button>
                                              ) : (
                                                <span className="no-image">No Image</span>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* 6. Itching */}
                                    <div className="symptom-category">
                                      <h5>6. Itching</h5>
                                      <div className="symptom-detail">
                                        <p>{selectedDateSymptoms.breast.itching.length > 0 ? selectedDateSymptoms.breast.itching.join(', ') : 'None'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Nipple Symptoms Section */}
                                  <div className="symptom-section">
                                    <h4>Nipple Symptoms</h4>

                                    {/* 1. Inversion */}
                                    <div className="symptom-category">
                                      <h5>1. Inversion</h5>
                                      <div className="symptom-detail">
                                        <div className="symptom-side">
                                          <strong>Left:</strong> {selectedDateSymptoms.nipple.inversion.left}
                                        </div>
                                        <div className="symptom-side">
                                          <strong>Right:</strong> {selectedDateSymptoms.nipple.inversion.right}
                                        </div>
                                      </div>
                                    </div>

                                    {/* 2. Discharge */}
                                    <div className="symptom-category">
                                      <h5>2. Discharge</h5>
                                      <div className="symptom-detail">
                                        <p>
                                          <strong>Type:</strong> {selectedDateSymptoms.nipple.discharge.type}
                                          {selectedDateSymptoms.nipple.discharge.type === 'Unusual' &&
                                            ` (${selectedDateSymptoms.nipple.discharge.details})`
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {!selectedDateSymptoms && (
                              <div className="no-symptoms-message">
                                <p>No symptoms recorded for {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ✅  Prescription Tab */}
                    {activeMedicalTab === 'prescription' && (
                      <div className="prescription-content">
                        <div className="details-section">
                          <h2><BsFillFileEarmarkMedicalFill className="icon-margin-right" /> Uploaded Prescriptions</h2>
                          <div className="prescription-files">
                            {patient.prescriptionFiles?.length > 0 ? (
                              patient.prescriptionFiles.map((file, index) => (
                                <div key={index} className="prescription-file-card">
                                  <div className="file-icon">
                                    {getFileIcon(file.type, file.uri)}
                                  </div>
                                  <div className="file-details">
                                    <h3>{file.name}</h3>
                                    {/* <p className="file-meta">
                                      <span className="file-type">{file.type}</span>
                                      <span className="file-size">{formatFileSize(file.size)}</span>
                                    </p> */}
                                    <p className="upload-date">Uploaded on {file.uploadDate}</p>
                                  </div>
                                  <div className="file-actions">
                                    <button className="view-file-btn" onClick={() => viewFile(file)}>
                                      View
                                    </button>
                                    <button className="download-file-btn" onClick={() => downloadFile(file)}>
                                      Download
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="no-files-message">
                                <p>No prescription files have been uploaded yet.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ✅  Reports Tab */}
                    {activeMedicalTab === 'reports' && (
                      <div className="reports-content">
                        <div className="details-section">
                          <h2><BsFillFileEarmarkMedicalFill className="icon-margin-right" /> Uploaded Reports</h2>
                          <div className="prescription-files">
                            {patient.reportFiles?.length > 0 ? (
                              patient.reportFiles.map((file, index) => (
                                <div key={index} className="prescription-file-card">
                                  <div className="file-icon">
                                    {getFileIcon(file.type, file.uri)}
                                  </div>
                                  <div className="file-details">
                                    <h3>{file.name}</h3>
                                    <p className="file-meta">
                                      {/* <span className="file-type">{file.type}</span> */}
                                      {/* <span className="file-size">{formatFileSize(file.size)}</span> */}
                                    </p>
                                    <p className="upload-date">Uploaded on {file.uploadDate}</p>
                                  </div>
                                  <div className="file-actions">
                                    <button className="view-file-btn" onClick={() => viewFile(file.uri)}>
                                      View
                                    </button>
                                    <button className="download-file-btn" onClick={() => downloadFile(file.uri)}>
                                      Download
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="no-files-message">
                                <p>No report files have been uploaded yet.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ✅  Treatment Tab */}
                    {activeMedicalTab === 'treatment' && (
                      <div className="treatment-content">
                        <div className="details-section">
                          <h2>
                            <FaStickyNote className="icon-margin-right" /> Notes
                            <div className="notes-header-actions">
                              <button
                                className="sort-notes-btn"
                                onClick={handleSortNotes}
                                title={sortAscending ? "Sort Newest First" : "Sort Oldest First"}
                              >
                                <i className={`fas fa-sort-${sortAscending ? "down" : "up"}`}></i>
                                {sortAscending ? "Oldest First" : "Newest First"}
                              </button>
                            </div>
                          </h2>

                          {notesLoading ? (
                            <div className="loading-notes">Loading notes...</div>
                          ) : (
                            <>
                              <div className="notes-list">
                                {notes.length > 0 ? (
                                  notes.map((note, index) => (
                                    <div key={index} className="note-card">
                                      <div className="note-content">
                                        <div className="note-header">
                                          <h3>{note.note}</h3>
                                          <span className="note-date">Added on: {formatDate(note.createdAt)}</span>
                                        </div>
                                      </div>
                                      <div className="note-actions">
                                        <button className="edit-note-btn" onClick={() => editNote(note)}>
                                          <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button className="delete-note-btn" onClick={() => deleteNote(note)}>
                                          <FaTrash style={{ marginRight: "2px" }} />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="no-notes-message">
                                    <p>No notes have been added yet.</p>
                                  </div>
                                )}
                              </div>
                              <button className="add-note-btn" onClick={addNote}>
                                <i className="fas fa-plus"></i> Add Note
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'personal' && (
                <div className="personal-content">
                  {/* Personal Sub Tabs */}
                  <div className="personal-subtabs">
                    <button
                      className={`subtab-button ${activePersonalTab === 'cancer' ? 'active' : ''}`}
                      onClick={() => setActivePersonalTab('cancer')}
                    >
                      <FaRibbon className="icon-margin-right" /> Cancer
                    </button>
                    <button
                      className={`subtab-button ${activePersonalTab === 'health' ? 'active' : ''}`}
                      onClick={() => setActivePersonalTab('health')}
                    >
                      <MdHealthAndSafety className="icon-margin-right" /> Health
                    </button>
                    {/* <button
                      className={`subtab-button ${activePersonalTab === 'physique' ? 'active' : ''}`}
                      onClick={() => setActivePersonalTab('physique')}
                    >
                      <GiBodyHeight className="icon-margin-right" /> Physique
                    </button> */}
                    <button
                      className={`subtab-button ${activePersonalTab === 'lifestyle' ? 'active' : ''}`}
                      onClick={() => setActivePersonalTab('lifestyle')}
                    >
                      <FaAppleAlt className="icon-margin-right" /> Lifestyle
                    </button>
                  </div>

                  {/* Personal Subtab Content */}
                  <div className="subtab-content">
                    {/*  */}
                    {activePersonalTab === 'cancer' && (
                      <div className="cancer-content">
                        {/* Cancer Sub Tabs */}
                        <div className="cancer-subtabs">
                          <button
                            className={`subtab-button ${activeCancerTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveCancerTab('overview')}
                          >
                            <FaRibbon className="icon-margin-right" /> Overview
                          </button>
                          <button
                            className={`subtab-button ${activeCancerTab === 'personal' ? 'active' : ''}`}
                            onClick={() => setActiveCancerTab('personal')}
                          >
                            <FaUser className="icon-margin-right" /> Personal
                          </button>
                          <button
                            className={`subtab-button ${activeCancerTab === 'medical' ? 'active' : ''}`}
                            onClick={() => setActiveCancerTab('medical')}
                          >
                            <MdMedicalServices className="icon-margin-right" /> Medical
                          </button>
                          <button
                            className={`subtab-button ${activeCancerTab === 'family' ? 'active' : ''}`}
                            onClick={() => setActiveCancerTab('family')}
                          >
                            <FaUser className="icon-margin-right" /> Family
                          </button>
                        </div>

                        {/* Cancer Subtab Content */}
                        <div className="subtab-content">
                          {/* ✅ Overview Tab Content */}
                          {activeCancerTab === 'overview' && (
                            <div className="cancer-overview-content">
                              {/* Cancer Statistics Section */}
                              <div className="details-section">
                                <h2><FaRibbon className="icon-margin-right" /> Family Cancer Statistics</h2>
                                <div className="cancer-stats-grid">
                                  <div className="cancer-stat-card breast">
                                    <div className="cancer-stat-header">
                                      <div className="cancer-stat-icon">
                                        <FaRibbon />
                                      </div>
                                      <h3>Breast Cancer</h3>
                                    </div>
                                    <div className="cancer-stat-count">
                                      {familyCancerHistory.summary.breastCancer}
                                    </div>
                                    <div className="cancer-stat-footer">
                                      {familyCancerHistory.immediate.breastCancer.length} immediate, {familyCancerHistory.extended.breastCancer.length} extended
                                    </div>
                                  </div>

                                  <div className="cancer-stat-card ovarian">
                                    <div className="cancer-stat-header">
                                      <div className="cancer-stat-icon">
                                        <FaFemale />
                                      </div>
                                      <h3>Ovarian Cancer</h3>
                                    </div>
                                    <div className="cancer-stat-count">
                                      {familyCancerHistory.summary.ovarianCancer}
                                    </div>
                                    <div className="cancer-stat-footer">
                                      {familyCancerHistory.immediate.ovarianCancer.length} immediate, {familyCancerHistory.extended.ovarianCancer.length} extended
                                    </div>
                                  </div>

                                  <div className="cancer-stat-card cervical">
                                    <div className="cancer-stat-header">
                                      <div className="cancer-stat-icon">
                                        <FaFemale />
                                      </div>
                                      <h3>Cervical Cancer</h3>
                                    </div>
                                    <div className="cancer-stat-count">
                                      {familyCancerHistory.summary.cervicalCancer}
                                    </div>
                                    <div className="cancer-stat-footer">
                                      {familyCancerHistory.immediate.cervicalCancer.length} immediate, {familyCancerHistory.extended.cervicalCancer.length} extended
                                    </div>
                                  </div>

                                  <div className="cancer-stat-card other">
                                    <div className="cancer-stat-header">
                                      <div className="cancer-stat-icon">
                                        <FaHeartbeat />
                                      </div>
                                      <h3>Other Cancer</h3>
                                    </div>
                                    <div className="cancer-stat-count">
                                      {familyCancerHistory.summary.otherCancer}
                                    </div>
                                    <div className="cancer-stat-footer">
                                      {familyCancerHistory.immediate.otherCancer.length} immediate, {familyCancerHistory.extended.otherCancer.length} extended
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Risk Factors Section */}
                              <div className="details-section risk-factors-section">
                                <h2><FaHeartbeat className="icon-margin-right" /> Cancer Risk Factors</h2>
                                <div className="risk-factors-grid">
                                  {/* Genetic Risk Factors */}
                                  <div className="risk-factor-card genetic">
                                    <div className="risk-factor-header">
                                      <div className="risk-factor-icon">
                                        <FaUser />
                                      </div>
                                      <h3>Genetic Factors</h3>
                                    </div>
                                    <div className="risk-factor-content">
                                      <div className="risk-factor-level">
                                        <span className="risk-level-label">Risk:</span>
                                        <div className="risk-level-bar">
                                          <div className="risk-level-fill high"></div>
                                        </div>
                                        <span className="risk-level-value">High</span>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Family history of breast cancer (mother diagnosed at age 55)</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Multiple relatives with breast and ovarian cancer</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">BRCA1/2 genetic testing recommended</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Reproductive Risk Factors */}
                                  <div className="risk-factor-card reproductive">
                                    <div className="risk-factor-header">
                                      <div className="risk-factor-icon">
                                        <FaFemale />
                                      </div>
                                      <h3>Reproductive Factors</h3>
                                    </div>
                                    <div className="risk-factor-content">
                                      <div className="risk-factor-level">
                                        <span className="risk-level-label">Risk:</span>
                                        <div className="risk-level-bar">
                                          <div className="risk-level-fill medium"></div>
                                        </div>
                                        <span className="risk-level-value">Medium</span>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Age at first pregnancy: 30 (after age 30)</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Age at menarche: 13 (average risk)</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Breastfed for more than 1 year (protective factor)</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Lifestyle Risk Factors */}
                                  <div className="risk-factor-card lifestyle">
                                    <div className="risk-factor-header">
                                      <div className="risk-factor-icon">
                                        <FaAppleAlt />
                                      </div>
                                      <h3>Lifestyle Factors</h3>
                                    </div>
                                    <div className="risk-factor-content">
                                      <div className="risk-factor-level">
                                        <span className="risk-level-label">Risk:</span>
                                        <div className="risk-level-bar">
                                          <div className="risk-level-fill low"></div>
                                        </div>
                                        <span className="risk-level-value">Low</span>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Weight/BMI: Normal (protective factor)</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Non-smoker (protective factor)</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Moderate alcohol consumption (1-2 drinks/week)</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Regular physical activity (protective factor)</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Environmental Risk Factors */}
                                  <div className="risk-factor-card environmental">
                                    <div className="risk-factor-header">
                                      <div className="risk-factor-icon">
                                        <FaSmoking />
                                      </div>
                                      <h3>Environmental Factors</h3>
                                    </div>
                                    <div className="risk-factor-content">
                                      <div className="risk-factor-level">
                                        <span className="risk-level-label">Risk:</span>
                                        <div className="risk-level-bar">
                                          <div className="risk-level-fill low"></div>
                                        </div>
                                        <span className="risk-level-value">Low</span>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">No significant radiation exposure history</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">No known exposure to carcinogens in workplace</div>
                                      </div>
                                      <div className="risk-factor-item">
                                        <div className="risk-factor-bullet"></div>
                                        <div className="risk-factor-text">Residential area with low pollution levels</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="cancer-overview-content">
                                <div className="details-section" style={{ marginTop: '2rem' }}>
                                  <h2><FaUser className="icon-margin-right" /> Personal Summary</h2>
                                  <div className="cancer-stats-grid">
                                    <div className="cancer-stat-card">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <FaUser />
                                        </div>
                                        <h3>Age</h3>
                                      </div>
                                      <div className="cancer-stat-count">
                                        {patient.age}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        Years
                                      </div>
                                    </div>

                                    <div className="cancer-stat-card reproductive">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <FaFemale />
                                        </div>
                                        <h3>Menstrual Status</h3>
                                      </div>
                                      <div className="cancer-stat-count" style={{ fontSize: '1.8rem' }}>
                                        {menstrualHistory.status}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        {menstrualHistory.cycle || 'N/A'}
                                      </div>
                                    </div>

                                    <div className="cancer-stat-card">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <FaBaby />
                                        </div>
                                        <h3>Children</h3>
                                      </div>
                                      <div className="cancer-stat-count">
                                        {reproductiveHistory.motherhoodDetails.numberOfChildren || 0}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        {reproductiveHistory.motherhood === 'Yes' ? 'Mother' : 'No Children'}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Medical Summary Section */}
                                <div className="details-section" style={{ marginTop: '2rem' }}>
                                  <h2><MdMedicalServices className="icon-margin-right" /> Medical Summary</h2>
                                  <div className="cancer-stats-grid">
                                    <div className="cancer-stat-card">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <MdMedicalServices />
                                        </div>
                                        <h3>Comorbidities</h3>
                                      </div>
                                      <div className="cancer-stat-count">
                                        {Object.values(healthData.chronicConditions || {}).flat().length}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        Conditions
                                      </div>
                                    </div>

                                    <div className="cancer-stat-card">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <FaClipboardList />
                                        </div>
                                        <h3>Biopsies</h3>
                                      </div>
                                      <div className="cancer-stat-count">
                                        {testData?.Biopsy?.biopsyRecords?.length > 0 ? testData.Biopsy.biopsyRecords.length : 0}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        Samples
                                      </div>
                                    </div>

                                    <div className="cancer-stat-card breast">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <FaRibbon />
                                        </div>
                                        <h3>Family Cancer</h3>
                                      </div>
                                      <div className="cancer-stat-count">
                                        {familyCancerHistory.summary.breastCancer +
                                          familyCancerHistory.summary.ovarianCancer +
                                          familyCancerHistory.summary.cervicalCancer +
                                          familyCancerHistory.summary.otherCancer}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        Total Cases
                                      </div>
                                    </div>

                                    <div className="cancer-stat-card">
                                      <div className="cancer-stat-header">
                                        <div className="cancer-stat-icon">
                                          <MdMedication />
                                        </div>
                                        <h3>Medications</h3>
                                      </div>
                                      <div className="cancer-stat-count">
                                        {patient?.medications?.length || 0}
                                      </div>
                                      <div className="cancer-stat-footer">
                                        Current Medications
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* ❤️❤️  Personal Tab under Cancer */}
                          {activeCancerTab === 'personal' && (
                            <div className="cancer-personal-content">
                              <div className="details-section">
                                <h2><FaUser className="icon-margin-right" /> Personal Impact</h2>
                                <div className="info-card">
                                  {/* Address Information */}
                                  <div className="address-information">
                                    <h3 className="section-subheader">Address Information</h3>

                                    <div className="address-container">
                                      <div className="address-section">
                                        <h4>Current Address</h4>
                                        <div className="address-details">
                                          <p className="address-line">{patient?.currentAddress?.addressLine1}{patient?.currentAddress?.addressLine2 ? ', ' : ''}{patient?.currentAddress?.addressLine2}</p>
                                          <p className="address-line">{patient?.currentAddress?.state ? patient?.currentAddress?.state : ''}{patient?.currentAddress?.district ? ', ' + patient?.currentAddress?.district : ''}{patient?.currentAddress?.pincode ? ', ' + patient?.currentAddress?.pincode : ''}</p>
                                        </div>
                                      </div>

                                      <div className="address-section">
                                        <h4>Permanent Address</h4>
                                        <div className="address-details">
                                          {patient?.permanentAddress ? (
                                            <>
                                              <p className="address-line">{patient?.permanentAddress?.addressLine1}{patient?.permanentAddress?.addressLine2 ? ', ' : ''}{patient?.permanentAddress?.addressLine2}</p>
                                              <p className="address-line">{patient?.permanentAddress?.state ? patient?.permanentAddress?.state : ''}{patient?.permanentAddress?.district ? ', ' + patient?.permanentAddress?.district : ''}{patient?.permanentAddress?.pincode ? ', ' + patient?.permanentAddress?.pincode : ''}</p>
                                            </>
                                          ) : (
                                            <p className="address-line same-address">Same as Current Address</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Family Information */}
                                  {/* <div className="family-information">
                                    <h3 className="section-subheader">Family Information</h3>

                                    <div className="family-grid-container">
                                      <div className="family-block parents-block">
                                        <div className="block-header">
                                          <span className="block-icon">👪</span>
                                          <h4>Parents</h4>
                                        </div>
                                        <div className="family-member-grid">
                                          <div className="family-member-card">
                                            <div className="member-header">Father</div>
                                            <div className="member-details">
                                              <div className="detail-item">
                                                <span className="detail-label">Status:</span>
                                                <span className="detail-value alive">Alive</span>
                                              </div>
                                              <div className="detail-item">
                                                <span className="detail-label">Age:</span>
                                                <span className="detail-value">65 Years</span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="family-member-card">
                                            <div className="member-header">Mother</div>
                                            <div className="member-details">
                                              <div className="detail-item">
                                                <span className="detail-label">Status:</span>
                                                <span className="detail-value alive">Alive</span>
                                              </div>
                                              <div className="detail-item">
                                                <span className="detail-label">Age:</span>
                                                <span className="detail-value">62 Years</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="family-block children-block">
                                        <div className="block-header">
                                          <span className="block-icon">👶</span>
                                          <h4>Children</h4>
                                        </div>
                                        <div className="family-stats-cards">
                                          {familyStructure?.children?.son && (
                                            <div className="stats-card">
                                              <div className="stats-header">Son</div>
                                              <div className="stats-count">{familyStructure.children.son.total || 0}</div>
                                              <div className="stats-details">
                                                <div className="stats-item">
                                                  <span className="stats-dot alive"></span>
                                                  <span className="stats-label">Alive:</span>
                                                  <span className="stats-value">{familyStructure.children.son.alive || 0}</span>
                                                </div>
                                                <div className="stats-item">
                                                  <span className="stats-dot deceased"></span>
                                                  <span className="stats-label">Deceased:</span>
                                                  <span className="stats-value">{familyStructure.children.son.deceased || 0}</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {familyStructure?.children?.daughter && (
                                            <div className="stats-card">
                                              <div className="stats-header">Daughter</div>
                                              <div className="stats-count">{familyStructure.children.daughter.total || 0}</div>
                                              <div className="stats-details">
                                                <div className="stats-item">
                                                  <span className="stats-dot alive"></span>
                                                  <span className="stats-label">Alive:</span>
                                                  <span className="stats-value">{familyStructure.children.daughter.alive || 0}</span>
                                                </div>
                                                <div className="stats-item">
                                                  <span className="stats-dot deceased"></span>
                                                  <span className="stats-label">Deceased:</span>
                                                  <span className="stats-value">{familyStructure.children.daughter.deceased || 0}</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="family-block siblings-block">
                                        <div className="block-header">
                                          <span className="block-icon">👫</span>
                                          <h4>Siblings</h4>
                                        </div>
                                        <div className="family-stats-cards">
                                          {familyStructure?.siblings?.brother && (
                                            <div className="stats-card">
                                              <div className="stats-header">Brother</div>
                                              <div className="stats-count">{familyStructure.siblings.brother.total || 0}</div>
                                              <div className="stats-details">
                                                <div className="stats-item">
                                                  <span className="stats-dot alive"></span>
                                                  <span className="stats-label">Alive:</span>
                                                  <span className="stats-value">{familyStructure.siblings.brother.alive || 0}</span>
                                                </div>
                                                <div className="stats-item">
                                                  <span className="stats-dot deceased"></span>
                                                  <span className="stats-label">Deceased:</span>
                                                  <span className="stats-value">{familyStructure.siblings.brother.deceased || 0}</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {familyStructure?.siblings?.sister && (
                                            <div className="stats-card">
                                              <div className="stats-header">Sister</div>
                                              <div className="stats-count">{familyStructure.siblings.sister.total || 0}</div>
                                              <div className="stats-details">
                                                <div className="stats-item">
                                                  <span className="stats-dot alive"></span>
                                                  <span className="stats-label">Alive:</span>
                                                  <span className="stats-value">{familyStructure.siblings.sister.alive || 0}</span>
                                                </div>
                                                <div className="stats-item">
                                                  <span className="stats-dot deceased"></span>
                                                  <span className="stats-label">Deceased:</span>
                                                  <span className="stats-value">{familyStructure.siblings.sister.deceased || 0}</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* ✅  Medical Tab under Cancer */}
                          {activeCancerTab === 'medical' && (
                            <div className="cancer-medical-content">
                              <div className="details-section">
                                <h2><FaClipboardList className="icon-margin-right" /> Medical History</h2>

                                {/* Menstrual History Card */}
                                <div className="history-card">
                                  <div className="history-header">
                                    <div className="history-icon">
                                      <FaFemale />
                                    </div>
                                    <h3>Menstrual History</h3>
                                  </div>

                                  <div className="history-content">
                                    {menstrualHistory && (
                                      <>
                                        <div className="detail-grid">
                                          <div className="detail-label">Menstruation Status</div>
                                          <div className="detail-value highlight">{menstrualHistory.status}</div>
                                        </div>

                                        {menstrualHistory.status === 'Started' && (
                                          <>
                                            <div className="detail-grid">
                                              <div className="detail-label">Started at Age</div>
                                              <div className="detail-value">{menstrualHistory.startedAtAge} years</div>
                                            </div>

                                            <div className="detail-grid">
                                              <div className="detail-label">Cycle</div>
                                              <div className="detail-value">{menstrualHistory.cycle}</div>
                                            </div>

                                            <div className="detail-grid">
                                              <div className="detail-label">Menopause</div>
                                              <div className="detail-value">
                                                {menstrualHistory.menopause.status}
                                                {menstrualHistory.menopause.status === 'Yes' && (
                                                  <span className="age-display"> (Age: {menstrualHistory.menopause.age})</span>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Reproductive History Card */}
                                <div className="history-card">
                                  <div className="history-header">
                                    <div className="history-icon">
                                      <FaBaby />
                                    </div>
                                    <h3>Reproductive History</h3>
                                  </div>

                                  <div className="history-content">
                                    {reproductiveHistory && (
                                      <>
                                        <div className="detail-grid">
                                          <div className="detail-label">Pregnancy</div>
                                          <div className="detail-value highlight">{reproductiveHistory.pregnancy}</div>
                                        </div>

                                        {reproductiveHistory.pregnancy === 'Yes' && (
                                          <div className="nested-details">
                                            <h4>Pregnancy Details</h4>
                                            <div className="detail-grid">
                                              <div className="detail-label">Number of Pregnancies</div>
                                              <div className="detail-value">{reproductiveHistory.pregnancyDetails.numberOfPregnancies}</div>
                                            </div>
                                            <div className="detail-grid">
                                              <div className="detail-label">Age at First Pregnancy</div>
                                              <div className="detail-value">{reproductiveHistory.pregnancyDetails.ageAtFirstPregnancy} years</div>
                                            </div>
                                            <div className="detail-grid">
                                              <div className="detail-label">Complications</div>
                                              <div className="detail-value">{reproductiveHistory.pregnancyDetails.complications}</div>
                                            </div>
                                          </div>
                                        )}

                                        <div className="detail-grid">
                                          <div className="detail-label">Motherhood</div>
                                          <div className="detail-value highlight">{reproductiveHistory.motherhood}</div>
                                        </div>

                                        {reproductiveHistory.motherhood === 'Yes' && (
                                          <div className="nested-details">
                                            <h4>Motherhood Details</h4>
                                            <div className="detail-grid">
                                              <div className="detail-label">Age at First Child</div>
                                              <div className="detail-value">{reproductiveHistory.motherhoodDetails.ageAtFirstChild} years</div>
                                            </div>
                                            <div className="detail-grid">
                                              <div className="detail-label">Number of Children</div>
                                              <div className="detail-value">{reproductiveHistory.motherhoodDetails.numberOfChildren}</div>
                                            </div>
                                            <div className="detail-grid">
                                              <div className="detail-label">Breastfed</div>
                                              <div className="detail-value">{reproductiveHistory.motherhoodDetails.breastfed}</div>
                                            </div>
                                            <div className="detail-grid">
                                              <div className="detail-label">Breastfeeding Duration</div>
                                              <div className="detail-value">{reproductiveHistory.motherhoodDetails.breastfeedingDuration}</div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="details-section">
                                <h2><MdMedicalServices className="icon-margin-right" /> Medical Conditions & Treatments</h2>

                                <div className="medical-grid">
                                  {/* Comorbidities Card */}
                                  <div className="medical-card">
                                    <div className="medical-header">
                                      <h3>Comorbidities</h3>
                                    </div>
                                    <div className="medical-content">
                                      <ul className="medical-list">
                                        {comorbidities.hasComorbidities ? (
                                          comorbidities.list.map((condition, index) => (
                                            <li key={index}>
                                              {condition}
                                              {condition === "Others" && comorbidities.other && (
                                                <span className="other-detail"> ({comorbidities.other})</span>
                                              )}
                                            </li>
                                          ))
                                        ) : (
                                          <li>No comorbidities reported</li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Current Medications Card */}
                                  <div className="medical-card">
                                    <div className="medical-header">
                                      <h3>Current Medications</h3>
                                    </div>
                                    <div className="medical-content">
                                      <div className="medication-cards">
                                        {medications.ongoing.length > 0 ? (
                                          medications.ongoing.map((medication, index) => (
                                            <div key={index} className="medication-card">
                                              <h4>{medication.name}</h4>
                                              <p><strong>Route:</strong> <span>{medication.route || "Oral"}</span></p>
                                              {/* <p><strong>Dosage:</strong> <span>{medication.dosage || "N/A"}</span></p> */}
                                              {/* <p><strong>Frequency:</strong> <span>{medication.frequency || "N/A"}</span></p> */}
                                            </div>
                                          ))
                                        ) : (
                                          <div className="no-data-message">No current medications</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Past Medications Card */}
                                  <div className="medical-card">
                                    <div className="medical-header">
                                      <h3>Past Medications</h3>
                                    </div>
                                    <div className="medical-content">
                                      <div className="medication-cards">
                                        {medications.past.length > 0 ? (
                                          medications.past.map((medication, index) => (
                                            <div key={index} className="medication-card">
                                              <h4>{medication.name}</h4>
                                              <p><strong>Duration:</strong> <span>{medication.duration || "N/A"}</span></p>
                                              {medication.reason && (
                                                <p><strong>Reason:</strong> <span>{medication.reason}</span></p>
                                              )}
                                            </div>
                                          ))
                                        ) : (
                                          <div className="no-data-message">No past medication records</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Test, Biopsy & Surgery Section */}
                              <div className="details-section">
                                <h2><BsFillFileEarmarkMedicalFill className="icon-margin-right" /> Tests, Biopsies & Surgeries</h2>

                                {/* Conditional rendering based on availability of data */}
                                {((testData?.BreastRelatedTests?.anyBreastCancerTests === "Yes" &&
                                  testData?.BreastRelatedTests?.breastCancerTestRecords?.length > 0) ||
                                  (testData?.Biopsy?.anyBiopsies === "Yes" &&
                                    testData?.Biopsy?.biopsyRecords?.length > 0) ||
                                  (testData?.Surgeries?.breastSurgeries === "Yes" &&
                                    testData?.Surgeries?.breastSurgeryRecords?.length > 0)) ? (
                                  <div className="info-card">
                                    {/* Tests Section */}
                                    {testData?.BreastRelatedTests?.anyBreastCancerTests === "Yes" &&
                                      testData?.BreastRelatedTests?.breastCancerTestRecords?.length > 0 && (
                                        <div className="medical-card">
                                          <div className="medical-header">
                                            <h3>Breast Cancer Tests</h3>
                                          </div>
                                          <div className="medical-content">
                                            <div className="test-cards">
                                              {testData.BreastRelatedTests.breastCancerTestRecords.map((record, index) => (
                                                <div key={index} className="test-card">
                                                  <div className="test-card-header">
                                                    <h4>{record.test}</h4>
                                                    {record.report && (
                                                      <button
                                                        className="view-report-btn"
                                                        onClick={() => viewFile({ uri: record.report, name: `${record.test} Report` })}
                                                      >
                                                        View Report
                                                      </button>
                                                    )}
                                                  </div>
                                                  <div className="test-details">
                                                    <div className="test-detail-item">
                                                      <FaCalendarAlt className="detail-icon" />
                                                      <span>{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || "Date not specified"}</span>
                                                    </div>
                                                    {record.doctor && (
                                                      <div className="test-detail-item">
                                                        <FaUser className="detail-icon" />
                                                        <span>Dr. {record.doctor}</span>
                                                      </div>
                                                    )}
                                                    {record.hospital && (
                                                      <div className="test-detail-item">
                                                        <FaHospital className="detail-icon" />
                                                        <span>{record.hospital}</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    {/* Biopsies Section */}
                                    {testData?.Biopsy?.anyBiopsies === "Yes" &&
                                      testData?.Biopsy?.biopsyRecords?.length > 0 && (
                                        <div className="medical-card">
                                          <div className="medical-header">
                                            <h3>Biopsies</h3>
                                          </div>
                                          <div className="medical-content">
                                            <div className="biopsy-cards">
                                              {testData.Biopsy.biopsyRecords.map((record, index) => (
                                                <div key={index} className="biopsy-card">
                                                  <div className="biopsy-card-header">
                                                    <span className="biopsy-date">
                                                      {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || "Date not specified"}
                                                    </span>
                                                    {record.testDetails && (
                                                      <button
                                                        className="view-report-btn"
                                                        onClick={() => viewFile({ uri: record.testDetails, name: "Biopsy Details" })}
                                                      >
                                                        View Details
                                                      </button>
                                                    )}
                                                  </div>
                                                  {record.result && (
                                                    <div className={`biopsy-result ${record.result.toLowerCase().includes("negative") ? "negative-result" :
                                                      record.result.toLowerCase().includes("positive") ? "positive-result" :
                                                        "neutral-result"
                                                      }`}>
                                                      <span className="result-label">Result:</span> {record.result}
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    {/* Surgeries Section */}
                                    {testData?.Surgeries?.breastSurgeries === "Yes" &&
                                      testData?.Surgeries?.breastSurgeryRecords?.length > 0 && (
                                        <div className="medical-card">
                                          <div className="medical-header">
                                            <h3>Surgeries</h3>
                                          </div>
                                          <div className="medical-content">
                                            <div className="surgery-cards">
                                              {testData.Surgeries.breastSurgeryRecords.map((record, index) => (
                                                <div key={index} className="surgery-card">
                                                  <div className="surgery-date">
                                                    {(() => {
                                                      try {
                                                        // Check if date is valid before formatting
                                                        const dateObj = new Date(record.date);
                                                        if (!isNaN(dateObj.getTime())) {
                                                          return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                                        } else {
                                                          // If date is invalid, fall back to the raw date or default message
                                                          return record?.date || "Date not specified";
                                                        }
                                                      } catch (error) {
                                                        // Handle any other errors
                                                        return record?.date || "Date not specified";
                                                      }
                                                    })()}
                                                  </div>
                                                  <div className="surgery-reason">
                                                    {record.reason?.[0] !== "Others" ? record.reason : record.otherReason || "Reason not specified"}
                                                  </div>
                                                  {record.hospital && (
                                                    <div className="surgery-detail-item">
                                                      <FaHospital className="detail-icon" />
                                                      <span>{record.hospital}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="info-card">
                                    <div className="no-data-message">No test, biopsy, or surgery data available</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {/* ✅  Family Tab Under Cancer */}
                          {activeCancerTab === 'family' && (
                            <div className="cancer-family-content">
                              <div className="details-section cancer-history-section">
                                <h2><FaUser className="icon-margin-right" /> Family Cancer History</h2>
                                <div className="info-card">
                                  <div className="cancer-history-section">
                                    <h3 className="section-subheader">Cancer History in Family</h3>

                                    <div className="cancer-history-boxes">
                                      <div className="cancer-history-box">
                                        <div className="cancer-history-icon breast">
                                          <FaRibbon />
                                        </div>
                                        <div className="cancer-history-details">
                                          <h4>Breast Cancer</h4>
                                          <div className="cancer-cases">{familyCancerHistory.summary.breastCancer} Case{familyCancerHistory.summary.breastCancer !== 1 ? 's' : ''}</div>
                                        </div>
                                      </div>

                                      <div className="cancer-history-box">
                                        <div className="cancer-history-icon ovarian">
                                          <FaFemale />
                                        </div>
                                        <div className="cancer-history-details">
                                          <h4>Ovarian Cancer</h4>
                                          <div className="cancer-cases">{familyCancerHistory.summary.ovarianCancer} Case{familyCancerHistory.summary.ovarianCancer !== 1 ? 's' : ''}</div>
                                        </div>
                                      </div>

                                      <div className="cancer-history-box">
                                        <div className="cancer-history-icon cervical">
                                          <FaFemale />
                                        </div>
                                        <div className="cancer-history-details">
                                          <h4>Cervical Cancer</h4>
                                          <div className="cancer-cases">{familyCancerHistory.summary.cervicalCancer} Case{familyCancerHistory.summary.cervicalCancer !== 1 ? 's' : ''}</div>
                                        </div>
                                      </div>

                                      <div className="cancer-history-box">
                                        <div className="cancer-history-icon other">
                                          <FaHeartbeat />
                                        </div>
                                        <div className="cancer-history-details">
                                          <h4>Other Cancer</h4>
                                          <div className="cancer-cases">{familyCancerHistory.summary.otherCancer} Case{familyCancerHistory.summary.otherCancer !== 1 ? 's' : ''}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="family-sections-container">
                                    <div className="immediate-family-section">
                                      <h3 className="section-subheader">Immediate Family</h3>

                                      <div className="family-grid">
                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon breast"></span>
                                            Breast Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.immediate.breastCancer.length > 0 ? (
                                              familyCancerHistory.immediate.breastCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No breast cancer cases in immediate family</div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon ovarian"></span>
                                            Ovarian Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.immediate.ovarianCancer.length > 0 ? (
                                              familyCancerHistory.immediate.ovarianCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No ovarian cancer cases in immediate family</div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon cervical"></span>
                                            Cervical Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.immediate.cervicalCancer.length > 0 ? (
                                              familyCancerHistory.immediate.cervicalCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No cervical cancer cases in immediate family</div>
                                            )}
                                          </div>
                                        </div>

                                        {familyCancerHistory.immediate.otherCancer.length > 0 && (
                                          <div className="family-cancer-category">
                                            <h4 className="cancer-type-header">
                                              <span className="cancer-icon other"></span>
                                              Other Cancer
                                            </h4>
                                            <div className="family-members-list">
                                              {familyCancerHistory.immediate.otherCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                  {relative.type && <span className="cancer-specific-type">{relative.type}</span>}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="extended-family-section">
                                      <h3 className="section-subheader">Extended Family</h3>

                                      <div className="family-grid">
                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon breast"></span>
                                            Breast Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.extended.breastCancer.length > 0 ? (
                                              familyCancerHistory.extended.breastCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No breast cancer cases in extended family</div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon ovarian"></span>
                                            Ovarian Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.extended.ovarianCancer.length > 0 ? (
                                              familyCancerHistory.extended.ovarianCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No ovarian cancer cases in extended family</div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon cervical"></span>
                                            Cervical Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.extended.cervicalCancer.length > 0 ? (
                                              familyCancerHistory.extended.cervicalCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No cervical cancer cases in extended family</div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="family-cancer-category">
                                          <h4 className="cancer-type-header">
                                            <span className="cancer-icon other"></span>
                                            Other Cancer
                                          </h4>
                                          <div className="family-members-list">
                                            {familyCancerHistory.extended.otherCancer.length > 0 ? (
                                              familyCancerHistory.extended.otherCancer.map((relative, index) => (
                                                <div key={index} className="family-member-tag">
                                                  <span className="relation-name">{relative.relation}</span>
                                                  <span className="relation-age">{relative.age || 'Unknown'}</span>
                                                  {relative.type && <span className="cancer-specific-type">{relative.type}</span>}
                                                </div>
                                              ))
                                            ) : (
                                              <div className="no-data-message">No other cancer cases in extended family</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* ✅ Personal Health Tab Content */}
                    {activePersonalTab === 'health' && (
                      <div className="health-content">
                        {/* Medical Section */}
                        <div className="details-section">
                          <h2 className="section-header health-header">
                            <MdMedicalServices className="icon-margin-right" />
                            <span>Medical Information</span>
                          </h2>
                          <div className="info-card">
                            {/* Chronic Conditions */}
                            <div className="health-card" style={{ marginBottom: '20px' }}>
                              <div className="health-card-header">
                                <div className="health-icon-container">
                                  <MdHealthAndSafety className="health-icon" />
                                </div>
                                <h3>Chronic Conditions</h3>
                              </div>
                              <div className="health-card-content">
                                {/* Vision Conditions */}
                                {healthData.chronicConditions.vision.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Vision</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.vision.slice(0, expandedCategories.vision ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag vision">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.vision.length > 3 && !expandedCategories.vision && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('vision')}>
                                          +{healthData.chronicConditions.vision.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.vision && healthData.chronicConditions.vision.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('vision')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Cancer Conditions */}
                                {healthData.chronicConditions.cancer.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Cancer</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.cancer.slice(0, expandedCategories.cancer ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag cancer">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.cancer.length > 3 && !expandedCategories.cancer && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('cancer')}>
                                          +{healthData.chronicConditions.cancer.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.cancer && healthData.chronicConditions.cancer.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('cancer')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Musculoskeletal Conditions */}
                                {healthData.chronicConditions.musculoskeletal.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Musculoskeletal</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.musculoskeletal.slice(0, expandedCategories.musculoskeletal ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag musculoskeletal">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.musculoskeletal.length > 3 && !expandedCategories.musculoskeletal && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('musculoskeletal')}>
                                          +{healthData.chronicConditions.musculoskeletal.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.musculoskeletal && healthData.chronicConditions.musculoskeletal.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('musculoskeletal')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Gastrointestinal Conditions */}
                                {healthData.chronicConditions.gastrointestinal.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Gastrointestinal</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.gastrointestinal.slice(0, expandedCategories.gastrointestinal ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag gastrointestinal">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.gastrointestinal.length > 3 && !expandedCategories.gastrointestinal && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('gastrointestinal')}>
                                          +{healthData.chronicConditions.gastrointestinal.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.gastrointestinal && healthData.chronicConditions.gastrointestinal.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('gastrointestinal')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Respiratory Conditions */}
                                {healthData.chronicConditions.respiratory.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Respiratory</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.respiratory.slice(0, expandedCategories.respiratory ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag respiratory">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.respiratory.length > 3 && !expandedCategories.respiratory && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('respiratory')}>
                                          +{healthData.chronicConditions.respiratory.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.respiratory && healthData.chronicConditions.respiratory.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('respiratory')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Neurological Conditions */}
                                {healthData.chronicConditions.neurological.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Neurological</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.neurological.slice(0, expandedCategories.neurological ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag neurological">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.neurological.length > 3 && !expandedCategories.neurological && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('neurological')}>
                                          +{healthData.chronicConditions.neurological.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.neurological && healthData.chronicConditions.neurological.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('neurological')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Urological Conditions */}
                                {healthData.chronicConditions.urological.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Urological</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.urological.slice(0, expandedCategories.urological ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag urological">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.urological.length > 3 && !expandedCategories.urological && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('urological')}>
                                          +{healthData.chronicConditions.urological.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.urological && healthData.chronicConditions.urological.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('urological')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Diabetic Conditions */}
                                {healthData.chronicConditions.diabetic.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Diabetic</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.diabetic.slice(0, expandedCategories.diabetic ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag diabetic">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.diabetic.length > 3 && !expandedCategories.diabetic && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('diabetic')}>
                                          +{healthData.chronicConditions.diabetic.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.diabetic && healthData.chronicConditions.diabetic.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('diabetic')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Cardiac Conditions */}
                                {healthData.chronicConditions.cardiac.length > 0 && (
                                  <div className="health-category-box">
                                    <h4 className="category-title">Cardiac</h4>
                                    <div className="condition-tags">
                                      {healthData.chronicConditions.cardiac.slice(0, expandedCategories.cardiac ? undefined : 3).map((item, index) => (
                                        <span key={index} className="condition-tag cardiac">{item}</span>
                                      ))}
                                      {healthData.chronicConditions.cardiac.length > 3 && !expandedCategories.cardiac && (
                                        <span className="condition-tag more-tag" onClick={() => toggleCategoryExpand('cardiac')}>
                                          +{healthData.chronicConditions.cardiac.length - 3} more...
                                        </span>
                                      )}
                                    </div>
                                    {expandedCategories.cardiac && healthData.chronicConditions.cardiac.length > 3 && (
                                      <button className="show-less-btn" onClick={() => toggleCategoryExpand('cardiac')}>
                                        Show Less
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* No conditions message */}
                                {Object.values(healthData.chronicConditions).every(arr => arr.length === 0) && (
                                  <p className="no-data-message">No chronic conditions reported</p>
                                )}
                              </div>
                            </div>
                            <div className="health-grid">


                              {/* Infectious Diseases */}
                              <div className="health-card">
                                <div className="health-card-header">
                                  <div className="health-icon-container">
                                    <FaHeartbeat className="health-icon" />
                                  </div>
                                  <h3>Infectious Diseases</h3>
                                </div>
                                <div className="health-card-content">
                                  <div className="condition-tags">
                                    {healthData.infectiousDiseases.map((disease, index) => (
                                      <span key={index} className="condition-tag infectious">{disease}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Vaccinations */}
                              <div className="health-card">
                                <div className="health-card-header">
                                  <div className="health-icon-container">
                                    <BsClipboardPulse className="health-icon" />
                                  </div>
                                  <h3>Vaccinations</h3>
                                </div>
                                <div className="health-card-content">
                                  <div className="condition-tags">
                                    {healthData.vaccinations.map((vaccination, index) => (
                                      <span key={index} className="condition-tag vaccination">{vaccination}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Allergies */}
                              <div className="health-card">
                                <div className="health-card-header">
                                  <div className="health-icon-container">
                                    <FaHeartbeat className="health-icon" />
                                  </div>
                                  <h3>Allergies</h3>
                                </div>
                                <div className="health-card-content">
                                  <div className="condition-tags">
                                    {healthData.allergies.map((allergy, index) => (
                                      <span key={index} className="condition-tag allergy">{allergy}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="health-details-grid">
                              {/* Surgery History */}
                              <div className="health-detail-card">
                                <div className="health-detail-header">
                                  <FaHeartbeat className="detail-icon" />
                                  <h3>Surgery History</h3>
                                </div>
                                <div className="health-detail-content">
                                  <p className="detail-text">{healthData.surgeryHistory}</p>
                                </div>
                              </div>

                              {/* Alternative Medicine */}
                              <div className="health-detail-card">
                                <div className="health-detail-header">
                                  <MdMedicalServices className="detail-icon" />
                                  <h3>Alternative Medicine</h3>
                                </div>
                                <div className="health-detail-content">
                                  <div className="detail-tags">
                                    {healthData.alternativeMedicine.map((medicine, index) => (
                                      <span key={index} className="detail-tag">{medicine}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Menstruation */}
                              {patient?.gender === "Female" && (
                                <div className="health-detail-card">
                                  <div className="health-detail-header">
                                    <FaFemale className="detail-icon" />
                                    <h3>Menstruation</h3>
                                  </div>
                                  <div className="health-detail-content">
                                    <p className="detail-text">{healthData.menstruation}</p>
                                  </div>
                                </div>
                              )}

                              {/* Reproductive Health */}
                              {(patient?.gender === "Male" && healthData?.reproductiveHealth?.length > 0) && (
                                <div className="health-detail-card">
                                  <div className="health-detail-header">
                                    {/* <FaFemale className="detail-icon" /> */}
                                    <h3>Reproductive Health</h3>
                                  </div>
                                  <div className="health-detail-content">
                                    <p className="detail-text">{healthData?.reproductiveHealth?.join(", ")}</p>
                                  </div>
                                </div>
                              )}

                              {/* Hospitalization */}
                              <div className="health-detail-card">
                                <div className="health-detail-header">
                                  <MdMedicalServices className="detail-icon" />
                                  <h3>Hospitalization</h3>
                                </div>
                                <div className="health-detail-content">
                                  <div className="detail-row">
                                    <span className="detail-label">Reason:</span>
                                    <span className="detail-value">{healthData.hospitalization.reason}</span>
                                  </div>
                                  <div className="detail-row">
                                    <span className="detail-label">Duration:</span>
                                    <span className="detail-value">{healthData.hospitalization.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Emotional Section */}
                        <div className="details-section" style={{ marginTop: '2rem' }}>
                          <h2 className="section-header emotional-header">
                            <MdOutlineMood className="icon-margin-right" />
                            <span>Emotional Health</span>
                          </h2>
                          <div className="info-card">
                            <div className="health-grid">
                              {/* Psychiatric Conditions */}
                              <div className="health-card">
                                <div className="health-card-header">
                                  <div className="health-icon-container">
                                    <RiMentalHealthFill className="health-icon" />
                                  </div>
                                  <h3>Psychiatric Conditions</h3>
                                </div>
                                <div className="health-card-content">
                                  <div className="condition-tags">
                                    {healthData.emotional.psychiatricConditions.map((condition, index) => (
                                      <span key={index} className="condition-tag psychiatric">{condition}</span>
                                    ))}
                                  </div>
                                  <div className="admission-box">
                                    <h4>Psychiatric Admission:</h4>
                                    <span className="admission-duration">{healthData.emotional.psychiatricAdmission}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Mental Health */}
                              {healthData.emotional.mentalHealth?.length > 0 && (
                                <div className="health-card">
                                  <div className="health-card-header">
                                    <div className="health-icon-container">
                                      <RiMentalHealthFill className="health-icon" />
                                    </div>
                                    <h3>Family Mental Health</h3>
                                  </div>
                                  <div className="health-card-content">
                                    {Object.entries(healthData.emotional.mentalHealth).map(([relation, conditions], index) => (
                                      <div key={index} className="mental-health-box">
                                        <h4 className="relation-title">{relation}</h4>
                                        <div className="condition-tags">
                                          {conditions.map((condition, idx) => (
                                            <span key={idx} className="condition-tag mental">{condition}</span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Neurological Conditions */}
                              <div className="health-card">
                                <div className="health-card-header">
                                  <div className="health-icon-container">
                                    <FaHeartbeat className="health-icon" />
                                  </div>
                                  <h3>Neurological Conditions</h3>
                                </div>
                                <div className="health-card-content">
                                  <div className="condition-tags">
                                    {healthData.emotional.neurologicalConditions.map((condition, index) => (
                                      <span key={index} className="condition-tag neurological">{condition}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Social Engagement */}
                              <div className="health-card">
                                <div className="health-card-header">
                                  <div className="health-icon-container">
                                    <MdOutlineMood className="health-icon" />
                                  </div>
                                  <h3>Social Engagement</h3>
                                </div>
                                <div className="health-card-content">
                                  <p className="engagement-status">{healthData.emotional.socialEngagement}</p>
                                </div>
                              </div>
                            </div>

                            <div className="health-details-grid">
                              {/* Trauma */}
                              <div className="health-detail-card full-width">
                                <div className="health-detail-header">
                                  <RiMentalHealthFill className="detail-icon" />
                                  <h3>Trauma History</h3>
                                </div>
                                <div className="health-detail-content">
                                  <div className="trauma-grid">
                                    <div className="trauma-box">
                                      <h4>Childhood Trauma</h4>
                                      <p className="trauma-text">{healthData.emotional.trauma.childhood}</p>
                                    </div>

                                    <div className="trauma-box">
                                      <h4>Recent Trauma</h4>
                                      <div className="trauma-tags">
                                        {healthData.emotional.trauma.recent.map((item, index) => (
                                          <span key={index} className="trauma-tag">{item}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Ability to handle Anger/Sadness */}
                              <div className="health-detail-card">
                                <div className="health-detail-header">
                                  <MdOutlineMood className="detail-icon" />
                                  <h3>Emotional Management</h3>
                                </div>
                                <div className="health-detail-content">
                                  <span className="detail-label">Ability to handle Anger/Sadness:</span>
                                  <div className="detail-row">
                                    <span className="detail-value emotion-handling">{healthData.emotional.handlingEmotions}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* {activePersonalTab === 'physique' && (
                      <div className="physique-content">
                        <div className="details-section">
                          <h2><GiBodyHeight className="icon-margin-right" /> Physical Measurements</h2>
                          <div className="info-card">
                            <div className="measurement-metrics">
                              <div className="metric">
                                <div className="metric-icon">
                                  <GiBodyHeight className="physique-icon" />
                                </div>
                                <div className="metric-details">
                                  <h3>Height</h3>
                                  <p className="metric-value">5'6" (168 cm)</p>
                                  <p className="metric-date">Measured: January 15, 2025</p>
                                </div>
                              </div>

                              <div className="metric">
                                <div className="metric-icon">
                                  <GiWeightScale className="physique-icon" />
                                </div>
                                <div className="metric-details">
                                  <h3>Weight</h3>
                                  <p className="metric-value">145 lbs (65.8 kg)</p>
                                  <p className="metric-date">Measured: April 1, 2025</p>
                                </div>
                              </div>

                              <div className="metric">
                                <div className="metric-icon">
                                  <FaUser className="physique-icon" />
                                </div>
                                <div className="metric-details">
                                  <h3>BMI</h3>
                                  <p className="metric-value">23.4</p>
                                  <p className="metric-note">Normal weight</p>
                                </div>
                              </div>
                            </div>

                            <div className="weight-history">
                              <h3 className="section-subheader">Weight History</h3>
                              <div className="weight-chart">
                                <ResponsiveContainer width="100%" height={200}>
                                  <LineChart
                                    data={[
                                      { date: 'Jan 2025', weight: 150 },
                                      { date: 'Feb 2025', weight: 148 },
                                      { date: 'Mar 2025', weight: 146 },
                                      { date: 'Apr 2025', weight: 145 }
                                    ]}
                                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[140, 155]} />
                                    <Tooltip />
                                    <Line
                                      type="monotone"
                                      dataKey="weight"
                                      stroke="#0e9f6e"
                                      strokeWidth={2}
                                      dot={{ r: 4 }}
                                      activeDot={{ r: 6 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="details-section">
                          <h2><FaRunning className="icon-margin-right" /> Physical Activity</h2>
                          <div className="info-card">
                            <h3 className="section-subheader">Exercise Routine</h3>
                            <div className="exercise-details">
                              <div className="exercise-item">
                                <div className="exercise-type">Walking</div>
                                <div className="exercise-frequency">30 minutes, 5 days/week</div>
                              </div>
                              <div className="exercise-item">
                                <div className="exercise-type">Yoga</div>
                                <div className="exercise-frequency">45 minutes, 2 days/week</div>
                              </div>
                              <div className="exercise-item">
                                <div className="exercise-type">Light strength training</div>
                                <div className="exercise-frequency">20 minutes, 3 days/week</div>
                              </div>
                            </div>

                            <div className="activity-note">
                              <p><strong>Note:</strong> Activity level adjusted during chemotherapy treatment. Focusing on gentle movement and maintaining strength.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                    {/* ✅ Lifestyle Content */}
                    {activePersonalTab === 'lifestyle' && (
                      <div className="lifestyle-content">
                        {/* Wellness Section */}
                        <div className="details-section">
                          <h2><FaAppleAlt className="icon-margin-right" /> Wellness</h2>
                          <div className="info-card">
                            <div className="wellness-grid">
                              {/* Diet */}
                              <div className="wellness-item">
                                <div className="wellness-header">
                                  <h3>Diet</h3>
                                </div>
                                <div className="wellness-content">
                                  <div className="data-display">
                                    <span className="data-label">Diet Type: </span>
                                    <span className="data-value">{lifestyleData.wellness.dietType}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Stress */}
                              <div className="wellness-item">
                                <div className="wellness-header">
                                  <h3>Stress</h3>
                                </div>
                                <div className="wellness-content">
                                  <div className="data-display">
                                    <span className="data-label">Stress: </span>
                                    <span className="data-value">{lifestyleData.wellness.regularStress}</span>
                                  </div>

                                  {lifestyleData.wellness.regularStress === "Yes" && (
                                    <div className="stress-factors">
                                      <h4>Stress Factors</h4>
                                      <div className="factor-tags">
                                        {lifestyleData.wellness.stressType.map((factor, index) => (
                                          <div key={index} className="factor-tag active">{factor}</div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Activity Level */}
                              <div className="wellness-item">
                                <div className="wellness-header">
                                  <h3>Activity Level</h3>
                                </div>
                                <div className="wellness-content">
                                  <div className="data-display">
                                    <span className="data-label">Work Style: </span>
                                    <span className="data-value">{lifestyleData.wellness.workingType}</span>
                                  </div>

                                  <div className="data-display mt-3">
                                    <span className="data-label">Hours Sitting: </span>
                                    <span className="data-value">{lifestyleData.wellness.hoursSpentSitting}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Sleep */}
                              <div className="wellness-item">
                                <div className="wellness-header">
                                  <h3>Sleep</h3>
                                </div>
                                <div className="wellness-content">
                                  <div className="data-display">
                                    <span className="data-label">Duration: </span>
                                    <span className="data-value">{lifestyleData.wellness.sleepDuration}</span>
                                  </div>

                                  <div className="data-display mt-3">
                                    <span className="data-label">Interruption: </span>
                                    <span className="data-value">{lifestyleData.wellness.sleepInterruption}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Addiction Section */}
                        <div className="details-section" style={{ marginTop: '2rem' }}>
                          <h2><FaSmoking className="icon-margin-right" /> Addiction</h2>
                          <div className="info-card">
                            {/* Substance Use */}
                            <div className="addiction-section">
                              <h3 className="section-subheader">Substance Use</h3>
                              <div className="addiction-grid">
                                {/* Smoking */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Smoking</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <span className="addiction-value">{lifestyleData.addiction.smokingFrequency}</span>
                                  </div>
                                </div>

                                {/* Alcohol */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Alcohol</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <span className="addiction-value">{lifestyleData.addiction.alcoholFrequency}</span>
                                  </div>
                                </div>

                                {/* Prescribed Drug */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Prescribed Drug</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <span className="addiction-value">{lifestyleData.addiction.prescriptionDrugMention}</span>
                                  </div>
                                </div>

                                {/* Tea */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Tea</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <span className="addiction-value">{lifestyleData.addiction.teaFrequency}</span>
                                  </div>
                                </div>

                                {/* Coffee */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Coffee</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <span className="addiction-value">{lifestyleData.addiction.coffeeFrequency}</span>
                                  </div>
                                </div>

                                {/* Edible Tobacco */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Edible Tobacco</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <div className="tobacco-types">
                                      {lifestyleData.addiction.edibleTobaccooption.map((type, index) => (
                                        <span key={index} className="tobacco-type">
                                          {type === 'Other' ? lifestyleData.addiction.edibleTobaccoOther : type}
                                        </span>
                                      ))}
                                    </div>
                                    <span className="addiction-value">{lifestyleData.addiction.edibleTobaccoFrequency}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Behavioral */}
                            <div className="addiction-section">
                              <h3 className="section-subheader">Behavioral</h3>
                              <div className="addiction-grid">
                                {/* Social Media */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Social Media</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <div className="social-media-types">
                                      {lifestyleData.addiction.whichSocialMedia.map((platform, index) => (
                                        <span key={index} className="social-media-type">
                                          {platform === 'Other' ? lifestyleData.addiction.otherSocialMedia : platform}
                                        </span>
                                      ))}
                                    </div>
                                    <span className="addiction-value">{lifestyleData.addiction.sMediaDurationPerDay}</span>
                                  </div>
                                </div>

                                {/* Shopping Mode */}
                                <div className="addiction-item">
                                  <div className="addiction-header">
                                    <h4>Shopping Mode</h4>
                                  </div>
                                  <div className="addiction-content">
                                    <div className="shopping-modes">
                                      {lifestyleData.addiction.shoppingMode.map((mode, index) => (
                                        <span key={index} className="shopping-mode">{mode}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}


            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientProfile;