import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdmissionStepper from './AdmissionStepper';

import ProgramStep from './steps/ProgramStep';
import PersonalStep from './steps/PersonalStep';
import ContactStep from './steps/ContactStep';
import EmergencyStep from './steps/EmergencyStep';
import AcademicStep from './steps/AcademicStep';
import ExperienceStep from './steps/ExperienceStep';
import AdditionalStep from './steps/AdditionalStep';
import DocumentsStep from './steps/DocumentsStep';
import StatementStep from './steps/StatementStep';
import ReviewStep from './steps/ReviewStep';
import PaymentStep from './steps/PaymentStep';
import SuccessStep from './steps/SuccessStep';

const steps = [
  { id: 'program', label: 'Program' },
  { id: 'personal', label: 'Personal' },
  { id: 'contact', label: 'Contact' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'academic', label: 'Academic' },
  { id: 'experience', label: 'Experience' },
  { id: 'additional', label: 'Additional' },
  { id: 'documents', label: 'Documents' },
  { id: 'statement', label: 'Statement' },
  { id: 'review', label: 'Review' },
  { id: 'payment', label: 'Payment' }
];

export default function ApplicationWizard() {
  const { id } = useParams(); // Admission ID if draft exists
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`http://localhost:5001/api/admissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setFormData(res.data.data);
        setCurrentStepIndex(res.data.data.currentStep ? res.data.data.currentStep - 1 : 0);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load application');
    }
  };

  const saveDraft = async (stepData, isNext = true) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const updatedData = { ...formData, ...stepData, currentStep: isNext ? currentStepIndex + 2 : currentStepIndex + 1 };

      const endpoint = `http://localhost:5001/api/admissions/draft`;

      const res = await axios.post(endpoint, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setFormData(res.data.admission);
        if (!id && res.data.admission?._id) {
          navigate(`/admission/apply/${res.data.admission._id}`, { replace: true });
        }
        if (isNext && currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
          window.scrollTo(0, 0);
        }
      }
    } catch (err) {
      // Local draft fallback if API userToken missing
      setFormData(prev => ({ ...prev, ...stepData }));
      if (isNext && currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Online Admission Portal 2025</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight mt-0.5">
                University Admission Application Wizard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your progress is auto-saved. All required fields marked with <span className="text-red-500 font-bold">*</span>
              </p>
            </div>
            <div className="shrink-0 bg-blue-50 border border-blue-200/80 px-4 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-900 block">Need Assistance?</span>
              <span className="text-xs font-semibold text-blue-700">📞 1800-123-4567 (Toll-Free)</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <AdmissionStepper 
              steps={steps} 
              currentStepIndex={currentStepIndex} 
              setStep={setCurrentStepIndex} 
            />
          </div>
        </div>

        {/* Step Container Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm min-h-[500px]">
          {currentStepIndex === 0 && <ProgramStep data={formData} onNext={saveDraft} loading={loading} />}
          {currentStepIndex === 1 && <PersonalStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 2 && <ContactStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 3 && <EmergencyStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 4 && <AcademicStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 5 && <ExperienceStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 6 && <AdditionalStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 7 && <DocumentsStep admissionId={id} documents={formData.documents || []} onNext={() => saveDraft({})} onBack={handleBack} />}
          {currentStepIndex === 8 && <StatementStep data={formData} onNext={saveDraft} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 9 && <ReviewStep data={formData} onNext={(d) => saveDraft(d, true)} onBack={handleBack} loading={loading} setStep={setCurrentStepIndex} />}
          {currentStepIndex === 10 && <PaymentStep admissionId={id} data={formData} onSuccess={() => setCurrentStepIndex(11)} onBack={handleBack} loading={loading} />}
          {currentStepIndex === 11 && <SuccessStep data={formData} />}
        </div>

      </div>
    </div>
  );
}
