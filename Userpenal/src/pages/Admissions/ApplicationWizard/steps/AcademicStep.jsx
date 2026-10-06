import React, { useState } from 'react';
import { GraduationCap, Award, Building, BookOpen, ChevronRight, ChevronLeft, Percent } from 'lucide-react';

export default function AcademicStep({ data, onNext, onBack, loading }) {
  const [formData, setFormData] = useState({
    institutionName: data?.academicHistory?.[0]?.institutionName || '',
    qualification: data?.academicHistory?.[0]?.qualification || "Bachelor's Degree",
    fieldOfStudy: data?.academicHistory?.[0]?.fieldOfStudy || 'Computer Science / IT',
    graduationStatus: data?.academicHistory?.[0]?.graduationStatus || 'Completed',
    grade: data?.academicHistory?.[0]?.grade || '',
    entranceExam: data?.entranceExam || 'JEE Main / CAT',
    entranceScore: data?.entranceScore || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      academicHistory: [formData],
      entranceExam: formData.entranceExam,
      entranceScore: formData.entranceScore
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" /> Step 5 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Academic Qualifications</h2>
        <p className="text-sm text-slate-500 mt-1">Provide information about your most recent academic credentials and qualifying entrance exams.</p>
      </div>

      {/* Main Qualification Card */}
      <div className="space-y-5">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" /> Recent Academic Qualification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Institution Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[13px] font-bold text-[#172554] block">
              School / College / University Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="e.g. St. Xavier's College / CBSE Board"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Qualification Level */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Highest Qualification <span className="text-red-500">*</span>
            </label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all appearance-none cursor-pointer"
              required
            >
              <option value="10th High School">10th Standard / Secondary</option>
              <option value="12th Higher Secondary">12th Standard / Higher Secondary (10+2)</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's Degree">Bachelor's Degree (UG)</option>
              <option value="Master's Degree">Master's Degree (PG)</option>
            </select>
          </div>

          {/* Field of Study */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Field of Study / Stream <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              placeholder="e.g. Science (PCM) / Computer Science"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>

          {/* Status Pills */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#172554] block">
              Completion Status <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {['Completed', 'Pursuing'].map((status) => {
                const isSelected = formData.graduationStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, graduationStatus: status })}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#172554] text-[#172554] ring-2 ring-[#172554]/10 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{status === 'Completed' ? '🎓' : '⏳'}</span>
                    <span>{status === 'Completed' ? 'Completed' : 'Final Year / Pursuing'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade / Percentage / CGPA */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Grade / Percentage / CGPA <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Percent className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g. 88.5% or 8.9 CGPA"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Entrance Exam Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600" /> National Entrance Test (If Applicable)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">Entrance Exam Name</label>
            <input
              type="text"
              name="entranceExam"
              value={formData.entranceExam}
              onChange={handleChange}
              placeholder="e.g. JEE Main, CAT, NEET, GATE, NATA"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">Score / Percentile / Rank</label>
            <input
              type="text"
              name="entranceScore"
              value={formData.entranceScore}
              onChange={handleChange}
              placeholder="e.g. 98.4 Percentile or AIR 1420"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
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
