import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import ConfirmDialog from "@/components/ConfirmDialog";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../components/ui/table";

export default function AdminAdmissionList() {
  const [admissions, setAdmissions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchAdmissions = async () => {
    const { data } = await axios.get(`/api/admin/admissions?status=${filter}`);
    setAdmissions(data.admissions || []);
  };

  useEffect(() => {
    fetchAdmissions();
  }, [filter]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/admissions/${id}`);
    fetchAdmissions();
  };

  const statuses = [
    'All', 'Draft', 'Submitted', 'Under Review', 'Documents Required',
    'Documents Rejected', 'Verified', 'Shortlisted', 'Approved',
    'Rejected', 'Withdrawn', 'Admission Confirmed'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Admissions</h1>
        <select
          className="border rounded-md px-3 py-1.5"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Admissions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App No.</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {admissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      No admissions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  admissions.map((admission) => (
                    <TableRow key={admission._id}>
                      <TableCell className="font-medium">{admission.applicationNumber}</TableCell>
                      <TableCell className="font-medium">{admission.name}</TableCell>
                      <TableCell>{admission.collegeId?.name }</TableCell>
                      <TableCell>{admission.courseId?.name }</TableCell>
                      <TableCell>{admission.admissionYear }</TableCell>

                      <TableCell>
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          admission.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                          admission.status === 'Submitted' ? 'bg-blue-50 text-blue-700' :
                          (admission.status === 'Under Review' || admission.status === 'Documents Required') ? 'bg-amber-50 text-amber-700' :
                          (admission.status === 'Approved' || admission.status === 'Admission Confirmed') ? 'bg-brand-softest text-brand' :
                          (admission.status === 'Rejected' || admission.status === 'Documents Rejected') ? 'bg-red-50 text-red-700' :
                          'bg-surface text-ink'
                        }`}>
                          {admission.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          to={`/admin/admissions/${admission._id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setPendingDelete(admission)}
                          className="ml-3 text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this admission?"
        description={
          pendingDelete
            ? `${pendingDelete.applicationNumber} — ${pendingDelete.name}. This cannot be undone.`
            : ""
        }
        onConfirm={() => handleDelete(pendingDelete._id)}
      />
    </div>
  );
}

