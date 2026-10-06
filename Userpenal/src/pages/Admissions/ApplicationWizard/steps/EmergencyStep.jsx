import React, { useState } from 'react';
import { AlertCircle, Phone, User, Mail, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';

const RELATIONSHIP_OPTIONS = [
  { id: 'Father', label: 'Father', icon: '👨' },
  { id: 'Mother', label: 'Mother', icon: '👩' },
  { id: 'Spouse', label: 'Spouse', icon: '💍' },
  { id: 'Guardian', label: 'Guardian', icon: '🧑' },
  { id: 'Sibling', label: 'Sibling', icon: '👫' }
];

export default function EmergencyStep({ data, onNext, onBack, loading }) {
  const [formData, setFormData] = useState({
    emergencyFullName: data?.emergencyFullName || '',
    emergencyRelationship: data?.emergencyRelationship || 'Father',
    emergencyPhone: data?.emergencyPhone || '',
    emergencyEmail: data?.emergencyEmail || '',
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
        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" /> Step 4 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Emergency Contact</h2>
        <p className="text-sm text-slate-500 mt-1">Provide details of a trusted parent or guardian we can reach out to in case of urgent notice.</p>
      </div>

      {/* Emergency Contact Card */}
      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 space-y-6">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#172554] block">
            Emergency Contact Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="emergencyFullName"
              value={formData.emergencyFullName}
              onChange={handleChange}
              placeholder="e.g. Suresh Sharma"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Relationship Selector Pills */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#172554] block">
            Relationship to Applicant <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {RELATIONSHIP_OPTIONS.map((r) => {
              const isSelected = formData.emergencyRelationship === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, emergencyRelationship: r.id })}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#172554] text-[#172554] ring-2 ring-[#172554]/10 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Phone & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Emergency Phone with Prefix */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Emergency Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl border border-slate-300 bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]/15 focus-within:border-[#2563EB] transition-all">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 border-r border-slate-200 text-[13px] font-bold text-[#172554] select-none shrink-0">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="98765 11111"
                className="h-11 w-full bg-transparent px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Emergency Email */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">Emergency Contact Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="emergencyEmail"
                value={formData.emergencyEmail}
                onChange={handleChange}
                placeholder="parent@example.com"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              />
            </div>
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
