import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    Compass,
    BookOpen,
    Bell,
    Grid,
    X,
    Building2,
    GraduationCap,
    TrendingUp,
    Award,
    Landmark,
    MessagesSquare,
    FileText,
    Sparkles,
    Scale,
    Trophy,
    ChevronRight,
    User,
    LogOut,
    CheckCircle2,
    Briefcase
} from "lucide-react";

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user = (() => {
        try {
            const u = localStorage.getItem("user");
            return u ? JSON.parse(u) : null;
        } catch {
            return null;
        }
    })();

    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "Colleges", path: "/colleges", icon: Compass },
        { name: "Courses", path: "/courses", icon: BookOpen },
        { name: "Alerts", path: "/education-alerts", icon: Bell, badge: true },
        { name: "Menu", path: "#menu", icon: Grid, isMenuTrigger: true },
    ];

    const hubSections = [
        {
            title: "Colleges & Admissions",
            items: [
                { title: "All Colleges", desc: "500+ Top Institutes", path: "/colleges", icon: Building2, color: "text-[#172554] bg-[#EFF6FF]" },
                { title: "Engineering (B.Tech)", desc: "IITs, NITs & Top Pvt", path: "/colleges/category/Engineering", icon: GraduationCap, color: "text-[#2563EB] bg-[#EFF6FF]" },
                { title: "Management (MBA)", desc: "IIMs & Top B-Schools", path: "/colleges/category/MBA", icon: Briefcase, color: "text-[#059669] bg-[#ECFDF5]" },
                { title: "Medical & MBBS", desc: "NEET AIQ & State Seats", path: "/colleges/category/Medical", icon: Sparkles, color: "text-[#DC2626] bg-[#FEF2F2]" },
                { title: "Compare Colleges", desc: "Side-by-side Matrix", path: "/compare", icon: Scale, color: "text-[#7C3AED] bg-[#F5F3FF]" },
                { title: "My Applications", desc: "Track admission status", path: "/my-applications", icon: FileText, color: "text-[#D97706] bg-[#FFFBEB]" },
            ]
        },
        {
            title: "Exams, Cutoffs & Predictors",
            items: [
                { title: "Entrance Exams", desc: "JEE, NEET, CAT & Dates", path: "/exams", icon: GraduationCap, color: "text-[#EA580C] bg-[#FFF7ED]" },
                { title: "Rank Predictor", desc: "AI Rank & Percentile", path: "/rank-predictor", icon: TrendingUp, color: "text-[#2563EB] bg-[#EFF6FF]" },
                { title: "College Predictor", desc: "Match by score & cutoff", path: "/college-predictor", icon: Sparkles, color: "text-[#0891B2] bg-[#ECFEFF]" },
                { title: "Rankings 2026", desc: "NIRF & India Today", path: "/rankings", icon: Trophy, color: "text-[#D97706] bg-[#FFFBEB]" },
            ]
        },
        {
            title: "Grants, Loans & Guidance",
            items: [
                { title: "Scholarships", desc: "₹25 Cr+ Grant Pool", path: "/scholarships", icon: Award, color: "text-[#7C3AED] bg-[#F5F3FF]" },
                { title: "Education Loans", desc: "Low ROI & EMI Guide", path: "/education-loan", icon: Landmark, color: "text-[#059669] bg-[#ECFDF5]" },
                { title: "1-on-1 Counselling", desc: "Expert Admission Help", path: "/counselling", icon: MessagesSquare, color: "text-[#172554] bg-[#EFF6FF]" },
                { title: "Live Alerts", desc: "Deadlines & Cutoffs", path: "/education-alerts", icon: Bell, color: "text-[#DC2626] bg-[#FEF2F2]" },
            ]
        }
    ];

    const handleNavigate = (path) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    return (
        <>
            {/* Floating / Native Bottom Navigation Bar */}
            <nav
                aria-label="Bottom Navigation"
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
                style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)" }}
            >
                <div className="flex h-13 items-center justify-around px-1 max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isTrigger = item.isMenuTrigger;
                        const isActive = isTrigger
                            ? isMenuOpen
                            : item.path === "/"
                            ? location.pathname === "/" || location.pathname === "/home"
                            : location.pathname.startsWith(item.path);

                        const Icon = item.icon;

                        if (isTrigger) {
                            return (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex flex-col items-center justify-center flex-1 h-full py-1 relative active:scale-95 transition-all"
                                >
                                    {isActive && (
                                        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#172554] rounded-full" />
                                    )}
                                    <div
                                        className={`flex items-center justify-center w-7 h-7 rounded-[4px] transition-colors ${
                                            isActive
                                                ? "bg-[#172554] text-white shadow-xs"
                                                : "text-slate-600 hover:text-[#172554]"
                                        }`}
                                    >
                                        <Icon size={16} strokeWidth={isActive ? 2.4 : 1.9} />
                                    </div>
                                    <span
                                        className={`text-[10px] mt-0.5 leading-none font-medium ${
                                            isActive ? "text-[#172554] font-bold" : "text-slate-500"
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex flex-col items-center justify-center flex-1 h-full py-1 relative active:scale-95 transition-all"
                            >
                                {isActive && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#172554] rounded-full" />
                                )}
                                <div
                                    className={`flex items-center justify-center w-7 h-7 rounded-[4px] transition-colors relative ${
                                        isActive
                                            ? "bg-[#EFF6FF] text-[#172554]"
                                            : "text-slate-600 hover:text-[#172554]"
                                    }`}
                                >
                                    <Icon size={17} strokeWidth={isActive ? 2.4 : 1.9} />
                                    {item.badge && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#F97316] rounded-full ring-2 ring-white" />
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] mt-0.5 leading-none font-medium ${
                                        isActive ? "text-[#172554] font-bold" : "text-slate-500"
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* FULL EXPLORE HUB / MENU BOTTOM SHEET (SCREENSHOT 2) */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
                    {/* Dismiss overlay */}
                    <div className="flex-1" onClick={() => setIsMenuOpen(false)} />

                    {/* Drawer container */}
                    <div className="bg-white rounded-t-[18px] max-h-[88vh] flex flex-col shadow-2xl border-t border-[#E5E7EB] animate-in slide-in-from-bottom duration-250">
                        {/* Pull handle */}
                        <div
                            className="w-full flex justify-center pt-2.5 pb-1 cursor-pointer"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="w-10 h-1 bg-slate-300 rounded-full" />
                        </div>

                        {/* Top Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E7EB]">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-[4px] bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
                                    E
                                </div>
                                <div>
                                    <h3 className="text-[14.5px] font-bold text-[#172554] leading-tight">
                                        Explore All Services
                                    </h3>
                                    <p className="text-[10px] text-[#64748B] leading-none">
                                        Colleges, Exams, Predictors & Grants
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                                aria-label="Close menu"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Categorized Hub Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[62vh]">
                            {hubSections.map((section, sIdx) => (
                                <div key={sIdx}>
                                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2 px-1">
                                        {section.title}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {section.items.map((item, iIdx) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={iIdx}
                                                    type="button"
                                                    onClick={() => handleNavigate(item.path)}
                                                    className="bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#172554] rounded-md p-2.5 flex items-start gap-2.5 text-left active:bg-[#EFF6FF] transition-all"
                                                >
                                                    <div
                                                        className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 ${item.color}`}
                                                    >
                                                        <Icon size={15} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[12px] font-bold text-[#172554] truncate">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[9.5px] text-[#64748B] truncate">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Profile / Quick Action Strip */}
                        <div className="p-3 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => handleNavigate("/profile")}
                                className="flex items-center gap-2 flex-1 bg-white border border-[#CBD5E1] rounded-[5px] px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#172554] text-white flex items-center justify-center text-[10px] font-bold">
                                    {user?.name?.charAt(0) || user?.fullName?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11.5px] font-bold text-[#172554] truncate">
                                        {user?.name || user?.fullName || "My Account"}
                                    </p>
                                    <p className="text-[9px] text-[#64748B] truncate">Manage profile & applications</p>
                                </div>
                                <ChevronRight size={14} className="text-slate-400" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleNavigate("/counselling")}
                                className="bg-[#172554] text-white px-3 py-2 rounded-[5px] text-[11.5px] font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                            >
                                <MessagesSquare size={13} />
                                <span>Get Help</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNav;
