import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

const AssignModal = ({ requestId, onClose, onAssigned }) => {
  const [counsellors, setCounsellors] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {

    axios
      .get('/api/admin/counselling/counsellors/active')
      .then((res) => {
        setCounsellors(res.data.counsellors || []);
      });
  }, []);

  const handleAssign = async () => {
    if (!selectedId) return;

await axios.put(
      `/api/admin/counselling/${requestId}/assign`,
      {
        counsellorId: selectedId,
      }
    );

    onAssigned();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Assign Guidance Person
          </h2>

          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink text-xl"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-ink-muted mb-4">
          Only active Guidance Persons are shown.
        </p>

        <Select
          value={selectedId}
          onValueChange={setSelectedId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Guidance Person" />
          </SelectTrigger>

          <SelectContent>
            {counsellors.length === 0 ? (
              <SelectItem value="_none" disabled>
                No active Guidance Persons
              </SelectItem>
            ) : (
              counsellors.map((counsellor) => (
                <SelectItem
                  key={counsellor._id}
                  value={counsellor._id}
                >
                  {counsellor.name} — {counsellor.email}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div className="flex gap-3 mt-5">
          <Button
            disabled={!selectedId}
            onClick={handleAssign}
            className="flex-1 bg-brand hover:bg-brand-dark"
          >
            Assign
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const counsellingStatusColors = {
  Requested: 'bg-blue-50 text-blue-700 border-blue-200',
  Assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'In Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Completed: 'bg-green-50 text-brand border-green-200',
  Closed: 'bg-brand-softest text-ink-muted border-line',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const AdminCounsellingList = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [assigningId, setAssigningId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {

    const res = await axios.get(
      `/api/admin/counselling?status=${filter}`
    );

    setRequests(res.data.requests || []);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(
        `/api/admin/counselling/${deleteConfirm}`
      );
      fetchRequests();
    } catch {
    }
    setDeleteConfirm(null);
  };

  const statuses = [
    'All',
    'Requested',
    'Assigned',
    'In Progress',
    'Completed',
    'Closed',
    'Cancelled',
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Counselling Requests
          </h1>

          <p className="text-sm text-ink-muted mt-1">
            Manage and assign Guidance Persons to student requests
          </p>
        </div>

        <div className="w-52">
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>

            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Guidance Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-ink-muted"
                >
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell className="font-medium text-sm">
                    {req.counsellingNumber}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm font-medium">
                      {req.studentId?.name}
                    </div>

                    <div className="text-xs text-ink-muted">
                      {req.studentId?.email}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    {req.courseId?.name || '-'}
                  </TableCell>

                  <TableCell>
                    {req.counsellorId ? (
                      <div className="flex items-center gap-2">
                        {req.counsellorId.image ? (
                          <img
                            src={req.counsellorId.image}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center text-xs text-brand font-bold">
                            {req.counsellorId.name?.charAt(0)}
                          </div>
                        )}

                        <span className="text-sm">
                          {req.counsellorId.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-muted">
                        Not Assigned
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={counsellingStatusColors[req.status] || 'bg-brand-softest text-ink-muted'}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {new Date(req.createdAt).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-brand border-brand-border hover:bg-brand-softest"
                        onClick={() => setAssigningId(req._id)}
                      >
                        Assign
                      </Button>

                      <Link to={`/admin/counselling/${req._id}`}>
                        <Button
                          size="sm"
                          variant="secondary"
                        >
                          Manage
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteConfirm(req._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {assigningId && (
        <AssignModal
          requestId={assigningId}
          onClose={() => setAssigningId(null)}
          onAssigned={() => {
            setAssigningId(null);
            fetchRequests();
          }}
        />
      )}

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-ink-muted">
            This will permanently delete the counselling request.
          </p>
          <div className="flex justify-end gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCounsellingList;
