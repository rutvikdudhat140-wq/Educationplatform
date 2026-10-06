import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Bell } from "lucide-react";

import {
  AdminCard,
  PageHeader,
  StatusBadge,
  EmptyRow,
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALERT_TYPES = [
  "Exam Alert",
  "Admission Alert",
  "Scholarship Alert",
  "Result Alert",
  "Deadline Alert",
  "Counselling Alert",
  "College Alert",
  "General Education Alert",
];

const emptyForm = {
  title: "",
  message: "",
  type: "General Education Alert",
  updateId: "none",
  examId: "none",
  collegeId: "none",
  courseId: "none",
  scholarshipId: "none",
  priority: "NORMAL",
  startDate: "",
  expiryDate: "",
  status: "ACTIVE",
};

const toDateInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 10);
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const EducationAlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [exams, setExams] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [scholarships, setScholarships] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {

      const [updateRes, examRes, collegeRes, courseRes, scholarshipRes] =
        await Promise.all([
          axios.get(
            "/api/admin/education-updates"
          ),
          axios.get("/api/exam"),
          axios.get("/api/colleges"),
          axios.get("/api/courses"),
          axios.get("/api/scholarships"),
        ]);

      setUpdates(updateRes.data.data || []);
      setExams(examRes.data.exams || []);
      setColleges(collegeRes.data.colleges || []);
      setCourses(courseRes.data.courses || courseRes.data.data || []);
      setScholarships(scholarshipRes.data.data || []);
    };

    fetchOptions();
  }, []);

  const fetchAlerts = async () => {

    const res = await axios.get("/api/admin/alerts");

    setAlerts(res.data.data || []);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const openCreateForm = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (alert) => {
    setEditId(alert._id);
    setForm({
      title: alert.title || "",
      message: alert.message || "",
      type: alert.type || "General Education Alert",
      updateId: alert.updateId?._id || "none",
      examId: alert.examId?._id || "none",
      collegeId: alert.collegeId?._id || "none",
      courseId: alert.courseId?._id || "none",
      scholarshipId: alert.scholarshipId?._id || "none",
      priority: alert.priority || "NORMAL",
      startDate: toDateInput(alert.startDate),
      expiryDate: toDateInput(alert.expiryDate),
      status: alert.status || "ACTIVE",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

const payload = {
      title: form.title,
      message: form.message,
      type: form.type,
      updateId: form.updateId === "none" ? null : form.updateId,
      examId: form.examId === "none" ? null : form.examId,
      collegeId: form.collegeId === "none" ? null : form.collegeId,
      courseId: form.courseId === "none" ? null : form.courseId,
      scholarshipId: form.scholarshipId === "none" ? null : form.scholarshipId,
      priority: form.priority,
      startDate: form.startDate || new Date().toISOString(),
      expiryDate: form.expiryDate || null,
      status: form.status,
    };

    if (editId) {
      await axios.put(
        `/api/admin/alerts/${editId}`,
        payload
      );
    } else {
      await axios.post("/api/admin/alerts", payload);
    }

    setFormOpen(false);
    fetchAlerts();
  };

  const handleDelete = async () => {

    await axios.delete(`/api/admin/alerts/${deleteConfirm}`);

    setDeleteConfirm(null);
    fetchAlerts();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Education Alerts"
        children={
          <Button
            size="sm"
            onClick={openCreateForm}
            className="h-9 bg-brand hover:bg-brand-dark"
          >
            <Plus size={15} />
            Add Alert
          </Button>
        }
      />

      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITLE</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>RELATED</TableHead>
              <TableHead>PRIORITY</TableHead>
              <TableHead>START DATE</TableHead>
              <TableHead>EXPIRY DATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {alerts.length === 0 ? (
              <EmptyRow colSpan={8} message="No alerts created yet." />
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert._id}>
                  <TableCell className="max-w-[260px]">
                    <span className="block truncate font-medium text-ink">
                      {alert.title}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {alert.type}
                  </TableCell>

                  <TableCell className="max-w-[200px]">
                    <span className="block truncate text-sm text-ink-muted">
                      {alert.updateId?.title ||
                        alert.examId?.name ||
                        alert.collegeId?.name ||
                        alert.courseId?.name ||
                        alert.scholarshipId?.name ||
                        "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`text-[0.6875rem] font-bold uppercase ${
                        alert.priority === "IMPORTANT"
                          ? "text-red-600"
                          : "text-ink-muted"
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {formatDate(alert.startDate)}
                  </TableCell>

                  <TableCell className="text-sm text-ink-muted">
                    {formatDate(alert.expiryDate)}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={alert.status} />
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <EditBtn onClick={() => openEditForm(alert)} />
                      <DeleteBtn onClick={() => setDeleteConfirm(alert._id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminCard>

      {/* Alert Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Bell size={16} className="text-brand" />
              {editId ? "Edit Alert" : "Add Alert"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="edu-field-label">Alert Title</label>

              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="JEE Main 2027 registration has started."
                required
              />
            </div>

            <div>
              <label className="edu-field-label">Message</label>

              <Textarea
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                rows={2}
                placeholder="Short one line notification for students"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="edu-field-label">Alert Type</label>

                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {ALERT_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="edu-field-label">Priority</label>

                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm({ ...form, priority: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="IMPORTANT">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="edu-field-label">Related Update</label>

              <Select
                value={form.updateId}
                onValueChange={(value) =>
                  setForm({ ...form, updateId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No update" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">No Update</SelectItem>

                  {updates.map((update) => (
                    <SelectItem key={update._id} value={update._id}>
                      {update.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="edu-field-label">Related Exam</label>

                <Select
                  value={form.examId}
                  onValueChange={(value) =>
                    setForm({ ...form, examId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No exam" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No Exam</SelectItem>

                    {exams.map((exam) => (
                      <SelectItem key={exam._id} value={exam._id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="edu-field-label">Related College</label>

                <Select
                  value={form.collegeId}
                  onValueChange={(value) =>
                    setForm({ ...form, collegeId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No college" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No College</SelectItem>

                    {colleges.map((college) => (
                      <SelectItem key={college._id} value={college._id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="edu-field-label">Related Course</label>

                <Select
                  value={form.courseId}
                  onValueChange={(value) =>
                    setForm({ ...form, courseId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No course" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No Course</SelectItem>

                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="edu-field-label">Related Scholarship</label>

                <Select
                  value={form.scholarshipId}
                  onValueChange={(value) =>
                    setForm({ ...form, scholarshipId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No scholarship" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No Scholarship</SelectItem>

                    {scholarships.map((scholarship) => (
                      <SelectItem
                        key={scholarship._id}
                        value={scholarship._id}
                      >
                        {scholarship.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="edu-field-label">Start Date</label>

                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="edu-field-label">Expiry Date</label>

                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="edu-field-label">Status</label>

                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-[0.75rem] text-ink-muted">
              An alert stops showing as active on the student side once its
              expiry date has passed.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-brand text-white hover:bg-brand-dark"
              >
                {editId ? "Save Alert" : "Create Alert"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Delete this alert?</DialogTitle>
          </DialogHeader>

          <p className="text-xs text-ink-muted">
            The alert will be removed for all students immediately.
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

export default EducationAlertList;
