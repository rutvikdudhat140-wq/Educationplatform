import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
  GraduationCap,
  Star,
  Building2,
  BookOpen,
  Briefcase,
  BarChart,
  Trophy,
  LogOut,
  CheckSquare,
  Users,
  Wallet,
  MonitorPlay,
  Newspaper,
  Menu,
  HelpCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(location.pathname.startsWith("/admin/exam"));
  const [isScholarshipMenuOpen, setIsScholarshipMenuOpen] = useState(location.pathname.startsWith("/admin/scholarship"));
  const [isOnlineCourseMenuOpen, setIsOnlineCourseMenuOpen] = useState(location.pathname.startsWith("/admin/online-course"));
  const [isEducationUpdateMenuOpen, setIsEducationUpdateMenuOpen] = useState(
    location.pathname.startsWith("/admin/education-updates") || location.pathname.startsWith("/admin/education-alerts")
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  }

  const SectionLabel = ({ children }) => (
    <p className={`px-5 pb-1.5 pt-4 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink-muted/80 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 p-0 m-0 overflow-hidden' : 'opacity-100'}`}>
      {children}
    </p>
  );

  const NavItem = ({ to, icon: Icon, label, exact = false }) => {
    const active = exact ? location.pathname === to : location.pathname.includes(to);

    return (
      <Link
        to={to}
        title={isCollapsed ? label : ""}
        className={`group flex items-center gap-3 border-l-2 py-2.5 px-4 text-[0.8125rem] font-medium transition-all duration-200 ${isCollapsed ? "justify-center px-0" : ""} ${active
          ? "border-l-brand bg-brand/[0.14] text-white"
          : "border-l-transparent text-ink-muted hover:bg-white/[0.06] hover:text-white"
          }`}
      >
        <Icon size={18} className={`shrink-0 transition-colors ${active ? "text-brand-soft" : "text-ink-muted/80 group-hover:text-white"}`} />
        {!isCollapsed && <span className="truncate animate-fade-in">{label}</span>}
      </Link>
    );
  };

  const GroupToggle = ({ label, icon: Icon, open, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      title={isCollapsed ? label : ""}
      className={`flex w-full items-center justify-between border-l-2 border-transparent py-2.5 px-4 text-[0.8125rem] font-medium transition-all duration-200 ${open
        ? "text-white"
        : "text-ink-muted hover:bg-white/[0.06] hover:text-white"
        }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} className={`shrink-0 ${open ? "text-brand-soft" : "text-ink-muted/80"}`} />
        {!isCollapsed && <span className="truncate animate-fade-in">{label}</span>}
      </span>
      {!isCollapsed && <ChevronDown size={14} className={`shrink-0 text-ink-muted/80 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />}
    </button>
  );

  const GroupList = ({ open, items }) => (
    <div className={`overflow-hidden transition-all duration-300 ${open && !isCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="py-1 bg-black/20">
        {items.map(([label, path]) => {
          const active = location.pathname.includes(path);
          return (
            <Link
              key={path}
              to={path}
              className={`block border-l-2 py-2 pl-12 pr-4 text-[0.78125rem] font-medium transition-colors ${active
                ? "border-l-brand bg-brand/[0.14] text-white"
                : "border-l-transparent text-ink-muted hover:bg-white/[0.06] hover:text-white"
                }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`sticky top-0 flex h-screen shrink-0 flex-col bg-ink transition-all duration-300 z-50 ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      <div className={`flex h-16 shrink-0 items-center border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand bg-gradient-to-br from-brand to-brand-darker text-[1rem] font-bold text-white shadow-lg shadow-brand/20">
              E
            </span>
            <h2 className="text-[1.0625rem] font-bold tracking-tight text-white whitespace-nowrap animate-fade-in">EduAdmin</h2>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-white/10 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-3 custom-scrollbar">
        <SectionLabel>Main</SectionLabel>
        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" exact />
        <NavItem to="/admin/admissions" icon={BookOpen} label="Admissions" />
        <NavItem to="/admin/counselling" icon={CheckSquare} label="Counselling" />
        <NavItem to="/admin/counselling/guidance-persons" icon={Users} label="Guidance Persons" />

        <SectionLabel>Apps</SectionLabel>
        <NavItem to="/admin/college/list" icon={Building2} label="Colleges" />
        <NavItem to="/admin/college/reviews" icon={Star} label="College Reviews" />
        <NavItem to="/admin/univercity/list" icon={GraduationCap} label="University" />
        <NavItem to="/admin/course/list" icon={BookOpen} label="Courses" />
        <NavItem to="/admin/career/list" icon={Briefcase} label="Careers" />
        <NavItem to="/admin/prediction-management" icon={BarChart} label="Predictors & Cutoffs" />
        <NavItem to="/admin/ranking/list" icon={Trophy} label="Rankings" />

        <div className="mt-1">
          <GroupToggle label="Exam Management" icon={CheckSquare} open={isExamMenuOpen} onToggle={() => !isCollapsed && setIsExamMenuOpen(!isExamMenuOpen)} />
          <GroupList open={isExamMenuOpen} items={[["Exams", "/admin/exam/list"], ["Exam Sessions", "/admin/exam-session/list"], ["Exam Dates", "/admin/exam-date/list"], ["Eligibility", "/admin/exam-eligibility/list"], ["Pattern", "/admin/exam-pattern/list"], ["Preparation", "/admin/exam-preparation/list"]]} />
        </div>

        <div className="mt-1">
          <GroupToggle label="Online Courses" icon={MonitorPlay} open={isOnlineCourseMenuOpen} onToggle={() => !isCollapsed && setIsOnlineCourseMenuOpen(!isOnlineCourseMenuOpen)} />
          <GroupList open={isOnlineCourseMenuOpen} items={[["All Online Courses", "/admin/online-courses"], ["Enrollments", "/admin/online-course-enrollments"], ["Certificates", "/admin/online-course-certificates"]]} />
        </div>

        <div className="mt-1">
          <GroupToggle label="Scholarships" icon={Wallet} open={isScholarshipMenuOpen} onToggle={() => !isCollapsed && setIsScholarshipMenuOpen(!isScholarshipMenuOpen)} />
          <GroupList open={isScholarshipMenuOpen} items={[["Scholarship List", "/admin/scholarships"], ["Applications", "/admin/scholarship-applications"]]} />
        </div>

        <div className="mt-1">
          <GroupToggle label="Education Updates" icon={Newspaper} open={isEducationUpdateMenuOpen} onToggle={() => !isCollapsed && setIsEducationUpdateMenuOpen(!isEducationUpdateMenuOpen)} />
          <GroupList open={isEducationUpdateMenuOpen} items={[["All Updates", "/admin/education-updates"], ["Alerts", "/admin/education-alerts"]]} />
        </div>

         <div className="mt-1">
          <NavItem to="/admin/education-loans" icon={Wallet} label="Education Loans" />
        </div>

        <div className="mt-1">
          <NavItem to="/admin/qa" icon={HelpCircle} label="Q&amp;A" />
        </div>
      </div>

      <div className="shrink-0 border-t border-white/5 p-4">
        <Button
          variant="ghost"
          className={`w-full bg-white/[0.04] text-ink-muted hover:bg-white/10 hover:text-white transition-colors ${isCollapsed ? 'px-0 justify-center' : 'justify-start'}`}
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={16} className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
