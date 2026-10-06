import React, { useState } from 'react';
import { PlusCircle, HelpCircle, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Building, Home, Globe, DollarSign } from 'lucide-react';

export default function AdditionalStep({ data, onNext, onBack, loading }) {
  const [formData, setFormData] = useState({
    referralSource: data?.referralSource || 'Search Engine',
    previouslyApplied: data?.previouslyApplied || false,
    applyingForFinancialAid: data?.applyingForFinancialAid || false,
    internationalApplicant: data?.internationalApplicant || false,
    requiresAccommodation: data?.requiresAccommodation || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const toggleOption = (key) => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <PlusCircle className="w-4 h-4" /> Step 7 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Additional Information</h2>
        <p className="text-sm text-slate-500 mt-1">Specify your preference for scholarship aid, hostel accommodation, or visa support.</p>
      </div>

      {/* Referral Source Dropdown */}
      <div className="space-y-1.5 max-w-lg">
        <label className="text-[13px] font-bold text-[#172554] block">
          How did you hear about our institution? <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <HelpCircle className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            name="referralSource"
            value={formData.referralSource}
            onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-8 text-sm font-medium text-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all appearance-none cursor-pointer"
            required
          >
            <option value="Search Engine">Search Engine (Google / Bing Search)</option>
            <option value="Social Media">Social Media (LinkedIn, Instagram, YouTube)</option>
            <option value="Friend or Alumni">Friend, Family or College Alumni Recommendation</option>
            <option value="Education Fair">Education Fair / Admission Expo</option>
            <option value="News Media">News Paper / Online Portal Article</option>
          </select>
        </div>
      </div>

      {/* Toggle Cards Options Grid */}
      <div className="space-y-3 pt-2">
        <label className="text-[13px] font-bold text-[#172554] block">Additional Preferences & Requirements</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Financial Aid Card */}
          <button
            type="button"
            onClick={() => toggleOption('applyingForFinancialAid')}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
              formData.applyingForFinancialAid
                ? 'border-[#172554] bg-[#EFF6FF] ring-4 ring-[#172554]/10 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${formData.applyingForFinancialAid ? 'bg-white border-blue-200 text-[#172554]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-bold ${formData.applyingForFinancialAid ? 'text-[#172554]' : 'text-slate-800'}`}>Financial Aid / Scholarship</p>
                {formData.applyingForFinancialAid && <CheckCircle2 className="w-4 h-4 text-[#172554] shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">I wish to apply for merit scholarship or financial assistance</p>
            </div>
          </button>

          {/* Hostel Accommodation Card */}
          <button
            type="button"
            onClick={() => toggleOption('requiresAccommodation')}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
              formData.requiresAccommodation
                ? 'border-[#172554] bg-[#EFF6FF] ring-4 ring-[#172554]/10 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${formData.requiresAccommodation ? 'bg-white border-blue-200 text-[#172554]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              <Home className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-bold ${formData.requiresAccommodation ? 'text-[#172554]' : 'text-slate-800'}`}>On-Campus Hostel</p>
                {formData.requiresAccommodation && <CheckCircle2 className="w-4 h-4 text-[#172554] shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">I require student hostel room & mess accommodation</p>
            </div>
          </button>

          {/* International Applicant Card */}
          <button
            type="button"
            onClick={() => toggleOption('internationalApplicant')}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
              formData.internationalApplicant
                ? 'border-[#172554] bg-[#EFF6FF] ring-4 ring-[#172554]/10 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${formData.internationalApplicant ? 'bg-white border-blue-200 text-[#172554]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-bold ${formData.internationalApplicant ? 'text-[#172554]' : 'text-slate-800'}`}>International Student</p>
                {formData.internationalApplicant && <CheckCircle2 className="w-4 h-4 text-[#172554] shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">I am an overseas applicant requiring student visa assistance</p>
            </div>
          </button>

          {/* Previously Applied Card */}
          <button
            type="button"
            onClick={() => toggleOption('previouslyApplied')}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
              formData.previouslyApplied
                ? 'border-[#172554] bg-[#EFF6FF] ring-4 ring-[#172554]/10 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${formData.previouslyApplied ? 'bg-white border-blue-200 text-[#172554]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              <Building className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-bold ${formData.previouslyApplied ? 'text-[#172554]' : 'text-slate-800'}`}>Previously Applied</p>
                {formData.previouslyApplied && <CheckCircle2 className="w-4 h-4 text-[#172554] shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">I have previously submitted an application to this university</p>
            </div>
          </button>
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
