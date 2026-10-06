
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditCareer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    stream: "",
    description: "",
    salaryMin: 0,
    salaryMax: 0,
    salaryUnit: "LPA",
    workType: "Full Time",
    growthLevel: "Moderate",
    relatedCourses: [],
    isActive: true,
  });

  // Get Career and Courses
  useEffect(() => {
    getCareer();
    getCourses();
  }, [id]);

  const getCareer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/career/${id}`
      );

      const career = response.data.data;

      setForm({
        name: career.name || "",
        stream: career.stream || "",
        description: career.description || "",
        salaryMin: career.salaryMin || 0,
        salaryMax: career.salaryMax || 0,
        salaryUnit: career.salaryUnit || "LPA",
        workType: career.workType || "Full Time",
        growthLevel: career.growthLevel || "Moderate",
        relatedCourses: career.relatedCourses || [],
        isActive: career.isActive !== false,
      });
    } catch (error) {

    }
  };

  const getCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/course?isActive=true"
      );

      setCourses(response.data.data || []);
    } catch (error) {
      console.log("Courses Error:", error);
    }
  };

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };


  const toggleCourse = (courseId) => {
    const alreadySelected = form.relatedCourses.includes(courseId);

    if (alreadySelected) {
      setForm({
        ...form,
        relatedCourses: form.relatedCourses.filter(
          (id) => id !== courseId
        ),
      });
    } else {
      setForm({
        ...form,
        relatedCourses: [
          ...form.relatedCourses,
          courseId,
        ],
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5001/api/career/${id}`,
        {
          name: form.name,
          stream: form.stream,
          description: form.description,
          salaryMin: Number(form.salaryMin),
          salaryMax: Number(form.salaryMax),
          salaryUnit: form.salaryUnit,
          workType: form.workType,
          growthLevel: form.growthLevel,
          relatedCourses: form.relatedCourses,
          isActive: form.isActive,
        }
      );

      navigate("/admin/careers/list");
    } catch (error) {

    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">
        Edit Career
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
      >

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Career name"
          className="w-full rounded-lg border px-3 py-2"
          required
        />

        {/* Stream */}
        <select
          name="stream"
          value={form.stream}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">
            Select stream
          </option>

          {STREAM_OPTIONS.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>


        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full rounded-lg border px-3 py-2"
          rows="4"
        />


        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="salaryMin"
            value={form.salaryMin}
            onChange={handleChange}
            placeholder="Minimum Salary"
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            type="number"
            name="salaryMax"
            value={form.salaryMax}
            onChange={handleChange}
            placeholder="Maximum Salary"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <select
          name="salaryUnit"
          value={form.salaryUnit}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="LPA">LPA</option>
          <option value="Per Month">
            Per Month
          </option>
        </select>


        <select
          name="workType"
          value={form.workType}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Freelance">Freelance</option>
          <option value="Remote">Remote</option>
        </select>


        <select
          name="growthLevel"
          value={form.growthLevel}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>


        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({
                ...form,
                isActive: e.target.checked,
              })
            }
          />
          Active
        </label>


        <div>
          <p className="mb-2 font-medium">
            Related Courses
          </p>

          <div className="grid gap-2 md:grid-cols-2">
            {courses.map((course) => (
              <label
                key={course._id}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={form.relatedCourses.includes(
                    course._id
                  )}
                  onChange={() =>
                    toggleCourse(course._id)
                  }
                />

                <span>{course.name}</span>
              </label>
            ))}
          </div>
        </div>


        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Update Career
        </button>
      </form>
    </div>
  );
}

