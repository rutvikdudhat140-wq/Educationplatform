import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import { Building2, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        axios.get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/exam`).then((response) => {
            setExams(response.data.exams || []);
        });

        axios.get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/course`).then((response) => {
            setCourses(response.data.courses || []);
        });
    }, []);

    useEffect(() => {
        if (form.examId) {
            axios
                .get(
                    `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/predictor-exam-sessions?examId=${form.examId}`
                )
                .then((response) => {
                    setSessions(response.data.examSessions || []);
                });
        }
    }, [form.examId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
            ...(name === "examId" && {
                examSessionId: "",
            }),
        });
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
        <div className="min-h-screen bg-surface pb-16 text-ink">
            {/* Header Banner */}
            <div className="border-b border-line bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-brand text-xs font-semibold mb-2.5">
                            <Building2 size={13} /> College Admission Predictor
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
                            Predict Eligible Colleges
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
                            Discover institutions and branches you can secure based on your entrance rank, category, quota and location preferences.
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Form Card */}
                <div className="rounded-md border border-line bg-white p-5 sm:p-8 shadow-none mb-8">
                    <div className="border-b border-line pb-3 mb-6">
                        <h2 className="text-base font-bold text-ink">Enter Rank & Preference Parameters</h2>
                        <p className="text-xs text-ink-muted mt-0.5">Parameters are evaluated against previous year closing ranks.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Exam */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Exam *
                                </label>
                                <select
                                    required
                                    name="examId"
                                    value={form.examId}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                >
                                    <option value="">Select Exam</option>
                                    {exams.map((exam) => (
                                        <option key={exam._id} value={exam._id}>
                                            {exam.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Session */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Session
                                </label>
                                <select
                                    name="examSessionId"
                                    value={form.examSessionId}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                >
                                    <option value="">Select Session</option>
                                    {sessions.map((session) => (
                                        <option key={session._id} value={session._id}>
                                            {session.academicYear} - {session.sessionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Rank */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Your Rank *
                                </label>
                                <input
                                    required
                                    type="number"
                                    name="rank"
                                    value={form.rank}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000"
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                >
                                    <option value="OPEN">OPEN / General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="EWS">EWS</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Gender */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Gender Pool
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                >
                                    <option value="ALL">Gender Neutral / All</option>
                                    <option value="FEMALE">Female Only</option>
                                </select>
                            </div>

                            {/* Quota */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Quota
                                </label>
                                <select
                                    name="quota"
                                    value={form.quota}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                >
                                    <option value="HOME_STATE">Home State (HS)</option>
                                    <option value="OUTSIDE_STATE">Outside State (OS)</option>
                                    <option value="ALL">All India (AI)</option>
                                </select>
                            </div>

                            {/* Preferred Course */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Preferred Course
                                </label>
                                <select
                                    name="courseIds"
                                    value={form.courseIds}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                >
                                    <option value="">All Programs</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Preferred State */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                                    Preferred State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="e.g. Maharashtra"
                                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-11 shadow-none flex items-center justify-center gap-2"
                            >
                                <Search size={15} /> Find Matching Colleges & Cutoffs
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
