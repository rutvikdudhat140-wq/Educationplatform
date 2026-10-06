import React, { useState } from 'react';
import { User, Calendar, Globe, ChevronRight, ChevronLeft, ShieldCheck, Heart } from 'lucide-react';

const GENDER_OPTIONS = [
  { id: 'Male', label: 'Male', icon: '👨' },
  { id: 'Female', label: 'Female', icon: '👩' },
  { id: 'Other', label: 'Other', icon: '🧑' },
];

export default function PersonalStep({ data, onNext, onBack, loading }) {
  const [formData, setFormData] = useState({
    firstName: data?.firstName || '',
    middleName: data?.middleName || '',
    lastName: data?.lastName || '',
    dob: data?.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
    gender: data?.gender || 'Male',
    nationality: data?.nationality || 'Indian',
    category: data?.category || 'General',
    governmentId: data?.governmentId || '',
    fatherName: data?.fatherName || '',
    motherName: data?.motherName || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" /> Step 2 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-1">Please enter your official personal details as they appear on your identity certificates.</p>
      </div>

      {/* Name Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" /> Full Name Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Rahul"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="e.g. Kumar"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Last Name / Surname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Sharma"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Gender Selection Pills (Matching Reference Image 1) */}
      <div className="space-y-2 pt-1">
        <label className="text-[13px] font-bold text-[#172554] block">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {GENDER_OPTIONS.map((g) => {
            const isSelected = formData.gender === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setFormData({ ...formData, gender: g.id })}
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-2 text-xs font-extrabold transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-[#EFF6FF] border-[#172554] text-[#172554] ring-4 ring-[#172554]/10 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-base">{g.icon}</span>
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DOB & Identity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#172554] block">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Nationality */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#172554] block">
            Nationality / Citizenship <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="e.g. Indian"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#172554] block">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all appearance-none cursor-pointer"
            required
          >
            <option value="General">General (Unreserved)</option>
            <option value="OBC">OBC (Other Backward Classes)</option>
            <option value="SC">SC (Scheduled Caste)</option>
            <option value="ST">ST (Scheduled Tribe)</option>
            <option value="EWS">EWS (Economically Weaker Section)</option>
          </select>
        </div>

        {/* Government ID / Aadhar Number */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#172554] block">
            Aadhar / Government ID Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <ShieldCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="governmentId"
              value={formData.governmentId}
              onChange={handleChange}
              placeholder="e.g. 1234 5678 9012"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Parents Information */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <Heart className="w-4 h-4 text-blue-600" /> Parent / Guardian Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Father's Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="e.g. Suresh Sharma"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Mother's Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              placeholder="e.g. Sunita Sharma"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>
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
