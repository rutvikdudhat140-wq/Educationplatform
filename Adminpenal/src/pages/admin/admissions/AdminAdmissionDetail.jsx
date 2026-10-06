import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminAdmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admission, setAdmission] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchAdmission = async () => {
    const { data } = await axios.get(`/api/admin/admissions/${id}`);
    setAdmission(data.admission);
    setStatus(data.admission.status);
    setAdminNotes(data.admission.adminNotes || "");
  };

  useEffect(() => {
    fetchAdmission();
  }, [id]);

  const handleUpdateStatus = () => {
    axios.put(`/api/admin/admissions/${id}/status`,
      { status, note, adminNotes }).then(() => { fetchAdmission(); setNote(""); })

  };

  const handleVerifyDocument = (docId, docStatus, docRemark) => {
    axios.put(`/api/admin/admissions/${id}/documents/verify`,
      { docId, status: docStatus, remark: docRemark }).then(() => { fetchAdmission(); })

  };

  const handleDelete = async () => {
    await axios.delete(`/api/admin/admissions/${id}`);
    navigate("/admin/admissions");
  };

  if (!admission) return null;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admission Details</h1>
          <p className="text-gray-500 text-sm mt-1">Application No: <span className="font-semibold text-gray-700">{admission.applicationNumber}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/admissions")}>Back</Button>
          <Button variant="outline" className="text-red-600 hover:text-red-900 border-red-200 hover:bg-red-50" onClick={() => setConfirmDelete(true)}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">

          <Card>
            <CardHeader><CardTitle>Student & Academic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block">Name</span><p className="font-medium">{admission.name}</p></div>
              <div><span className="text-gray-500 block">Email</span><p className="font-medium">{admission.email}</p></div>
              <div><span className="text-gray-500 block">Phone</span><p className="font-medium">{admission.phone}</p></div>
              <div><span className="text-gray-500 block">DOB</span><p className="font-medium">{admission.dob ? new Date(admission.dob).toLocaleDateString() : '-'}</p></div>
              <div><span className="text-gray-500 block">10th %</span><p className="font-medium">{admission.tenthPercentage || '-'}</p></div>
              <div><span className="text-gray-500 block">12th %</span><p className="font-medium">{admission.twelfthPercentage || '-'}</p></div>
              <div><span className="text-gray-500 block">Qualification</span><p className="font-medium">{admission.qualification || '-'}</p></div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader><CardTitle>Documents Verification</CardTitle></CardHeader>
            <CardContent>
              {admission.documents && admission.documents.length > 0 ? (
                <div className="space-y-4">
                  {admission.documents.map((doc) => (
                    <div key={doc._id} className="border p-4 rounded flex justify-between items-start bg-surface">
                      <div>
                        <p className="font-semibold">{doc.name} <span className="text-xs font-normal bg-gray-200 px-2 py-1 rounded ml-2">{doc.status}</span></p>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Document</a>
                        {doc.remark && <p className="text-sm text-red-500 mt-1">Remark: {doc.remark}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-green-50 text-brand" onClick={() => handleVerifyDocument(doc._id, 'Verified', '')}>Approve</Button>
                        <Button size="sm" variant="outline" className="bg-red-50 text-red-700" onClick={() => {
                          const rem = prompt("Reason for rejection:");
                          if (rem !== null) handleVerifyDocument(doc._id, 'Rejected', rem);
                        }}>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">No documents uploaded.</p>}
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader><CardTitle>Update Admission Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                      {['Draft', 'Submitted', 'Under Review', 'Documents Required', 'Documents Rejected', 'Verified', 'Shortlisted', 'Approved', 'Rejected', 'Withdrawn', 'Admission Confirmed'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status Note (visible to student)</Label>
                  <Input className="mt-1" placeholder="Why did the status change?" value={note} onChange={e => setNote(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Admin Notes (internal)</Label>
                <Textarea className="mt-1" placeholder="Internal remarks" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
              </div>
              <div className="flex justify-end"><Button onClick={handleUpdateStatus}>Save Status Update</Button></div>
            </CardContent>
          </Card>

        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle>Target Program</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-gray-500">College:</span> {admission.collegeId?.name}</p>
              <p><span className="text-gray-500">Course:</span> {admission.courseId?.name}</p>
              <p><span className="text-gray-500">Year:</span> {admission.admissionYear}</p>
            </CardContent>
          </Card>

          {admission.scholarshipId && (
            <Card className="border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-100"><CardTitle className="text-green-800 text-sm">Scholarship Applied</CardTitle></CardHeader>
              <CardContent className="pt-3 text-sm space-y-1">
                <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{admission.scholarshipId?.name}</span></p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admission.statusHistory?.map((hist, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-semibold">{hist.status}</p>
                    <p className="text-xs text-gray-500">{new Date(hist.changedAt).toLocaleString()}</p>
                    {hist.note && <p className="text-gray-700 mt-1 italic">"{hist.note}"</p>}
                    <hr className="my-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <ConfirmDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title="Delete this admission?"
          description={`${admission.applicationNumber} — ${admission.name}. This cannot be undone.`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
