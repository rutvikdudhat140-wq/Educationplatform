import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Trash2,
  Eye,
} from "lucide-react";

import {
  AdminCard,
  FilterBar,
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
import { Input } from "@/components/ui/input";
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

import { Textarea } from "@/components/ui/textarea";

const QAQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewQuestion, setViewQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (collegeFilter) params.college = collegeFilter;

    try {
      const res = await axios.get("/api/admin/questions", { params });
      setQuestions(res.data.data || []);
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  };

  const fetchColleges = async () => {
    try {
      const res = await axios.get("/api/colleges?limit=500");
      setColleges(res.data.colleges || []);
    } catch {
      setColleges([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchColleges();
  }, []);

  const handleSearch = () => {
    fetchQuestions();
  };

  const handleCollegeFilter = (value) => {
    setCollegeFilter(value || "");
  };

  const toggleQuestionStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    try {
      await axios.patch(`/api/admin/questions/${id}/status`, {
        status: newStatus,
      });
      fetchQuestions();
    } catch {}
  };

  const toggleAnswerStatus = async (answerId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    try {
      await axios.patch(
        `/api/admin/questions/answers/${answerId}/status`,
        { status: newStatus }
      );
      if (viewQuestion) {
        const res = await axios.get(`/api/admin/questions/${viewQuestion._id}`);
        setViewQuestion(res.data.data);
      }
    } catch {}
  };

  const handleDeleteQuestion = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(`/api/admin/questions/${deleteConfirm}`);
      setDeleteConfirm(null);
      fetchQuestions();
    } catch {}
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(`/api/admin/questions/answers/${answerId}`);
      if (viewQuestion) {
        const res = await axios.get(`/api/admin/questions/${viewQuestion._id}`);
        setViewQuestion(res.data.data);
      }
    } catch {}
  };

  const handlePostAnswer = async () => {
    if (!answerText.trim() || !viewQuestion) return;
    try {
      await axios.post(
        `/api/admin/questions/${viewQuestion._id}/answers`,
        { answer: answerText }
      );
      setAnswerText("");
      const res = await axios.get(`/api/admin/questions/${viewQuestion._id}`);
      setViewQuestion(res.data.data);
    } catch {}
  };

  const viewQuestionDetail = async (id) => {
    const res = await axios.get(`/api/admin/questions/${id}`);
    setViewQuestion(res.data.data);
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
      <PageHeader title="Q&amp;A Management" />
      <AdminCard>
        <FilterBar>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={collegeFilter} onValueChange={handleCollegeFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by college" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Colleges</SelectItem>
              {colleges.map((college) => (
                <SelectItem key={college._id} value={college._id}>
                  {college.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={handleSearch}>
            Apply
          </Button>
        </FilterBar>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Asked By</TableHead>
                <TableHead>Answers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <EmptyRow colSpan={7} message="Loading..." />
              ) : questions.length === 0 ? (
                <EmptyRow colSpan={7} message="No questions found." />
              ) : (
                questions.map((q) => (
                  <TableRow key={q._id}>
                    <TableCell className="max-w-xs">
                      <p
                        className="line-clamp-2 text-sm font-medium text-ink cursor-pointer hover:text-brand"
                        onClick={() => viewQuestionDetail(q._id)}
                      >
                        {q.question}
                      </p>
                    </TableCell>

                    <TableCell className="text-sm text-ink-muted">
                      {q.collegeId?.name || "—"}
                    </TableCell>

                    <TableCell className="text-sm text-ink-muted">
                      {q.userId?.name || "—"}
                    </TableCell>

                    <TableCell className="text-sm text-ink-muted">
                      {q.answers ? q.answers.length : q.answerCount || 0}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={q.status} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toggleQuestionStatus(q._id, q.status)
                        }
                        className="ml-2 h-6 px-1.5 text-[10px]"
                      >
                        {q.status === "ACTIVE" ? "Hide" : "Show"}
                      </Button>
                    </TableCell>

                    <TableCell className="text-sm text-ink-muted">
                      {formatDate(q.createdAt)}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewQuestionDetail(q._id)}
                          className="h-7 w-7 p-0"
                        >
                          <Eye size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirm(q._id)}
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
        </div>
      </AdminCard>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              Are you sure?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-ink-muted">
            This will permanently delete the question and all its
            answers.
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
              onClick={handleDeleteQuestion}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Question & Answers */}
      <Dialog open={!!viewQuestion} onOpenChange={() => setViewQuestion(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6">
          {viewQuestion && (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  Question Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {viewQuestion.question}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-muted">
                  <span>
                    Asked by{" "}
                    <span className="font-medium">
                      {viewQuestion.userId?.name || "Anonymous"}
                    </span>
                  </span>
                  <span>College: {viewQuestion.collegeId?.name || "—"}</span>
                  <span>{formatDate(viewQuestion.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={viewQuestion.status} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleQuestionStatus(
                        viewQuestion._id,
                        viewQuestion.status
                      )
                    }
                    className="h-6 px-1.5 text-[10px]"
                  >
                    {viewQuestion.status === "ACTIVE" ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>

              <div className="border-t border-line pt-4">
                <h3 className="text-sm font-semibold text-ink mb-3">
                  Answers ({viewQuestion.answers?.length || 0})
                </h3>

                {viewQuestion.answers?.length === 0 ? (
                  <p className="text-xs text-ink-muted">
                    No answers yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {viewQuestion.answers.map((a) => (
                      <div
                        key={a._id}
                        className="rounded-md border border-line bg-surface p-3"
                      >
                        <div className="space-y-2">
                          <p className="text-sm text-ink">{a.answer}</p>

                          <div className="flex items-center gap-3 text-xs text-ink-muted">
                            <span>
                              Answered by{" "}
                              <span className="font-medium">
                                {a.userId?.name || "Anonymous"}
                              </span>
                            </span>
                            <span>{formatDate(a.createdAt)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <StatusBadge status={a.status} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                toggleAnswerStatus(a._id, a.status)
                              }
                              className="h-6 px-1.5 text-[10px]"
                            >
                              {a.status === "ACTIVE" ? "Hide" : "Show"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAnswer(a._id)}
                              className="h-6 px-1.5 text-[10px] text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3 border-t border-line pt-4">
                <h4 className="text-sm font-semibold text-ink">Post Answer</h4>
                <Textarea
                  placeholder="Write your answer..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handlePostAnswer}
                    disabled={!answerText.trim()}
                    className="bg-brand hover:bg-brand/90 text-white"
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-line">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewQuestion(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QAQuestionList;
