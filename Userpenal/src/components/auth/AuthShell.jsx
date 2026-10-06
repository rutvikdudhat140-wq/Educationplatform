import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, ShieldCheck, TrendingUp, Award, Building2 } from 'lucide-react';

const perks = [
  { icon: Building2, text: 'Compare 500+ verified colleges & universities' },
  { icon: TrendingUp, text: 'Rank & college predictors with real cutoffs' },
  { icon: Award, text: 'Track scholarships, exams and applications' },
  { icon: ShieldCheck, text: 'Free expert counselling and secure data' },
];

/** Shared responsive shell: split-screen on desktop, clean white page on mobile. */
export default function AuthShell({ badge, headline, sub, title, subtitle, children, wide = false }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-white text-[#111827]">
      <aside className="hidden lg:flex w-[46%] bg-[#172554] p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-white/5" />
        <div className="absolute -left-20 -bottom-20 size-72 rounded-full bg-white/5" />
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#172554]">
            <GraduationCap size={22} />
          </span>
          <span className="text-2xl font-bold tracking-tight">EduPlatform</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <span className="inline-block rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold mb-5">{badge}</span>
          <h1 className="text-4xl xl:text-[44px] font-bold leading-tight tracking-tight text-white">{headline}</h1>
          <p className="text-sm text-white/80 leading-relaxed mt-4">{sub}</p>
          <ul className="mt-8 space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10"><Icon size={16} /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/60">© {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-5 pt-5 lg:px-10">
          <button onClick={() => navigate(-1)} aria-label="Go back"
            className="flex size-10 items-center justify-center rounded-full text-[#172554] hover:bg-[#F3F4F6] active:scale-95 transition">
            <ArrowLeft size={22} />
          </button>
          <Link to="/" className="lg:hidden flex items-center gap-2 text-[#172554] font-bold">
            <GraduationCap size={20} /> EduPlatform
          </Link>
          <span className="w-10" />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-6 lg:px-10">
          <div className={`w-full ${wide ? 'max-w-[480px]' : 'max-w-[420px]'}`}>
            <div className="text-center mb-7">
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[#111827] leading-tight">{title}</h2>
              <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
