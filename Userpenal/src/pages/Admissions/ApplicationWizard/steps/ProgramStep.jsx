import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, Calendar, GraduationCap } from 'lucide-react';

const STREAMS = [
  { id: 'engineering', label: 'Engineering & Tech', icon: '💻', desc: 'B.Tech, M.Tech, BCA, MCA' },
  { id: 'management', label: 'Management & Business', icon: '📊', desc: 'MBA, BBA, Executive PG' },
  { id: 'medical', label: 'Medical & Healthcare', icon: '🩺', desc: 'MBBS, BDS, B.Pharm, Nursing' },
  { id: 'law', label: 'Law & Legal Studies', icon: '⚖️', desc: 'BA LLB, BBA LLB, LLM' },
  { id: 'design', label: 'Design & Media', icon: '🎨', desc: 'B.Des, M.Des, Animation' },
  { id: 'science', label: 'Arts & Sciences', icon: '🔬', desc: 'B.Sc, M.Sc, BA, MA' },
];

const STUDY_MODES = [
  { id: 'Full-Time', label: 'Full-Time On-Campus', icon: '🏫', desc: 'Regular classroom sessions & lab access' },
  { id: 'Hybrid', label: 'Hybrid / Blended', icon: '💻', desc: 'Combine online lectures with weekend practicals' },
  { id: 'Distance', label: 'Distance / Online', icon: '🌐', desc: '100% self-paced online learning with mentor support' },
];

export default function ProgramStep({ data, onNext, onBack, loading }) {
  const [formData, setFormData] = useState({
    stream: data?.stream || 'management',
    courseName: data?.courseName || 'Master of Business Administration (MBA)',
    academicYear: data?.academicYear || '2025-2026',
    intake: data?.intake || 'Autumn 2025',
    studyMode: data?.studyMode || 'Full-Time',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Step 1 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Program & Academic Selection</h2>
        <p className="text-sm text-slate-500 mt-1">Choose your target stream, course degree, academic year, and preferred mode of learning.</p>
      </div>

      {/* Stream Selector */}
      <div className="space-y-3">
        <label className="text-[13.5px] font-bold text-[#172554] block">
          Select Academic Stream <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STREAMS.map((s) => {
            const isSelected = formData.stream === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFormData({ ...formData, stream: s.id })}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#172554] bg-[#EFF6FF] ring-4 ring-[#172554]/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-slate-100">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold truncate ${isSelected ? 'text-[#172554]' : 'text-slate-800'}`}>{s.label}</p>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#172554] shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Course Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[13.5px] font-bold text-[#172554] block">
            Target Course / Degree Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="e.g. Master of Business Administration (MBA)"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Academic Year */}
        <div className="space-y-1.5">
          <label className="text-[13.5px] font-bold text-[#172554] block">
            Academic Session / Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-8 text-sm font-medium text-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all appearance-none cursor-pointer"
              required
            >
              <option value="2025-2026">2025 - 2026 Academic Year</option>
              <option value="2026-2027">2026 - 2027 Academic Year</option>
            </select>
          </div>
        </div>

        {/* Admission Intake */}
        <div className="space-y-1.5">
          <label className="text-[13.5px] font-bold text-[#172554] block">
            Preferred Intake <span className="text-red-500">*</span>
          </label>
          <select
            name="intake"
            value={formData.intake}
            onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all appearance-none cursor-pointer"
            required
          >
            <option value="Autumn 2025">Autumn 2025 (August - September)</option>
            <option value="Spring 2026">Spring 2026 (January - February)</option>
            <option value="Summer 2026">Summer 2026 (May - June)</option>
          </select>
        </div>
      </div>

      {/* Mode of Learning */}
      <div className="space-y-3 pt-2">
        <label className="text-[13.5px] font-bold text-[#172554] block">
          Select Study Mode <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STUDY_MODES.map((mode) => {
            const isSelected = formData.studyMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFormData({ ...formData, studyMode: mode.id })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#172554] bg-[#EFF6FF] ring-2 ring-[#172554]/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{mode.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#172554]' : 'text-slate-800'}`}>{mode.label}</span>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-tight">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
        <div />
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
