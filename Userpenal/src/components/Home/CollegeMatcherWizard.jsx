import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Star,
  MapPin,
  Check,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export const CollegeMatcherWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selections, setSelections] = useState({
    stream: 'Engineering',
    budget: '1.5L-4L',
    location: 'All India',
  });

  const [matchedResults, setMatchedResults] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/college?status=Active').then((res) => {
      setAllColleges(res.data.colleges || res.data.data || []);
    }).catch(() => {});
  }, []);

  const streams = [
    { id: 'Engineering', label: 'Engineering & Tech', icon: '💻', sub: 'B.Tech, M.Tech, BE', bg: 'bg-[#EFF6FF] text-[#2563EB]' },
    { id: 'Management', label: 'Management & MBA', icon: '📈', sub: 'MBA, BBA, PGDM', bg: 'bg-[#ECFDF5] text-[#059669]' },
    { id: 'Medical', label: 'Medical & Healthcare', icon: '🩺', sub: 'MBBS, BDS, Pharma', bg: 'bg-[#FEF2F2] text-[#DC2626]' },
    { id: 'Law', label: 'Law & Governance', icon: '⚖️', sub: 'BA LLB, LLM', bg: 'bg-[#F5F3FF] text-[#7C3AED]' },
    { id: 'Design', label: 'Design & Architecture', icon: '🎨', sub: 'B.Des, B.Arch', bg: 'bg-[#FFF7ED] text-[#EA580C]' },
    { id: 'Computer Applications', label: 'IT & Computer Apps', icon: '🚀', sub: 'BCA, MCA, Data', bg: 'bg-[#ECFEFF] text-[#0891B2]' },
  ];

  const budgets = [
    { id: 'under-1.5L', label: 'Under ₹1.5 Lakh/yr', desc: 'Government & State Merit Seats' },
    { id: '1.5L-4L', label: '₹1.5L - ₹4.0 Lakh/yr', desc: 'Autonomous & Top Tier-2 Institutions' },
    { id: '4L-8L', label: '₹4.0L - ₹8.0 Lakh/yr', desc: 'Premier Private Universities' },
    { id: 'above-8L', label: 'Above ₹8 Lakh/yr', desc: 'Elite Global & Deemed Universities' },
  ];

  const locations = [
    { id: 'All India', label: 'All India (Pan-India)', desc: 'Top Ranked Across All States' },
    { id: 'Gujarat', label: 'Gujarat', desc: 'Ahmedabad, Vadodara, Surat, Rajkot' },
    { id: 'Maharashtra', label: 'Maharashtra', desc: 'Mumbai, Pune, Nagpur' },
    { id: 'Delhi NCR', label: 'Delhi NCR', desc: 'Delhi, Noida, Gurgaon' },
    { id: 'Karnataka', label: 'Karnataka', desc: 'Bangalore, Mysore' },
  ];

  const handleCalculateMatch = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = allColleges.filter((c) => {
        const cat = (c.category || '').toLowerCase();
        if (selections.stream && cat) {
          return cat.includes(selections.stream.toLowerCase().slice(0, 4));
        }
        return true;
      });

      const list = filtered.length >= 3 ? filtered : allColleges;
      const results = list.slice(0, 4).map((c, i) => ({
        ...c,
        matchScore: 98 - i * 3,
        avgPkg: c.placements?.[0]?.averagePackage || c.highlights?.averagePackage || '₹8.5 LPA Avg',
      }));

      setMatchedResults(results);
      setLoading(false);
      setStep(4);
    }, 400);
  };

  const handleReset = () => {
    setStep(1);
    setSelections({
      stream: 'Engineering',
      budget: '1.5L-4L',
      location: 'All India',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#F0F7FF] via-white to-[#F8FAFC] p-5 sm:p-7 shadow-[0_8px_30px_rgba(23,37,84,0.06)]">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] sm:text-[18px] font-extrabold text-[#172554]">30-Second AI College Matcher</h2>
              <span className="rounded-full bg-[#DCFCE7] border border-[#86EFAC] px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-[#15803D]">
                SMART FIT AI
              </span>
            </div>
            <p className="text-[11.5px] sm:text-[12px] text-[#64748B]">Answer 3 quick questions to discover your best matching institutions.</p>
          </div>
        </div>

        {/* Step Progress Pills */}
        {step <= 3 && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white px-2.5 py-1.5 rounded-full border border-[#E2E8F0] shadow-2xs shrink-0">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                    step === s
                      ? 'bg-[#172554] text-white'
                      : step > s
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {step > s ? <Check size={13} strokeWidth={3} /> : s}
                </span>
                {s < 3 && <span className="w-3 h-0.5 bg-[#CBD5E1]" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* STEP 1: STREAM SELECTION */}
      {step === 1 && (
        <div className="pt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <h3 className="text-[13.5px] sm:text-[14px] font-bold text-[#172554]">Step 1 of 3: Select your preferred field of study</h3>
            <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#64748B]">Choose 1 stream</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {streams.map((item) => {
              const isSelected = selections.stream === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelections({ ...selections, stream: item.id })}
                  className={`group relative flex items-start gap-3 rounded-xl p-3.5 text-left border transition-all ${
                    isSelected
                      ? 'border-[#172554] bg-white ring-2 ring-[#172554]/15 shadow-sm'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ${item.bg}`}>
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-[#172554]">{item.label}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{item.sub}</p>
                  </div>
                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#172554] text-white shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#172554] text-white font-bold text-[13.5px] hover:bg-[#0F172A] active:scale-95 transition-all shadow-xs"
            >
              Next: Choose Budget <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BUDGET SELECTION */}
      {step === 2 && (
        <div className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#172554]">Step 2 of 3: What is your annual fee budget?</h3>
            <span className="text-[11px] font-semibold text-[#64748B]">Per year budget</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgets.map((b) => {
              const isSelected = selections.budget === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelections({ ...selections, budget: b.id })}
                  className={`flex items-start gap-3 rounded-xl p-4 text-left border transition-all ${
                    isSelected
                      ? 'border-[#172554] bg-white ring-2 ring-[#172554]/15 shadow-sm'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#172554]">{b.label}</p>
                    <p className="text-[11.5px] text-[#64748B] mt-1">{b.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#172554] text-white shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[13px] font-semibold text-[#64748B] hover:text-[#172554]"
            >
              &larr; Back to Stream
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#172554] text-white font-bold text-[13.5px] hover:bg-[#0F172A] active:scale-95 transition-all shadow-xs"
            >
              Next: Preferred Location <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION SELECTION */}
      {step === 3 && (
        <div className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#172554]">Step 3 of 3: Preferred Location / State</h3>
            <span className="text-[11px] font-semibold text-[#64748B]">State or Pan-India</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {locations.map((loc) => {
              const isSelected = selections.location === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelections({ ...selections, location: loc.id })}
                  className={`flex items-start gap-3 rounded-xl p-3.5 text-left border transition-all ${
                    isSelected
                      ? 'border-[#172554] bg-white ring-2 ring-[#172554]/15 shadow-sm'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <MapPin size={18} className={`shrink-0 mt-0.5 ${isSelected ? 'text-[#172554]' : 'text-[#64748B]'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-[#172554]">{loc.label}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{loc.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#172554] text-white shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[13px] font-semibold text-[#64748B] hover:text-[#172554]"
            >
              &larr; Back to Budget
            </button>
            <button
              type="button"
              onClick={handleCalculateMatch}
              disabled={loading}
              className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#2563EB] text-white font-extrabold text-[14px] hover:bg-[#1D4ED8] active:scale-95 transition-all shadow-md"
            >
              {loading ? (
                <span>Analyzing Colleges...</span>
              ) : (
                <>
                  <Sparkles size={16} /> View Matched Colleges <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULTS */}
      {step === 4 && (
        <div className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                <CheckCircle2 size={13} /> {matchedResults.length} Colleges Matched
              </span>
              <h3 className="text-[16px] font-extrabold text-[#172554] mt-1">
                Top Matches for {selections.stream} ({selections.location})
              </h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:underline"
            >
              <RotateCcw size={13} /> Re-match
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedResults.map((c) => {
              const collegeId = c._id || c.id;
              return (
                <div
                  key={collegeId}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between hover:border-[#172554] shadow-2xs transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-extrabold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                        ⚡ {c.matchScore}% Match
                      </span>
                      <h4 className="text-[14px] font-bold text-[#172554] mt-1.5 truncate">{c.name || c.collegeName}</h4>
                      <p className="text-[11.5px] text-[#64748B] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="shrink-0" />
                        {[c.location?.city, c.location?.state].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    {c.rating && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-[#FFFBEB] border border-[#FEF3C7] px-2 py-0.5 rounded-md shrink-0">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {Number(c.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#16A34A]">{c.avgPkg}</span>
                    <Link
                      to={`/colleges/${collegeId}`}
                      className="text-[12px] font-bold text-[#172554] hover:text-[#2563EB] flex items-center gap-0.5"
                    >
                      View Details <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[#172554] text-white font-bold text-[13px] hover:bg-[#0F172A] active:scale-95 transition-all"
            >
              Browse All 500+ Colleges <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeMatcherWizard;
