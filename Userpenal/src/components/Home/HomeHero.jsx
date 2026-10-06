import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApiUrl } from '../../lib/api';
import {
  Search, Building2, BookOpen, GraduationCap, Award, MapPin, ArrowRight, BarChart3,
  MessagesSquare, ChevronDown, Landmark, University, Sparkles, Briefcase, Stethoscope, Scale, Palette,
  ChevronLeft, ChevronRight, TrendingUp, Compass,
} from 'lucide-react';

import ScheduleDeadlines from '@/components/Home/ScheduleDeadlines';

const SLIDE_MS = 5500;

// Same themes as the mobile carousel, so web and mobile tell the same story.
const heroSlides = [
  {
    id: 'admissions',
    icon: Sparkles,
    tag: 'Admissions 2026',
    badge: 'Live Now',
    badgeColor: 'bg-[#F97316]',
    title: ['Find the Right ', 'College', ', Course & Career Path'],
    desc: 'Discover verified universities, compare courses, get expert counselling and make confident career decisions — all in one place.',
    primary: { text: 'Explore Colleges', path: '/colleges', icon: Building2 },
    secondary: [
      { text: 'College Predictor', path: '/predictors', icon: BarChart3, tone: 'text-[#2563EB]' },
      { text: 'Free Counselling', path: '/counselling', icon: MessagesSquare, tone: 'text-[#F97316]' },
    ],
    card: { title: 'Your Career Journey', sub: 'Starts Here' },
  },
  {
    id: 'scholarships',
    icon: Award,
    tag: 'Scholarships',
    badge: '₹25 Cr+ Pool',
    badgeColor: 'bg-[#16A34A]',
    title: ['Discover Merit & Govt ', 'Scholarships', ' for 2026'],
    desc: '150+ active financial aid schemes — check eligibility, deadlines and required documents in minutes.',
    primary: { text: 'View Scholarships', path: '/scholarships', icon: Award },
    secondary: [
      { text: 'Education Loans', path: '/education-loan', icon: Landmark, tone: 'text-[#E11D48]' },
    ],
    card: { title: '150+ Schemes', sub: 'Merit · Need · Govt' },
  },
  {
    id: 'predictor',
    icon: TrendingUp,
    tag: 'Smart Predictor',
    badge: 'AI Powered',
    badgeColor: 'bg-[#2563EB]',
    title: ['Predict Your ', 'Admission', ' Chances Instantly'],
    desc: 'Instant rank & seat analysis for JEE, NEET, CAT and State CETs based on previous year cutoffs.',
    primary: { text: 'Predict My Rank', path: '/predictors', icon: BarChart3 },
    secondary: [
      { text: 'College Predictor', path: '/college-predictor', icon: GraduationCap, tone: 'text-[#2563EB]' },
    ],
    card: { title: 'JEE · NEET · CAT', sub: 'Cutoff based analysis' },
  },
  {
    id: 'counselling',
    icon: MessagesSquare,
    tag: '1-on-1 Guidance',
    badge: 'Free Session',
    badgeColor: 'bg-[#F97316]',
    title: ['Expert ', 'Counselling', ' for Admissions & Fees'],
    desc: 'Get certified guidance on top colleges, cutoffs, fee structures and seat locking — free for students.',
    primary: { text: 'Book Guidance', path: '/counselling', icon: MessagesSquare },
    secondary: [
      { text: 'Career Paths', path: '/careers', icon: Compass, tone: 'text-[#7C3AED]' },
    ],
    card: { title: 'Certified Experts', sub: 'Available today' },
  },
];

const tabs = [
  { id: 'colleges', label: 'Colleges & Universities', icon: Building2, ph: 'Search colleges by name, city, course or exam...' },
  { id: 'courses', label: 'Courses & Degrees', icon: BookOpen, ph: 'Search courses (e.g. B.Tech, MBA, MBBS)...' },
  { id: 'exams', label: 'Exams', icon: GraduationCap, ph: 'Search exams (e.g. JEE Main, NEET, CAT)...' },
  { id: 'scholarships', label: 'Scholarships', icon: Award, ph: 'Search merit and need-based scholarships...' },
];

const streamOptions = ['Engineering', 'MBA', 'Medical', 'Law', 'Design'];

const streams = [
  { label: 'Engineering', sub: 'B.Tech · M.Tech', icon: GraduationCap, path: '/colleges/category/Engineering', tone: 'bg-[#EFF6FF] text-[#2563EB]' },
  { label: 'Management', sub: 'MBA · BBA', icon: Briefcase, path: '/colleges/category/MBA', tone: 'bg-[#ECFDF5] text-[#059669]' },
  { label: 'Medical', sub: 'MBBS · BDS', icon: Stethoscope, path: '/colleges/category/Medical', tone: 'bg-[#FEF2F2] text-[#DC2626]' },
  { label: 'Law', sub: 'LLB · LLM', icon: Scale, path: '/colleges/category/Law', tone: 'bg-[#F5F3FF] text-[#7C3AED]' },
  { label: 'Design', sub: 'B.Des · Arts', icon: Palette, path: '/colleges/category/Design', tone: 'bg-[#FFF7ED] text-[#EA580C]' },
  { label: 'All Colleges', sub: 'Browse everything', icon: Building2, path: '/colleges', tone: 'bg-[#F1F5F9] text-[#172554]' },
];

const Select = ({ icon: Icon, value, onChange, children }) => (
  <div className="relative">
    <Icon size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-8 text-[13px] font-medium text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 cursor-pointer">
      {children}
    </select>
    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
  </div>
);

export default function HomeHero() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('colleges');
  const [term, setTerm] = useState('');
  const [type, setType] = useState('');
  const [stream, setStream] = useState('');
  const [city, setCity] = useState('');
  const [colleges, setColleges] = useState([]);
  const [counts, setCounts] = useState({ courses: null, scholarships: null, exams: null });
  const [focused, setFocused] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i) => setSlide((i + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => go(slide + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [slide, paused, go]);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      fetch(createApiUrl('/college?limit=100')).then(r => r.json()),
      fetch(createApiUrl('/course')).then(r => r.json()),
      fetch(createApiUrl('/scholarships')).then(r => r.json()),
      fetch(createApiUrl('/exam')).then(r => r.json()),
    ]).then(([c, co, s, e]) => {
      if (!alive) return;
      if (c.status === 'fulfilled') setColleges(c.value.data?.colleges || c.value.data?.data || []);
      const len = (r, ...keys) => {
        if (r.status !== 'fulfilled') return null;
        for (const k of keys) if (Array.isArray(r.value.data?.[k])) return r.value.data[k].length;
        return null;
      };
      setCounts({
        courses: len(co, 'courses', 'data'),
        scholarships: len(s, 'data', 'scholarships'),
        exams: len(e, 'exams', 'data'),
      });
    });
    return () => { alive = false; };
  }, []);

  const cities = useMemo(
    () => [...new Set(colleges.map((c) => c.location?.city).filter(Boolean))].sort(),
    [colleges]
  );

  const matches = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return colleges.filter((c) => (c.name || '').toLowerCase().includes(q)).slice(0, 6);
  }, [colleges, term]);

  const submit = () => {
    const q = encodeURIComponent(term.trim());
    if (tab === 'courses') return navigate(`/courses${q ? `?search=${q}` : ''}`);
    if (tab === 'exams') return navigate(`/exams${q ? `?search=${q}` : ''}`);
    if (tab === 'scholarships') return navigate(`/scholarships${q ? `?search=${q}` : ''}`);
    const params = new URLSearchParams();
    if (term.trim()) params.set('search', term.trim());
    if (city) params.set('city', city);
    if (type) params.set('institutionType', type);
    const base = stream ? `/colleges/category/${stream}` : '/colleges';
    const qs = params.toString();
    navigate(qs ? `${base}?${qs}` : base);
  };

  const active = tabs.find((t) => t.id === tab);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#F4F9FF] to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 sm:px-6 pt-12 pb-28 lg:grid-cols-2 lg:pt-16">
          <div
            className="relative z-10 max-w-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
  
            <div className="grid">
              {heroSlides.map((s, i) => {
                const isActive = i === slide;
                const Heading = i === 0 ? 'h1' : 'h2';
                return (
                  <div
                    key={s.id}
                    aria-hidden={!isActive}
                    className={`[grid-area:1/1] transition-all duration-700 ease-out ${
                      isActive
                        ? 'opacity-100 translate-x-0 pointer-events-auto'
                        : `opacity-0 pointer-events-none ${i < slide ? '-translate-x-8' : 'translate-x-8'}`
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1E40AF]">
                      <s.icon size={12} className="text-[#2563EB]" /> {s.tag}
                      <span className={`rounded-full px-1.5 py-px text-[9.5px] text-white ${s.badgeColor}`}>{s.badge}</span>
                    </span>
                    <Heading className="mt-5 text-[40px] font-extrabold leading-[1.1] tracking-tight text-[#172554] lg:text-[52px]">
                      {s.title[0]}<span className="text-[#2563EB]">{s.title[1]}</span>{s.title[2]}
                    </Heading>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#64748B]">{s.desc}</p>
                    <div className="mt-6 flex flex-row items-center gap-2 overflow-x-auto no-scrollbar sm:flex-nowrap">
                      <Link to={s.primary.path} tabIndex={isActive ? 0 : -1} className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-md bg-[#172554] px-3.5 text-[12px] font-bold text-white shadow-xs transition hover:bg-[#0F172A] active:scale-95">
                        <s.primary.icon size={13} /> {s.primary.text} <ArrowRight size={12} />
                      </Link>
                      {s.secondary.map((b) => (
                        <Link key={b.text} to={b.path} tabIndex={isActive ? 0 : -1} className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-3 text-[12px] font-bold text-[#172554] transition hover:border-[#2563EB] active:scale-95">
                          <b.icon size={13} className={b.tone} /> {b.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider controls */}
            <div className="mt-6 flex items-center gap-3">
              <button type="button" aria-label="Previous slide" onClick={() => go(slide - 1)}
                className="flex size-8 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-[#172554] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                <ChevronLeft size={15} />
              </button>
              <div className="flex items-center gap-1.5">
                {heroSlides.map((s, i) => (
                  <button key={s.id} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => go(i)}
                    className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-[#BFDBFE]' : 'w-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'}`}>
                    {i === slide && (
                      <span
                        key={`${slide}-${paused}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-[#172554]"
                        style={{ width: paused ? '100%' : undefined, animation: paused ? 'none' : `heroProgress ${SLIDE_MS}ms linear forwards` }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <button type="button" aria-label="Next slide" onClick={() => go(slide + 1)}
                className="flex size-8 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-[#172554] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                <ChevronRight size={15} />
              </button>
            </div>
            <style>{`@keyframes heroProgress { from { width: 0% } to { width: 100% } }`}</style>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative ml-auto h-[380px] w-full max-w-[560px] overflow-hidden rounded-3xl">
              <img src="/images/hero-student.jpg" alt="Student with books on campus" className="h-full w-full object-cover object-right" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EAF3FF] via-transparent to-transparent" />
            </div>
            <div className="absolute right-2 top-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#172554]"><University size={20} /></span>
              <div>
                <p className="text-[18px] font-extrabold leading-none text-[#172554]">{colleges.length || '—'}</p>
                <p className="mt-1 text-[11px] text-[#64748B]">Institutions listed</p>
              </div>
            </div>
            <div className="absolute bottom-6 left-4 rounded-2xl bg-white px-4 py-3 shadow-lg min-w-[180px]">
              <div className="grid">
                {heroSlides.map((s, i) => (
                  <div key={s.id} className={`[grid-area:1/1] transition-all duration-500 ${i === slide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <p className="text-[13px] font-bold text-[#172554]">{s.card.title}</p>
                    <p className="text-[11px] text-[#64748B]">{s.card.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH CONSOLE & STREAM EXPLORER (Matches max-w-6xl spacing) */}
      <div className="relative z-20 mx-auto -mt-20 max-w-6xl px-4 sm:px-6 space-y-8">

        {/* Search Card Container with Integrated Footer */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(23,37,84,0.10)] flex flex-col">
          <div className="p-4 sm:p-5">
            <div className="flex gap-1 overflow-x-auto border-b border-[#E2E8F0] no-scrollbar">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`relative inline-flex shrink-0 items-center gap-2 px-4 pb-3 pt-1 text-[13px] font-semibold transition ${
                  tab === id ? 'text-[#172554]' : 'text-[#64748B] hover:text-[#172554]'
                }`}>
                <Icon size={15} /> {label}
                {tab === id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#172554]" />}
              </button>
            ))}
          </div>

          {/* Full Width Search Input (Button Removed as requested) */}
          <div className="mt-4">
            <div className="relative w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                autoComplete="off"
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder={active.ph}
                className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-[14px] font-medium text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15 shadow-2xs"
              />
              {focused && tab === 'colleges' && term && (
                <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl">
                  {matches.length ? matches.map((c) => (
                    <Link key={c._id} to={`/colleges/${c._id}`} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-[#EFF6FF]">
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold text-[#172554]">{c.name}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[#64748B]"><MapPin size={11} />{[c.location?.city, c.location?.state].filter(Boolean).join(', ')}</span>
                      </span>
                      <ArrowRight size={14} className="shrink-0 text-[#2563EB]" />
                    </Link>
                  )) : (
                    <p className="px-3 py-3 text-[13px] text-[#64748B]">No match — press Enter to search all colleges.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {tab === 'colleges' && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select icon={University} value={type} onChange={setType}>
                <option value="">All Institutions</option>
                <option value="college">Colleges</option>
                <option value="university">Universities</option>
              </Select>
              <Select icon={BookOpen} value={stream} onChange={setStream}>
                <option value="">All Streams</option>
                {streamOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Select icon={MapPin} value={city} onChange={setCity}>
                <option value="">All Cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
          )}
          </div>

          {/* Integrated Deadlines Footer */}
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 sm:px-5 rounded-b-2xl">
            <ScheduleDeadlines variant="desktop" />
          </div>
        </div>

        {/* BROWSE BY STREAM SECTION (Perfect Left/Right Spacing Alignment) */}
        <div>
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
              EXPLORE
            </span>
            <h2 className="mt-0.5 text-[20px] sm:text-[22px] font-bold text-[#172554]">
              Browse by Stream
            </h2>
            <p className="mt-0.5 text-[13px] text-[#64748B]">
              Jump straight to colleges in your field of interest
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {streams.map(({ label, sub, icon: Icon, path, tone }) => (
              <Link
                key={label}
                to={path}
                className="group flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:border-[#2563EB] hover:shadow-md active:scale-[0.98]"
              >
                <span className={`flex size-10 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon size={19} />
                </span>
                <div className="mt-4">
                  <p className="text-[14px] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#64748B]">
                    {sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
