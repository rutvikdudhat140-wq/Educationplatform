import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, Calendar, FileText, Building2, GraduationCap, ArrowLeft, Plus } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getStatusBadge = (status) => {
  switch (status) {
    case 'Submitted':
      return <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">Submitted</span>;
    case 'Under Review':
      return <span className="rounded bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-semibold">Under Review</span>;
    case 'Documents Verification':
      return <span className="rounded bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 text-xs font-semibold">Docs Verification</span>;
    case 'Approved':
      return <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-semibold">Approved</span>;
    case 'Rejected':
      return <span className="rounded bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-xs font-semibold">Rejected</span>;
    case 'Disbursed':
      return <span className="rounded bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-semibold">Disbursed</span>;
    default:
      return <span className="rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-xs font-semibold">{status || 'In Progress'}</span>;
  }
};

const ApplicationCard = ({ application }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="rounded-md border border-line bg-white shadow-none hover:border-brand/40 transition-colors">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-ink">
                App ID: {application.applicationId || application._id?.slice(-8).toUpperCase()}
              </span>
              {getStatusBadge(application.status)}
            </div>

            <h3 className="text-base font-bold text-ink truncate">
              {application.scholarshipId?.name}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted mt-1.5">
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-ink-muted" />
                {application.scholarshipId?.provider}
              </span>
              <span className="rounded bg-blue-50 text-brand px-1.5 py-0.5 text-[10px] font-semibold border border-blue-100">
                {application.scholarshipId?.type || 'Scholarship'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-ink-muted" />
                Applied: {formatDate(application.appliedAt)}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">Grant Amount</span>
            <span className="text-base font-bold text-brand">
              {application.scholarshipId?.amount || 'As Applicable'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 p-3 rounded bg-surface border border-line text-xs">
          {application.collegeId && (
            <div className="flex items-start gap-2 min-w-0">
              <Building2 size={14} className="text-brand shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{application.collegeId.name}</p>
                <p className="text-ink-muted text-[11px] truncate">
                  {application.collegeId.location?.city}, {application.collegeId.location?.state}
                </p>
              </div>
            </div>
          )}

          {application.courseId && (
            <div className="flex items-start gap-2 min-w-0">
              <GraduationCap size={14} className="text-brand shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{application.courseId.name}</p>
                <p className="text-ink-muted text-[11px]">{application.courseId.level || 'Degree'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line text-xs">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <span>Last Updated:</span>
            <span className="font-medium text-ink">{formatDate(application.updatedAt)}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/scholarships/applications/${application._id}`)}
            className="rounded-md border-line text-xs font-semibold h-8 shadow-none self-end sm:self-auto"
          >
            <Eye size={13} className="mr-1.5" /> View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MyScholarships = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const token = localStorage.getItem('userToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/scholarships/my/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.data || []);
    } catch (err) {
      console.error('Error fetching scholarship applications', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = (status) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
  };

  const getTabCounts = () => {
    return {
      all: applications.length,
      submitted: applications.filter(app => app.status === 'Submitted').length,
      review: applications.filter(app =>
        app.status === 'Under Review' || app.status === 'Documents Verification'
      ).length,
      approved: applications.filter(app => app.status === 'Approved').length,
      disbursed: applications.filter(app => app.status === 'Disbursed').length,
      rejected: applications.filter(app => app.status === 'Rejected').length,
    };
  };

  const counts = getTabCounts();

  return (
    <div className="min-h-screen bg-surface pb-16 text-ink">
      {/* Header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/scholarships" className="hover:text-ink">Scholarships</Link>
            <span>/</span>
            <span className="font-semibold text-ink">My Applications</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">My Scholarship Applications</h1>
              <p className="text-xs sm:text-sm text-ink-muted mt-1">
                Track verification, status updates, and scholarship disbursement.
              </p>
            </div>

            <Link to="/scholarships">
              <Button className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-4 shadow-none">
                <Plus size={14} className="mr-1.5" /> Explore Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="rounded-md border border-line bg-white p-1 h-auto flex flex-nowrap min-w-max">
              <TabsTrigger value="all" className="rounded text-xs font-semibold py-1.5 px-3">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="Submitted" className="rounded text-xs font-semibold py-1.5 px-3">
                Submitted ({counts.submitted})
              </TabsTrigger>
              <TabsTrigger value="Under Review" className="rounded text-xs font-semibold py-1.5 px-3">
                Under Review ({counts.review})
              </TabsTrigger>
              <TabsTrigger value="Approved" className="rounded text-xs font-semibold py-1.5 px-3">
                Approved ({counts.approved})
              </TabsTrigger>
              <TabsTrigger value="Disbursed" className="rounded text-xs font-semibold py-1.5 px-3">
                Disbursed ({counts.disbursed})
              </TabsTrigger>
              <TabsTrigger value="Rejected" className="rounded text-xs font-semibold py-1.5 px-3">
                Rejected ({counts.rejected})
              </TabsTrigger>
            </TabsList>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-md border border-line bg-white p-5 animate-pulse space-y-3">
                  <div className="h-5 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {['all', 'Submitted', 'Under Review', 'Approved', 'Disbursed', 'Rejected'].map((tabVal) => {
                const filtered = filterApplications(tabVal);
                return (
                  <TabsContent key={tabVal} value={tabVal} className="space-y-4 mt-0">
                    {filtered.length === 0 ? (
                      <div className="rounded-md border border-line bg-white p-12 text-center shadow-none max-w-md mx-auto">
                        <FileText size={32} className="mx-auto text-ink-muted mb-2" />
                        <h3 className="text-base font-bold text-ink">No Applications</h3>
                        <p className="text-xs text-ink-muted mt-1">
                          No scholarship applications found under this status.
                        </p>
                      </div>
                    ) : (
                      filtered.map((app) => (
                        <ApplicationCard key={app._id} application={app} />
                      ))
                    )}
                  </TabsContent>
                );
              })}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MyScholarships;
