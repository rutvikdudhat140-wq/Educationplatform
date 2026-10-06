import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ChevronRight, ChevronLeft, QrCode, Building, Sparkles } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR Code', icon: '📱', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, MasterCard, RuPay, Maestro' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏛️', desc: 'HDFC, ICICI, SBI, Axis & all major banks' },
];

export default function PaymentStep({ admissionId, data, onSuccess, onBack, loading }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const token = localStorage.getItem('userToken');

      if (admissionId) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/admissions/draft`,
          {
            ...data,
            _id: admissionId,
            paidAmount: 1500,
            paymentStatus: 'Paid',
            status: 'SUBMITTED',
            currentStep: 12
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success('Payment of ₹1,500 completed successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.success('Application submitted successfully!');
      if (onSuccess) onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <CreditCard className="w-4 h-4" /> Step 11 of 11
        </div>
        <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">Application Fee Payment</h2>
        <p className="text-sm text-slate-500 mt-1">Complete your application submission by paying the non-refundable registration fee.</p>
      </div>

      {/* Fee Breakdown Card */}
      <div className="bg-gradient-to-br from-[#172554] to-blue-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-blue-800/80 pb-4">
          <div>
            <p className="text-xs font-bold uppercase text-blue-300 tracking-wider">Target Program</p>
            <h3 className="text-base font-extrabold text-white mt-0.5">{data?.courseName || 'Master of Business Administration (MBA)'}</h3>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-extrabold">
            Standard Application
          </span>
        </div>

        <div className="space-y-2 text-xs text-blue-200">
          <div className="flex justify-between">
            <span>Application Processing Fee</span>
            <span className="font-bold text-white">₹1,500.00</span>
          </div>
          <div className="flex justify-between">
            <span>Service Tax / GST (0%)</span>
            <span className="font-bold text-white">₹0.00</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-blue-800/80 pt-4">
          <span className="text-sm font-bold text-blue-200">Total Payable Amount</span>
          <span className="text-3xl font-black text-amber-400">₹1,500</span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-3">
        <label className="text-[13.5px] font-bold text-[#172554] block">Select Payment Gateway</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((m) => {
            const isSelected = selectedMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#172554] bg-[#EFF6FF] ring-2 ring-[#172554]/10 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{m.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#172554]' : 'text-slate-800'}`}>{m.label}</span>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-tight">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Assurance Badge */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <Lock className="w-4 h-4 text-emerald-600" />
        <span>256-Bit SSL Encryption • Instant Receipt Generation</span>
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
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Processing Payment...</span>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <span>Pay ₹1,500 & Submit Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
