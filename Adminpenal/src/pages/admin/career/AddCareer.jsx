import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

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

const GROWTH_OPTIONS = ["Low", "Moderate", "High"];
const WORK_TYPE_OPTIONS = ["Full Time", "Part Time", "Freelance", "Remote"];
const SALARY_UNIT_OPTIONS = ["LPA", "Per Month"];

export default function AddCareer() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        stream: "",
        shortDescription: "",
        description: "",
        education: "",
        skills: [],
        averageSalary: "",
        salaryMin: 0,
        salaryMax: 0,
        salaryUnit: "LPA",
        workType: "Full Time",
        growthLevel: "Moderate",
        demandLevel: "",
        relatedStream: "",
        careerPath: "",
        relatedCourses: [],
    mentors: [],
        topCompanies: [],
        isActive: true,
        status: "Active",
        displayOrder: 0,
    });

    useEffect(() => {
        const loadCourses = async () => {
            const response = await axios.get("/api/course?isActive=true");
            setCourses(response.data.data || response.data.courses || []);
        };
        loadCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSkillsChange = (e) => {
        const value = e.target.value;
        const skills = value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        setForm((prev) => ({
            ...prev,
            skills,
        }));
    };

    const handleTopCompaniesChange = (e) => {
        const value = e.target.value;
        const companies = value
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
        setForm((prev) => ({
            ...prev,
            topCompanies: companies,
        }));
    };

    const toggleCourse = (courseId) => {
        setForm((prev) => ({
            ...prev,
            relatedCourses: prev.relatedCourses.includes(courseId)
                ? prev.relatedCourses.filter((id) => id !== courseId)
                : [...prev.relatedCourses, courseId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/api/career", {
                ...form,
                salaryMin: Number(form.salaryMin) || 0,
                salaryMax: Number(form.salaryMax) || 0,
                skills: form.skills || [],
                topCompanies: form.topCompanies || [],
                relatedCourses: form.relatedCourses || [],
            });

            navigate("/admin/career/list");
        } catch {}
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Add Career</h2>
                    <p className="mt-1 text-sm text-gray-500">Create a new career and connect it with related courses.</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border bg-white p-6 shadow-sm md:p-8"
                >
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Career Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter career name"
                                required
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Stream</label>
                            <select
                                name="stream"
                                value={form.stream}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Short Description</label>
                            <textarea
                                name="shortDescription"
                                value={form.shortDescription}
                                onChange={handleChange}
                                placeholder="Brief description (one line)"
                                rows={2}
                                className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter career description"
                                rows={4}
                                className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Education</label>
                            <input
                                name="education"
                                value={form.education}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech, B.Sc, MBA"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Skills</label>
                            <input
                                name="skills"
                                value={form.skills.join(", ")}
                                onChange={handleSkillsChange}
                                placeholder="e.g. JavaScript, React, Node.js"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate skills with commas</p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Career Path</label>
                            <input
                                name="careerPath"
                                value={form.careerPath}
                                onChange={handleChange}
                                placeholder="e.g. Junior Developer → Senior Developer → Lead"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Salary Min</label>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={form.salaryMin}
                                    onChange={handleChange}
                                    placeholder="Minimum"
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Salary Max</label>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={form.salaryMax}
                                    onChange={handleChange}
                                    placeholder="Maximum"
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Unit</label>
                                <select
                                    name="salaryUnit"
                                    value={form.salaryUnit}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                >
                                    {SALARY_UNIT_OPTIONS.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Average Salary</label>
                            <input
                                name="averageSalary"
                                value={form.averageSalary}
                                onChange={handleChange}
                                placeholder="e.g. 8 LPA"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Work Type</label>
                                <select
                                    name="workType"
                                    value={form.workType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                >
                                    {WORK_TYPE_OPTIONS.map((wt) => (
                                        <option key={wt} value={wt}>{wt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Growth Level</label>
                                <select
                                    name="growthLevel"
                                    value={form.growthLevel}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                >
                                    {GROWTH_OPTIONS.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Demand Level</label>
                            <input
                                name="demandLevel"
                                value={form.demandLevel}
                                onChange={handleChange}
                                placeholder="e.g. High, Medium, Low"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Related Stream</label>
                            <input
                                name="relatedStream"
                                value={form.relatedStream}
                                onChange={handleChange}
                                placeholder="e.g. Engineering, Technology"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Top Companies</label>
                            <input
                                name="topCompanies"
                                value={form.topCompanies.join(", ")}
                                onChange={handleTopCompaniesChange}
                                placeholder="e.g. Google, Microsoft, Amazon"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate companies with commas</p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Related Courses</label>
                            <p className="mt-1 text-xs text-gray-500">Select courses related to this career.</p>
                            {courses.length === 0 ? (
                                <p className="py-4 text-center text-sm text-gray-500">No courses available.</p>
                            ) : (
                                <div className="max-h-60 overflow-y-auto rounded-lg border p-3">
                                    <div className="grid gap-2 md:grid-cols-2">
                                        {courses.map((course) => (
                                            <label
                                                key={course._id}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.relatedCourses.includes(course._id)}
                                                    onChange={() => toggleCourse(course._id)}
                                                    className="h-4 w-4 accent-emerald-600"
                                                />
                                                <span className="text-gray-700">{course.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Mentors (Alumni)</label>
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

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isActive: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4 accent-emerald-600"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-5">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/career/list")}
                                className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
