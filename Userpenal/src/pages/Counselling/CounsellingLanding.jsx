import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Target,
  CheckCircle2,
  MessageCircle,
  UserCheck,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Building2,
  Compass,
  FileCheck,
  Calendar,
  Clock,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CounsellingLanding = () => {
  const navigate = useNavigate();

  const handleStartCounselling = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/counselling/wizard');
  };

  const guidanceServices = [
    {
      icon: Compass,
      title: 'Career Guidance',
      description: 'Align your strengths, interests and aptitude with high-growth professions and industry demands.',
    },
    {
      icon: Building2,
      title: 'College Selection',
      description: 'Shortlist top-tier universities based on cutoff ranks, budget, location preferences, and accreditations.',
    },
    {
      icon: GraduationCap,
      title: 'Course Guidance',
      description: 'Choose the most suitable undergraduate or postgraduate degree for your long-term career trajectory.',
    },
    {
      icon: FileCheck,
      title: 'Admission Support',
      description: 'End-to-end assistance with documentation, application procedures, eligibility criteria, and deadlines.',
    },
  ];

  const workflowSteps = [
    { step: 1, title: 'Share Profile', desc: 'Provide academic scores, rank, and preferences' },
    { step: 2, title: 'Expert Review', desc: 'Counsellors evaluate eligibility & cutoff trends' },
    { step: 3, title: '1-on-1 Session', desc: 'Structured video or call guidance with advisors' },
    { step: 4, title: 'College & Course Plan', desc: 'Personalized shortlist and application strategy' },
    { step: 5, title: 'Admission Follow-up', desc: 'Continuous support through final admission offer' },
  ];

  const statusList = [
    { label: 'Requested', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Scheduled', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'In Progress', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  ];

  return (
    <div className="min-h-screen bg-surface pb-20 text-ink">
      {/* Page Header / Hero Banner */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-brand text-xs font-semibold mb-2.5">
                <UserCheck size={13} /> Certified Academic Counselling
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
                Professional Education & Admission Guidance
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-ink-muted leading-relaxed">
                Make confident decisions with data-driven advice from expert education consultants. Get tailored shortlists for courses, colleges, and scholarships.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleStartCounselling}
                  className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-5 shadow-none flex items-center gap-2"
                >
                  Request Counselling Session <ArrowRight size={14} />
                </Button>
                <Link to="/my-counselling">
                  <Button
                    variant="outline"
                    className="rounded-md border-line text-xs font-semibold h-10 px-4 shadow-none"
                  >
                    View My Requests
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Box */}
            <div className="rounded-md border border-line bg-surface p-5 md:min-w-[280px] space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-brand font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Verified Counsellors</h3>
                  <p className="text-xs text-ink-muted">100% unbiased recommendations</p>
                </div>
              </div>
              <div className="pt-3 border-t border-line text-xs text-ink-muted space-y-1">
                <p>✓ 10,000+ Students Guided</p>
                <p>✓ Direct College Admission Insights</p>
                <p>✓ Scholarship Feasibility Review</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Core Pillars Grid */}
        <div>
          <div className="border-b border-line pb-3 mb-5">
            <h2 className="text-lg md:text-xl font-bold text-ink">
              Comprehensive Guidance Services
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Personalized support at every stage of your higher education journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guidanceServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="rounded-md border border-line bg-white p-5 shadow-none flex flex-col justify-between hover:border-brand/40 transition-colors"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-brand mb-3 border border-blue-100">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-ink mb-1.5">{service.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works - Process Flow */}
        <div className="rounded-md border border-line bg-white p-6 shadow-none">
          <div className="border-b border-line pb-3 mb-6">
            <h2 className="text-base md:text-lg font-bold text-ink">
              How the Counselling Process Works
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Structured 5-step methodology from initial inquiry to final admission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((ws, i) => (
              <div key={i} className="relative p-4 rounded-md border border-line bg-surface flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand bg-blue-50 px-2 py-0.5 rounded">
                      Step {ws.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-ink mb-1">{ws.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{ws.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Lifecycle & Tracking Indicator */}
        <div className="rounded-md border border-line bg-white p-5 shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-ink">Request Lifecycle Stages</h2>
              <p className="text-xs text-ink-muted">Track the exact status of your booked consultation.</p>
            </div>
            <Link to="/my-counselling" className="text-xs font-semibold text-brand hover:underline">
              View Active Sessions →
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statusList.map((st, idx) => (
              <span
                key={idx}
                className={`text-xs font-medium px-2.5 py-1 rounded border ${st.color}`}
              >
                {st.label}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="rounded-md border border-line bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink">Ready to speak with an advisor?</h3>
            <p className="text-xs text-ink-muted mt-0.5">Fill out your profile and schedule your personalized session.</p>
          </div>
          <Button
            onClick={handleStartCounselling}
            className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-6 shadow-none shrink-0"
          >
            Start Free Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CounsellingLanding;
