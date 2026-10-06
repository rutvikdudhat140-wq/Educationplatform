import React, { useState } from 'react';
import { Briefcase, Building2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const EMPLOYMENT_TYPES = [
  { id: 'Full-Time', label: 'Full-Time', icon: '💼' },
  { id: 'Part-Time', label: 'Part-Time', icon: '⏱️' },
  { id: 'Internship', label: 'Internship', icon: '🎓' },
  { id: 'Freelance', label: 'Freelance', icon: '💻' }
];

export default function ExperienceStep({ data, onNext, onBack, loading }) {
  const [hasExperience, setHasExperience] = useState(data?.workExperience?.length > 0 || false);
  const [formData, setFormData] = useState({
    organizationName: data?.workExperience?.[0]?.organizationName || '',
    jobTitle: data?.workExperience?.[0]?.jobTitle || '',
    employmentType: data?.workExperience?.[0]?.employmentType || 'Full-Time',
    responsibilities: data?.workExperience?.[0]?.responsibilities || '1-2 Years',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasExperience) {
      onNext({ workExperience: [formData] });
    } else {
      onNext({ workExperience: [] });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Briefcase className="w-4 h-4" /> Step 6 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Work Experience</h2>
        <p className="text-sm text-slate-500 mt-1">If you have any prior internship or full-time employment background, add it here.</p>
      </div>

      {/* Experience Checkbox Toggle Card */}
      <button
        type="button"
        onClick={() => setHasExperience(!hasExperience)}
        className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
          hasExperience
            ? 'border-[#172554] bg-[#EFF6FF] ring-4 ring-[#172554]/10 shadow-xs'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 rounded-xl border ${hasExperience ? 'bg-white border-blue-200 text-[#172554]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-extrabold ${hasExperience ? 'text-[#172554]' : 'text-slate-800'}`}>
              I have professional work experience or internship background
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Toggle on to fill in organization details</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          hasExperience ? 'border-[#172554] bg-[#172554] text-white' : 'border-slate-300 bg-white'
        }`}>
          {hasExperience && <CheckCircle2 className="w-4 h-4" />}
        </div>
      </button>

      {/* Fields block if experience exists */}
      {hasExperience && (
        <div className="space-y-5 pt-2 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Organization Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[13px] font-bold text-[#172554] block">
                Organization / Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Tata Consultancy Services / Google"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                  required={hasExperience}
                />
              </div>
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#172554] block">
                Designation / Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Software Engineer / Marketing Intern"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                required={hasExperience}
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#172554] block">Total Duration / Tenure</label>
              <input
                type="text"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="e.g. 1 Year 6 Months"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              />
            </div>
          </div>

          {/* Employment Type Pills */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#172554] block">Employment Type</label>
            <div className="flex flex-wrap gap-2.5">
              {EMPLOYMENT_TYPES.map((t) => {
                const isSelected = formData.employmentType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, employmentType: t.id })}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#172554] text-[#172554] ring-2 ring-[#172554]/10 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
          disabled={loading}
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#172554] hover:bg-blue-900 text-white rounded-xl font-bold text-sm shadow-md shadow-[#172554]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <span>Saving...</span>
          ) : (
            <>
              <span>Save & Continue</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
