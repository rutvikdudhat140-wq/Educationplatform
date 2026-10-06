import React from 'react';
import { Check, User, BookOpen, Phone, AlertCircle, GraduationCap, Briefcase, PlusCircle, FileText, MessageSquareText, Eye, CreditCard } from 'lucide-react';

const STEP_ICONS = {
  program: BookOpen,
  personal: User,
  contact: Phone,
  emergency: AlertCircle,
  academic: GraduationCap,
  experience: Briefcase,
  additional: PlusCircle,
  documents: FileText,
  statement: MessageSquareText,
  review: Eye,
  payment: CreditCard
};

export default function AdmissionStepper({ steps, currentStepIndex, setStep }) {
  const progressPercentage = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Top Header & Percentage Bar */}
      <div className="flex items-center justify-between px-2 sm:px-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Application Progress</p>
          <p className="text-sm font-extrabold text-[#172554]">
            Step {currentStepIndex + 1} of {steps.length}: <span className="text-blue-600">{steps[currentStepIndex]?.label}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80">
            {progressPercentage}% Completed
          </span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden px-1">
        <div 
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Stepper Scrollable Horizontal Track */}
      <div className="overflow-x-auto custom-scrollbar pt-2 pb-3">
        <div className="flex items-center min-w-max px-3 space-x-1 sm:space-x-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const Icon = STEP_ICONS[step.id] || User;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  disabled={index > currentStepIndex}
                  onClick={() => index <= currentStepIndex && setStep(index)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#172554] text-white shadow-md shadow-[#172554]/20 ring-2 ring-[#172554]/20'
                      : isCompleted
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/80 hover:bg-blue-100/80'
                      : 'bg-slate-50 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="whitespace-nowrap font-bold">{step.label}</span>
                </button>

                {index < steps.length - 1 && (
                  <div className={`h-[2px] w-4 sm:w-6 mx-1 rounded transition-colors ${
                    index < currentStepIndex ? 'bg-blue-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
