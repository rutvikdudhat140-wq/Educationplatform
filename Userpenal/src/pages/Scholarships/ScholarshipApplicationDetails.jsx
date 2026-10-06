import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileText, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-blue-100 text-blue-800";
    case "Under Review":
      return "bg-yellow-100 text-yellow-800";
    case "Documents Verification":
      return "bg-orange-100 text-orange-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Disbursed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const InfoRow = ({ label, children }) => (
  <div className="grid grid-cols-2 gap-1 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-ink">{children || "-"}</span>
  </div>
);

export default function ScholarshipApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchApplication = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/scholarships/applications/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplication(res.data.data || res.data);
      } catch {
        // 404 / 401 -> leaves application null, renders not-found state
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="text-gray-600">Loading application...</span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="mx-auto max-w-2xl px-4">
          <Card className="border border-gray-200 p-8 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-ink">
              Application not found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The application you are looking for does not exist or you do not
              have access to it.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => navigate("/my-scholarships")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Scholarships
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const {
    personalDetails,
    academicDetails,
    eligibilityDetails,
    documents,
    scholarshipId,
    collegeId,
    courseId,
    statusHistory,
    adminRemark,
  } = application;

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="mx-auto max-w-6xl px-4 lg:px-0">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>
          <span>/</span>
          <Link to="/my-scholarships" className="hover:text-brand">
            My Scholarships
          </Link>
          <span>/</span>
          <span className="text-ink">{application.applicationId}</span>
        </nav>

        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {scholarshipId?.name || "Scholarship Application"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Application ID:
              <span className="font-semibold text-ink">
                {" "}
                {application.applicationId}
              </span>
            </p>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status}
          </Badge>
        </header>

        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-ink">
              Application Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                Current Status: {application.status}
              </span>
            </div>
            <div className="space-y-5">
              {(statusHistory || []).map((entry, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        entry.status === "Rejected" ||
                        entry.status === "Documents Rejected"
                          ? "bg-red-400"
                          : "bg-brand"
                      }`}
                    ></div>
                    {idx < (statusHistory || []).length - 1 && (
                      <div className="mt-1 w-[2px] flex-1 bg-gray-200"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{entry.status}</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(entry.updatedAt)}
                    </p>
                    {entry.note && (
                      <p className="mt-1 text-sm text-gray-600">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold text-ink">
                  Scholarship Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Scholarship Name">
                  {scholarshipId?.name}
                </InfoRow>
                <InfoRow label="Provider">{scholarshipId?.provider}</InfoRow>
                <InfoRow label="Type">{scholarshipId?.type}</InfoRow>
                <InfoRow label="Amount">
                  {scholarshipId?.amount ? `₹ ${scholarshipId.amount}` : "-"}
                </InfoRow>
                <InfoRow label="Amount Type">
                  {scholarshipId?.amountType}
                </InfoRow>
                <InfoRow label="Application Deadline">
                  {formatDate(scholarshipId?.applicationDeadline)}
                </InfoRow>
                <InfoRow label="Applied On">
                  {formatDate(application.appliedAt)}
                </InfoRow>
                <InfoRow label="Last Updated">
                  {formatDate(application.updatedAt)}
                </InfoRow>
              </CardContent>
            </Card>

            {collegeId && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[15px] font-semibold text-ink">
                    College &amp; Course
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoRow label="College">{collegeId?.name}</InfoRow>
                  <InfoRow label="Location">
                    {collegeId?.location
                      ? `${collegeId.location.city}${
                          collegeId.location.state
                            ? `, ${collegeId.location.state}`
                            : ""
                        }`
                      : "-"}
                  </InfoRow>
                  <InfoRow label="Course">
                    {courseId?.name || courseId?.fullName}
                  </InfoRow>
                  <InfoRow label="Level">{courseId?.level}</InfoRow>
                </CardContent>
              </Card>
            )}

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold text-ink">
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Full Name">
                  {personalDetails?.fullName}
                </InfoRow>
                <InfoRow label="Email">{personalDetails?.email}</InfoRow>
                <InfoRow label="Mobile">{personalDetails?.mobile}</InfoRow>
                <InfoRow label="Date of Birth">
                  {formatDate(personalDetails?.dateOfBirth)}
                </InfoRow>
                <InfoRow label="Gender">{personalDetails?.gender}</InfoRow>
                <InfoRow label="State">{personalDetails?.state}</InfoRow>
                <InfoRow label="City">{personalDetails?.city}</InfoRow>
                <div className="sm:col-span-2">
                  <InfoRow label="Address">{personalDetails?.address}</InfoRow>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold text-ink">
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="College">
                  {academicDetails?.college}
                </InfoRow>
                <InfoRow label="Course">{academicDetails?.course}</InfoRow>
                <InfoRow label="Current Year">
                  {academicDetails?.currentYear}
                </InfoRow>
                <InfoRow label="Admission Year">
                  {academicDetails?.admissionYear}
                </InfoRow>
                <InfoRow label="10th Percentage">
                  {academicDetails?.tenthPercentage}
                </InfoRow>
                <InfoRow label="12th Percentage">
                  {academicDetails?.twelfthPercentage}
                </InfoRow>
                <InfoRow label="Current CGPA">
                  {academicDetails?.currentCGPA}
                </InfoRow>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold text-ink">
                  Eligibility Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Category">
                  {eligibilityDetails?.category}
                </InfoRow>
                <InfoRow label="Annual Family Income">
                  {eligibilityDetails?.annualFamilyIncome}
                </InfoRow>
                <InfoRow label="Domicile State">
                  {eligibilityDetails?.domicileState}
                </InfoRow>
                <InfoRow label="Disability Status">
                  {eligibilityDetails?.disabilityStatus}
                </InfoRow>
                {eligibilityDetails?.otherDetails && (
                  <div className="sm:col-span-2">
                    <InfoRow label="Other Details">
                      {eligibilityDetails?.otherDetails}
                    </InfoRow>
                  </div>
                )}
              </CardContent>
            </Card>

            {documents?.length > 0 && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[15px] font-semibold text-ink">
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-line p-3"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-ink">
                              {doc.documentType}
                            </p>
                            {doc.documentName && (
                              <p className="text-xs text-gray-600">
                                {doc.documentName}
                              </p>
                            )}
                          </div>
                        </div>
                        {doc.documentUrl && (
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-brand hover:underline"
                          >
                            View
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {adminRemark && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[15px] font-semibold text-ink">
                    Admin Remark
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink">{adminRemark}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <Calendar className="h-4 w-4 text-brand" />
                  Quick Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Status">{application.status}</InfoRow>
                <InfoRow label="Applied On">
                  {formatDate(application.appliedAt)}
                </InfoRow>
                <InfoRow label="Last Updated">
                  {formatDate(application.updatedAt)}
                </InfoRow>
              </CardContent>
            </Card>

            <Button
              asChild
              className="w-full bg-brand hover:bg-brand/90"
            >
              <Link to="/my-scholarships">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Scholarships
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
