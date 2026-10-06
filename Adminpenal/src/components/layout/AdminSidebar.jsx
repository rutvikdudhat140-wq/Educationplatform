import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(
    location.pathname.startsWith('/admin/exam')
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <aside className="min-h-screen w-64 border-r bg-white p-4">
      <div>
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <p className="mt-1 text-sm text-gray-500">
          Education Platform
        </p>
      </div>

      <nav className="mt-8 space-y-1">
        <Link
          to="/admin/dashboard"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/college/list"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Colleges
        </Link>
        <Link
          to="/admin/college/reviews"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          College Reviews
        </Link>

       
        <Link
          to="/admin/univercity/list"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          University
        </Link>

        <Link
          to="/admin/course/list"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Courses
        </Link>

        <Link
          to="/admin/career/list"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          careers
        </Link>
        <Link to="/admin/prediction-management" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">
          Cutoffs & Predictors
        </Link>

        <Link to="/admin/ranking/list" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">
          Rankings
        </Link>

        <button
          type="button"
          onClick={() => setIsExamMenuOpen((isOpen) => !isOpen)}
          className="flex w-full items-center justify-between rounded-lg px-3 pb-1 pt-4 text-left text-xs font-semibold uppercase text-gray-400"
          aria-expanded={isExamMenuOpen}
        >
          Exam Management
          <ChevronDown className={`size-4 transition-transform ${isExamMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        {isExamMenuOpen && <div className="space-y-1 pl-3">
          {[
            ['Exams', '/admin/exam/list'],
            ['Exam Sessions', '/admin/exam-session/list'],
            ['Exam Dates', '/admin/exam-date/list'],
            ['Eligibility', '/admin/exam-eligibility/list'],
            ['Pattern', '/admin/exam-pattern/list'],
            ['Information & Preparation', '/admin/exam-preparation/list'],
            // ['Syllabus', '/admin/exam-syllabus/list'],
            // ['Sample Papers', '/admin/exam-sample-paper/list'],
            // ['Mock Tests', '/admin/exam-mock-test/list'],
            // ['FAQs', '/admin/exam-faq/list'],
          ].map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="block rounded-lg border-l-2 border-transparent px-3 py-2 text-sm font-medium text-gray-600 "
            >
              {label}
            </Link>
          ))}
        </div>}
      </nav>

      <div className="mt-8">
        <Separator />

        <div className="mt-4">
          <p className="text-xs text-gray-500">Admin Dashboard</p>
          <p className="mt-1 text-sm font-medium">Education Platform</p>
        </div>

        <Button
          variant="destructive"
          className="mt-4 w-full"
          onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
