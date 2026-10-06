import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  FileText,
  User,
  Clock,
      CheckCircle,
    GraduationCap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

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

const ScholarshipApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  
  const fetchApplication = async () => {

    const res = await axios.get(
      `/api/admin/scholarship-applications/${id}`
    );

    setApplication(res.data.data);
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    if (!status) return;

const res = await axios.put(
      `/api/admin/scholarship-applications/${id}/status`,
        {
          status,
        }
    );

    if (res.data.success) {
      fetchApplication();
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!application) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-500 mb-3">
          Application not found.
        </p>

        <Button
          size="sm"
          onClick={() => navigate("/admin/scholarship-applications")}
        >
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">
            {application.applicationId}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {application.scholarshipId?.name || "Scholarship"}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Select
            value={application.status}
            onValueChange={(value) => handleUpdateStatus(value)}
          >
            <SelectTrigger className="h-9 w-[210px] text-xs">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Submitted">
                Submitted
              </SelectItem>

              <SelectItem value="Under Review">
                Under Review
              </SelectItem>

              <SelectItem value="Documents Verification">
                Documents Verification
              </SelectItem>

              <SelectItem value="Approved">
                Approved
              </SelectItem>

              <SelectItem value="Rejected">
                Rejected
              </SelectItem>

              <SelectItem value="Disbursed">
                Disbursed
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/admin/scholarship-applications")}
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back
          </Button>
        </div>
      </div>

<Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Current Status
            </p>

            <Badge
              className={`mt-1 ${getStatusColor(application.status)}`}
            >
              {application.status}
            </Badge>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">
              Applied On
            </p>

            <p className="text-sm font-medium">
              {formatDate(application.appliedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

<Card>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User size={16} />
            Personal Information
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.fullName || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.email || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Mobile</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.mobile || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Date of Birth</p>
            <p className="text-sm font-medium">
              {formatDate(application.personalDetails?.dateOfBirth)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.gender || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.address || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">State</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.state || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">City</p>
            <p className="text-sm font-medium">
              {application.personalDetails?.city || "N/A"}
            </p>
          </div>

        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap size={16} />
            Academic Information
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <p className="text-xs text-gray-500">College</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.college || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Course</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.course || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Current Year</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.currentYear || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Admission Year</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.admissionYear || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">10th Percentage</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.tenthPercentage || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">12th Percentage</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.twelfthPercentage || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Current CGPA</p>
            <p className="text-sm font-medium">
              {application.academicDetails?.currentCGPA || "N/A"}
            </p>
          </div>

        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            Eligibility Information
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <p className="text-xs text-gray-500">Category</p>
            <p className="text-sm font-medium">
              {application.eligibilityDetails?.category || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Annual Income</p>
            <p className="text-sm font-medium">
              {application.eligibilityDetails?.annualFamilyIncome || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Domicile State</p>
            <p className="text-sm font-medium">
              {application.eligibilityDetails?.domicileState || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Disability Status</p>
            <p className="text-sm font-medium">
              {application.eligibilityDetails?.disabilityStatus || "N/A"}
            </p>
          </div>

        </CardContent>
      </Card>

      {/* Documents */}
      {application.documents?.length > 0 && (
        <Card>
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText size={16} />
              Documents
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-2">
            {application.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium">
                  {doc.documentType}
                </p>

                {doc.documentUrl && (
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand hover:underline"
                  >
                    View Document
                  </a>
                )}
              </div>
            ))}
            </CardContent>
          </Card>
        )}

{/* Status History */}
      {application.statusHistory?.length > 0 && (
        <Card>
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock size={16} />
              Status History
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-2">
            {application.statusHistory.map((history, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Badge className={getStatusColor(history.status)}>
                  {history.status}
                </Badge>

                  <div>
                    <p className="text-xs text-gray-500">
                      {history.updatedAt
                        ? new Date(history.updatedAt).toLocaleDateString(
                            "en-IN"
                          )
                        : ""}
                    </p>
                  </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

</div>
  );
};

export default ScholarshipApplicationDetail;
