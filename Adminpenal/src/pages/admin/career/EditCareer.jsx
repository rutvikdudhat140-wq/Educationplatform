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
    mentors: [],
    isActive: true,
  });

useEffect(() => {
    getCareer();
    getCourses();
  }, [id]);

  const getCareer = async () => {
    const response = await axios.get(`/api/career/${id}`);

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
      mentors: career.mentors || [],
      isActive: career.isActive !== false,
    });
  };

  const getCourses = async () => {
    const response = await axios.get("/api/course?isActive=true");
    setCourses(response.data.data || []);
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
      await axios.put(`/api/career/${id}`, {
        name: form.name,
        stream: form.stream,
        description: form.description,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        salaryUnit: form.salaryUnit,
        workType: form.workType,
        growthLevel: form.growthLevel,
        relatedCourses: form.relatedCourses,
        mentors: form.mentors,
        isActive: form.isActive,
      });

      navigate("/admin/career/list");
    } catch {}
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

        <div>
          <p className="mb-2 font-medium">Mentors (Alumni)</p>
          <div className="space-y-3 mb-4">
            {form.mentors.map((mentor, index) => (
              <div key={index} className="border p-3 rounded-lg flex justify-between items-center bg-gray-50">
                <div>
                  <p className="font-semibold text-sm">{mentor.name} <span className="text-gray-500 font-normal">({mentor.currentRole} at {mentor.company})</span></p>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    const newMentors = [...form.mentors];
                    newMentors.splice(index, 1);
                    setForm({...form, mentors: newMentors});
                  }}
                  className="text-red-500 text-xs font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            {form.mentors.length === 0 && <p className="text-sm text-gray-500 italic">No mentors added yet.</p>}
          </div>

          <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
            <p className="font-semibold text-sm mb-3 text-gray-700">Quick Add Mentor</p>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" id="newMentorName" placeholder="Full Name *" className="border p-2 rounded text-sm w-full bg-white" />
              <input type="text" id="newMentorRole" placeholder="Role (e.g. Data Scientist)" className="border p-2 rounded text-sm w-full bg-white" />
              <input type="text" id="newMentorCompany" placeholder="Company (e.g. Google)" className="border p-2 rounded text-sm w-full bg-white" />
              <input type="text" id="newMentorCollege" placeholder="College (e.g. IIT Bombay)" className="border p-2 rounded text-sm w-full bg-white" />
            </div>
            <button 
              type="button" 
              onClick={() => {
                const name = document.getElementById('newMentorName').value;
                const role = document.getElementById('newMentorRole').value;
                const company = document.getElementById('newMentorCompany').value;
                const college = document.getElementById('newMentorCollege').value;
                if(!name) return alert('Name is required');
                setForm({
                  ...form, 
                  mentors: [...form.mentors, { name, currentRole: role, company, college, profilePhoto: '' }]
                });
                document.getElementById('newMentorName').value = '';
                document.getElementById('newMentorRole').value = '';
                document.getElementById('newMentorCompany').value = '';
                document.getElementById('newMentorCollege').value = '';
              }}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              + Add Mentor
            </button>
            <p className="text-xs text-gray-400 mt-2">Added mentors will be saved when you submit the career form.</p>
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

