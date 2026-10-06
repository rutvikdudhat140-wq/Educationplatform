import React, { useState } from 'react';
import { Phone, Mail, MapPin, ChevronRight, ChevronLeft, Building2, Map } from 'lucide-react';

export default function ContactStep({ data, onNext, onBack, loading }) {
  const [formData, setFormData] = useState({
    primaryEmail: data?.primaryEmail || '',
    alternateEmail: data?.alternateEmail || '',
    primaryPhone: data?.primaryPhone || '',
    alternatePhone: data?.alternatePhone || '',
    residentialAddress: data?.residentialAddress || '',
    city: data?.city || '',
    state: data?.state || '',
    country: data?.country || 'India',
    postalCode: data?.postalCode || '',
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
          <Phone className="w-4 h-4" /> Step 3 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Contact & Address Information</h2>
        <p className="text-sm text-slate-500 mt-1">Provide your active email addresses, phone numbers, and physical residential address.</p>
      </div>

      {/* Communication Contacts */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-600" /> Phone & Email Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Primary Email */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Primary Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleChange}
                placeholder="name@example.com"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Alternate Email */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">Alternate Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="alternateEmail"
                value={formData.alternateEmail}
                onChange={handleChange}
                placeholder="alternate@example.com"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              />
            </div>
          </div>

          {/* Primary Phone with Integrated Country Prefix Badge (Matching Reference Image 1) */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Primary Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl border border-slate-300 bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]/15 focus-within:border-[#2563EB] transition-all">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 border-r border-slate-200 text-[13px] font-bold text-[#172554] select-none shrink-0">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleChange}
                placeholder="98765 43210"
                className="h-11 w-full bg-transparent px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Alternate Phone with Integrated Country Prefix Badge */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">Alternate Phone Number</label>
            <div className="flex rounded-xl border border-slate-300 bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]/15 focus-within:border-[#2563EB] transition-all">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 border-r border-slate-200 text-[13px] font-bold text-[#172554] select-none shrink-0">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="98765 00000"
                className="h-11 w-full bg-transparent px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Residential Address */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" /> Residential Address
        </h3>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#172554] block">
            Street Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="residentialAddress"
            value={formData.residentialAddress}
            onChange={handleChange}
            rows="2"
            placeholder="House / Flat No., Building Name, Street Name, Area / Locality"
            className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              City / Town <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              State / Province <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Map className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. India"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
              required
            />
          </div>

          {/* Postal Code */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#172554] block">
              PIN / Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="e.g. 400001"
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
