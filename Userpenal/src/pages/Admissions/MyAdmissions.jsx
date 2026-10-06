import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  FileText,
  CheckCircle2,
  XCircle,
  Hourglass,
  ChevronRight,
  Building2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/admissions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdmissions(res.data.admissions || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const TABS = ["All", "Pending", "Approved", "Rejected"];

  const filtered = admissions.filter(app => {
    if (activeTab === "All") return true;
    if (activeTab === "Approved") return ["Approved", "Admission Confirmed", "Confirmed"].includes(app.status);
    if (activeTab === "Rejected") return ["Rejected", "Documents Rejected"].includes(app.status);
    if (activeTab === "Pending") return ["Submitted", "Under Review", "Documents Required", "Draft"].includes(app.status);
    return true;
  });

  const getStatusBadge = (status) => {
    if (["Approved", "Admission Confirmed", "Confirmed"].includes(status)) {
      return <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-semibold">{status}</span>;
    }
    if (["Rejected", "Documents Rejected"].includes(status)) {
      return <span className="rounded bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-xs font-semibold">{status}</span>;
    }
    if (["Under Review", "Documents Required"].includes(status)) {
      return <span className="rounded bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-semibold">{status}</span>;
    }
    return <span className="rounded bg-blue-50 text-brand border border-blue-200 px-2 py-0.5 text-xs font-semibold">{status || 'Submitted'}</span>;
  };

  return (
    <div className="min-h-screen bg-surface pb-16 text-ink">
      {/* Page Header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="font-semibold text-ink">My Applications</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">Admission Applications</h1>
              <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                Track status, required documentation, and admission acceptance notices.
              </p>
            </div>

            <Link to="/colleges">
              <Button className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-4 shadow-none">
                <Plus size={14} className="mr-1.5" /> Apply To Another College
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 mt-5 border-t border-line pt-3 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                  activeTab === tab
                    ? "bg-brand text-white border-brand shadow-none"
                    : "bg-white text-ink border-line hover:border-brand/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-md border border-line bg-white p-5 animate-pulse space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-12 text-center shadow-none max-w-md mx-auto">
            <div className="w-12 h-12 bg-blue-50 text-brand rounded-md flex items-center justify-center mx-auto mb-3">
              <Building2 size={24} />
            </div>
            <h3 className="text-base font-bold text-ink">
              No applications {activeTab !== "All" ? `in "${activeTab}"` : "yet"}
            </h3>
            <p className="text-xs text-ink-muted mt-1 mb-5">
              Explore accredited colleges, review eligibility, and start your admission application.
            </p>
            <Link to="/colleges">
              <Button className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 px-4 shadow-none">
                Browse Colleges
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(app => (
              <Link
                key={app._id}
                to={`/my-applications/${app._id}`}
                className="group rounded-md border border-line bg-white p-5 shadow-none hover:border-brand/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted bg-surface px-2 py-0.5 rounded border border-line">
                      <FileText size={11} />
                      {app.applicationNumber || "APP-PENDING"}
                    </span>
                    {getStatusBadge(app.status)}
                  </div>

                  {/* College & Course */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 text-brand border border-blue-100 flex items-center justify-center shrink-0 font-bold text-sm">
                      <Building2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-ink group-hover:text-brand transition-colors line-clamp-1">
                        {app.collegeId?.name || "College Name Unavailable"}
                      </h3>
                      <p className="text-xs text-brand font-semibold line-clamp-1 mt-0.5">
                        {app.courseId?.name || app.courseId?.fullName || "Course Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Location & Date */}
                  <div className="space-y-1 text-xs text-ink-muted border-t border-line/60 pt-3">
                    {(app.collegeId?.location?.city || app.collegeId?.location?.state) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={12} className="text-ink-muted shrink-0" />
                        <span>{[app.collegeId?.location?.city, app.collegeId?.location?.state].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-ink-muted shrink-0" />
                      <span>Applied: {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Fee or Action */}
                <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                  {app.grossFee > 0 ? (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-muted block">Fee Payable</span>
                      <span className="text-xs font-bold text-brand">₹{app.netPayable?.toLocaleString("en-IN")}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-muted">Application Submitted</span>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand group-hover:translate-x-0.5 transition-transform">
                    View Details <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
