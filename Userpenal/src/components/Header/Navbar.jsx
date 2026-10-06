import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import LocationSelector from "@/components/common/LocationSelector";
import {
    Menu,
    X,
    ChevronDown,
    LogIn,
    UserPlus,
    LogOut,
    LayoutGrid,
    Calculator,
    Building2,
    Globe,
    Landmark,
    Percent,
    Scale,
    ShieldCheck,
    Route,
    Bell,
    Search,
    User,
} from "lucide-react";

const EXAM_OPTIONS = {
    Engineering: [
        "JEE Main",
        "JEE Advanced",
        "BITSAT",
        "GATE",
        "WBJEE",
        "MHT CET",
        "COMEDK",
    ],
    Management: [
        "CAT",
        "XAT",
        "CMAT",
        "MAT",
        "SNAP",
        "NMAT",
    ],
    "Commerce & Banking": [
        "CUET",
        "CA Foundation",
        "CMA",
        "CS",
    ],
    Medical: [
        "NEET UG",
        "NEET PG",
        "AIIMS Nursing",
    ],
    Sciences: [
        "CUET",
        "IIT JAM",
        "NEST",
        "CSIR NET",
    ],
    "Hotel Management": [
        "NCHMCT JEE",
        "IIHM eCHAT",
    ],
    "Information Technology": [
        "NIMCET",
        "CUET",
    ],
    "Arts & Humanities": [
        "CUET",
        "NTA UGC NET",
    ],
    "Mass Communication": [
        "CUET",
        "IIMC Entrance Exam",
    ],
    Agriculture: [
        "ICAR AIEEA",
        "CUET Agriculture",
    ],
    Design: [
        "NID DAT",
        "UCEED",
        "NIFT Entrance Exam",
    ],
    Law: [
        "CLAT",
        "AILET",
        "LSAT India",
    ],
    Pharmacy: [
        "GPAT",
        "MHT CET Pharmacy",
    ],
    Dental: [
        "NEET MDS",
    ],
    "Performing Arts": [
        "CUET",
        "University Entrance Exams",
    ],
    Education: [
        "CUET",
        "UGC NET",
    ],
};

const LOAN_SECTIONS = [
    {
        name: "Step-by-Step Guide",
        description: "How to apply, from documents to disbursement",
        path: "/education-loan/step-by-step-guide",
        icon: Route,
    },
    {
        name: "Loan Eligibility",
        description: "Who qualifies and what documents are needed",
        path: "/education-loan/eligibility-criteria",
        icon: ShieldCheck,
    },
    {
        name: "Best Loan Providers",
        description: "Compare banks, NBFCs and interest rates",
        path: "/education-loan/best-education-loan-providers",
        icon: Building2,
    },
    {
        name: "Public v/s Private",
        description: "Government schemes against private lenders",
        path: "/education-loan/public-vs-private",
        icon: Scale,
    },
    {
        name: "Government Loans",
        description: "Subsidised loans and state education schemes",
        path: "/education-loan/government-loans",
        icon: Landmark,
    },
    {
        name: "Vidya Laxmi Portal",
        description: "Apply on the national student loan portal",
        path: "/education-loan/vidya-laxmi-portal",
        icon: Globe,
    },
    {
        name: "Loan Calculator",
        description: "Estimate EMI and total repayment instantly",
        path: "/education-loan/loan-calculator",
        icon: Calculator,
    },
    {
        name: "Interest Rates",
        description: "Latest rates across lenders and tenures",
        path: "/education-loan/interest-rates",
        icon: Percent,
    },
];

const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSection, setMobileSection] = useState(null);

    const headerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(() =>
        Boolean(localStorage.getItem("userToken"))
    );

    const [unreadAlerts, setUnreadAlerts] = useState(0);

    const navItems = [
        {
            name: "Colleges",
            path: "/colleges/all-colleges",
            matchPrefix: "/colleges",
            panel: "list",
            dropdown: [
                { name: "All Colleges & Universities", path: "/colleges/all-colleges" },
                { name: "Top Engineering Colleges", path: "/colleges/category/Engineering" },
                { name: "Top MBA Colleges", path: "/colleges/category/MBA" },
                { name: "Top Medical Colleges", path: "/colleges/category/Medical" },
                { name: "Top Central & State Universities", path: "/colleges/all-colleges?institutionType=university" },
                { name: "Top Law Colleges", path: "/colleges/category/Law" },
            ],
        },
        {
            name: "Courses",
            path: "/courses",
            matchPrefix: "/courses",
            panel: "list",
            dropdown: [
                { name: "All Courses", path: "/courses" },
                { name: "Career Explorer", path: "/careers" },
            ],
        },
        {
            name: "Online Courses",
            path: "/online-courses",
            matchPrefix: "/online-courses",
            panel: "list",
            dropdown: [
                { name: "All Online Courses", path: "/online-courses" },
                { name: "My Learning", path: "/my-learning" },
                { name: "My Certificates", path: "/my-certificates" },
            ],
        },
        {
            name: "Counselling",
            path: "/counselling",
            matchPrefix: "/counselling",
            panel: "list",
            dropdown: [
                { name: "Start Counselling", path: "/counselling" },
                { name: "My Counselling", path: "/my-counselling" },
            ],
        },
        {
            name: "Exams",
            path: "/exams",
            matchPrefix: "/exams",
            panel: "mega",
        },
        {
            name: "Education Loans",
            path: "/education-loan/step-by-step-guide",
            matchPrefix: "/education-loan",
            panel: "loans",
        },
    ];

    const moreItems = [
        { name: "Education Updates", path: "/education-updates", matchPrefix: "/education-updates" },
        { name: "My Updates", path: "/my-updates" },
        { name: "My Applications", path: "/my-applications" },
        { name: "Scholarships", path: "/scholarships" },
        { name: "My Scholarships", path: "/my-scholarships" },
        { name: "Career Explorer", path: "/careers" },
        { name: "Predictors", path: "/predictors" },
        { name: "Recommendations", path: "/recommendations", matchPrefix: "/recommendations" },
        { name: "Rankings", path: "/rankings", matchPrefix: "/rankings" },
        { name: "Compare", path: "/compare", matchPrefix: "/compare" },
    ];

    useEffect(() => {
        setOpenDropdown(null);
        setMobileSection(null);
        setIsLoggedIn(Boolean(localStorage.getItem("userToken")));
    }, [location.pathname]);

    useEffect(() => {
        if (!isLoggedIn) {
            setUnreadAlerts(0);
            return;
        }

        const fetchUnreadAlerts = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await axios.get(
                    "http://localhost:5001/api/education-alerts/unread-count",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUnreadAlerts(res.data?.data?.count || 0);
            } catch {
                // silent
            }
        };

        fetchUnreadAlerts();
    }, [location.pathname, isLoggedIn]);

    useEffect(() => {
        if (!openDropdown) return;

        const handlePointerDown = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpenDropdown(null);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [openDropdown]);

    const handleLogout = async () => {
        const token = localStorage.getItem("userToken");
        if (token) {
            try {
                await axios.post("http://localhost:5001/api/user/logout", null, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch {
                // proceed
            }
        }

        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header
            ref={headerRef}
            className="hidden md:block sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md"
        >
            <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-5 lg:px-6">
                <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">

                    {/* Brand Logo */}
                    <Link
                        to="/"
                        className="flex shrink-0 items-center gap-2 font-bold text-[#172554] whitespace-nowrap"
                        onClick={() => setOpenDropdown(null)}
                    >
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-black text-white shadow-xs">
                            E
                        </span>
                        <div className="flex flex-col leading-none">
                            <span className="text-[1.0625rem] font-extrabold tracking-tight text-[#172554] whitespace-nowrap">
                                EduPlatform
                            </span>
                            <span className="mt-0.5 hidden text-[0.65rem] font-bold text-[#64748B] xl:block whitespace-nowrap">
                                Discovery &amp; Admissions
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex lg:items-center lg:gap-0.5 shrink-0">
                        {navItems.map((item) => {
                            const active =
                                location.pathname === item.path ||
                                location.pathname.startsWith(`${item.matchPrefix || item.path}/`) ||
                                item.dropdown?.some((sub) => location.pathname === sub.path);

                            return (
                                <div key={item.name} className="relative shrink-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === item.name ? null : item.name
                                            )
                                        }
                                        aria-expanded={openDropdown === item.name}
                                        className={`relative flex h-14 items-center gap-1 px-2.5 xl:px-3 text-[0.8125rem] font-bold transition-colors whitespace-nowrap shrink-0 ${
                                            active || openDropdown === item.name
                                                ? "text-[#2563EB] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-[#2563EB]"
                                                : "text-slate-700 hover:text-[#172554]"
                                        }`}
                                    >
                                        <span className="whitespace-nowrap font-bold">{item.name}</span>
                                        <ChevronDown
                                            size={13}
                                            className={`shrink-0 transition-transform duration-150 ${
                                                openDropdown === item.name ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Exams Mega Menu */}
                                    {openDropdown === item.name && item.panel === "mega" && (
                                        <div className="absolute left-1/2 top-full z-50 w-[min(880px,calc(100vw-40px))] -translate-x-1/2 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl">
                                            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3 bg-[#F8FAFC] rounded-t-2xl">
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-[#172554]">
                                                        Entrance Exams Discovery
                                                    </h3>
                                                    <p className="text-xs text-[#64748B]">
                                                        Explore entrance exams by category, dates and preparation paths
                                                    </p>
                                                </div>
                                                <Link
                                                    to="/exams"
                                                    onClick={() => setOpenDropdown(null)}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1D4ED8] hover:bg-[#2563EB] hover:text-white transition-colors whitespace-nowrap"
                                                >
                                                    View All Exams &rarr;
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-[220px_1fr]">
                                                <div className="border-r border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
                                                    <div className="mb-2 px-2 text-[0.6875rem] font-bold uppercase tracking-wider text-[#64748B]">
                                                        Categories
                                                    </div>
                                                    <div className="max-h-[380px] space-y-0.5 overflow-y-auto pr-1">
                                                        {Object.entries(EXAM_OPTIONS).map(([stream, exams]) => (
                                                            <button
                                                                key={stream}
                                                                type="button"
                                                                onMouseEnter={() => setMobileSection(stream)}
                                                                onClick={() => setMobileSection(stream)}
                                                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[0.8125rem] transition-colors whitespace-nowrap ${
                                                                    (mobileSection || Object.keys(EXAM_OPTIONS)[0]) === stream
                                                                        ? "bg-[#2563EB] text-white font-bold"
                                                                        : "text-slate-700 hover:bg-[#EFF6FF] hover:text-[#172554]"
                                                                }`}
                                                            >
                                                                <span className="truncate font-semibold">{stream}</span>
                                                                <span className={`text-[0.6875rem] font-bold ${
                                                                    (mobileSection || Object.keys(EXAM_OPTIONS)[0]) === stream
                                                                        ? "text-blue-100"
                                                                        : "text-slate-400"
                                                                }`}>
                                                                    {exams.length}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    {(() => {
                                                        const selectedStream = mobileSection || Object.keys(EXAM_OPTIONS)[0];
                                                        const selectedExams = EXAM_OPTIONS[selectedStream] || [];

                                                        return (
                                                            <>
                                                                <div className="mb-3 flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                                                                    <span className="text-[0.8125rem] font-bold text-[#172554]">
                                                                        {selectedStream} Exams ({selectedExams.length})
                                                                    </span>
                                                                    <Link
                                                                        to={`/exams?stream=${encodeURIComponent(selectedStream)}`}
                                                                        onClick={() => setOpenDropdown(null)}
                                                                        className="text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap"
                                                                    >
                                                                        Filter by {selectedStream}
                                                                    </Link>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {selectedExams.map((exam) => (
                                                                        <Link
                                                                            key={exam}
                                                                            to={`/exams/${encodeURIComponent(exam)}`}
                                                                            onClick={() => setOpenDropdown(null)}
                                                                            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
                                                                        >
                                                                            <span className="truncate font-bold">{exam}</span>
                                                                            <span className="text-slate-400">&rarr;</span>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Education Loan Guides Panel */}
                                    {openDropdown === item.name && item.panel === "loans" && (
                                        <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-2xl">
                                            <div className="mb-2 flex items-center justify-between border-b border-[#E5E7EB] pb-2 px-1">
                                                <span className="text-[0.8125rem] font-bold text-[#172554]">
                                                    Education Loan Resources
                                                </span>
                                                <Link
                                                    to={item.path}
                                                    onClick={() => setOpenDropdown(null)}
                                                    className="text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap"
                                                >
                                                    All Guides &rarr;
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 gap-1.5">
                                                {LOAN_SECTIONS.map((sec) => {
                                                    const Icon = sec.icon;
                                                    return (
                                                        <Link
                                                            key={sec.name}
                                                            to={sec.path}
                                                            onClick={() => setOpenDropdown(null)}
                                                            className="flex items-start gap-2 rounded-xl p-2 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E5E7EB] transition-colors"
                                                        >
                                                            <div className="mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                                                                <Icon size={14} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-bold text-[#172554] truncate whitespace-nowrap">
                                                                    {sec.name}
                                                                </div>
                                                                <div className="text-[0.6875rem] text-[#64748B] line-clamp-1">
                                                                    {sec.description}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Standard Dropdown List */}
                                    {openDropdown === item.name && item.panel === "list" && (
                                        <div className="absolute left-0 top-full z-50 min-w-[210px] rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl">
                                            <Link
                                                to={item.path}
                                                onClick={() => setOpenDropdown(null)}
                                                className="block rounded-xl px-3 py-2 text-xs font-extrabold text-[#2563EB] hover:bg-[#EFF6FF] whitespace-nowrap"
                                            >
                                                Browse All {item.name}
                                            </Link>
                                            <div className="my-1 border-t border-[#E5E7EB]" />
                                            {item.dropdown?.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.path}
                                                    onClick={() => setOpenDropdown(null)}
                                                    className="block rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#F8FAFC] hover:text-[#172554] whitespace-nowrap"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* More Menu */}
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setOpenDropdown(openDropdown === "More" ? null : "More")}
                                aria-expanded={openDropdown === "More"}
                                className={`flex h-14 items-center gap-1 px-2.5 xl:px-3 text-[0.8125rem] font-bold transition-colors whitespace-nowrap shrink-0 ${
                                    openDropdown === "More"
                                        ? "text-[#2563EB]"
                                        : "text-slate-700 hover:text-[#172554]"
                                }`}
                            >
                                <span className="whitespace-nowrap font-bold">More</span>
                                <ChevronDown
                                    size={13}
                                    className={`shrink-0 transition-transform duration-150 ${
                                        openDropdown === "More" ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {openDropdown === "More" && (
                                <div className="absolute right-0 top-full z-50 w-52 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl">
                                    {moreItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setOpenDropdown(null)}
                                            className="block rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB] whitespace-nowrap"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right Action Icons & Auth */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Auto-Detect Location Selector */}
                        <LocationSelector />

                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('open_spotlight_search'))}
                            aria-label="Open spotlight search"
                            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-slate-600 hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#172554] transition-colors whitespace-nowrap shrink-0"
                        >
                            <Search size={13} className="text-[#2563EB] shrink-0" />
                            <span className="text-[11px] font-bold hidden xl:inline whitespace-nowrap">Search</span>
                            <kbd className="rounded border border-[#CBD5E1] bg-white px-1 py-0.2 text-[9px] font-bold text-slate-500 shadow-2xs">
                                ⌘K
                            </kbd>
                        </button>

                        <Link
                            to="/education-alerts"
                            className="relative flex size-8.5 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-700 hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                        >
                            <Bell size={15} />
                            {unreadAlerts > 0 && (
                                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#F97316] text-[0.5625rem] font-bold text-white">
                                    {unreadAlerts}
                                </span>
                            )}
                        </Link>

                        <div className="hidden sm:block h-5 w-px bg-[#E5E7EB] mx-0.5 shrink-0" />

                        {isLoggedIn ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Link
                                    to="/profile"
                                    aria-label="View Profile"
                                    title="View Profile"
                                    className="flex size-8.5 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-700 hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                                >
                                    <User size={15} />
                                </Link>
                                
                                {/* Icon-Only Logout Button as requested */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Logout"
                                    aria-label="Logout"
                                    className="flex size-8.5 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={15} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Link
                                    to="/login"
                                    className="inline-flex h-8.5 items-center gap-1 rounded-lg px-3 text-xs font-bold text-slate-700 hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
                                >
                                    <LogIn size={13} />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-[#172554] px-3.5 text-xs font-extrabold text-white hover:bg-[#0F172A] transition-colors whitespace-nowrap"
                                >
                                    <UserPlus size={13} />
                                    <span>Sign Up</span>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Navigation Trigger */}
                        <div className="lg:hidden shrink-0 ml-1">
                            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon-sm" className="rounded-lg">
                                        <Menu size={16} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[85vw] max-w-[20rem] p-0 flex flex-col">
                                    <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3 bg-[#F8FAFC]">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-6 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">E</span>
                                            <span className="text-[0.9375rem] font-bold text-[#172554]">EduPlatform</span>
                                        </div>
                                        <Button variant="ghost" size="icon-xs" onClick={() => setMobileOpen(false)}>
                                            <X size={16} />
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
                                        {navItems.map((item) => {
                                            const expanded = mobileSection === item.name;
                                            return (
                                                <div key={item.name}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMobileSection(expanded ? null : item.name)}
                                                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-800 hover:bg-[#F8FAFC] whitespace-nowrap"
                                                    >
                                                        <span>{item.name}</span>
                                                        <ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
                                                    </button>
                                                    {expanded && (
                                                        <div className="bg-[#F8FAFC] px-4 py-2 space-y-1">
                                                            <Link
                                                                to={item.path}
                                                                onClick={() => setMobileOpen(false)}
                                                                className="block py-1 text-xs font-extrabold text-[#2563EB] whitespace-nowrap"
                                                            >
                                                                All {item.name}
                                                            </Link>
                                                            {item.dropdown?.map((sub) => (
                                                                <Link
                                                                    key={sub.name}
                                                                    to={sub.path}
                                                                    onClick={() => setMobileOpen(false)}
                                                                    className="block py-1 text-xs font-bold text-slate-600 whitespace-nowrap"
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <div className="px-4 py-2.5">
                                            <div className="text-[0.6875rem] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                                                More Tools
                                            </div>
                                            <div className="space-y-1">
                                                {moreItems.map((m) => (
                                                    <Link
                                                        key={m.name}
                                                        to={m.path}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="block py-1 text-xs font-bold text-slate-700 hover:text-[#2563EB] whitespace-nowrap"
                                                    >
                                                        {m.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#E5E7EB] p-4 bg-[#F8FAFC]">
                                        {isLoggedIn ? (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center rounded-xl font-bold text-xs hover:text-red-600 hover:border-red-200"
                                                onClick={() => {
                                                    handleLogout();
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <LogOut size={16} />
                                            </Button>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    to="/login"
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex h-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-700"
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    to="/signup"
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex h-9 items-center justify-center rounded-xl bg-[#172554] text-xs font-extrabold text-white hover:bg-[#0F172A]"
                                                >
                                                    Sign Up
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;
