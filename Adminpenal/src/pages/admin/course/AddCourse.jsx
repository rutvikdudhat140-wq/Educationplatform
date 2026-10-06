import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STREAM_OPTIONS = [
  "Engineering",
  "Technology",
  "Management",
  "Science",
  "Commerce",
  "Arts",
  "Education",
  "Agriculture",
  "Design",
  "Pharmacy",
  "Medical",
  "Law",
  "Hotel Management",
  "Computer Applications",
];

const AddCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    fullName: "",
    stream: "",
    level: "UG",
    duration: "",
    description: "",
    eligibilityCriteria: [],
    entranceExams: [],
    careerOptions: [],
    fees: "",
    collegeCount: "",
    // image: "",
    isPopular: false,
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleArrayChange = (e, field) => {
    setForm({
      ...form,
      [field]: e.target.value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5001/api/course", {
      ...form,
      fees: Number(form.fees) || 0,
      collegeCount: Number(form.collegeCount) || 0,
      isActive: form.status === "Active",
    });

    navigate("/admin/course/list");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Add Course</h1>
            <p className="mt-1 text-sm text-slate-500">Add course information</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/course/list")}
            className="rounded-lg border bg-white px-4 py-2 text-sm">Back</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Course Details</h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Course Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="B.Tech"
                  required
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Full Course Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Bachelor of Technology"
                  required
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Stream</label>
                <select
                  name="stream"
                  value={form.stream}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Select stream</option>

                  {STREAM_OPTIONS.map((stream) => (
                    <option key={stream} value={stream}>
                      {stream}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                >
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                  <option value="Diploma">Diploma</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="4 Years"
                  required
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Course description"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Fees</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Fees</label>

                <input
                  type="number"
                  name="fees"
                  value={form.fees}
                  onChange={handleChange}
                  placeholder="150000"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  College Count
                </label>

                <input
                  type="number"
                  name="collegeCount"
                  value={form.collegeCount}
                  onChange={handleChange}
                  placeholder="8"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">Eligibility & Exams</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Eligibility Criteria</label>

                <input
                  type="text"
                  value={form.eligibilityCriteria.join(", ")}
                  onChange={(e) =>
                    handleArrayChange(e, "eligibilityCriteria")
                  }
                  placeholder="12th Science, Minimum 50% marks"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Entrance Exams</label>

                <input
                  type="text"
                  value={form.entranceExams.join(", ")}
                  onChange={(e) =>
                    handleArrayChange(e, "entranceExams")
                  }
                  placeholder="JEE Main, JEE Advanced"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Career Options</label>

                <input
                  type="text"
                  value={form.careerOptions.join(", ")}
                  onChange={(e) =>
                    handleArrayChange(e, "careerOptions")
                  }
                  placeholder="Software Engineer, Developer"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

            </div>
          </div>


          {/* <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">
              Image
            </h2>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
          </div> */}


          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleChange}/>
              <span className="text-sm font-medium">Show as Popular Course</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate("/admin/course/list")}
              className="rounded-lg border bg-white px-5 py-2.5 text-sm">
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Save Course
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCourse;
