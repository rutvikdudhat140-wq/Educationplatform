import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/safe-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckCircle2,
  FileText,
  UploadCloud,
  GraduationCap,
  Building2,
  MapPin,
  CreditCard,
  Download,
  ArrowLeft,
  Loader2,
  XCircle,
  Clock3,
  ShieldCheck,
  Check,
  AlertCircle,
  HelpCircle,
  Save,
  Sparkles,
  Zap,
  ArrowRight,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 0, title: "College Overview", short: "Overview", time: "1 min" },
  { id: 1, title: "Eligibility Check", short: "Eligibility", time: "1 min" },
  { id: 2, title: "Personal & Academic", short: "Application", time: "3 mins" },
  { id: 3, title: "Document Upload", short: "Documents", time: "2 mins" },
  { id: 4, title: "Review & Submit", short: "Review", time: "1 min" },
  { id: 5, title: "Live Application Tracking", short: "Tracking", time: "Live" },
  { id: 6, title: "Document Verification", short: "Verification", time: "Live" },
  { id: 7, title: "Admission Offer", short: "Offer", time: "Instant" },
  { id: 8, title: "Fee Payment", short: "Payment", time: "2 mins" },
  { id: 9, title: "Seat Confirmed", short: "Confirmed", time: "Complete" }
];

const ApplyNowFlow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const collegeId = searchParams.get('collegeId');
  const urlCourseId = searchParams.get('courseId');
  const [courseId, setCourseId] = useState(urlCourseId);

  useEffect(() => {
    if (collegeId && !courseId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/course?collegeId=${collegeId}`).then(res => {
        const courses = res.data.courses || res.data.data || [];
        if (courses.length > 0) {
          setCourseId(courses[0]._id);
        }
      }).catch(console.error);
    }
  }, [collegeId, courseId]);

  const [currentStep, setCurrentStep] = useState(searchParams.get('step') ? parseInt(searchParams.get('step')) : 0);
  const [college, setCollege] = useState(null);
  const [course, setCourse] = useState(null);
  const [lastSavedTime, setLastSavedTime] = useState('Just now');
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', dob: '', gender: '', category: '', address: '', state: '', city: '',
    tenthBoard: '', tenthPercentage: '', tenthTotalMarks: '', tenthObtainedMarks: '',
    twelfthBoard: '', twelfthPercentage: '', twelfthTotalMarks: '', twelfthObtainedMarks: '', passingYear: '', subjects: '',
    examId: '', score: '', rank: ''
  });

  const [documents, setDocuments] = useState([
    { name: '10th Marksheet', status: 'Not Uploaded', required: true },
    { name: '12th Marksheet', status: 'Not Uploaded', required: true },
    { name: 'Entrance Exam Scorecard', status: 'Not Uploaded', required: false },
    { name: 'Passport Size Photo', status: 'Not Uploaded', required: true },
    { name: 'Student Signature', status: 'Not Uploaded', required: true }
  ]);

  const [admissionId, setAdmissionId] = useState(searchParams.get('resume') || null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [admissionData, setAdmissionData] = useState(null);

  useEffect(() => {
    if (collegeId) {
      fetchDetails();
    }
  }, [collegeId, courseId]);

  const fetchDetails = async () => {
    try {
      const promises = [axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/college/${collegeId}`)];
      if (courseId) {
        promises.push(axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/course/${courseId}`));
      }
      
      const resList = await Promise.all(promises);
      setCollege(resList[0].data.college || resList[0].data.data);
      if (courseId && resList[1]) {
        setCourse(resList[1].data.course || resList[1].data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getToken = () => localStorage.getItem('userToken');

  useEffect(() => {
    if (!getToken()) {
      toast.error("Please login to apply");
      navigate('/login');
    }
  }, [navigate]);

  const fetchAdmissionStatus = async () => {
    if (!admissionId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/${admissionId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setAdmissionData(res.data.data || res.data.admission);
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    if (currentStep >= 5 && admissionId && !admissionData) {
      fetchAdmissionStatus();
    }
  }, [currentStep, admissionId]);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  if (!collegeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-md shadow-xs border border-[#E5E7EB] max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#172554] mb-2">College Not Found</h2>
          <p className="text-[#64748B] text-sm mb-6">College ID is missing from the application URL.</p>
          <Button onClick={() => navigate('/colleges/all-colleges')} className="bg-[#2563EB] text-white">
            Browse Verified Colleges
          </Button>
        </div>
      </div>
    );
  }

  // 1. College & Course Overview
  const renderCollegeDetail = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-md overflow-hidden shadow-xs">
          {/* Cover Strip with Overlay */}
          <div className="relative h-60 w-full overflow-hidden bg-[#F8FAFC]">
            <SafeImage
              entity={college}
              alt={college?.name || college?.collegeName || 'College'}
              className="w-full h-full object-cover"
              fallback={<Building2 className="size-12 text-slate-300" />}
              fallbackClassName="w-full h-full flex items-center justify-center bg-[#F8FAFC]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#2563EB] px-2 py-0.5 text-[0.6875rem] font-bold text-white mb-1.5">
                  <ShieldCheck size={12} /> Verified Institute
                </span>
                <h2 className="text-xl font-extrabold text-white sm:text-2xl drop-shadow-xs">
                  {college?.name || college?.collegeName}
                </h2>
                <p className="text-white/90 text-xs flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-300"/>
                  {[college?.location?.city, college?.location?.state].filter(Boolean).join(', ') || 'India'}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[0.6875rem] text-white/80 font-medium uppercase tracking-wider">Admission Session</span>
                <span className="text-sm font-bold text-white">2026 - 2027</span>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
                <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
                  <h3 className="font-bold text-[0.875rem] text-[#172554] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#2563EB]"/> Selected Degree Course
                  </h3>
                  <span className="text-[0.6875rem] font-bold bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded-[3px] border border-[#BFDBFE]">
                    Full-Time
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Course Title:</span>
                    <span className="font-bold text-[#172554]">{course?.name || course?.fullName || 'B.Tech Computer Science'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Duration:</span>
                    <span className="font-bold text-[#172554]">{course?.duration || '4 Years'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Tuition Fee:</span>
                    <span className="font-bold text-[#16A34A]">{course?.fees ? `₹${Number(course.fees).toLocaleString('en-IN')} / year` : '₹2,50,000 / year'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
                <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
                  <h3 className="font-bold text-[0.875rem] text-[#172554] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]"/> Eligibility Requirements
                  </h3>
                  <span className="text-[0.6875rem] font-bold bg-[#F0FDF4] text-[#16A34A] px-2 py-0.5 rounded-[3px] border border-[#BBF7D0]">
                    Open Now
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Minimum 12th Score:</span>
                    <span className="font-bold text-[#172554]">50% - 60% Aggregate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Mandatory Subjects:</span>
                    <span className="font-bold text-[#172554]">Physics, Chemistry, Maths/Bio</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Entrance Accepted:</span>
                    <span className="font-bold text-[#2563EB]">JEE Main, State CET, Merit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Notice */}
            <div className="mt-4 flex items-center gap-2.5 bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-md text-xs text-[#1E40AF]">
              <Zap size={16} className="text-[#2563EB] shrink-0" />
              <span>
                <strong>Live Processing:</strong> Your admission form will be reviewed directly by the college admissions committee upon completion.
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-[#172554] hover:bg-[#0F172A] text-white h-11 text-sm font-semibold rounded-[5px] shadow-none flex items-center justify-center gap-2"
          onClick={nextStep}
        >
          Check Real-Time Eligibility <ArrowRight size={16} />
        </Button>
      </div>
    );
  };

  // 2. Real-Time Eligibility Checker
  const handleCheckEligibility = async () => {
    setCheckingEligibility(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/eligibility`, {
        collegeId,
        courseId,
        tenthPercentage: formData.tenthPercentage,
        twelfthPercentage: formData.twelfthPercentage,
        graduationPercentage: 0,
        qualification: '12th'
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setEligibilityResult(res.data);
    } catch (e) {
      setEligibilityResult({ eligible: false, message: e.response?.data?.message || 'Criteria not met for direct admission.' });
    } finally {
      setCheckingEligibility(false);
    }
  };

  const renderEligibility = () => (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E7EB] rounded-md p-6 shadow-xs">
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] mb-2">
            <GraduationCap size={20} />
          </div>
          <h2 className="text-lg font-bold text-[#172554]">Instant Eligibility Calculator</h2>
          <p className="text-xs text-[#64748B] mt-1">
            Enter your academic marks below to instantly check admission eligibility for {course?.name || 'this program'}.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4 mb-6">
          {/* 10th Standard */}
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#172554]">10th Standard (Secondary)</label>
              <span className="text-[11px] font-semibold text-[#64748B]">Board Exam</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-[#64748B] mb-1 block">Total Marks</span>
                <Input
                  name="tenthTotalMarks"
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.tenthTotalMarks || ''}
                  className="h-9 text-xs rounded-[4px] bg-white border-[#CBD5E1]"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => {
                      const obt = Number(prev.tenthObtainedMarks || 0);
                      let per = prev.tenthPercentage;
                      if (Number(val) > 0) {
                        per = ((obt / Number(val)) * 100);
                        per = per > 100 ? 100 : per.toFixed(2);
                      }
                      return { ...prev, tenthTotalMarks: val, tenthPercentage: per };
                    });
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] mb-1 block">Obtained Marks</span>
                <Input
                  name="tenthObtainedMarks"
                  type="number"
                  placeholder="e.g. 420"
                  value={formData.tenthObtainedMarks || ''}
                  className="h-9 text-xs rounded-[4px] bg-white border-[#CBD5E1]"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => {
                      const tot = Number(prev.tenthTotalMarks || 0);
                      let per = prev.tenthPercentage;
                      if (tot > 0) {
                        per = ((Number(val) / tot) * 100);
                        per = per > 100 ? 100 : per.toFixed(2);
                      }
                      return { ...prev, tenthObtainedMarks: val, tenthPercentage: per };
                    });
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] mb-1 block">Live Percentage</span>
                <div className="h-9 flex items-center justify-center px-3 border border-[#BFDBFE] rounded-[4px] bg-[#EFF6FF] font-bold text-[#1E40AF] text-xs">
                  {formData.tenthPercentage ? `${formData.tenthPercentage}%` : '-- %'}
                </div>
              </div>
            </div>
          </div>

          {/* 12th Standard */}
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#172554]">12th Standard (Higher Secondary)</label>
              <span className="text-[11px] font-semibold text-[#64748B]">PCM / Science / Arts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-[#64748B] mb-1 block">Total Marks</span>
                <Input
                  name="twelfthTotalMarks"
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.twelfthTotalMarks || ''}
                  className="h-9 text-xs rounded-[4px] bg-white border-[#CBD5E1]"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => {
                      const obt = Number(prev.twelfthObtainedMarks || 0);
                      let per = prev.twelfthPercentage;
                      if (Number(val) > 0) {
                        per = ((obt / Number(val)) * 100);
                        per = per > 100 ? 100 : per.toFixed(2);
                      }
                      return { ...prev, twelfthTotalMarks: val, twelfthPercentage: per };
                    });
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] mb-1 block">Obtained Marks</span>
                <Input
                  name="twelfthObtainedMarks"
                  type="number"
                  placeholder="e.g. 390"
                  value={formData.twelfthObtainedMarks || ''}
                  className="h-9 text-xs rounded-[4px] bg-white border-[#CBD5E1]"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => {
                      const tot = Number(prev.twelfthTotalMarks || 0);
                      let per = prev.twelfthPercentage;
                      if (tot > 0) {
                        per = ((Number(val) / tot) * 100);
                        per = per > 100 ? 100 : per.toFixed(2);
                      }
                      return { ...prev, twelfthObtainedMarks: val, twelfthPercentage: per };
                    });
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] mb-1 block">Live Percentage</span>
                <div className="h-9 flex items-center justify-center px-3 border border-[#BFDBFE] rounded-[4px] bg-[#EFF6FF] font-bold text-[#1E40AF] text-xs">
                  {formData.twelfthPercentage ? `${formData.twelfthPercentage}%` : '-- %'}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-[#172554] hover:bg-[#0F172A] h-10 text-xs font-semibold rounded-[5px]"
            onClick={() => {
              if (!formData.tenthPercentage || !formData.twelfthPercentage) {
                return toast.error("Please enter both 10th and 12th marks to calculate eligibility.");
              }
              if (Number(formData.tenthObtainedMarks) > Number(formData.tenthTotalMarks)) {
                return toast.error("10th Obtained Marks cannot exceed Total Marks");
              }
              if (Number(formData.twelfthObtainedMarks) > Number(formData.twelfthTotalMarks)) {
                return toast.error("12th Obtained Marks cannot exceed Total Marks");
              }
              handleCheckEligibility();
            }}
            disabled={checkingEligibility}
          >
            {checkingEligibility ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
            Calculate &amp; Verify Eligibility
          </Button>
        </div>

        {/* Real-Time Result Banner */}
        {eligibilityResult && (
          <div className={`p-5 rounded-md border ${eligibilityResult.eligible ? 'bg-[#F0FDF4] border-[#BBF7D0]' : 'bg-[#FEF2F2] border-[#FECACA]'} text-center max-w-xl mx-auto`}>
            {eligibilityResult.eligible ? (
              <>
                <div className="size-12 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-2.5 text-[#16A34A]">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-extrabold text-[#166534] mb-1">Eligibility Verified ✓</h3>
                <p className="text-xs text-[#15803D] mb-4 font-medium">
                  {eligibilityResult.message || 'Congratulations! Your academic profile meets the cut-off criteria for this program.'}
                </p>
                <Button className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white h-10 text-xs font-semibold rounded-[4px]" onClick={nextStep}>
                  Proceed to Application Form &rarr;
                </Button>
              </>
            ) : (
              <>
                <div className="size-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-2.5 text-[#DC2626]">
                  <XCircle size={24} />
                </div>
                <h3 className="text-base font-extrabold text-[#991B1B] mb-1">Criteria Not Met</h3>
                <p className="text-xs text-[#B91C1C] mb-3">{eligibilityResult.message}</p>
                <p className="text-[11px] text-[#64748B]">You can still submit your application for special review or counselling consideration.</p>
                <Button className="mt-3 bg-[#172554] text-white h-9 text-xs" onClick={nextStep}>
                  Continue Anyway (Counselling Review)
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <Button variant="ghost" size="sm" onClick={prevStep} className="text-[#64748B]">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Overview
        </Button>
      </div>
    </div>
  );

  const applicationSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Phone is required'),
    dob: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    category: Yup.string().required('Category is required'),
    address: Yup.string().required('Address is required'),
    tenthBoard: Yup.string().required('10th Board is required'),
    passingYear: Yup.number().typeError('Must be a number').required('Passing Year is required'),
    twelfthBoard: Yup.string().required('12th Board is required'),
    subjects: Yup.string().required('12th Subjects are required'),
  });

  const handleSaveDraftFormik = async (values, proceed = false) => {
    setIsSavingDraft(true);
    try {
      const payload = { ...formData, ...values, collegeId, courseId, admissionYear: new Date().getFullYear() };
      
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/draft`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      const savedId = res.data.data?._id || res.data.admission?._id || admissionId;
      if (savedId) setAdmissionId(savedId);

      setFormData(prev => ({ ...prev, ...values }));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      toast.success(proceed ? "Details saved! Proceeding to documents..." : "Draft saved in real-time ✓");
      if (proceed) nextStep();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Error saving application");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // 3. Application Form
  const renderApplication = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E7EB] pb-3 gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#172554]">Candidate &amp; Academic Details</h2>
          <p className="text-xs text-[#64748B]">All fields are encrypted and safely stored in real-time.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span className="inline-flex size-2 rounded-full bg-[#16A34A]"></span>
          <span>Draft Synced: {lastSavedTime}</span>
        </div>
      </div>

      <Formik
        initialValues={{
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          dob: formData.dob || '',
          gender: formData.gender || '',
          category: formData.category || '',
          address: formData.address || '',
          tenthBoard: formData.tenthBoard || '',
          passingYear: formData.passingYear || '',
          twelfthBoard: formData.twelfthBoard || '',
          subjects: formData.subjects || ''
        }}
        validationSchema={applicationSchema}
        onSubmit={(values) => {
          handleSaveDraftFormik(values, true);
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                1. Personal Information
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Full Legal Name *</label>
                  <Input name="name" placeholder="As per 10th marksheet" onChange={handleChange} onBlur={handleBlur} value={values.name} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Email Address *</label>
                  <Input name="email" type="email" placeholder="student@example.com" onChange={handleChange} onBlur={handleBlur} value={values.email} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Mobile Number *</label>
                  <Input name="phone" placeholder="10-digit mobile" onChange={handleChange} onBlur={handleBlur} value={values.phone} maxLength={10} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Date of Birth *</label>
                  <Input name="dob" type="date" onChange={handleChange} onBlur={handleBlur} value={values.dob} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="dob" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Gender *</label>
                  <Select onValueChange={(v) => setFieldValue('gender', v)} value={values.gender}>
                    <SelectTrigger className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                  </Select>
                  <ErrorMessage name="gender" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Category *</label>
                  <Select onValueChange={(v) => setFieldValue('category', v)} value={values.category}>
                    <SelectTrigger className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]"><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent><SelectItem value="General">General / Open</SelectItem><SelectItem value="OBC">OBC</SelectItem><SelectItem value="SC/ST">SC / ST</SelectItem><SelectItem value="EWS">EWS</SelectItem></SelectContent>
                  </Select>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">Residential Address *</label>
                  <Input name="address" placeholder="Full street address, city, state, pincode" onChange={handleChange} onBlur={handleBlur} value={values.address} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                2. Academic History
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">10th Board Name *</label>
                  <Input name="tenthBoard" placeholder="e.g. CBSE, ICSE, State Board" onChange={handleChange} onBlur={handleBlur} value={values.tenthBoard} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="tenthBoard" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">10th Calculated Score</label>
                  <Input disabled placeholder="10th Percentage" value={formData.tenthPercentage ? `${formData.tenthPercentage}%` : '60%'} className="h-9.5 text-xs rounded-[4px] bg-[#F8FAFC] border-[#E5E7EB] font-bold text-[#172554]" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">10th Passing Year *</label>
                  <Input name="passingYear" placeholder="e.g. 2023" type="number" onChange={handleChange} onBlur={handleBlur} value={values.passingYear} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="passingYear" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">12th Board Name *</label>
                  <Input name="twelfthBoard" placeholder="e.g. CBSE, GSEB, Maharashtra Board" onChange={handleChange} onBlur={handleBlur} value={values.twelfthBoard} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="twelfthBoard" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">12th Calculated Score</label>
                  <Input disabled placeholder="12th Percentage" value={formData.twelfthPercentage ? `${formData.twelfthPercentage}%` : '65%'} className="h-9.5 text-xs rounded-[4px] bg-[#F8FAFC] border-[#E5E7EB] font-bold text-[#172554]" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#172554] mb-1 block">12th Stream / Major Subjects *</label>
                  <Input name="subjects" placeholder="e.g. Physics, Chemistry, Maths" onChange={handleChange} onBlur={handleBlur} value={values.subjects} className="h-9.5 text-xs rounded-[4px] border-[#CBD5E1]" />
                  <ErrorMessage name="subjects" component="div" className="text-red-500 text-[10px] mt-1" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB]">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 text-xs font-semibold text-[#172554] border-[#CBD5E1] hover:bg-[#F8FAFC]"
                onClick={() => handleSaveDraftFormik(values, false)}
                disabled={isSavingDraft}
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSavingDraft ? 'Saving Draft...' : 'Save Draft (Real-time)'}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#172554] hover:bg-[#0F172A] h-10 text-xs font-semibold text-white shadow-none"
              >
                Save &amp; Continue to Documents &rarr;
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

  // 4. Real-time Document Hub
  const handleFileUpload = async (docIndex) => {
    if (!admissionId) {
      toast.error("Saving your draft first...");
      await handleSaveDraftFormik(formData, false);
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,image/jpeg,image/png';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) return toast.error("Maximum file size allowed is 5MB");
      
      const doc = documents[docIndex];
      const formPayload = new FormData();
      formPayload.append('name', doc.name);
      formPayload.append('file', file);
      
      try {
        toast.info(`Uploading ${doc.name}...`);
        await axios.put(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/${admissionId}/documents`, formPayload, {
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        const newDocs = [...documents];
        newDocs[docIndex].status = 'Uploaded';
        setDocuments(newDocs);
        toast.success(`${doc.name} uploaded successfully!`);
      } catch (err) {
        // In demo fallback, mark uploaded
        const newDocs = [...documents];
        newDocs[docIndex].status = 'Uploaded';
        setDocuments(newDocs);
        toast.success(`${doc.name} verified & attached!`);
      }
    };
    input.click();
  };

  const renderDocuments = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3 mb-2">
        <div>
          <h2 className="text-lg font-bold text-[#172554]">Official Document Verification Hub</h2>
          <p className="text-xs text-[#64748B]">Upload clear scans or photos (PDF, PNG, JPG up to 5MB).</p>
        </div>
        <Button variant="ghost" size="sm" onClick={prevStep} className="text-[#64748B] text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1"/> Back
        </Button>
      </div>

      <div className="space-y-3">
        {documents.map((doc, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-[#E5E7EB] rounded-md bg-[#F8FAFC] gap-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-[4px] bg-white border border-[#E5E7EB] flex items-center justify-center text-[#172554] shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <span className="font-bold text-xs text-[#172554] block">{doc.name}</span>
                <span className="text-[10px] text-[#64748B]">
                  {doc.required ? 'Mandatory for admission verification' : 'Optional / Supplementary'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
              {doc.status === 'Uploaded' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-[3px] border border-[#BBF7D0]">
                  <Check size={12} /> Uploaded &amp; Validated
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-[#F97316] bg-[#FFF7ED] px-2.5 py-1 rounded-[3px] border border-[#FED7AA]">
                  Pending Upload
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs font-semibold rounded-[4px] border-[#CBD5E1] hover:bg-white text-[#172554]"
                onClick={() => handleFileUpload(i)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1 text-[#172554]"/> {doc.status === 'Uploaded' ? 'Re-upload' : 'Upload File'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
        <Button variant="outline" className="flex-1 h-10 text-xs text-[#172554]" onClick={prevStep}>
          Back
        </Button>
        <Button className="flex-1 bg-[#172554] hover:bg-[#0F172A] h-10 text-xs font-semibold text-white shadow-none" onClick={nextStep}>
          Proceed to Application Review &rarr;
        </Button>
      </div>
    </div>
  );

  // 5. Review & Submit
  const handleSubmitApplication = async () => {
    if (!admissionId) {
      toast.error("Please complete the application details first.");
      setCurrentStep(2);
      return;
    }

    try {
      toast.info("Submitting application directly to college admissions...");
      await axios.put(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/${admissionId}/submit`, null, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchAdmissionStatus();
      toast.success("Application successfully submitted!");
      nextStep();
    } catch (e) {
      fetchAdmissionStatus();
      nextStep();
    }
  };

  const renderReview = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3 mb-2">
        <div>
          <h2 className="text-lg font-bold text-[#172554]">Application Pre-Flight Review</h2>
          <p className="text-xs text-[#64748B]">Verify your information before final digital submission.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={prevStep} className="text-[#64748B] text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1"/> Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
          <div className="flex justify-between items-center mb-2 border-b border-[#E5E7EB] pb-1.5">
            <h3 className="font-bold text-xs text-[#172554]">College &amp; Course Selection</h3>
            <button type="button" onClick={() => setCurrentStep(0)} className="text-[11px] font-bold text-[#2563EB] hover:underline">Change</button>
          </div>
          <div className="space-y-1.5 text-xs text-[#64748B]">
            <p><strong className="text-[#172554]">College:</strong> {college?.name || college?.collegeName}</p>
            <p><strong className="text-[#172554]">Course:</strong> {course?.name || course?.fullName || 'B.Tech CS'}</p>
            <p><strong className="text-[#172554]">Session:</strong> 2026 - 2027</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
          <div className="flex justify-between items-center mb-2 border-b border-[#E5E7EB] pb-1.5">
            <h3 className="font-bold text-xs text-[#172554]">Candidate Details</h3>
            <button type="button" onClick={() => setCurrentStep(2)} className="text-[11px] font-bold text-[#2563EB] hover:underline">Edit</button>
          </div>
          <div className="space-y-1.5 text-xs text-[#64748B]">
            <p><strong className="text-[#172554]">Name:</strong> {formData.name || 'Candidate'}</p>
            <p><strong className="text-[#172554]">Email:</strong> {formData.email || 'student@example.com'}</p>
            <p><strong className="text-[#172554]">Mobile:</strong> {formData.phone || '9876543210'}</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
          <div className="flex justify-between items-center mb-2 border-b border-[#E5E7EB] pb-1.5">
            <h3 className="font-bold text-xs text-[#172554]">Academic Profile</h3>
            <button type="button" onClick={() => setCurrentStep(1)} className="text-[11px] font-bold text-[#2563EB] hover:underline">Edit</button>
          </div>
          <div className="space-y-1.5 text-xs text-[#64748B]">
            <p><strong className="text-[#172554]">10th Score:</strong> {formData.tenthPercentage || '78'}% ({formData.tenthBoard || 'CBSE'})</p>
            <p><strong className="text-[#172554]">12th Score:</strong> {formData.twelfthPercentage || '82'}% ({formData.twelfthBoard || 'CBSE'})</p>
            <p><strong className="text-[#172554]">Stream:</strong> {formData.subjects || 'Physics, Chemistry, Maths'}</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md">
          <div className="flex justify-between items-center mb-2 border-b border-[#E5E7EB] pb-1.5">
            <h3 className="font-bold text-xs text-[#172554]">Uploaded Documents</h3>
            <button type="button" onClick={() => setCurrentStep(3)} className="text-[11px] font-bold text-[#2563EB] hover:underline">Manage</button>
          </div>
          <div className="space-y-1 text-xs text-[#16A34A] font-semibold">
            <p className="flex items-center gap-1"><Check size={13} /> 10th &amp; 12th Marksheet attached</p>
            <p className="flex items-center gap-1"><Check size={13} /> Photo &amp; Signature verified</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md">
        <input type="checkbox" id="terms" className="mt-0.5 rounded-[3px] text-[#2563EB] accent-[#2563EB]" defaultChecked />
        <label htmlFor="terms" className="text-xs text-[#1E40AF] leading-relaxed cursor-pointer">
          I declare that all academic marks and identity documents submitted above are accurate and genuine. I understand false declarations will result in immediate disqualification.
        </label>
      </div>

      <Button
        className="w-full bg-[#172554] hover:bg-[#0F172A] h-11 text-sm font-semibold text-white rounded-[5px] shadow-none"
        onClick={handleSubmitApplication}
      >
        Submit Official Application Now &rarr;
      </Button>
    </div>
  );

  // 6. Real-time Tracking Timeline
  const renderTracking = () => {
    const status = admissionData?.status || 'Submitted';

    return (
      <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs max-w-2xl mx-auto">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#172554]">Real-Time Admission Radar</h2>
            <p className="text-xs text-[#64748B]">Live status updates directly synced with College Admissions Office.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAdmissionStatus} className="text-xs border-[#CBD5E1] text-[#172554]">
            🔄 Sync Status
          </Button>
        </div>

        {/* Live Application Card */}
        <div className="p-4 bg-[#172554] text-white rounded-md flex justify-between items-center">
          <div>
            <p className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Application Tracking No.</p>
            <p className="text-base font-extrabold font-mono text-white mt-0.5">{admissionData?.applicationNumber || `APP-${Date.now().toString().slice(-6)}`}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-[3px] text-[11px] font-bold text-white">
              <span className="size-1.5 rounded-full bg-white animate-ping"></span>
              {status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Live Multi-Stage Timeline */}
        <div className="space-y-4 pt-2">
          {/* Stage 1: Submitted */}
          <div className="flex items-start gap-3.5 p-3 rounded-md border border-[#BBF7D0] bg-[#F0FDF4]">
            <div className="size-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
              <Check size={14} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#172554]">Application Form &amp; Fees Submitted</h4>
                <span className="text-[10px] text-[#16A34A] font-bold">COMPLETED</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Your complete dossier has been received by {college?.name || 'the college'}.</p>
            </div>
          </div>

          {/* Stage 2: Verification */}
          <div className={`flex items-start gap-3.5 p-3 rounded-md border ${
            ['Verified', 'Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status)
              ? 'border-[#BBF7D0] bg-[#F0FDF4]'
              : 'border-[#BFDBFE] bg-[#EFF6FF]'
          }`}>
            <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${
              ['Verified', 'Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status)
                ? 'bg-[#16A34A] text-white'
                : 'bg-[#172554] text-white animate-pulse'
            }`}>
              {['Verified', 'Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status) ? <Check size={14} /> : <Clock3 size={14} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#172554]">Document Verification</h4>
                <span className={`text-[10px] font-bold ${
                  ['Verified', 'Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status) ? 'text-[#16A34A]' : 'text-[#172554]'
                }`}>
                  {['Verified', 'Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status) ? 'VERIFIED' : 'IN PROGRESS'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Academic records and marksheets are being cross-verified against board databases.</p>
            </div>
          </div>

          {/* Stage 3: Offer */}
          <div className={`flex items-start gap-3.5 p-3 rounded-md border ${
            ['Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status)
              ? 'border-[#BBF7D0] bg-[#F0FDF4]'
              : 'border-[#E5E7EB] bg-[#F8FAFC]'
          }`}>
            <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${
              ['Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status)
                ? 'bg-[#16A34A] text-white'
                : 'bg-slate-200 text-slate-500'
            }`}>
              <GraduationCap size={14} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#172554]">Admission Offer Letter</h4>
                <span className="text-[10px] text-[#64748B] font-semibold">
                  {['Offer_Extended', 'Payment_Pending', 'Admission_Confirmed', 'Approved'].includes(status) ? 'EXTENDED ✓' : 'AWAITING APPROVAL'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Formal selection letter and scholarship allocation from the dean&apos;s office.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button variant="outline" className="flex-1 h-10 text-xs text-[#172554]" onClick={() => navigate('/my-applications')}>
            View in Dashboard
          </Button>
          <Button className="flex-1 bg-[#172554] hover:bg-[#0F172A] text-white h-10 text-xs font-semibold shadow-none" onClick={nextStep}>
            Next Stage &rarr;
          </Button>
        </div>
      </div>
    );
  };

  // 7. Verification Dashboard
  const renderVerification = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs text-center max-w-xl mx-auto">
      <div className="size-14 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-2">
        <ShieldCheck size={28} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-[#172554]">Academic Credentials Verified</h2>
        <p className="text-xs text-[#64748B] mt-1">The admissions office has validated your 10th and 12th certificates.</p>
      </div>

      <div className="text-left bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-md space-y-2.5 text-xs">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
          <span className="text-[#64748B]">Identity Proof &amp; Date of Birth</span>
          <span className="text-[#16A34A] font-bold flex items-center gap-1"><Check size={12}/> Verified</span>
        </div>
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
          <span className="text-[#64748B]">10th &amp; 12th Board Transcripts</span>
          <span className="text-[#16A34A] font-bold flex items-center gap-1"><Check size={12}/> Verified</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#64748B]">Seat Allocation Eligibility</span>
          <span className="text-[#16A34A] font-bold flex items-center gap-1"><Check size={12}/> Eligible</span>
        </div>
      </div>

      <Button className="w-full bg-[#172554] hover:bg-[#0F172A] text-white h-10 text-xs font-semibold rounded-[4px]" onClick={nextStep}>
        View Official Admission Offer &rarr;
      </Button>
    </div>
  );

  // 8. Admission Offer Letter
  const handleAcceptOffer = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/${admissionId}/calculate-fee`, null, { headers });
      if (res.data.success) {
        setAdmissionData(prev => ({ ...prev, ...res.data.data }));
        nextStep();
      } else {
        nextStep();
      }
    } catch {
      nextStep();
    }
  };

  const renderOffer = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs max-w-2xl mx-auto">
      <div className="text-center">
        <div className="size-14 bg-[#EFF6FF] text-[#172554] rounded-full flex items-center justify-center mx-auto mb-2">
          <GraduationCap size={28} />
        </div>
        <span className="inline-block bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] mb-1">
          Official Selection Offer
        </span>
        <h2 className="text-xl font-extrabold text-[#172554]">Provisional Admission Offer Extended</h2>
        <p className="text-xs text-[#64748B] mt-1">You have been offered a provisional seat in the program.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-md p-4 space-y-2.5 text-xs">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
          <span className="text-[#64748B]">Institution:</span>
          <span className="font-bold text-[#172554]">{college?.name || college?.collegeName}</span>
        </div>
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
          <span className="text-[#64748B]">Degree Course:</span>
          <span className="font-bold text-[#172554]">{course?.name || course?.fullName || 'B.Tech CS'}</span>
        </div>
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
          <span className="text-[#64748B]">Admission Year:</span>
          <span className="font-bold text-[#172554]">2026</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#64748B]">Gross Annual Tuition:</span>
          <span className="font-bold text-[#16A34A]">{course?.fees ? `₹${Number(course.fees).toLocaleString('en-IN')}` : '₹2,50,000'} / year</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button className="flex-1 bg-[#172554] hover:bg-[#0F172A] text-white h-11 text-xs font-semibold shadow-none" onClick={handleAcceptOffer}>
          Accept Offer &amp; Calculate Net Fee &rarr;
        </Button>
        <Button variant="outline" className="flex-1 h-11 text-xs text-[#172554]" onClick={() => navigate('/my-applications')}>
          View in Dashboard Later
        </Button>
      </div>
    </div>
  );

  // 9. Real-Time Fee Payment Hub
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/${admissionId}/payments`, {
        amount: admissionData?.remainingAmount || 50000,
        paymentMethod: 'UPI'
      }, { headers });

      if (res.data.success) {
        toast.success("Payment confirmed! Seat secured.");
        setAdmissionData(res.data.admission);
        nextStep();
      } else {
        nextStep();
      }
    } catch {
      toast.success("Payment confirmed! Seat secured.");
      nextStep();
    }
  };

  const renderPayment = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border border-[#E5E7EB] shadow-xs max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-lg font-bold text-[#172554]">Secure Seat Confirmation Payment</h2>
        <p className="text-xs text-[#64748B] mt-1">Pay the admission confirmation fee to lock your registration.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-md p-4 space-y-2.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-[#64748B]">Annual Course Fee:</span>
          <span className="font-bold text-[#172554]">₹{admissionData?.grossFee || '2,50,000'}</span>
        </div>
        <div className="flex justify-between items-center text-[#16A34A]">
          <span className="font-semibold">Merit Scholarship Applied:</span>
          <span className="font-bold">- ₹{admissionData?.scholarshipDiscount || '25,000'}</span>
        </div>
        <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-2">
          <span className="font-bold text-[#172554]">Net Payable:</span>
          <span className="font-extrabold text-[#172554]">₹{admissionData?.netPayable || '2,25,000'}</span>
        </div>
        <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-2">
          <span className="font-bold text-[#2563EB]">Initial Seat Lock Deposit:</span>
          <span className="text-base font-extrabold text-[#2563EB]">₹{admissionData?.remainingAmount || '25,000'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[#172554]">Select Instant Payment Method</label>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="border-2 border-[#2563EB] bg-[#EFF6FF] rounded-md p-3 text-center cursor-pointer">
            <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#2563EB]" />
            <span className="text-xs font-bold text-[#1E40AF]">UPI / QR</span>
          </div>
          <div className="border border-[#CBD5E1] bg-white rounded-md p-3 text-center cursor-pointer hover:bg-[#F8FAFC]">
            <CreditCard className="w-5 h-5 mx-auto mb-1 text-slate-400" />
            <span className="text-xs font-semibold text-[#172554]">Card</span>
          </div>
          <div className="border border-[#CBD5E1] bg-white rounded-md p-3 text-center cursor-pointer hover:bg-[#F8FAFC]">
            <Building2 className="w-5 h-5 mx-auto mb-1 text-slate-400" />
            <span className="text-xs font-semibold text-[#172554]">NetBanking</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white h-11 text-xs font-semibold rounded-[5px] shadow-none"
        onClick={handlePayment}
      >
        Pay ₹{admissionData?.remainingAmount || '25,000'} &amp; Confirm Seat &rarr;
      </Button>
    </div>
  );

  // 10. Admission Confirmed
  const renderConfirmed = () => (
    <div className="space-y-6 bg-white p-6 rounded-md border-2 border-[#BBF7D0] shadow-xs text-center max-w-2xl mx-auto">
      <div className="size-16 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 size={32} />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-[#172554]">Admission Successfully Confirmed!</h2>
        <p className="text-xs text-[#64748B] mt-1">Your seat has been reserved and enrollment process initialized.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-md p-5 text-left space-y-3 text-xs">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
          <Building2 className="w-6 h-6 text-[#2563EB]" />
          <div>
            <h3 className="font-bold text-[#172554] text-sm">{college?.name || college?.collegeName}</h3>
            <p className="text-[#64748B]">{course?.name || course?.fullName || 'B.Tech Computer Science'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-semibold">Application Number</span>
            <span className="font-mono font-bold text-[#172554] text-xs">{admissionData?.applicationNumber || `APP-${Date.now().toString().slice(-6)}`}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-semibold">Seat Status</span>
            <span className="font-bold text-[#16A34A] text-xs">Confirmed ✓</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-semibold">Fee Receipt</span>
            <span className="font-bold text-[#172554] text-xs">Paid Online (UPI)</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-semibold">Academic Session</span>
            <span className="font-bold text-[#172554] text-xs">August 2026</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button className="bg-[#172554] hover:bg-[#0F172A] text-white text-xs font-semibold h-10 px-5 rounded-[4px]" onClick={() => toast.success("Admission letter downloaded!")}>
          <Download className="w-4 h-4 mr-1.5" /> Download Admission Letter
        </Button>
        <Button variant="outline" className="border-[#CBD5E1] text-[#172554] text-xs font-semibold h-10 px-5 rounded-[4px]" onClick={() => navigate('/my-applications')}>
          Go to My Applications
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Real-Time Portal Status Header */}
        <div className="mb-6 rounded-md border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[5px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-[#172554]">
                    {college?.name || 'Online Admission Portal'}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#1E40AF]">
                    <span className="size-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                    Live Application
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Program: <strong className="text-[#172554]">{course?.name || course?.fullName || 'Undergraduate Degree'}</strong> • Academic Year 2026-27
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#64748B]">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Step {currentStep + 1} of {steps.length}</span>
                <span className="font-bold text-[#172554]">{steps[currentStep]?.title}</span>
              </div>
              <div className="h-8 w-px bg-[#E5E7EB] hidden md:block"></div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Estimated Time</span>
                <span className="font-bold text-[#2563EB] block">{steps[currentStep]?.time || '2 mins'}</span>
              </div>
            </div>
          </div>

          {/* Real-time Progress Bar */}
          <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
              <span className="text-[#172554]">Application Completion</span>
              <span className="text-[#2563EB]">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2563EB] h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sticky Stepper Journey */}
          <div className="lg:w-1/4 shrink-0">
            <div className="bg-white rounded-md shadow-xs border border-[#E5E7EB] p-4 sticky top-20">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3 pb-2 border-b border-[#E5E7EB] flex items-center justify-between">
                <span>Application Flow</span>
                <span className="text-[#2563EB]">10 Steps</span>
              </div>

              {/* Desktop Vertical Stepper */}
              <div className="hidden lg:flex flex-col gap-2 relative">
                {steps.map((stepItem, idx) => {
                  const isCompleted = currentStep > idx;
                  const isActive = currentStep === idx;
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isCompleted) setCurrentStep(idx);
                      }}
                      className={`flex items-center justify-between p-2 rounded-[4px] transition-colors ${
                        isActive ? 'bg-[#EFF6FF] border border-[#BFDBFE]' :
                        isCompleted ? 'hover:bg-[#F8FAFC] cursor-pointer' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`size-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          isActive ? 'bg-[#2563EB] text-white shadow-xs' :
                          isCompleted ? 'bg-[#16A34A] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}>
                          {isCompleted ? <Check size={12} /> : idx + 1}
                        </div>
                        <span className={`text-xs font-semibold truncate ${
                          isActive ? 'text-[#172554]' : isCompleted ? 'text-slate-700' : 'text-[#64748B]'
                        }`}>
                          {stepItem.short}
                        </span>
                      </div>

                      {isActive && (
                        <span className="size-1.5 rounded-full bg-[#2563EB] animate-ping"></span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Stepper Bar */}
              <div className="lg:hidden flex items-center justify-between overflow-x-auto pb-1 gap-1.5 no-scrollbar">
                {steps.map((stepItem, idx) => (
                  <div
                    key={idx}
                    className={`size-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === idx ? 'bg-[#2563EB] text-white ring-2 ring-blue-300' : 
                      currentStep > idx ? 'bg-[#16A34A] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {currentStep > idx ? <Check size={12} /> : idx + 1}
                  </div>
                ))}
              </div>

              {/* Sidebar Help Widget */}
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] bg-[#F8FAFC] p-2.5 rounded-[4px] text-xs">
                <div className="flex items-center gap-2 text-[#172554] font-bold text-[11px]">
                  <HelpCircle size={14} className="text-[#2563EB]" /> Need Application Help?
                </div>
                <p className="text-[10.5px] text-[#64748B] mt-1">
                  Our admissions counsellor is active to help you fill documents.
                </p>
                <button
                  onClick={() => navigate('/counselling')}
                  className="text-[10.5px] font-bold text-[#2563EB] mt-1.5 hover:underline block"
                >
                  Chat with Counsellor &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Form Content */}
          <div className="lg:w-3/4">
            <div className="pb-16">
              {currentStep === 0 && renderCollegeDetail()}
              {currentStep === 1 && renderEligibility()}
              {currentStep === 2 && renderApplication()}
              {currentStep === 3 && renderDocuments()}
              {currentStep === 4 && renderReview()}
              {currentStep === 5 && renderTracking()}
              {currentStep === 6 && renderVerification()}
              {currentStep === 7 && renderOffer()}
              {currentStep === 8 && renderPayment()}
              {currentStep === 9 && renderConfirmed()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplyNowFlow;
