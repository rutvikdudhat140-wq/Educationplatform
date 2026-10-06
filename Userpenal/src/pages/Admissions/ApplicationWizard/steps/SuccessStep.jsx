import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Home, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function SuccessStep({ data }) {
  const navigate = useNavigate();
  const appNumber = data?.applicationNumber || `APP-2025-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullName = `${data?.firstName || 'Rahul'} ${data?.lastName || 'Sharma'}`;

  return (
    <div className="py-8 text-center max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      {/* Celebration Icon Badge */}
      <div className="relative inline-block">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        <div className="absolute -top-1 -right-1 p-2 bg-amber-400 rounded-full text-white shadow-md animate-bounce">
          <Sparkles className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Success Title */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> Application Confirmed & Fee Received
        </span>
        <h2 className="text-3xl font-black text-[#172554] tracking-tight">Congratulations, {fullName}!</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your admission application has been successfully submitted and logged into our university admissions portal.
        </p>
      </div>

      {/* Application Reference ID Box */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Application Reference ID</p>
        <p className="text-2xl font-black text-blue-700 tracking-wider font-mono">{appNumber}</p>
        <p className="text-[11px] text-slate-500 mt-1">Please save this reference number for all future correspondence.</p>
      </div>

      {/* Program Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-400 font-medium">Applied Course:</span>
          <span className="font-extrabold text-slate-800">{data?.courseName || 'Master of Business Administration (MBA)'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-400 font-medium">Session / Year:</span>
          <span className="font-extrabold text-slate-800">{data?.academicYear || '2025-2026'} ({data?.intake || 'Autumn 2025'})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium">Payment Status:</span>
          <span className="font-extrabold text-emerald-600">₹1,500 Paid (Receipt Sent)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-xs transition-all"
        >
          <Download className="w-4 h-4" /> Download Application Copy
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#172554] hover:bg-blue-900 text-white text-sm font-bold shadow-md shadow-[#172554]/20 transition-all hover:scale-[1.01]"
        >
          <Home className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}
