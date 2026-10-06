import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  GraduationCap,
  Building2,
  FileText,
  ExternalLink,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  Check,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarshipDetail();
    checkIfApplied();
  }, [id]);

  const fetchScholarshipDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/scholarships/${id}`
      );
      setScholarship(response.data.data);
    } catch (err) {
      console.error("Error fetching scholarship details", err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setHasApplied(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5001/api/scholarships/my/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const applications = response.data.data || [];
      const applied = applications.some(
        (app) =>
          String(app.scholarshipId?._id || app.scholarshipId) === String(id)
      );
      setHasApplied(applied);
    } catch {
      setHasApplied(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleApplyNow = () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      scholarship?.applicationDeadline &&
      isDeadlinePassed(scholarship.applicationDeadline)
    ) {
      return;
    }

    if (hasApplied) {
      navigate("/my-scholarships");
      return;
    }

    navigate(`/scholarships/${id}/apply`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent mx-auto" />
          <p className="text-sm text-ink-muted">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) return null;

  const deadlinePassed = scholarship.applicationDeadline
    ? isDeadlinePassed(scholarship.applicationDeadline)
    : false;

  const daysLeft = scholarship.applicationDeadline
    ? getDaysLeft(scholarship.applicationDeadline)
    : 0;

  return (
    <div className="min-h-screen bg-surface text-ink pb-20 md:pb-12">
      {/* Breadcrumb Bar */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-hidden text-xs text-ink-muted">
            <Link to="/" className="shrink-0 hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/scholarships" className="shrink-0 hover:text-ink">Scholarships</Link>
            <span>/</span>
            <span className="truncate font-semibold text-ink">{scholarship.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Scholarship Hero Card */}
        <div className="mb-6 rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="rounded bg-blue-50 text-brand text-xs font-semibold px-2 py-0.5 border border-blue-100">
                  {scholarship.type || 'Scholarship'}
                </Badge>
                {scholarship.status && (
                  <Badge variant="outline" className="rounded text-xs border-line text-ink-muted px-2 py-0.5">
                    {scholarship.status}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-ink max-w-3xl leading-snug">
                {scholarship.name}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <Building2 size={13} className="text-ink-muted" />
                  <span>Provided by <strong className="text-ink font-semibold">{scholarship.provider}</strong></span>
                </div>
                {scholarship.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-ink-muted" />
                    <span>Duration: {scholarship.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount Box */}
            <div className="shrink-0 rounded-md border border-line bg-surface p-4 text-left md:text-right min-w-[180px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
                Financial Grant
              </span>
              <div className="mt-1 flex items-center text-xl font-bold text-brand md:justify-end">
                <IndianRupee size={17} className="mr-0.5" />
                {scholarship.amount || "N/A"}
              </div>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                {scholarship.amountType || "Per Academic Year"}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <div className="rounded-md border border-line bg-white p-5 shadow-none">
              <SectionTitle icon={<FileText size={16} />} title="About This Scholarship" />
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
                {scholarship.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="rounded-md border border-line bg-white p-5 shadow-none">
              <SectionTitle icon={<IndianRupee size={16} />} title="Grant & Coverage Details" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoBox
                  icon={<IndianRupee size={14} />}
                  label="Scholarship Amount"
                  value={scholarship.amount || "Not specified"}
                />
                <InfoBox
                  icon={<Clock size={14} />}
                  label="Grant Tenure"
                  value={scholarship.duration || scholarship.amountType || "Annual Basis"}
                />
              </div>

              {scholarship.renewalAvailable && (
                <div className="mt-3 flex items-center gap-2 rounded bg-blue-50 px-3 py-2 text-xs text-brand border border-blue-100 font-medium">
                  <CheckCircle size={14} />
                  <span>Renewal available based on maintaining academic CGPA/percentage.</span>
                </div>
              )}

              {scholarship.benefitsDescription && (
                <div className="mt-3 rounded bg-surface p-3 border border-line text-xs">
                  <strong className="text-ink block mb-1">Additional Benefits Included:</strong>
                  <p className="text-ink-muted leading-relaxed">{scholarship.benefitsDescription}</p>
                </div>
              )}
            </div>

            {/* Eligibility */}
            <div className="rounded-md border border-line bg-white p-5 shadow-none">
              <SectionTitle icon={<ShieldCheck size={16} />} title="Eligibility Requirements" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {scholarship.eligibility?.minimumMarks && (
                  <EligibilityItem
                    icon={<GraduationCap size={14} />}
                    title="Minimum Academic Marks"
                    value={scholarship.eligibility.minimumMarks}
                  />
                )}
                {scholarship.eligibility?.maximumFamilyIncome && (
                  <EligibilityItem
                    icon={<IndianRupee size={14} />}
                    title="Family Annual Income Limit"
                    value={scholarship.eligibility.maximumFamilyIncome}
                  />
                )}
                {scholarship.eligibility?.gender && scholarship.eligibility.gender !== "All" && (
                  <EligibilityItem
                    icon={<Users size={14} />}
                    title="Eligible Gender"
                    value={scholarship.eligibility.gender}
                  />
                )}
              </div>

              {scholarship.eligibility?.category?.length > 0 && (
                <TagSection title="Eligible Reservation Categories" values={scholarship.eligibility.category} />
              )}
              {scholarship.eligibility?.state?.length > 0 && (
                <TagSection title="Eligible Domicile States" values={scholarship.eligibility.state} />
              )}
              {scholarship.eligibility?.studyLevel?.length > 0 && (
                <TagSection title="Applicable Degree Levels" values={scholarship.eligibility.studyLevel} />
              )}
            </div>

            {/* Documents */}
            {scholarship.requiredDocuments?.length > 0 && (
              <div className="rounded-md border border-line bg-white p-5 shadow-none">
                <SectionTitle icon={<FileText size={16} />} title="Required Documents" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scholarship.requiredDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded border border-line bg-surface px-3 py-2 text-xs text-ink"
                    >
                      <Check size={13} className="shrink-0 text-brand" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Process */}
            {scholarship.applicationProcess && (
              <div className="rounded-md border border-line bg-white p-5 shadow-none">
                <SectionTitle icon={<FileText size={16} />} title="Application Procedure" />
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
                  {scholarship.applicationProcess}
                </p>
                {scholarship.applicationUrl && (
                  <a
                    href={scholarship.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    Official Portal Link <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-md border border-line bg-white p-5 shadow-none lg:sticky lg:top-20">
              <div className="flex items-center gap-2 border-b border-line pb-3 mb-4">
                <CalendarDays size={16} className="text-brand" />
                <h3 className="text-sm font-bold text-ink">Application Timeline</h3>
              </div>

              {/* Status Box */}
              <div className="mb-4">
                {deadlinePassed ? (
                  <div className="rounded bg-red-50 p-3 text-center border border-red-100">
                    <AlertCircle size={20} className="mx-auto mb-1 text-red-600" />
                    <p className="text-xs font-bold text-red-700">Application Closed</p>
                    <p className="text-[11px] text-red-600 mt-0.5">Deadline has passed for this session</p>
                  </div>
                ) : (
                  <div className="rounded bg-blue-50 p-3 text-center border border-blue-100">
                    <CheckCircle size={20} className="mx-auto mb-1 text-brand" />
                    <p className="text-xs font-bold text-brand">Applications Active</p>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      {daysLeft > 0 ? `${daysLeft} days remaining to apply` : "Last day to submit application"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs">
                <DateRow label="Application Start" value={formatDate(scholarship.applicationStartDate)} />
                <DateRow
                  label="Deadline"
                  value={formatDate(scholarship.applicationDeadline)}
                  valueClassName={deadlinePassed ? "text-red-600" : "text-brand font-bold"}
                />
              </div>

              <div className="mt-5 pt-4 border-t border-line">
                <Button
                  className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 shadow-none"
                  onClick={handleApplyNow}
                  disabled={deadlinePassed}
                >
                  {hasApplied
                    ? "View In My Applications"
                    : deadlinePassed
                    ? "Applications Closed"
                    : "Apply For Scholarship"}
                </Button>

                {!localStorage.getItem("userToken") && (
                  <p className="mt-2 text-center text-[10px] text-ink-muted">
                    Sign in required to submit application
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-md border border-line bg-white p-4 shadow-none space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-md border-line text-xs font-semibold h-9 shadow-none"
                onClick={() => navigate("/scholarships")}
              >
                <ArrowLeft size={13} className="mr-2" /> Back to Scholarships
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-md border-line text-xs font-semibold h-9 shadow-none"
                onClick={() => navigate("/my-scholarships")}
              >
                <FileText size={13} className="mr-2" /> My Submitted Applications
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="md:hidden fixed bottom-[49px] left-0 right-0 px-3 py-1.5 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] shadow-md z-30 flex items-center gap-2 h-11">
        <Button
          variant="outline"
          className="flex-1 rounded-[6px] border-[#CBD5E1] text-[11px] font-bold h-8 shadow-none"
          onClick={() => navigate("/my-scholarships")}
        >
          Track Applications
        </Button>
        <Button
          onClick={handleApplyNow}
          disabled={deadlinePassed}
          className="flex-1 rounded-[6px] bg-[#172554] hover:bg-[#0F172A] text-white text-[11px] font-bold h-8 shadow-none"
        >
          {hasApplied ? "View App" : deadlinePassed ? "Closed" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 border-b border-line pb-2.5">
    <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-50 text-brand">
      {icon}
    </span>
    <h2 className="text-sm font-bold text-ink">{title}</h2>
  </div>
);

const InfoBox = ({ icon, label, value }) => (
  <div className="rounded-md border border-line bg-surface p-3 text-xs">
    <div className="flex items-center gap-1.5 text-ink-muted text-[11px]">
      <span className="text-brand">{icon}</span>
      {label}
    </div>
    <p className="mt-1 font-bold text-ink text-sm">{value}</p>
  </div>
);

const EligibilityItem = ({ icon, title, value }) => (
  <div className="rounded-md border border-line bg-surface p-3 text-xs">
    <div className="flex items-center gap-1.5 text-ink-muted text-[11px]">
      <span className="text-brand">{icon}</span>
      {title}
    </div>
    <p className="mt-1 font-bold text-ink">{value}</p>
  </div>
);

const TagSection = ({ title, values }) => (
  <div className="mt-3 pt-3 border-t border-line">
    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">{title}</p>
    <div className="flex flex-wrap gap-1">
      {values.map((val, idx) => (
        <span key={idx} className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-ink">
          {val}
        </span>
      ))}
    </div>
  </div>
);

const DateRow = ({ label, value, valueClassName = "" }) => (
  <div className="flex items-center justify-between gap-3 text-xs border-b border-line/60 pb-1.5">
    <span className="text-ink-muted">{label}</span>
    <span className={`text-right font-semibold text-ink ${valueClassName}`}>{value}</span>
  </div>
);

export default ScholarshipDetail;
