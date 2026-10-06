import { useEffect, useState } from "react";
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

export default function AddCareer() {
    const navigate = useNavigate();

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

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5001/api/course?isActive=true"
                );
                setCourses(response.data.data || response.data.courses || []);
            } catch (error) {
            }
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
            await axios.post("http://localhost:5001/api/career", {
                ...form,
                salaryMin: Number(form.salaryMin) || 0,
                salaryMax: Number(form.salaryMax) || 0,
            });

            navigate("/admin/career/list");
        } catch (error) {
        }
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
                    className="rounded-2xl border bg-white p-6 shadow-sm md:p-8" >
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700"> Career Name</label>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700"> Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter career description"
                                rows={5}
                                className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Salary Range</label>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={form.salaryMin}
                                    onChange={handleChange}
                                    placeholder="Minimum salary"
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                />

                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={form.salaryMax}
                                    onChange={handleChange}
                                    placeholder="Maximum salary"
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                />

                                <select
                                    name="salaryUnit"
                                    value={form.salaryUnit}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                                    <option value="LPA">LPA</option>
                                    <option value="Per Month">Per Month</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Work Type</label>

                            <select name="workType"
                                value={form.workType}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">

                                <option value="Full Time">Fyll time</option>
                                <option value="part time">Part time</option>
                                <option value="freelance">Freelance</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Growth Level</label>

                            <select
                                name="growthLevel"
                                value={form.growthLevel}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                                <option value="law">law</option>
                                <option value="maderate">Maderate</option>
                                <option value="high">High</option>
                            </select>
                        </div>


                        <div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Related Courses</label>
                                <p className="mt-1 text-xs text-gray-500">Select courses related to this career.</p>
                            </div>
                            <div className="max-h-60 overflow-y-auto rounded-lg border p-3">
                                {courses.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-gray-500">No courses available.</p>
                                ) : (
                                    <div className="grid gap-2 md:grid-cols-2">
                                        {courses.map((course) => (
                                            <label
                                                key={course._id}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={form.relatedCourses.includes(course._id)}
                                                    onChange={() => toggleCourse(course._id)}
                                                    className="h-4 w-4 accent-emerald-600" />

                                                <span className="text-gray-700">{course.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        Active <input type="checkbox"
                            checked={form.isActive}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isActive: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 accent-emerald-600" />
                        <div className="flex justify-end gap-3 border-t pt-5">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/careers/list")}
                                className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50" >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"> SaveCareer
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
