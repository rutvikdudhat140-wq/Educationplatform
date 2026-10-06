import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  User,
  Phone,
  Mail,
  Award,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function AdmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmission = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmission(res.data.admission);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchAdmission();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#172554] border-t-transparent"></div>
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="text-center p-6 bg-white rounded-md border border-[#E5E7EB] max-w-sm">
          <AlertCircle className="size-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-[#172554]">Application Not Found</h2>
          <p className="text-xs text-[#64748B] mt-1 mb-4">The requested application record could not be loaded.</p>
          <Button onClick={() => navigate('/my-applications')} className="bg-[#172554] hover:bg-[#0F172A] text-white text-xs">
            Back to My Applications
          </Button>
        </div>
      </div>
    );
  }

  const getStepForAction = (status) => {
    if (status === 'Draft') return 2;
    if (status === 'Documents Required') return 3;
    if (status === 'Verified') return 6;
    if (['Offer_Extended', 'Approved'].includes(status)) return 7;
    if (status === 'Payment_Pending') return 8;
    return 5;
  };

  const statusColor = (() => {
    if (admission.status === 'Rejected' || admission.status === 'Documents Rejected') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (admission.status === 'Withdrawn') {
      return 'bg-slate-100 text-slate-700 border-slate-200';
    }
    if (admission.status === 'Admission Confirmed' || admission.status === 'Approved') {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    return 'bg-[#EFF6FF] text-[#172554] border-[#BFDBFE]';
  })();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-12 text-[#111827]">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/my-applications')}
                className="h-8 px-2.5 rounded-[4px] border-[#E5E7EB] text-[#172554] hover:bg-[#F8FAFC] text-xs font-semibold"
              >
                <ArrowLeft size={14} className="mr-1" />
                Applications
              </Button>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-[#172554] tracking-tight">
                  Application Dossier
                </h1>
                <p className="text-[11px] text-[#64748B] font-mono font-medium">
                  {admission.applicationNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-bold border ${statusColor}`}>
                <span className="size-1.5 rounded-full bg-current animate-pulse"></span>
                {admission.status}
              </span>

              {['Draft', 'Documents Required', 'Verified', 'Offer_Extended', 'Approved', 'Payment_Pending'].includes(admission.status) && (
                <Button
                  onClick={() => {
                    const step = getStepForAction(admission.status);
                    navigate(`/apply?collegeId=${admission.collegeId?._id}&courseId=${admission.courseId?._id}&resume=${admission._id}&step=${step}`);
                  }}
                  className="bg-[#172554] hover:bg-[#0F172A] text-white text-xs font-bold h-8 px-3.5 rounded-[4px] shadow-none"
                >
                  Resume Application &rarr;
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content: Left = Application Details, Right = Sidebar Timeline */}
      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          
          {/* LEFT COLUMN: Main Application Details (8 cols) */}
          <div className="space-y-4 lg:col-span-7 xl:col-span-8">
            
            {/* College & Course Overview Card */}
            <Card className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
              <div className="flex items-start gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#EFF6FF] text-[#172554] border border-[#E5E7EB]">
                  <Building2 size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Institution &amp; Degree Program
                  </span>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#172554] truncate">
                    {admission.collegeId?.name || "Target College"}
                  </h2>
                  <p className="text-xs font-semibold text-[#172554] mt-0.5">
                    {admission.courseId?.name || admission.courseId?.fullName || "Selected Degree Course"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#64748B]">
                    <span className="inline-flex items-center gap-1 rounded bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5">
                      <Calendar size={11} className="text-slate-400" />
                      Session: {admission.admissionYear || "2026"}
                    </span>
                    {admission.collegeId?.location?.city && (
                      <span className="rounded bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5">
                        📍 {admission.collegeId.location.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Applicant Personal & Contact Info Card */}
            <Card className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554] border-b border-[#E5E7EB] pb-2 mb-3 flex items-center gap-1.5">
                <User size={13} className="text-[#172554]" /> Applicant Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block text-[10.5px] font-medium text-[#64748B]">Candidate Name</span>
                  <span className="font-bold text-[#172554]">{admission.name || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10.5px] font-medium text-[#64748B]">Contact Mobile</span>
                  <span className="font-semibold text-[#172554]">{admission.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10.5px] font-medium text-[#64748B]">Email Address</span>
                  <span className="font-semibold text-[#172554] break-all">{admission.email || "N/A"}</span>
                </div>
              </div>
            </Card>

            {/* Academic Qualification & Entrance Exam Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554] border-b border-[#E5E7EB] pb-2 mb-3 flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-[#172554]" /> Academic Qualification
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Highest Degree:</span>
                    <span className="font-semibold text-[#172554]">{admission.qualification || "12th Standard"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Passing Year:</span>
                    <span className="font-semibold text-[#172554]">{admission.passingYear || "2025-2026"}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E7EB] pt-1.5">
                    <span className="text-[#64748B]">10th / 12th Score:</span>
                    <span className="font-bold text-[#172554]">
                      {admission.tenthPercentage ? `${admission.tenthPercentage}%` : '-'} / {admission.twelfthPercentage ? `${admission.twelfthPercentage}%` : '-'}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554] border-b border-[#E5E7EB] pb-2 mb-3 flex items-center gap-1.5">
                  <Award size={13} className="text-[#172554]" /> Entrance Exam
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Exam Name:</span>
                    <span className="font-semibold text-[#172554]">{admission.examId?.name || "Direct / Merit"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Rank / Score:</span>
                    <span className="font-bold text-[#172554]">{admission.rank || admission.examScore || "Qualified"}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E7EB] pt-1.5">
                    <span className="text-[#64748B]">Quota / Category:</span>
                    <span className="font-semibold text-[#172554]">{admission.category || "General"}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Uploaded Documents Verification Card */}
            <Card className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554] border-b border-[#E5E7EB] pb-2 mb-3 flex items-center gap-1.5">
                <FileText size={13} className="text-[#172554]" /> Uploaded Verification Documents
              </h3>
              {admission.documents && admission.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {admission.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC]">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[#172554] truncate">{doc.name}</p>
                        <span className={`inline-block mt-0.5 px-1.5 py-0.2 text-[9.5px] font-bold rounded ${
                          doc.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {doc.status || 'Attached'}
                        </span>
                      </div>
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#172554] hover:underline flex items-center gap-1 shrink-0"
                        >
                          View <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B] py-2 text-center">No additional documents attached.</p>
              )}
            </Card>

            {/* Admission Confirmed Banner (If applicable) */}
            {admission.status === 'Admission Confirmed' && (
              <Card className="rounded-md border border-green-200 bg-green-50 p-4 shadow-none">
                <div className="flex items-center gap-2 text-green-900 font-bold text-sm mb-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>Provisional Seat Confirmed</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white/80 p-2 rounded border border-green-100">
                    <span className="text-[10px] text-green-700 font-semibold block">Enrollment No.</span>
                    <span className="font-bold text-green-950">{admission.enrollmentNumber || "Generated"}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-green-100">
                    <span className="text-[10px] text-green-700 font-semibold block">Admission Date</span>
                    <span className="font-bold text-green-950">
                      {admission.admissionDate ? new Date(admission.admissionDate).toLocaleDateString('en-IN') : 'Confirmed'}
                    </span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-green-100">
                    <span className="text-[10px] text-green-700 font-semibold block">Batch Session</span>
                    <span className="font-bold text-green-950">August 2026</span>
                  </div>
                </div>
              </Card>
            )}

          </div>

          {/* RIGHT COLUMN: Sidebar Timeline & Quick Actions (4 cols) */}
          <div className="space-y-4 lg:col-span-5 xl:col-span-4">
            
            {/* SIDEBAR TIMELINE CARD */}
            <Card className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none sticky top-20">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554] flex items-center gap-1.5">
                  <Clock3 size={14} className="text-[#172554]" /> Application Radar Timeline
                </h3>
                <span className="text-[10.5px] font-bold text-[#172554]">
                  Live Sync
                </span>
              </div>

              {/* Status Flow List */}
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
                {admission.statusHistory && admission.statusHistory.length > 0 ? (
                  admission.statusHistory.map((history, idx) => (
                    <div key={idx} className="relative group">
                      {/* Status Dot */}
                      <span className="absolute -left-5 top-0.5 size-3 rounded-full bg-[#172554] ring-4 ring-white" />
                      
                      <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-2.5 rounded-[4px]">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#172554]">{history.status}</p>
                          <span className="text-[9.5px] text-[#64748B] font-medium">
                            {new Date(history.changedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        {history.note && (
                          <p className="mt-1 text-[11px] text-slate-600 bg-white p-1.5 rounded border border-[#E5E7EB]">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <span className="absolute -left-5 top-0.5 size-3 rounded-full bg-[#172554] ring-4 ring-white" />
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-2.5 rounded-[4px]">
                      <p className="text-xs font-bold text-[#172554]">{admission.status}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Application active on portal.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions in Sidebar */}
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] space-y-2">
                {['Draft', 'Documents Required', 'Verified', 'Offer_Extended', 'Approved', 'Payment_Pending'].includes(admission.status) && (
                  <Button
                    onClick={() => {
                      const step = getStepForAction(admission.status);
                      navigate(`/apply?collegeId=${admission.collegeId?._id}&courseId=${admission.courseId?._id}&resume=${admission._id}&step=${step}`);
                    }}
                    className="w-full bg-[#172554] hover:bg-[#0F172A] text-white text-xs font-bold h-9 rounded-[4px] shadow-none"
                  >
                    Take Action / Complete Step
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => navigate('/my-applications')}
                  className="w-full border-[#E5E7EB] text-[#172554] hover:bg-[#F8FAFC] text-xs font-semibold h-9 rounded-[4px]"
                >
                  All My Applications
                </Button>
              </div>

              {/* Verified Trust Badge */}
              <div className="mt-3 bg-[#EFF6FF] border border-[#BFDBFE] p-2 rounded-[4px] flex items-center gap-2 text-[10.5px] text-[#172554]">
                <ShieldCheck size={14} className="shrink-0 text-[#172554]" />
                <span>Directly connected with College Admission Desk.</span>
              </div>
            </Card>

          </div>

        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-[49px] left-0 right-0 px-3 py-1.5 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] shadow-md z-30 flex gap-2 h-11 items-center">
        <Button
          variant="outline"
          className="flex-1 border-[#CBD5E1] text-[#172554] font-bold rounded-[6px] h-8 text-[11px]"
          onClick={() => navigate("/my-applications")}
        >
          My Applications
        </Button>
        {['Draft', 'Documents Required', 'Verified', 'Offer_Extended', 'Approved', 'Payment_Pending'].includes(admission.status) ? (
          <Button
            className="flex-1 bg-[#172554] hover:bg-[#0F172A] text-white font-bold rounded-[6px] h-8 text-[11px]"
            onClick={() => {
              const step = getStepForAction(admission.status);
              navigate(`/apply?collegeId=${admission.collegeId?._id}&courseId=${admission.courseId?._id}&resume=${admission._id}&step=${step}`);
            }}
          >
            Take Action
          </Button>
        ) : (
          <Button
            className="flex-1 bg-[#172554] hover:bg-[#0F172A] text-white font-bold rounded-[4px] h-9 text-xs"
            onClick={() => navigate("/counselling")}
          >
            Need Help?
          </Button>
        )}
      </div>
    </div>
  );
}
