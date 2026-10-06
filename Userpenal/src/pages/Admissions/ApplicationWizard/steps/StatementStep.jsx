import React, { useState } from 'react';
import { MessageSquareText, Sparkles, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

const GUIDANCE_TIPS = [
  'What inspired your interest in this field?',
  'Key academic or extracurricular achievements',
  'Long-term career aspirations & goals',
  'Why this particular university program is the right fit'
];

export default function StatementStep({ data, onNext, onBack, loading }) {
  const [statement, setStatement] = useState(
    data?.personalStatement ||
      'I am applying to this program because of my passion for continuous academic learning and practical career growth. My academic background has equipped me with foundational problem-solving skills, and I am eager to contribute to campus research, engage in specialized industry projects, and achieve my long-term career goals through this curriculum.'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ personalStatement: statement });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <MessageSquareText className="w-4 h-4" /> Step 9 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Statement of Purpose</h2>
        <p className="text-sm text-slate-500 mt-1">Write a personal statement detailing your motivation, career goals, and academic interest.</p>
      </div>

      {/* Guidance Chips */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-[#172554] text-xs font-bold uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Helpful Guidance Tips
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {GUIDANCE_TIPS.map((tip, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl text-xs font-semibold text-slate-700 border border-blue-200/70 shadow-2xs">
              <Sparkles className="w-3 h-3 text-blue-500" /> {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Statement Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[#172554] block">
            Personal Statement / Essay <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs font-extrabold ${statement.length >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {statement.length} characters (Min 100 recommended)
          </span>
        </div>

        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          rows={7}
          placeholder="Write your statement of purpose here..."
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all leading-relaxed"
          required
        />
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
          disabled={loading || statement.trim().length < 20}
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
