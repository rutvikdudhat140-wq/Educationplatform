import MobileHome from "./MobileHome";
import { useEffect, useState } from 'react';
import { createApiUrl } from '@/lib/api';
import {
  Search,
  MapPin,
  BookOpen,
  Star,
  FileText,
  GraduationCap,
  Building2,
  BarChart3,
  Stethoscope,
  Scale,
  Settings2,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  IndianRupee,
  MessagesSquare,
  Award,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Users,
  BadgeCheck,
  Zap
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import UpcomingExamsSection from '../exams/UpcomingExamsSection';
import RecommendedForYouSection from '@/components/Recommendations/RecommendedForYouSection';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/safe-image';

import LocationSelector, { getLocation } from '@/components/common/LocationSelector';
import CollegeMatcherWizard from '@/components/Home/CollegeMatcherWizard';
import HomeExtras from '@/components/Home/HomeExtras';
import HomeHero from '@/components/Home/HomeHero';

export default function Home() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [topColleges, setTopColleges] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [activeSearchTab, setActiveSearchTab] = useState('colleges');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(() => getLocation());
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    const handleLocationChange = (e) => {
      setSelectedLocation(e.detail?.city || '');
    };

    window.addEventListener('user_location_changed', handleLocationChange);
    return () => {
      window.removeEventListener('user_location_changed', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [collegeResponse, topCollegeResponse, courseResponse] =
          await Promise.all([
            fetch(createApiUrl('/college?limit=100')).then(r => r.json()),
            fetch(createApiUrl('/college?isTopCollege=true')).then(r => r.json()),
            fetch(createApiUrl('/course/popular')).then(r => r.json()),
          ]);

        const collegeData =
          collegeResponse.data?.colleges ||
          collegeResponse.data?.data ||
          [];
        const topCollegeData =
          topCollegeResponse.data?.colleges ||
          topCollegeResponse.data?.data ||
          [];
        const courseData =
          courseResponse.data?.data ||
          courseResponse.data?.courses ||
          [];

        const validColleges = Array.isArray(collegeData)
          ? collegeData.filter((college) => college.status !== 'Inactive')
          : [];
        setColleges(validColleges);

        const validTop = Array.isArray(topCollegeData) && topCollegeData.length > 0
          ? topCollegeData.filter((college) => college.status !== 'Inactive')
          : validColleges.slice(0, 8);
        setTopColleges(validTop.length > 0 ? validTop : validColleges.slice(0, 8));
        setPopularCourses(Array.isArray(courseData) ? courseData : []);
      } catch {
        // silent
      }
    };

    loadHomeData();
  }, []);

  const locations = [];
  colleges.forEach((college) => {
    const city = college.location?.city;
    if (city && !locations.includes(city)) {
      locations.push(city);
    }
  });
  locations.sort();

  const matchingColleges = colleges
    .filter((college) => {
      const name = (college.name || college.collegeName || '').toLowerCase();
      const city = college.location?.city;
      return (
        name.includes(searchTerm.toLowerCase()) &&
        (!selectedLocation || city === selectedLocation)
      );
    })
    .slice(0, 8);

  const fieldClass =
    'h-10 w-full appearance-none rounded-[5px] border border-[#E5E7EB] bg-white pl-8 pr-7 text-[0.8125rem] font-medium text-slate-700 outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#2563EB] focus:ring-[2px] focus:ring-[#2563EB]/20';

  const quickNavBlocks = [
    { label: 'Colleges', desc: '500+ Top universities', path: '/colleges/all-colleges', icon: Building2, count: '500+' },
    { label: 'Courses', desc: 'Degrees & specializations', path: '/courses', icon: BookOpen, count: '1,200+' },
    { label: 'Career Guidance', desc: '7-Stage visual roadmaps', path: '/careers', icon: Compass, count: '50+ Paths' },
    { label: 'Scholarships', desc: 'Govt & private funding', path: '/scholarships', icon: Award, count: '₹25Cr+' },
    { label: 'Exams', desc: 'Dates, registration & cutoffs', path: '/exams', icon: GraduationCap, count: '80+ Exams' },
    { label: 'Counselling', desc: '1-on-1 Certified guidance', path: '/counselling', icon: MessagesSquare, count: 'Free' },
  ];

  

  const searchTabs = [
    { id: 'colleges', label: 'Colleges & Universities', icon: Building2, placeholder: 'Search colleges by name, city, NIRF rank, stream...' },
    { id: 'courses', label: 'Degrees & Courses', icon: BookOpen, placeholder: 'Search courses (e.g., B.Tech, MBA, Data Science, MBBS)...' },
    { id: 'exams', label: 'Entrance Exams', icon: GraduationCap, placeholder: 'Search exams (e.g., JEE Main, NEET, CAT, CUET)...' },
    { id: 'scholarships', label: 'Scholarships', icon: Award, placeholder: 'Search merit, need-based, and govt scholarships...' },
  ];

  const handleSearchSubmit = () => {
    if (activeSearchTab === 'courses') {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
      return;
    }
    if (activeSearchTab === 'exams') {
      navigate(`/exams?search=${encodeURIComponent(searchTerm)}`);
      return;
    }
    if (activeSearchTab === 'scholarships') {
      navigate(`/scholarships?search=${encodeURIComponent(searchTerm)}`);
      return;
    }

    if (matchingColleges.length > 0) {
      navigate(`/colleges/${matchingColleges[0]._id}`);
    } else if (searchTerm.trim()) {
      navigate(`/colleges?search=${(searchTerm)}`);
    } else if (selectedLocation) {
      navigate(`/colleges?city=${(selectedLocation)}`);
    } else {
      navigate('/colleges/all-colleges');
    }
  };

  const getPlaceholder = () => {
    const tab = searchTabs.find(t => t.id === activeSearchTab);
    return tab ? tab.placeholder : 'Search colleges, courses, exams, scholarships...';
  };

  return (
    <>
      <div className="min-h-screen bg-white text-[#111827]">
        {/* Mobile View */}
        <MobileHome topColleges={topColleges} popularCourses={popularCourses} />

        {/* Desktop View */}
        <div className="hidden md:block">
          <main>
            <HomeHero />

            {/* 30-SECOND AI COLLEGE MATCHER WIZARD */}
            <section className="edu-container pt-8 pb-2">
              <CollegeMatcherWizard />
            </section>

            {/* TOP COLLEGES SECTION */}
            {topColleges.length > 0 && (
              <section className="edu-container edu-section">
                <div className="edu-section-head">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
                      <BadgeCheck size={14} /> NIRF &amp; NAAC Verified
                    </div>
                    <h2 className="edu-section-title">Top Ranked Colleges &amp; Universities</h2>
                    <p className="edu-section-sub">
                      Institutions evaluated on academic excellence, faculty credentials, and verified placements
                    </p>
                  </div>
                  <Link
                    to="/colleges/all-colleges"
                    className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    View All Colleges &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {topColleges.map((college) => {
                    const collegeId = college._id || college.id;
                    const locationStr = [
                      college.location?.city,
                      college.location?.state,
                    ].filter(Boolean).join(', ');

                    const courseCount =
                      college.courses?.length ||
                      college.highlights?.totalCourses ||
                      '—';

                    const avgPkg =
                      college.placements?.[0]?.averagePackage ||
                      college.highlights?.averagePackage ||
                      college.averagePackage ||
                      '—';

                    const highestPkg =
                      college.placements?.[0]?.highestPackage ||
                      college.highlights?.highestPackage ||
                      college.highestPackage ||
                      '—';

                    const rankOrAccreditation =
                      college.highlights?.nirfRank ? `NIRF #${college.highlights.nirfRank}` :
                      (college.ranking ? `Rank #${college.ranking}` :
                      (college.accreditations?.[0] || college.accreditation || 'Verified'));

                    return (
                      <article
                        key={collegeId}
                        onClick={(e) => {
                          if (!e.target.closest('button') && !e.target.closest('a')) {
                            navigate(`/colleges/${collegeId}`);
                          }
                        }}
                        className="group flex flex-col rounded-md border border-[#E5E7EB] bg-white overflow-hidden transition-all duration-150 hover:border-[#93C5FD] hover:shadow-[0_4px_16px_rgba(37,99,235,0.06)] cursor-pointer"
                      >
                        {/* College Cover Image */}
                        <Link to={`/colleges/${collegeId}`} className="block relative h-38 w-full overflow-hidden bg-[#F8FAFC]">
                          <SafeImage
                            entity={college}
                            alt={college.collegeName || college.name || ''}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                            fallback={
                              <div className="flex h-full w-full items-center justify-center bg-[#F8FAFC] text-slate-300">
                                <Building2 size={32} />
                              </div>
                            }
                            fallbackClassName="h-full w-full"
                          />

                          {/* Gradient overlay on image bottom */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                          {/* Category Tag */}
                          <span className="absolute left-2.5 top-2.5 rounded-[4px] border border-white/40 bg-white/95 px-2 py-0.5 text-[0.625rem] font-bold text-[#172554] shadow-sm">
                            {college.category || college.collegeType || 'Autonomous'}
                          </span>

                          {/* Rating Pill */}
                          {college.rating && (
                            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-[4px] bg-white/95 px-2 py-0.5 text-[0.6875rem] font-bold text-slate-800 shadow-sm">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {Number(college.rating).toFixed(1)}
                            </span>
                          )}

                          {/* NIRF / NAAC Badge */}
                          {rankOrAccreditation && (
                            <span className="absolute right-2.5 bottom-2 rounded-[3px] bg-[#172554]/90 px-1.5 py-0.5 text-[0.625rem] font-bold text-white backdrop-blur-xs">
                              {rankOrAccreditation}
                            </span>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-3.5">
                          <Link to={`/colleges/${collegeId}`}>
                            <h3 className="line-clamp-1 text-[0.90625rem] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors">
                              {college.name || college.collegeName}
                            </h3>
                          </Link>

                          <div className="mt-1 flex items-center gap-1 text-[0.75rem] text-[#64748B]">
                            <MapPin className="size-3 shrink-0 text-slate-400" />
                            <span className="truncate">{locationStr || 'India'}</span>
                          </div>

                          {/* Key Metrics Grid */}
                          <div className="mt-3 grid grid-cols-2 gap-2 rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2 text-[0.6875rem]">
                            <div>
                              <span className="text-[#64748B] block text-[0.625rem] uppercase tracking-wider font-semibold">Avg Package</span>
                              <span className="font-bold text-[#172554] truncate block">{avgPkg}</span>
                            </div>
                            <div className="border-l border-[#E5E7EB] pl-2">
                              <span className="text-[#64748B] block text-[0.625rem] uppercase tracking-wider font-semibold">Highest</span>
                              <span className="font-bold text-[#16A34A] truncate block">{highestPkg}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-[#E5E7EB] pt-3">
                            <Link
                              to={`/apply?collegeId=${collegeId}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center h-8.5 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-[0.75rem] font-semibold shadow-none transition-colors"
                            >
                              Apply Now
                            </Link>
                            <Link
                              to={`/colleges/${collegeId}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center h-8.5 rounded-[4px] border border-[#E5E7EB] bg-white text-[#172554] hover:bg-[#F8FAFC] text-[0.75rem] font-medium shadow-none transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* LIVE COUNSELLOR CONNECT BANNER */}
            <section className="edu-container py-4">
              <div className="rounded-md border border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] via-white to-[#EFF6FF] p-6 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#2563EB] text-white">
                    <MessagesSquare size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-[3px]">
                        <span className="size-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                        Counsellors Available Now
                      </span>
                    </div>
                    <h3 className="mt-1 text-[1.125rem] font-bold text-[#172554]">
                      Need help selecting the best college or course for your rank?
                    </h3>
                    <p className="text-[0.8125rem] text-[#64748B] mt-0.5">
                      Get unbiased guidance on eligibility, cutoffs, fee structures, and scholarship criteria from certified experts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    type="button"
                    onClick={() => navigate('/counselling')}
                    className="bg-[#172554] hover:bg-[#1E3A8A] text-white font-semibold text-[0.8125rem] h-10 px-5 rounded-[4px] shadow-none"
                  >
                    Request Free Counselling &rarr;
                  </Button>
                </div>
              </div>
            </section>

            {/* RECOMMENDED FOR YOU */}
            <RecommendedForYouSection />

            {/* POPULAR COURSES SECTION */}
            {popularCourses.length > 0 && (
              <section className="border-t border-[#E5E7EB] bg-[#F8FAFC] py-14">
                <div className="edu-container">
                  <div className="edu-section-head">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
                        <Sparkles size={14} /> High Growth Careers
                      </div>
                      <h2 className="edu-section-title">In-Demand Courses &amp; Programs</h2>
                      <p className="edu-section-sub">
                        Explore popular undergraduate and postgraduate degrees with high industry placement demand
                      </p>
                    </div>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                    >
                      Browse All Courses &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {popularCourses.slice(0, 6).map((course) => (
                      <article
                        key={course._id}
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="group flex flex-col rounded-md border border-[#E5E7EB] bg-white p-4.5 cursor-pointer hover:border-[#93C5FD] hover:shadow-[0_4px_16px_rgba(37,99,235,0.05)] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[0.6875rem] font-bold text-[#1E40AF]">
                            {course.stream || 'General'}
                          </span>
                          <span className="text-[0.6875rem] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-[3px]">
                            {course.level || 'Undergraduate'}
                          </span>
                        </div>

                        <h3 className="mt-3.5 text-[0.9375rem] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                          {course.name}
                        </h3>

                        <p className="mt-1 text-[0.78125rem] text-[#64748B] line-clamp-1">
                          {course.fullName || course.name}
                        </p>

                        <div className="mt-3.5 flex items-center justify-between rounded border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1.5 text-[0.75rem]">
                          <span className="flex items-center gap-1 text-[#64748B]">
                            <Clock3 size={13} className="text-slate-400" />
                            {course.duration || '3-4 Years'}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[#172554]">
                            <IndianRupee size={13} className="text-slate-400" />
                            {course.fees ? `₹${Number(course.fees).toLocaleString('en-IN')}` : 'Check Eligibility'}
                          </span>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between border-t border-[#E5E7EB] pt-2.5 text-[0.75rem] font-semibold text-[#2563EB]">
                          <span>Curriculum &amp; Career Outcomes</span>
                          <ChevronRight size={14} />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* UPCOMING EXAMS SECTION */}
            <section className="edu-container edu-section">
              <div className="edu-section-head">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-[#F97316] mb-1">
                    <Zap size={14} /> Deadlines &amp; Schedules
                  </div>
                  <h2 className="edu-section-title">National &amp; State Entrance Exams</h2>
                  <p className="edu-section-sub">
                    Track registration deadlines, admit cards, eligibility criteria, and examination schedules
                  </p>
                </div>
                <Link
                  to="/exams"
                  className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  View All Exams &rarr;
                </Link>
              </div>

              <UpcomingExamsSection view="upcoming" compact={true} />
            </section>
          </main>
        </div>

        <HomeExtras />
      </div>
    </>
  );
}
