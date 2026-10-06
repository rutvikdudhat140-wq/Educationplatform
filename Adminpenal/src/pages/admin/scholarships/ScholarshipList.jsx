import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
} from "lucide-react";

import {
  AdminCard,
  PageHeader,
  StatusBadge,
  EmptyRow,
} from "@/components/layout/AdminUI";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ScholarshipList = () => {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchScholarships = async () => {

    const res = await axios.get(
      "/api/admin/scholarships"
    );

    setScholarships(res.data.data || []);
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

await axios.delete(
      `/api/admin/scholarships/${deleteConfirm}`
    );

    setDeleteConfirm(null);
    fetchScholarships();
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
      <PageHeader
        title="Scholarship Management"
        children={
          <Button
            size="sm"
            onClick={() => navigate("/admin/scholarships/add")}
            className="h-9 bg-brand hover:bg-brand-dark flex items-center gap-2"
          >
            <Plus size={15} />
            Add Scholarship
          </Button>
        }
      />

<AdminCard>

        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>
                SCHOLARSHIP NAME
              </TableHead>

              <TableHead>
                PROVIDER
              </TableHead>

              <TableHead>
                TYPE
              </TableHead>

               <TableHead>
                 AMOUNT
               </TableHead>

               <TableHead>
                 COLLEGE
               </TableHead>

               <TableHead>
                 STATUS
               </TableHead>

              <TableHead>
                DEADLINE
              </TableHead>

              <TableHead className="text-right pr-6">
                ACTIONS
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {scholarships.length === 0 ? (
              <EmptyRow
                colSpan={8}
                message="No scholarships found."
              />
            ) : (
              scholarships.map((scholarship) => (
                <TableRow key={scholarship._id}>

                  {/* Name */}
                  <TableCell>
                    <span className="text-sm font-medium text-ink">
                      {scholarship.name}
                    </span>
                  </TableCell>

                  {/* Provider */}
                  <TableCell className="text-sm text-ink-muted">
                    {scholarship.provider || "—"}
                  </TableCell>

                  {/* Type */}
                  <TableCell className="text-sm text-ink-muted">
                    {scholarship.type || "—"}
                  </TableCell>

                   {/* Amount */}
                   <TableCell className="text-sm text-ink-muted">
                     {scholarship.amount || "—"}
                   </TableCell>

                   {/* College */}
                   <TableCell className="text-sm text-ink-muted">
                     {scholarship.collegeIds && scholarship.collegeIds.length > 0
                       ? scholarship.collegeIds
                           .map((college) => college?.name)
                           .filter(Boolean)
                           .join(", ") || "—"
                       : "—"}
                   </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge
                      status={scholarship.status}
                    />
                  </TableCell>

                  {/* Deadline */}
                  <TableCell className="text-sm text-ink-muted">
                    {formatDate(
                      scholarship.applicationDeadline
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-6">

                    <div className="flex items-center justify-end gap-1">

                      {/* Edit */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/scholarships/edit/${scholarship._id}`
                          )
                        }
                        className="h-7 w-7 p-0"
                      >
                        <Edit2 size={13} />
                      </Button>

                      {/* Applications */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/scholarships/applications?scholarshipId=${scholarship._id}`
                          )
                        }
                        className="h-7 w-7 p-0"
                      >
                        <FileText size={13} />
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDeleteConfirm(
                            scholarship._id
                          )
                        }
                        className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </Button>

                    </div>

                  </TableCell>

                </TableRow>
              ))
            )}

          </TableBody>
        </Table>

      </AdminCard>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() =>
          setDeleteConfirm(null)
        }
      >
        <DialogContent className="max-w-sm">

          <DialogHeader>
            <DialogTitle className="text-base">
              Are you sure?
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-ink-muted">
            This will delete the scholarship. If
            applications exist, it will be
            deactivated instead.
          </p>

          <div className="flex justify-end gap-2 mt-3">

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setDeleteConfirm(null)
              }
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

export default ScholarshipList;
