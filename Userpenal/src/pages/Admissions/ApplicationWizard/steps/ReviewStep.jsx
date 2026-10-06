import React, { useState } from 'react';
import { Eye, CheckCircle2, Edit3, User, BookOpen, Phone, ShieldAlert, GraduationCap, Briefcase, PlusCircle, FileText, MessageSquareText, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';

export default function ReviewStep({ data, onNext, onBack, loading, setStep }) {
  const [declared, setDeclared] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!declared) return;
    onNext({});
  };

  const fullName = `${data?.firstName || 'Rahul'} ${data?.middleName || ''} ${data?.lastName || 'Sharma'}`.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Eye className="w-4 h-4" /> Step 10 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Review Your Application</h2>
        <p className="text-sm text-slate-500 mt-1">Please carefully review all details below before proceeding to application fee payment.</p>
      </div>

      {/* Summary Cards Stack */}
      <div className="space-y-5">
        {/* Section 1: Program */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#172554]">
              <BookOpen className="w-4 h-4 text-blue-600" /> Program Details
            </div>
            {setStep && (
              <button type="button" onClick={() => setStep(0)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Target Program</span>
              <span className="font-extrabold text-slate-800">{data?.courseName || 'Master of Business Administration (MBA)'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Academic Session</span>
              <span className="font-extrabold text-slate-800">{data?.academicYear || '2025-2026'} ({data?.intake || 'Autumn 2025'})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Study Mode</span>
              <span className="font-extrabold text-slate-800">{data?.studyMode || 'Full-Time'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Personal */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#172554]">
              <User className="w-4 h-4 text-blue-600" /> Personal Details
            </div>
            {setStep && (
              <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Full Name</span>
              <span className="font-extrabold text-slate-800">{fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Gender</span>
              <span className="font-extrabold text-slate-800">{data?.gender || 'Male'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Date of Birth</span>
              <span className="font-extrabold text-slate-800">{data?.dob || '2001-05-15'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Category</span>
              <span className="font-extrabold text-slate-800">{data?.category || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Address */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#172554]">
              <Phone className="w-4 h-4 text-blue-600" /> Contact Details
            </div>
            {setStep && (
              <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Primary Email</span>
              <span className="font-extrabold text-slate-800">{data?.primaryEmail || 'applicant@example.com'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Primary Phone</span>
              <span className="font-extrabold text-slate-800">+91 {data?.primaryPhone || '98765 43210'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Location</span>
              <span className="font-extrabold text-slate-800">{data?.city || 'Mumbai'}, {data?.state || 'Maharashtra'}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Academic */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#172554]">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Academic Qualifications
            </div>
            {setStep && (
              <button type="button" onClick={() => setStep(4)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Institution</span>
              <span className="font-extrabold text-slate-800">{data?.academicHistory?.[0]?.institutionName || "St. Xavier's University"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Qualification</span>
              <span className="font-extrabold text-slate-800">{data?.academicHistory?.[0]?.qualification || "Bachelor's Degree"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Grade / Score</span>
              <span className="font-extrabold text-slate-800">{data?.academicHistory?.[0]?.grade || '88.5%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Declaration Checkbox */}
      <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#172554] focus:ring-[#172554]"
          />
          <span className="text-xs font-bold text-slate-700 leading-relaxed">
            I hereby declare that all information submitted in this application is accurate and complete to the best of my knowledge. I understand that falsification may lead to rejection.
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all"
        >
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={loading || !declared}
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#172554] hover:bg-blue-900 text-white rounded-xl font-bold text-sm shadow-md shadow-[#172554]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Proceed to Payment</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
