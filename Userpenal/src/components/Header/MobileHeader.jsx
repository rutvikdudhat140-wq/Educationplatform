import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Bell, Heart, Sparkles } from "lucide-react";
import LocationSelector from "@/components/common/LocationSelector";

const pageTitles = {
    "/": { title: null, greeting: true },
    "/colleges": { title: "Colleges & Universities" },
    "/courses": { title: "Courses & Degrees" },
    "/exams": { title: "Entrance Exams" },
    "/scholarships": { title: "Scholarships & Grants" },
    "/predictors": { title: "AI Predictors" },
    "/my-applications": { title: "My Applications" },
    "/profile": { title: "My Profile" },
    "/my-counselling": { title: "Counselling" },
    "/my-learning": { title: "My Learning" },
    "/education-updates": { title: "News & Updates" },
    "/education-alerts": { title: "Education Alerts" },
    "/recommendations": { title: "Recommendations" },
    "/rankings": { title: "College Rankings" },
    "/compare": { title: "Compare Colleges" },
    "/education-loan": { title: "Education Loans" },
    "/login": { title: null, hide: true },
    "/signup": { title: null, hide: true },
};

const MobileHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    // Don't show on auth pages
    if (
        path === "/login" ||
        path === "/signup" ||
        path === "/forgot-password" ||
        path.startsWith("/reset-password")
    ) {
        return null;
    }

    // Find matching page config
    const exact = pageTitles[path];
    const matchedKey = Object.keys(pageTitles).find(
        (key) => key !== "/" && path.startsWith(key)
    );
    const config = exact || (matchedKey ? pageTitles[matchedKey] : null);

    const isHome = path === "/" || path === "/home";
    const isDetailPage = !isHome && path.split("/").at(-1)?.match(/^[a-f0-9]{24}$/i);
    const showBack = !isHome;

    // Determine title
    let title = "";
    if (isHome) {
        title = null;
    } else if (config?.title) {
        title = config.title;
    } else {
        const segment = path.split("/").filter(Boolean)[0];
        if (segment) {
            title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }
    }

    const user = (() => {
        try {
            const u = localStorage.getItem("user");
            return u ? JSON.parse(u) : null;
        } catch {
            return null;
        }
    })();

    const firstName = user?.name?.split(" ")[0] || user?.fullName?.split(" ")[0] || "Student";
    const initial = firstName.charAt(0).toUpperCase();

    return (
        <header className="md:hidden sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB] h-11 flex items-center justify-between px-3 shadow-xs">
            {/* Left Header Section */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {showBack ? (
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="w-7.5 h-7.5 rounded-[6px] bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] shrink-0 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#172554] active:scale-95 transition-all"
                    >
                        <ArrowLeft size={15} />
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/profile")}
                        aria-label="Profile"
                        className="w-7.5 h-7.5 rounded-full bg-[#172554] text-white flex items-center justify-center font-extrabold text-[11px] shrink-0 ring-2 ring-[#EFF6FF] active:scale-95 transition-all"
                    >
                        {initial}
                    </button>
                )}

                {isHome ? (
                    <div className="min-w-0">
                        <div className="text-[13px] font-bold text-[#172554] leading-tight flex items-center gap-1 truncate">
                            <span>Hi, {firstName}</span>
                            <span className="text-[11px]">👋</span>
                        </div>
                        <div className="text-[9.5px] text-[#64748B] leading-none truncate">
                            Find colleges, courses &amp; exams
                        </div>
                    </div>
                ) : (
                    <h1 className="text-[13px] font-bold text-[#172554] truncate leading-tight">{title}</h1>
                )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 shrink-0">
                {isHome && (
                    <LocationSelector triggerClassName="inline-flex items-center gap-1 h-7.5 px-2 rounded-[6px] bg-[#F8FAFC] border border-[#E5E7EB] text-[10.5px] font-semibold text-slate-700 hover:text-[#172554]" />
                )}

                {/* Global Search Button */}
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open_spotlight_search"))}
                    aria-label="Search"
                    className="w-7.5 h-7.5 rounded-[6px] bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] text-slate-700 hover:text-[#172554] hover:bg-[#EFF6FF] active:scale-95 transition-all"
                >
                    <Search size={14} />
                </button>

                {/* Notifications / Alerts Button */}
                <button
                    onClick={() => navigate("/education-alerts")}
                    aria-label="Alerts"
                    className="w-7.5 h-7.5 rounded-[6px] bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] relative text-slate-700 hover:text-[#172554] hover:bg-[#EFF6FF] active:scale-95 transition-all"
                >
                    <Bell size={14} />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F97316] rounded-full ring-1 ring-white" />
                </button>

                {isDetailPage && (
                    <button
                        aria-label="Save"
                        className="w-7.5 h-7.5 rounded-[6px] bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] text-slate-600 hover:text-red-500 active:scale-95 transition-all"
                    >
                        <Heart size={14} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
