import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import { Building2, Search } from "lucide-react";

export default function CollegePredictor() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [courses, setCourses] = useState([]);

    const [form, setForm] = useState({
        examId: searchParams.get("examId") || "",
        examSessionId: "",
        rank: searchParams.get("rank") || "",
        category: searchParams.get("category") || "OPEN",
        gender: searchParams.get("gender") || "ALL",
        quota: searchParams.get("quota") || "HOME_STATE",
        courseIds: "",
        city: "",
        state: "",
    });

    useEffect(() => {
        axios.get("http://localhost:5001/api/exam").then((response) => {
            setExams(response.data.exams);
        });

        axios.get("http://localhost:5001/api/course").then((response) => {
            setCourses(response.data.courses);
        });
    }, []);

    useEffect(() => {
        if (form.examId) {
            axios
                .get(
                    `http://localhost:5001/api/predictor-exam-sessions?examId=${form.examId}`
                )
                .then((response) => {
                    setSessions(response.data.examSessions);
                });
        }
    }, [form.examId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        if (name === "examId") {
            setForm({
                ...form,
                examId: value,
                examSessionId: "",
            });
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const params = {};
        for (const key in form) {
            if (form[key]) {
                params[key] = form[key];
            }
        }

        navigate({
            pathname: "/college-predictor-results",
            search: `?${createSearchParams(params)}`,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* Hero */}
            <div className="bg-[#1e1b4b] text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">

                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
                        <Building2 className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl font-bold mb-4">
                        College Predictor
                    </h1>

                    <p className="text-lg text-indigo-100">
                        Find the best colleges you can get based on your exam rank.
                    </p>

                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 -mt-8">

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8 mb-12">

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid md:grid-cols-4 gap-4">

                            {/* Exam */}
                            <div>
                                <label className="text-sm font-semibold">
                                    Exam
                                </label>

                                <select
                                    name="examId"
                                    value={form.examId}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border p-3"
                                >
                                    <option value="">
                                        Select Exam
                                    </option>

                                    {exams.map((exam) => (
                                        <option key={exam._id} value={exam._id}>
                                            {exam.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Session */}
                            <div>
                                <label className="text-sm font-semibold">
                                    Session
                                </label>

                                <select
                                    name="examSessionId"
                                    value={form.examSessionId}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border p-3"
                                >
                                    <option value="">
                                        Select Session
                                    </option>

                                    {sessions.map((session) => (
                                        <option
                                            key={session._id}
                                            value={session._id}
                                        >
                                            {session.academicYear} -{" "}
                                            {session.sessionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Rank */}
                            <div>
                                <label className="text-sm font-semibold">
                                    Your Rank
                                </label>

                                <input
                                    type="number"
                                    name="rank"
                                    value={form.rank}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000"
                                    className="w-full mt-2 rounded-xl border p-3"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-sm font-semibold">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border p-3"
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="EWS">EWS</option>
                                </select>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="text-sm font-semibold">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border p-3"
                                >
                                    <option value="ALL">All</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>

                            {/* Quota */}
                            <div>
                                <label className="text-sm font-semibold">
                                    Quota
                                </label>

                                <select
                                    name="quota"
                                    value={form.quota}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border p-3"
                                >
                                    <option value="HOME_STATE">
                                        Home State
                                    </option>

                                    <option value="OUTSIDE_STATE">
                                        Outside State
                                    </option>

                                    <option value="ALL">
                                        All
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div className="grid md:grid-cols-3 gap-4">

                          
                            <div>
                                <label className="text-sm font-semibold">
                                    Preferred Course
                                </label>

                                <select
                                    name="courseIds"
                                    value={form.courseIds}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border p-3"
                                >
                                    <option value="">
                                        All Courses
                                    </option>

                                    {courses.map((course) => (
                                        <option
                                            key={course._id}
                                            value={course._id}
                                        >
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div>
                                <label className="text-sm font-semibold">
                                    Preferred City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Mumbai"
                                    className="w-full mt-2 rounded-xl border p-3"
                                />
                            </div>


                            <div>
                                <label className="text-sm font-semibold">
                                    Preferred State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="e.g. Maharashtra"
                                    className="w-full mt-2 rounded-xl border p-3"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700"
                        >
                            <Search className="w-5 h-5" />
                            Predict My College
                        </button>

                    </form>

                </div>


            </main>
        </div>
    );
}
