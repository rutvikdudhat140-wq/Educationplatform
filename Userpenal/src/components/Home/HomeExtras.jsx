import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createApiUrl } from '../../lib/api';
import {
  Award, Megaphone, Building2, GraduationCap, Briefcase, Stethoscope, Scale, Palette,
  Search, GitCompare, FileCheck2, PartyPopper, ChevronRight, ChevronDown, Calendar,
  ShieldCheck, BadgeCheck, Zap, MessagesSquare, Landmark, ArrowRight, PlayCircle, Clock, Star, Video
} from 'lucide-react';

const streams = [
  { label: 'Engineering', sub: 'B.Tech · M.Tech', icon: GraduationCap, path: '/colleges/category/Engineering', tone: 'bg-[#EFF6FF] text-[#2563EB]' },
  { label: 'Management', sub: 'MBA · BBA', icon: Briefcase, path: '/colleges/category/MBA', tone: 'bg-[#ECFDF5] text-[#059669]' },
  { label: 'Medical', sub: 'MBBS · BDS', icon: Stethoscope, path: '/colleges/category/Medical', tone: 'bg-[#FEF2F2] text-[#DC2626]' },
  { label: 'Law', sub: 'LLB · LLM', icon: Scale, path: '/colleges/category/Law', tone: 'bg-[#F5F3FF] text-[#7C3AED]' },
  { label: 'Design', sub: 'B.Des · Arts', icon: Palette, path: '/colleges/category/Design', tone: 'bg-[#FFF7ED] text-[#EA580C]' },
  { label: 'All Colleges', sub: 'Browse everything', icon: Building2, path: '/colleges', tone: 'bg-[#F1F5F9] text-[#172554]' },
];

const steps = [
  { icon: Search, title: 'Discover', text: 'Search verified colleges, courses and exams by city, stream or rank.' },
  { icon: GitCompare, title: 'Compare', text: 'Put fees, placements, cutoffs and ratings side by side.' },
  { icon: FileCheck2, title: 'Apply', text: 'Submit applications and scholarships, and track every status.' },
  { icon: PartyPopper, title: 'Get Admitted', text: 'Lock your seat with free guidance from expert counsellors.' },
];

const faqs = [
  { q: 'Is EduPlatform free for students?', a: 'Yes. Searching colleges, comparing, using predictors and tracking alerts is free. Counselling sessions are also free to start.' },
  { q: 'How do I apply to a college?', a: 'Open any college, tap Apply Now, and complete the short application. You can track it later from My Applications.' },
  { q: 'How are rank & college predictors calculated?', a: 'They use cutoff data stored on the platform for each college, course and exam category, so results reflect actual records.' },
  { q: 'How do I get deadline alerts?', a: 'Open Alerts to filter exam, admission, result and scholarship notifications by category and mark them as read.' },
];

const SectionHead = ({ eyebrow, title, sub, to, cta }) => (
  <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
    <div className="min-w-0 flex-1">
      {eyebrow && <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#F97316]">{eyebrow}</div>}
      <h2 className="text-[18px] sm:text-[22px] font-extrabold text-[#172554] leading-snug">{title}</h2>
      {sub && <p className="mt-1 text-[12.5px] sm:text-[13.5px] text-[#64748B] leading-relaxed">{sub}</p>}
    </div>
    {to && (
      <Link to={to} className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-md">
        {cta} <ChevronRight size={14} />
      </Link>
    )}
  </div>
);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export default function HomeExtras() {
  const [news, setNews] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [onlineCourses, setOnlineCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem('userToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.allSettled([
      fetch(createApiUrl('/education-updates?limit=4'), { headers }).then(r => r.json()),
      fetch(createApiUrl('/scholarships'), { headers }).then(r => r.json()),
      fetch(createApiUrl('/online-courses'), { headers }).then(r => r.json()),
    ]).then(([n, s, oc]) => {
      if (!alive) return;
      if (n.status === 'fulfilled') setNews((n.value.data?.data || []).slice(0, 4));
      if (s.status === 'fulfilled') setScholarships((s.value.data?.data || []).slice(0, 4));
      if (oc.status === 'fulfilled') setOnlineCourses((oc.value.data?.data || []).slice(0, 4));
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const skeleton = (n) =>
    Array.from({ length: n }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-[#F1F5F9]" />);

  return (
    <div className="pb-28 md:pb-0">

      {/* How it works */}
      <section className="border-y border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          <SectionHead eyebrow="How it works" title="From search to seat in 4 steps" />
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-lg border border-[#E5E7EB] bg-white p-5">
                <span className="absolute right-4 top-3 text-[28px] font-extrabold text-[#E2E8F0]">0{i + 1}</span>
                <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#172554] text-white"><Icon size={19} /></span>
                <p className="text-[14px] font-bold text-[#172554]">{title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748B]">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scholarships — live data */}
      {(loading || scholarships.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          <SectionHead eyebrow="Funding" title="Scholarships Open for You" sub="Live schemes from our database" to="/scholarships" cta="All scholarships" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? skeleton(4) : scholarships.map((s) => (
              <Link key={s._id} to={`/scholarships/${s._id}`}
                className="flex flex-col justify-between rounded-lg border border-[#E5E7EB] bg-white p-4 transition hover:border-[#172554] hover:shadow-sm active:scale-[0.99]">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex size-8 items-center justify-center rounded-md bg-[#F5F3FF] text-[#7C3AED]"><Award size={16} /></span>
                    {s.amount && <span className="rounded bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold text-[#16A34A]">{s.amount}</span>}
                  </div>
                  <p className="line-clamp-2 text-[13.5px] font-bold text-[#172554]">{s.name}</p>
                  {s.provider && <p className="mt-0.5 truncate text-[11.5px] text-[#64748B]">{s.provider}</p>}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]">View details <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Online Video Certification Courses — live data */}
      {(loading || onlineCourses.length > 0) && (
        <section className="border-t border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
            <SectionHead
              eyebrow="Skill Up"
              title="Online Courses & Video Learning"
              sub="Master high-demand tech & business skills with video lectures and certificates"
              to="/online-courses"
              cta="Explore all courses"
            />
            <div className="flex overflow-x-auto gap-3 pb-3 pt-1 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {loading
                ? skeleton(4)
                : onlineCourses.map((c) => (
                  <div
                    key={c._id}
                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#E2E8F0] bg-white transition-all hover:border-[#2563EB] hover:shadow-md w-[210px] sm:w-full shrink-0 snap-start"
                  >
                    {/* Video Thumbnail Header */}
                    <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={c.thumbnailUrl || c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                        alt={c.title}
                        className="size-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-90 transition-opacity group-hover:bg-black/15">
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/90 text-[#2563EB] shadow-xs transition group-hover:scale-110">
                          <PlayCircle size={18} className="fill-[#2563EB]/10" />
                        </span>
                      </div>
                      {c.category && (
                        <span className="absolute top-2 left-2 rounded bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white">
                          {c.category}
                        </span>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="flex flex-1 flex-col p-3">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[#64748B]">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                          <Star size={11} className="fill-amber-400" />
                          {c.rating ? Number(c.rating).toFixed(1) : '4.9'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Clock size={11} />
                          {c.duration ? `${c.duration}h` : '40h'}
                        </span>
                      </div>

                      <h3 className="mt-1.5 line-clamp-2 text-[12.5px] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors leading-snug min-h-[34px]">
                        {c.title}
                      </h3>

                      {c.instructor && (
                        <p className="mt-0.5 text-[10.5px] text-[#64748B] truncate">
                          Instructor: <span className="font-semibold text-[#334155]">{c.instructor}</span>
                        </p>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                        <div>
                          {c.isFree ? (
                            <span className="text-[12.5px] font-extrabold text-[#16A34A]">Free</span>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-[13px] font-extrabold text-[#172554]">
                                ₹{c.discountPrice || c.price || 499}
                              </span>
                              {Boolean(c.price) && Boolean(c.discountPrice) && Number(c.price) > Number(c.discountPrice) ? (
                                <span className="text-[10px] text-[#94A3B8] line-through">₹{c.price}</span>
                              ) : null}
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/online-courses/${c._id}`}
                          className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#172554] px-2.5 text-[10.5px] font-bold text-white transition hover:bg-[#0F172A] active:scale-95 shrink-0"
                        >
                          Watch <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* News — live data */}
      {(loading || news.length > 0) && (
        <section className="border-y border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
            <SectionHead eyebrow="Latest" title="News & Education Updates" sub="Admissions, results and policy changes" to="/education-updates" cta="All updates" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {loading ? skeleton(2) : news.map((n) => (
                <Link key={n._id || n.id} to={`/education-updates/${n._id || n.id}`}
                  className="flex gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 transition hover:border-[#172554] active:scale-[0.99]">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#172554]"><Megaphone size={18} /></span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[13.5px] font-bold text-[#172554]">{n.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[#64748B]">
                      {(n.category || n.type) && <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-medium">{n.category || n.type}</span>}
                      {(n.publishedAt || n.createdAt) && (
                        <span className="inline-flex items-center gap-1"><Calendar size={11} />{fmtDate(n.publishedAt || n.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <SectionHead eyebrow="Why EduPlatform" title="Built for confident decisions" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: 'Verified data', d: 'Colleges, fees and cutoffs managed by our admin team.' },
            { icon: Zap, t: 'Real-time alerts', d: 'Never miss an exam, admission or scholarship deadline.' },
            { icon: BadgeCheck, t: 'Expert guidance', d: 'Book free 1-on-1 counselling with certified mentors.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex gap-3 rounded-lg border border-[#E5E7EB] p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#059669]"><Icon size={19} /></span>
              <div><p className="text-[14px] font-bold text-[#172554]">{t}</p><p className="mt-0.5 text-[12.5px] text-[#64748B]">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-8 sm:pb-12">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        <div className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB] bg-white">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
                  <span className="text-[13.5px] font-semibold text-[#172554]">{f.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[#64748B] transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden px-4 text-[12.5px] leading-relaxed text-[#64748B]"><span className="block pb-4">{f.a}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 sm:pb-10">
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-[#172554] p-4 text-white sm:gap-4 sm:p-8 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-[18px] sm:text-[22px] font-extrabold !text-white" style={{ color: '#ffffff' }}>Not sure where to start?</h3>
            <p className="mt-1 text-[13.5px] sm:text-[14px] font-bold !text-white opacity-95" style={{ color: '#ffffff' }}>Talk to a certified counsellor — it's free.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-2.5">
            <Link to="/counselling" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[13px] font-extrabold text-[#172554] hover:bg-slate-100 active:scale-95 transition shadow-xs sm:w-auto">
              <MessagesSquare size={16} /> Book counselling
            </Link>
            <Link to="/education-loan" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/50 bg-white/10 px-4 py-2.5 text-[13px] font-semibold !text-white hover:bg-white/20 active:scale-95 transition sm:w-auto" style={{ color: '#ffffff' }}>
              <Landmark size={16} /> Education loans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
