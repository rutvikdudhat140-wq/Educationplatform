import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, Compass, BookOpen, GraduationCap, TrendingUp,
    ChevronRight, Star, MapPin, Building2, Calendar, Award, Heart,
    Lightbulb, Landmark, Trophy, FileText, Megaphone, MessagesSquare,
    ShieldCheck, Users, Sparkles, ChevronLeft, ArrowRight, CheckCircle2
} from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import CollegeMatcherWizard from '@/components/Home/CollegeMatcherWizard';
import ScheduleDeadlines from '@/components/Home/ScheduleDeadlines';
import { createApiUrl } from '@/lib/api';

const heroSlides = [
    {
        id: 1,
        tag: "ADMISSIONS 2026",
        badge: "LIVE NOW",
        title: "Find the right college, course & career.",
        desc: "Explore 500+ verified universities, ₹25Cr+ scholarships & cutoffs.",
        primaryCta: { text: "Explore Colleges", path: "/colleges" },
        secondaryCta: { text: "Free Counselling", path: "/counselling" },
        bg: "bg-[#172554]",
        badgeColor: "bg-[#F97316]",
    },
    {
        id: 2,
        tag: "SCHOLARSHIPS",
        badge: "₹25 CR+ POOL",
        title: "Discover merit & govt scholarships.",
        desc: "150+ active financial aid schemes for 2026 students.",
        primaryCta: { text: "View Scholarships", path: "/scholarships" },
        secondaryCta: { text: "Check Eligibility", path: "/scholarships" },
        bg: "bg-[#0F172A]",
        badgeColor: "bg-[#16A34A]",
    },
    {
        id: 3,
        tag: "SMART PREDICTOR",
        badge: "AI POWERED",
        title: "Predict your college admission chances.",
        desc: "Instant rank & seat analysis for JEE, NEET, CAT & State CETs.",
        primaryCta: { text: "Predict My Rank", path: "/predictors" },
        secondaryCta: { text: "College Predictor", path: "/college-predictor" },
        bg: "bg-[#1E1B4B]",
        badgeColor: "bg-[#2563EB]",
    },
    {
        id: 4,
        tag: "1-ON-1 GUIDANCE",
        badge: "FREE SESSION",
        title: "Expert counselling for admissions & fees.",
        desc: "Get certified guidance on top colleges, cutoffs & seat locking.",
        primaryCta: { text: "Book Guidance", path: "/counselling" },
        secondaryCta: { text: "Career Paths", path: "/careers" },
        bg: "bg-[#172554]",
        badgeColor: "bg-[#F97316]",
    }
];

const MobileHome = ({ topColleges = [], popularCourses = [] }) => {
    const navigate = useNavigate();
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSlide, setActiveSlide] = useState(0);
    const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        fetch(createApiUrl('/exam'))
            .then(res => res.json())
            .then(res => setUpcomingExams((res.data?.exams || res.data?.data || []).slice(0, 4)))
            .catch(() => { });
    }, []);

    // Auto-advance carousel every 4.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                setActiveSlide((prev) => (prev + 1) % heroSlides.length);
            } else {
                setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
            }
        }
    };

    // 8 Quick Actions Grid (Screenshot 1)
    const quickActions = [
        { icon: Building2, label: "Colleges", path: "/colleges", color: "bg-[#EFF6FF] text-[#2563EB]" },
        { icon: BookOpen, label: "Courses", path: "/courses", color: "bg-[#ECFDF5] text-[#059669]" },
        { icon: GraduationCap, label: "Exams", path: "/exams", color: "bg-[#FFF7ED] text-[#EA580C]" },
        { icon: Award, label: "Scholarships", path: "/scholarships", color: "bg-[#F5F3FF] text-[#7C3AED]" },
        { icon: TrendingUp, label: "Predictors", path: "/predictors", color: "bg-[#ECFEFF] text-[#0891B2]" },
        { icon: Landmark, label: "Edu Loans", path: "/education-loan", color: "bg-[#FFF1F2] text-[#E11D48]" },
        { icon: MessagesSquare, label: "Counselling", path: "/counselling", color: "bg-[#EFF6FF] text-[#172554]" },
        { icon: Megaphone, label: "Alerts", path: "/education-alerts", color: "bg-[#FFFBEB] text-[#D97706]" },
    ];

    const categoryChips = [
        { id: 'All', label: 'All Streams' },
        { id: 'Engineering', label: 'Engineering (B.Tech)' },
        { id: 'MBA', label: 'Management (MBA)' },
        { id: 'Medical', label: 'Medical (MBBS)' },
        { id: 'Law', label: 'Law & Justice' },
        { id: 'Design', label: 'Design & Arts' }
    ];

    const filteredColleges = selectedCategoryTab === 'All'
        ? topColleges
        : topColleges.filter(c => {
            const cat = (c.category || c.stream || '').toLowerCase();
            return cat.includes(selectedCategoryTab.toLowerCase());
        });

    const displayColleges = filteredColleges.length > 0 ? filteredColleges : topColleges;

    const trendingTags = [
        { label: "🔥 B.Tech CSE", path: "/colleges/category/Engineering" },
        { label: "💼 MBA", path: "/colleges/category/MBA" },
        { label: "🏥 MBBS", path: "/colleges/category/Medical" },
        { label: "📚 JEE Main 2026", path: "/exams" },
        { label: "🎯 NEET UG", path: "/exams" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const currentSlide = heroSlides[activeSlide];

    return (
        <div className="md:hidden bg-white pb-4">

            {/* Top Search Bar */}
            <div className="px-3 py-2.5 bg-white border-b border-[#E5E7EB] sticky top-11 z-40 shadow-2xs">
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search colleges, courses, exams, cutoffs..."
                        className="w-full h-9.5 bg-[#F8FAFC] border border-[#CBD5E1] text-[13px] leading-normal rounded-lg pl-9 pr-3 outline-none focus:border-[#172554] focus:bg-white text-[#111827] placeholder:text-[#64748B]"
                    />
                </form>
            </div>

            <div className="px-3 space-y-4 pt-3">

                {/* 1. HERO CAROUSEL BANNER */}
                <div 
                    className="relative overflow-hidden rounded-md border border-[#172554] shadow-xs"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div 
                        className={`${currentSlide.bg} p-4 text-white transition-all duration-300 relative min-h-[175px] flex flex-col justify-between`}
                    >
                        <div className="relative z-10">
                            {/* Top Badge */}
                            <div className="inline-flex items-center gap-1.5 rounded-[4px] bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white mb-2">
                                <span className="text-white font-medium">{currentSlide.tag}</span>
                                <span className={`${currentSlide.badgeColor} !text-white px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wide`}>
                                    {currentSlide.badge}
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 
                                className="text-[16px] font-extrabold leading-snug mb-1 !text-white"
                                style={{ color: '#ffffff' }}
                            >
                                {currentSlide.title}
                            </h2>

                            {/* Subtitle */}
                            <p 
                                className="text-[11px] leading-relaxed line-clamp-2 !text-white/90"
                                style={{ color: 'rgba(255, 255, 255, 0.92)' }}
                            >
                                {currentSlide.desc}
                            </p>
                        </div>

                        {/* CTA Buttons & Controls */}
                        <div className="relative z-10 mt-3 flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(currentSlide.primaryCta.path)}
                                    className="bg-white text-[#172554] hover:bg-slate-100 text-[11px] font-bold px-3 py-1.5 rounded-[4px] shadow-xs active:scale-95 transition-all"
                                >
                                    {currentSlide.primaryCta.text}
                                </button>
                                <button
                                    onClick={() => navigate(currentSlide.secondaryCta.path)}
                                    className="bg-white/15 hover:bg-white/20 !text-white text-[11px] font-medium px-2.5 py-1.5 rounded-[4px] border border-white/25 active:scale-95 transition-all"
                                    style={{ color: '#ffffff' }}
                                >
                                    {currentSlide.secondaryCta.text}
                                </button>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    aria-label="Previous Slide"
                                    onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                                    className="size-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs"
                                >
                                    <ChevronLeft size={13} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next Slide"
                                    onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
                                    className="size-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs"
                                >
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={idx}
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => setActiveSlide(idx)}
                                className={`h-1.5 rounded-full transition-all ${
                                    activeSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. WEEKLY EXAM & ADMISSION SCHEDULE STRIP (SCREENSHOT 1) */}
                <ScheduleDeadlines variant="mobile" />

                {/* 3. 8-ICON QUICK ACTIONS GRID (SCREENSHOT 1) */}
                <div>
                    <div className="grid grid-cols-4 gap-2">
                        {quickActions.map((action, idx) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className="bg-white border border-[#E5E7EB] hover:border-[#172554] rounded-md p-2 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all"
                                >
                                    <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${action.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10.5px] font-bold text-[#172554] truncate w-full">
                                        {action.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. 30-SECOND AI COLLEGE MATCHER WIZARD */}
                <CollegeMatcherWizard />

                {/* 5. POPULAR DISCIPLINES & CATEGORY FILTER CHIPS (SCREENSHOT 4) */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-[13px] font-bold text-[#172554]">Top Rated Colleges</h3>
                            <p className="text-[10px] text-[#64748B]">Verified NIRF &amp; State University rankings</p>
                        </div>
                        <button
                            onClick={() => navigate('/colleges')}
                            className="text-[11px] font-semibold text-[#172554] flex items-center gap-0.5"
                        >
                            View All <ChevronRight size={12} />
                        </button>
                    </div>

                    {/* Horizontal Stream Chips */}
                    <div className="flex overflow-x-auto gap-1.5 pb-2 no-scrollbar">
                        {categoryChips.map((chip) => (
                            <button
                                key={chip.id}
                                onClick={() => setSelectedCategoryTab(chip.id)}
                                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                    selectedCategoryTab === chip.id
                                        ? 'bg-[#172554] text-white shadow-xs'
                                        : 'bg-[#F8FAFC] border border-[#E5E7EB] text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>

                    {/* App-Style College Cards */}
                    <div className="space-y-2.5">
                        {displayColleges.slice(0, 6).map((college, idx) => {
                            const collegeId = college._id || college.id;
                            const ratingNum = Number(college.rating || 4.5).toFixed(1);
                            const avgPkg = college.placements?.[0]?.averagePackage;

                            return (
                                <div
                                    key={collegeId || idx}
                                    className="w-full bg-white rounded-lg p-3 border border-[#E2E8F0] shadow-2xs text-left"
                                >
                                    <div className="flex gap-3 items-center">
                                        {/* Left Square Image Box (100% Full Cover Fill - Zero Whitespace) */}
                                        <div className="relative shrink-0 w-16 h-16 rounded-[8px] overflow-hidden bg-slate-100 border border-[#E2E8F0]">
                                            <SafeImage
                                                entity={college}
                                                alt={college.name || college.collegeName}
                                                className="w-full h-full object-cover block"
                                                fallbackClassName="w-full h-full flex items-center justify-center bg-slate-100"
                                                fallback={
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                        <Building2 className="w-6 h-6" />
                                                    </div>
                                                }
                                            />
                                            <div className="absolute top-0.5 left-0.5 bg-[#172554] text-white text-[8px] font-extrabold px-1 py-0.2 rounded-[3px] shadow-xs z-10">
                                                #{idx + 1}
                                            </div>
                                        </div>

                                        {/* College Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-bold text-[#172554] line-clamp-1 leading-snug">
                                                {college.name || college.collegeName}
                                            </h4>
                                            
                                            <div className="flex items-center gap-1 mt-0.5 text-[10.5px] text-[#64748B]">
                                                <MapPin size={11} className="shrink-0 text-slate-400" />
                                                <span className="truncate">
                                                    {[college.location?.city, college.location?.state].filter(Boolean).join(', ') || 'India'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="inline-flex items-center gap-0.5 text-amber-500 bg-amber-50 px-1.5 py-0.2 rounded-[3px] border border-amber-200">
                                                    <Star size={10} className="fill-amber-400" />
                                                    <span className="text-[10px] font-bold text-[#172554]">{ratingNum}</span>
                                                </div>

                                                {avgPkg ? (
                                                    <span className="text-[10px] text-[#16A34A] font-bold bg-[#ECFDF5] px-1.5 py-0.2 rounded-[3px] border border-[#A7F3D0]">
                                                        Avg {avgPkg}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-[3px]">
                                                        {college.type || "UGC Approved"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-[#E5E7EB]">
                                        <Link
                                            to={`/colleges/${collegeId}`}
                                            className="flex-1 text-center py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#172554] font-bold text-[11px] rounded-[6px] border border-[#CBD5E1] active:scale-95 transition-all"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            to={`/apply?collegeId=${collegeId}`}
                                            className="flex-1 text-center py-1.5 bg-[#172554] hover:bg-[#0F172A] text-white font-bold text-[11px] rounded-[6px] shadow-2xs active:scale-95 transition-all"
                                        >
                                            Apply Now
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 6. LIVE COUNSELLOR ASSISTANCE MINI-BANNER */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-md p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-[4px] bg-[#172554] text-white flex items-center justify-center shrink-0">
                            <MessagesSquare size={16} />
                        </div>
                        <div>
                            <p className="text-[11.5px] font-bold text-[#172554]">Need Expert Admission Guidance?</p>
                            <p className="text-[10px] text-[#64748B]">Speak with verified mentors for free</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/counselling')}
                        className="bg-[#172554] text-white px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold shrink-0 active:scale-95 transition-all"
                    >
                        Connect &rarr;
                    </button>
                </div>

                {/* 7. UPCOMING ENTRANCE EXAMS */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h3 className="text-[13px] font-bold text-[#172554]">Upcoming Entrance Exams</h3>
                            <p className="text-[10px] text-[#64748B]">Registration dates &amp; syllabus</p>
                        </div>
                        <button
                            onClick={() => navigate('/exams')}
                            className="text-[11px] font-semibold text-[#172554] flex items-center gap-0.5"
                        >
                            All Exams <ChevronRight size={12} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {upcomingExams.map((exam, idx) => {
                            const examDate = exam.dates?.[0];
                            const dateStr = examDate?.examStartDate
                                ? new Date(examDate.examStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                : 'Date TBA';
                            return (
                                <div
                                    key={exam._id || idx}
                                    onClick={() => navigate(`/exams/${exam._id}`)}
                                    className="w-full bg-white rounded-md p-2.5 flex items-center justify-between border border-[#E5E7EB] text-left cursor-pointer active:border-[#93C5FD]"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 bg-[#EFF6FF] rounded-[4px] flex items-center justify-center shrink-0 text-[#172554]">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[12.5px] font-bold text-[#172554] truncate">{exam.name}</h4>
                                            <div className="flex items-center gap-1 text-[10.5px] text-[#64748B]">
                                                <Calendar size={10} className="text-[#172554]" />
                                                <span>{dateStr}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold border border-[#BFDBFE] bg-[#EFF6FF] text-[#172554] px-1.5 py-0.5 rounded-[3px] shrink-0">
                                        Upcoming
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 8. EXPLORE MORE TOOLS GRID */}
                <div className="pt-1 pb-4">
                    <h3 className="text-[13px] font-bold text-[#172554] mb-2">Education Tools</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => navigate('/education-updates')}
                            className="bg-white p-2.5 rounded-md border border-[#E5E7EB] flex items-center gap-2 text-left active:bg-[#F8FAFC]"
                        >
                            <div className="w-7 h-7 bg-[#EFF6FF] text-[#172554] rounded-[4px] flex items-center justify-center shrink-0">
                                <Megaphone size={14} />
                            </div>
                            <span className="text-[11.5px] font-bold text-[#172554]">News &amp; Alerts</span>
                        </button>
                        <button
                            onClick={() => navigate('/rankings')}
                            className="bg-white p-2.5 rounded-md border border-[#E5E7EB] flex items-center gap-2 text-left active:bg-[#F8FAFC]"
                        >
                            <div className="w-7 h-7 bg-[#EFF6FF] text-[#172554] rounded-[4px] flex items-center justify-center shrink-0">
                                <Trophy size={14} />
                            </div>
                            <span className="text-[11.5px] font-bold text-[#172554]">Rankings</span>
                        </button>
                        <button
                            onClick={() => navigate('/education-loan')}
                            className="bg-white p-2.5 rounded-md border border-[#E5E7EB] flex items-center gap-2 text-left col-span-2 active:bg-[#F8FAFC]"
                        >
                            <div className="w-7 h-7 bg-[#EFF6FF] text-[#172554] rounded-[4px] flex items-center justify-center shrink-0">
                                <Landmark size={14} />
                            </div>
                            <span className="text-[11.5px] font-bold text-[#172554]">Education Loans &amp; EMI Guide</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MobileHome;
