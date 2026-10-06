import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Search, Bell } from "lucide-react";

import {
  AdminCard,
  PageHeader,
  StatusBadge,
  EmptyRow,
  ViewBtn,
  EditBtn,
  DeleteBtn,
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
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = [
  "Education News",
  "Exam Update",
  "Admission Update",
  "College Update",
  "Scholarship Update",
  "Result",
  "Counselling",
  "Application Deadline",
  "Course Update",
  "Announcement",
];

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRelatedModule = (update) => {
  if (update.examId) return `Exam · ${update.examId.name}`;
  if (update.collegeId) return `College · ${update.collegeId.name}`;
  if (update.courseId) return `Course · ${update.courseId.name}`;
  if (update.scholarshipId)
    return `Scholarship · ${update.scholarshipId.name}`;

  return "—";
};

const EducationUpdateList = () => {
  const navigate = useNavigate();

  const [updates, setUpdates] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUpdates = async () => {

    const params = {};

    if (search) params.search = search;
    if (category !== "All") params.category = category;
    if (status !== "All") params.status = status;

    const res = await axios.get(
      "/api/admin/education-updates",
      {
        params,
      }
    );

    setUpdates(res.data.data || []);
  };

  useEffect(() => {
    fetchUpdates();
  }, [search, category, status]);

  const handleDelete = async () => {

    await axios.delete(
      `/api/admin/education-updates/${deleteConfirm}`
    );

    setDeleteConfirm(null);
    fetchUpdates();
  };

  const togglePublish = async (update) => {

    await axios.put(
      `/api/admin/education-updates/${update._id}`,
      {
        status: update.status === "Published" ? "Draft" : "Published",
        isImportant: update.isImportant,
      }
    );

    fetchUpdates();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Education Updates"
        children={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/admin/education-alerts")}
            >
              <Bell size={15} />
              Alerts
            </Button>

            <Button
              size="sm"
              onClick={() => navigate("/admin/education-updates/add")}
              className="h-9 bg-brand hover:bg-brand-dark"
            >
              <Plus size={15} />
              Add Update
            </Button>
          </div>
        }
      />

      <AdminCard>
        <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title"
              className="pl-8"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-[0.8125rem] text-ink"
            >
              <option value="All">All Categories</option>

              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-[0.8125rem] text-ink"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITLE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>RELATED MODULE</TableHead>
              <TableHead>PUBLISHED</TableHead>
              <TableHead>DEADLINE</TableHead>
              <TableHead>IMPORTANT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {updates.length === 0 ? (
              <EmptyRow colSpan={8} message="No education updates found." />
            ) : (
              updates.map((update) => (
                <TableRow key={update._id}>
                  <TableCell className="max-w-[280px]">
                    <span className="block truncate font-medium text-ink">
                      {update.title}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {update.category}
                  </TableCell>

                  <TableCell className="max-w-[220px]">
                    <span className="block truncate text-sm text-ink-muted">
                      {getRelatedModule(update)}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {formatDate(update.publishedAt)}
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {formatDate(update.deadline)}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`text-[0.6875rem] font-bold uppercase ${
                        update.isImportant ? "text-red-600" : "text-ink-muted"
                      }`}
                    >
                      {update.isImportant ? "Yes" : "No"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={update.status} />
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <ViewBtn
                        onClick={() =>
                          navigate(
                            `/admin/education-updates/edit/${update._id}`
                          )
                        }
                      />

                      <EditBtn
                        onClick={() =>
                          navigate(
                            `/admin/education-updates/edit/${update._id}`
                          )
                        }
                      />

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(update)}
                        className="h-7 px-2 text-[0.6875rem]"
                      >
                        {update.status === "Published"
                            ? "Unpublish"
                            : "Publish"}
                      </Button>

                      <DeleteBtn
                        onClick={() => setDeleteConfirm(update._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminCard>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              Delete this update?
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-ink-muted">
            The update and its related alert will be removed permanently.
          </p>

          <div className="mt-3 flex justify-end gap-2">
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
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationUpdateList;
