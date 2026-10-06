import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft } from "lucide-react";

import { AdminCard, PageHeader } from "@/components/layout/AdminUI";
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

const emptyForm = {
  title: "",
  shortDescription: "",
  content: "",
  category: "Education News",
  thumbnail: "",
  examId: "none",
  collegeId: "none",
  courseId: "none",
  scholarshipId: "none",
  publishedAt: "",
  deadline: "",
  examDate: "",
  resultDate: "",
  officialLink: "",
  isImportant: false,
  status: "Draft",
};

const toDateInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 10);
};

const EducationUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [exams, setExams] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [examRes, collegeRes, courseRes, scholarshipRes] =
        await Promise.all([
          axios.get("/api/exam"),
          axios.get("/api/colleges"),
          axios.get("/api/courses"),
          axios.get("/api/scholarships"),
        ]);

      setExams(examRes.data.exams || []);
      setColleges(collegeRes.data.colleges || []);
      setCourses(courseRes.data.courses || courseRes.data.data || []);
      setScholarships(scholarshipRes.data.data || []);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const fetchUpdate = async () => {
      const res = await axios.get(`/api/education-updates/${id}`);

      const data = res.data.data;

      setForm({
        title: data.title || "",
        shortDescription: data.shortDescription || "",
        content: data.content || "",
        category: data.category || "Education News",
        thumbnail: data.thumbnail || "",
        examId: data.examId?._id || "none",
        collegeId: data.collegeId?._id || "none",
        courseId: data.courseId?._id || "none",
        scholarshipId: data.scholarshipId?._id || "none",
        publishedAt: toDateInput(data.publishedAt),
        deadline: toDateInput(data.deadline),
        examDate: toDateInput(data.examDate),
        resultDate: toDateInput(data.resultDate),
        officialLink: data.officialLink || "",
        isImportant: !!data.isImportant,
        status: data.status || "Draft",
      });
    };

    fetchUpdate();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

const payload = {
      title: form.title,
      shortDescription: form.shortDescription,
      content: form.content,
      category: form.category,
      thumbnail: form.thumbnail,
      examId: form.examId === "none" ? null : form.examId,
      collegeId: form.collegeId === "none" ? null : form.collegeId,
      courseId: form.courseId === "none" ? null : form.courseId,
      scholarshipId: form.scholarshipId === "none" ? null : form.scholarshipId,
      publishedAt: form.publishedAt || undefined,
      deadline: form.deadline || null,
      examDate: form.examDate || null,
      resultDate: form.resultDate || null,
      officialLink: form.officialLink,
      isImportant: form.isImportant,
      status: form.status,
    };

    if (isEdit) {
      await axios.put(
        `/api/admin/education-updates/${id}`,
        payload
      );
    } else {
      await axios.post(
        "/api/admin/education-updates",
        payload
      );
    }

    navigate("/admin/education-updates");
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={isEdit ? "Edit Education Update" : "Add Education Update"}
        children={
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/admin/education-updates")}
          >
            <ArrowLeft size={15} />
            Back to List
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Basic Information */}
          <AdminCard className="p-5">
            <h3 className="mb-4 text-[0.875rem] font-bold text-ink">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="edu-field-label">Title</label>

                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="JEE Main 2027 Registration Begins"
                  required
                />
              </div>

              <div>
                <label className="edu-field-label">Short Description</label>

                <Textarea
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  rows={2}
                  placeholder="One or two lines shown on the update card"
                />
              </div>

              <div>
                <label className="edu-field-label">Full Content</label>

                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={8}
                  placeholder="Full education update content"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="edu-field-label">Category</label>

                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {CATEGORIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="edu-field-label">Thumbnail URL</label>

                  <Input
                    value={form.thumbnail}
                    onChange={(e) =>
                      setForm({ ...form, thumbnail: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Related Information */}
          <AdminCard className="p-5">
            <h3 className="mb-1 text-[0.875rem] font-bold text-ink">
              Related Information
            </h3>

            <p className="mb-4 text-[0.75rem] text-ink-muted">
              Link this update to an existing record. These are picked from the
              exams, colleges, courses and scholarships already on the platform.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="edu-field-label">Exam</label>

                <Select
                  value={form.examId}
                  onValueChange={(value) => setForm({ ...form, examId: value })}
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
                <label className="edu-field-label">College</label>

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
                <label className="edu-field-label">Course</label>

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
                <label className="edu-field-label">Scholarship</label>

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
                      <SelectItem key={scholarship._id} value={scholarship._id}>
                        {scholarship.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AdminCard>

          {/* Date Information */}
          <AdminCard className="p-5">
            <h3 className="mb-4 text-[0.875rem] font-bold text-ink">
              Date Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="edu-field-label">Published Date</label>

                <Input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm({ ...form, publishedAt: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="edu-field-label">Deadline</label>

                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="edu-field-label">Exam Date</label>

                <Input
                  type="date"
                  value={form.examDate}
                  onChange={(e) =>
                    setForm({ ...form, examDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="edu-field-label">Result Date</label>

                <Input
                  type="date"
                  value={form.resultDate}
                  onChange={(e) =>
                    setForm({ ...form, resultDate: e.target.value })
                  }
                />
              </div>
            </div>
          </AdminCard>

          {/* Publishing */}
          <AdminCard className="p-5">
            <h3 className="mb-4 text-[0.875rem] font-bold text-ink">
              Publishing
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="edu-field-label">Official Link</label>

                <Input
                  value={form.officialLink}
                  onChange={(e) =>
                    setForm({ ...form, officialLink: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="edu-field-label">Status</label>

                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="edu-field-label">Important</label>

                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem] text-ink-soft">
                    <input
                      type="radio"
                      checked={form.isImportant}
                      onChange={() =>
                        setForm({ ...form, isImportant: true })
                      }
                      className="size-4 accent-[#0F766E]"
                    />
                    Yes
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem] text-ink-soft">
                    <input
                      type="radio"
                      checked={!form.isImportant}
                      onChange={() =>
                        setForm({ ...form, isImportant: false })
                      }
                      className="size-4 accent-[#0F766E]"
                    />
                    No
                  </label>
                </div>

                <p className="mt-1.5 text-[0.75rem] text-ink-muted">
                  Important updates are highlighted for students and get an
                  alert when published.
                </p>
              </div>
            </div>
          </AdminCard>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/education-updates")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-brand text-white hover:bg-brand-dark"
            >
              <Save size={15} />
              {isEdit ? "Save Changes" : "Create Update"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EducationUpdateForm;
