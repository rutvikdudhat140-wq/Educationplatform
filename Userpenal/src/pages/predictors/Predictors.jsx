import { useNavigate, Link } from "react-router-dom";
import {
  Award,
  Building2,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Predictors() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-ink pb-20">
      {/* Header Banner */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-brand text-xs font-semibold mb-2.5">
              <TrendingUp size={13} /> Admission Intelligence Tools
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
              Rank & College Admission Predictor
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-ink-muted leading-relaxed">
              Estimate your competitive exam rank and discover eligible colleges and programs based on historical cutoffs and category reservation rules.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Two Main Predictor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 1: Rank Predictor */}
          <div className="rounded-md border border-line bg-white p-6 shadow-none flex flex-col justify-between hover:border-brand/40 transition-colors">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-brand mb-4 border border-blue-100">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-blue-50 px-2 py-0.5 rounded">
                Score Analysis
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-ink mt-2 mb-2">
                Exam Rank Predictor
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
                Enter your test marks or percentile to estimate your All India Rank (AIR) and Category Rank across national entrance exams like JEE, NEET, CAT, and GATE.
              </p>

              <div className="space-y-2 text-xs text-ink-muted mb-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 text-brand text-[10px]">✓</span>
                  <span>Percentile-to-rank conversion matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 text-brand text-[10px]">✓</span>
                  <span>Category-specific normalization (General, OBC, SC, ST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 text-brand text-[10px]">✓</span>
                  <span>Shift-wise difficulty trend calculations</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/rank-predictor")}
              className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 shadow-none flex items-center justify-center gap-1.5"
            >
              Launch Rank Predictor <ArrowRight size={14} />
            </Button>
          </div>

          {/* Tool 2: College Predictor */}
          <div className="rounded-md border border-line bg-white p-6 shadow-none flex flex-col justify-between hover:border-brand/40 transition-colors">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-brand mb-4 border border-blue-100">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-blue-50 px-2 py-0.5 rounded">
                College Matching
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-ink mt-2 mb-2">
                College Admission Predictor
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
                Input your exam rank or percentile to generate a structured list of universities, IITs, NITs, and private colleges where you have high admission probability.
              </p>

              <div className="space-y-2 text-xs text-ink-muted mb-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 text-brand text-[10px]">✓</span>
                  <span>State quota vs All India quota matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 text-brand text-[10px]">✓</span>
                  <span>Branch-wise opening & closing rank cutoffs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 text-brand text-[10px]">✓</span>
                  <span>Direct links to official counseling choices</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/college-predictor")}
              className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 shadow-none flex items-center justify-center gap-1.5"
            >
              Launch College Predictor <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* Methodology & Disclaimer Note */}
        <div className="rounded-md border border-line bg-white p-5 text-xs text-ink-muted">
          <div className="flex items-center gap-2 font-bold text-ink mb-1.5">
            <ShieldCheck size={16} className="text-brand" /> Prediction Methodology & Transparency
          </div>
          <p className="leading-relaxed">
            Estimates are derived from verified cutoff statistics of past admission cycles. Actual counselling allotment outcomes depend on candidate turnouts, seat availability variations, and official centralized counselling rounds (such as JoSAA, MCC, or state authorities).
          </p>
        </div>
      </div>
    </div>
  );
}
