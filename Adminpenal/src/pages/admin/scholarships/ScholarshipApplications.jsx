import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
  import {
    ArrowLeft,
    FileText,
    User,
    Trash2,
  } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  } from "@/components/ui/dialog";
  
  const statusColors = {
  Submitted: "bg-blue-50 text-blue-700 border-blue-100",
  "Under Review": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Documents Verification":
    "bg-orange-50 text-orange-700 border-orange-100",
  Approved: "bg-green-50 text-brand border-green-100",
  Rejected: "bg-red-50 text-red-700 border-red-100",
  Disbursed: "bg-purple-50 text-purple-700 border-purple-100",
};

const getStatusColor = (status) => {
  return (
    statusColors[status] ||
    "bg-brand-softest text-ink border-line"
  );
};

const ScholarshipApplications = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const scholarshipId = searchParams.get("scholarshipId");

  const [applications, setApplications] = useState([]);
  const [scholarshipInfo, setScholarshipInfo] = useState(null);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchApplications = async () => {

    const res = await axios.get(
      `/api/admin/scholarship-applications${
        scholarshipId ? `?scholarshipId=${scholarshipId}` : ""
      }`
    );

    setApplications(res.data.data || []);
  };

  const fetchScholarshipInfo = async () => {
    if (!scholarshipId) return;

const res = await axios.get(
      `/api/admin/scholarships/${scholarshipId}`
    );

    setScholarshipInfo(res.data.data);
  };

  useEffect(() => {
    fetchApplications();
    fetchScholarshipInfo();
  }, [scholarshipId]);

  const handleUpdateStatus = async (application, status) => {
    if (!application?._id || !status) return;

await axios.put(
      `/api/admin/scholarship-applications/${application._id}/status`,
        {
          status,
        }
    );

      fetchApplications();
  };

  const handleDeleteApplication = async () => {
    if (!deleteConfirm) return;

await axios.delete(
      `/api/admin/scholarship-applications/${deleteConfirm}`
    );

    setDeleteConfirm(null);
    fetchApplications();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">
            {scholarshipInfo
              ? `Applications: ${scholarshipInfo.name}`
              : "Scholarship Applications"}
          </h2>

          {scholarshipInfo && (
            <p className="text-xs text-ink-muted mt-1">
              {scholarshipInfo.provider} • {scholarshipInfo.type}
            </p>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/admin/scholarships")}
          className="h-8 gap-1.5"
        >
          <ArrowLeft size={14} />
          Back to List
        </Button>
      </div>

      <Card className="border-line shadow-sm">
        <CardContent className="p-0">

          <div className="overflow-x-auto">
            <table className="w-full text-xs">

              <thead>
                <tr className="border-b border-line bg-surface text-left">
                  <th className="px-4 py-3 font-medium text-ink-muted">
                    Student
                  </th>

                  <th className="px-4 py-3 font-medium text-ink-muted">
                    Application ID
                  </th>

                  <th className="px-4 py-3 font-medium text-ink-muted">
                    College
                  </th>

                  <th className="px-4 py-3 font-medium text-ink-muted">
                    Amount
                  </th>

                  <th className="px-4 py-3 font-medium text-ink-muted">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium text-ink-muted">
                    Applied
                  </th>

                  <th className="px-4 py-3 font-medium text-ink-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-ink-muted"
                    >
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      className="border-b border-line hover:bg-surface/70"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-full bg-brand-softest flex items-center justify-center shrink-0">
                            <User
                              size={14}
                              className="text-brand"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate">
                              {app.personalDetails?.fullName || "N/A"}
                            </p>

                            <p className="text-[11px] text-ink-muted truncate">
                              {app.personalDetails?.email || "N/A"}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-4 py-3 text-ink-muted">
                        {app.applicationId}
                      </td>

                      <td className="px-4 py-3 text-ink-muted">
                        {app.collegeId?.name || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-ink-muted">
                        {app.scholarshipId?.amount || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <Select
                          value={app.status}
                          onValueChange={(value) =>
                            handleUpdateStatus(app, value)
                          }
                        >
                          <SelectTrigger
                            className={`h-8 w-[165px] text-xs font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            <SelectValue />
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
                      </td>

<td className="px-4 py-3 text-ink-muted">
                        {formatDate(app.appliedAt)}
                      </td>

<td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedApplication(app)
                            }
                            className="h-7 w-7 p-0"
                          >
                            <FileText size={13} />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setDeleteConfirm(app._id)
                            }
                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </Button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </CardContent>
      </Card>

      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle className="text-base">
              Application Details
            </DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-3">

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {selectedApplication.personalDetails?.fullName}
                  </h3>

                  <p className="text-xs text-ink-muted mt-0.5">
                    Application ID:{" "}
                    {selectedApplication.applicationId}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={getStatusColor(
                    selectedApplication.status
                  )}
                >
                  {selectedApplication.status}
                </Badge>
              </div>

              <Card className="border-line shadow-none">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-xs font-semibold">
                    Personal Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-4 grid grid-cols-2 gap-3 text-xs">

                  <div>
                    <p className="text-ink-muted">Email</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.personalDetails?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">Mobile</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.personalDetails?.mobile}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">Date of Birth</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.personalDetails?.dateOfBirth
                        ? formatDate(
                            selectedApplication.personalDetails
                              .dateOfBirth
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">Gender</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.personalDetails?.gender}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">State</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.personalDetails?.state}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">City</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.personalDetails?.city}
                    </p>
                  </div>

                </CardContent>
              </Card>

              <Card className="border-line shadow-none">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-xs font-semibold">
                    Academic Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-4 grid grid-cols-2 gap-3 text-xs">

                  <div>
                    <p className="text-ink-muted">College</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.academicDetails?.college || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">Course</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.academicDetails?.course || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">Current Year</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.academicDetails?.currentYear || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink-muted">Admission Year</p>
                    <p className="text-ink mt-0.5">
                      {selectedApplication.academicDetails?.admissionYear || "—"}
                    </p>
                  </div>

                </CardContent>
              </Card>

              {selectedApplication.documents?.length > 0 && (
                <Card className="border-line shadow-none">
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-xs font-semibold">
                      Documents
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 space-y-2">
                    {selectedApplication.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-md bg-surface"
                      >
                        <span className="text-xs text-ink">
                          {doc.documentType}
                        </span>

                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {selectedApplication.statusHistory?.length > 0 && (
                <Card className="border-line shadow-none">
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-xs font-semibold">
                      Status History
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 space-y-2">

                    {selectedApplication.statusHistory.map(
                      (history, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 pb-2 border-b last:border-0"
                        >
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${getStatusColor(
                              history.status
                            )}`}
                          >
                            {history.status}
                          </Badge>

                              <div>
                                <p className="text-[11px] text-ink-muted">
                                  {history.updatedAt
                                    ? new Date(
                                        history.updatedAt
                                      ).toLocaleDateString("en-IN")
                                    : ""}
                                </p>
                              </div>
                        </div>
                      )
                    )}

                  </CardContent>
                </Card>
              )}

            </div>
          )}

        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">

          <DialogHeader>
            <DialogTitle className="text-base">
              Delete Application?
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-ink-muted">
            Are you sure you want to delete this scholarship application?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 mt-2">

            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteApplication}
            >
              Delete
            </Button>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ScholarshipApplications;
