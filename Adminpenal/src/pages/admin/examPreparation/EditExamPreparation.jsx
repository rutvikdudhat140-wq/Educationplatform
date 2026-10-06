import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const EditExamPreparation = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [examSessions, setExamSessions] = useState([]);

    const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

    const [form, setForm] = useState({
        exam: "",
        examSession: "",
        title: "",
        overview: "",
        preparationStrategy: "",
        subjectWisePreparation: "",
        importantTopics: "",
        studyPlan: "",
        bestBooks: "",
        previousYearPapers: "",
        mockTest: "",
        timeManagement: "",
        revisionStrategy: "",
        lastMinuteTips: "",
        examDayTips: "",
        commonMistakes: "",
        description: "",
        status: "Active",
    });

    useEffect(() => {
        axios
            .get("/api/exam")
            .then((res) => {
                setExams(res.data.exams || []);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`/api/exam-preparation/${id}`)
            .then((res) => {
                const data = res.data.examPreparation;

                setForm({
                    exam: data.exam?._id || data.exam || "",
                    examSession:
                        data.examSession?._id || data.examSession || "",
                    title: data.title || "",
                    overview: data.overview || "",
                    preparationStrategy: data.preparationStrategy || "",
                    subjectWisePreparation: data.subjectWisePreparation || "",
                    importantTopics: data.importantTopics || "",
                    studyPlan: data.studyPlan || "",
                    bestBooks: data.bestBooks || "",
                    previousYearPapers: data.previousYearPapers || "",
                    mockTest: data.mockTest || "",
                    timeManagement: data.timeManagement || "",
                    revisionStrategy: data.revisionStrategy || "",
                    lastMinuteTips: data.lastMinuteTips || "",
                    examDayTips: data.examDayTips || "",
                    commonMistakes: data.commonMistakes || "",
                    description: data.description || "",
                    status: data.status || "Active",
                });

                setFaqs(
                    data.faqs?.length
                        ? data.faqs
                        : [{ question: "", answer: "" }]
                );
            });
    }, [id]);

    useEffect(() => {
        if (!form.exam) {
            setExamSessions([]);
            return;
        }

        axios
            .get(
                `/api/exam-session?exam=${form.exam}`
            )
            .then((res) => {
                setExamSessions(res.data.examSessions || []);
            });
    }, [form.exam]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFaqChange = (index, field, value) => {
        const updated = faqs.map((faq, i) =>
            i === index ? { ...faq, [field]: value } : faq
        );
        setFaqs(updated);
    };

    const addFaq = () => {
        setFaqs([...faqs, { question: "", answer: "" }]);
    };

    const removeFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .put(
                `/api/exam-preparation/${id}`,
                { ...form, faqs }
            )
            .then(() => {
                navigate("/admin/exam-preparation/list");
            });
    };

    const inputClass =
        "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500";

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-semibold">
                    Edit Information & Preparation
                </h2>

                <p className="text-sm text-muted-foreground">
                    Update preparation content for an exam session
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
            >
                {/* Exam & Session */}
                <div className="grid gap-5 md:grid-cols-2">
                    <label className="space-y-1 text-sm font-medium">
                        Exam *

                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">Select Exam</option>

                            {exams.map((exam) => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="space-y-1 text-sm font-medium">
                        Exam Session *

                        <select
                            name="examSession"
                            value={form.examSession}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">Select Session</option>

                            {examSessions.map((session) => (
                                <option key={session._id} value={session._id}>
                                    {session.academicYear
                                        ? `${session.academicYear} - ${session.sessionName}`
                                        : session.sessionName}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Title */}
                <div className="border-t pt-5">
                    <label className="space-y-1 text-sm font-medium">
                        Title *

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. JEE Main 2026 Complete Preparation Guide"
                            className={inputClass}
                        />
                    </label>
                </div>

                {/* Overview & Strategy */}
                <div className="space-y-4 border-t pt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                        Overview & Strategy
                    </h3>

                    <label className="block space-y-1 text-sm font-medium">
                        Overview

                        <textarea
                            name="overview"
                            value={form.overview}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Brief overview of the exam and preparation approach..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Preparation Strategy

                        <textarea
                            name="preparationStrategy"
                            value={form.preparationStrategy}
                            onChange={handleChange}
                            rows={3}
                            placeholder="How should students approach this exam..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Subject-wise Preparation

                        <textarea
                            name="subjectWisePreparation"
                            value={form.subjectWisePreparation}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Guidance for preparing each subject..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Important Topics

                        <textarea
                            name="importantTopics"
                            value={form.importantTopics}
                            onChange={handleChange}
                            rows={3}
                            placeholder="List of high-weightage topics..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Study Plan

                        <textarea
                            name="studyPlan"
                            value={form.studyPlan}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Week-by-week or month-by-month study plan..."
                            className={inputClass}
                        />
                    </label>
                </div>

                {/* Resources */}
                <div className="space-y-4 border-t pt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                        Study Resources
                    </h3>

                    <label className="block space-y-1 text-sm font-medium">
                        Best Books

                        <textarea
                            name="bestBooks"
                            value={form.bestBooks}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Recommended books and study material..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Previous Year Papers

                        <textarea
                            name="previousYearPapers"
                            value={form.previousYearPapers}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Guidance on solving previous year papers..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Mock Test

                        <textarea
                            name="mockTest"
                            value={form.mockTest}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Mock test strategy and preparation..."
                            className={inputClass}
                        />
                    </label>
                </div>

                {/* Tips & Advice */}
                <div className="space-y-4 border-t pt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                        Tips & Advice
                    </h3>

                    <label className="block space-y-1 text-sm font-medium">
                        Time Management

                        <textarea
                            name="timeManagement"
                            value={form.timeManagement}
                            onChange={handleChange}
                            rows={2}
                            placeholder="How to manage time during preparation and exam..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Revision Strategy

                        <textarea
                            name="revisionStrategy"
                            value={form.revisionStrategy}
                            onChange={handleChange}
                            rows={2}
                            placeholder="How to plan and execute revision..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Last Minute Tips

                        <textarea
                            name="lastMinuteTips"
                            value={form.lastMinuteTips}
                            onChange={handleChange}
                            rows={2}
                            placeholder="What to do in the last few days before the exam..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Exam Day Tips

                        <textarea
                            name="examDayTips"
                            value={form.examDayTips}
                            onChange={handleChange}
                            rows={2}
                            placeholder="What to do on exam day..."
                            className={inputClass}
                        />
                    </label>

                    <label className="block space-y-1 text-sm font-medium">
                        Common Mistakes to Avoid

                        <textarea
                            name="commonMistakes"
                            value={form.commonMistakes}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Common mistakes students make..."
                            className={inputClass}
                        />
                    </label>
                </div>

                {/* Description */}
                <div className="border-t pt-5">
                    <label className="block space-y-1 text-sm font-medium">
                        Description

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Optional additional notes..."
                            className={inputClass}
                        />
                    </label>
                </div>

                {/* FAQs */}
                <div className="border-t pt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                        Frequently Asked Questions
                    </h3>

                    <div className="space-y-4 pt-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="space-y-3 rounded-lg border bg-gray-50 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">
                                        FAQ {index + 1}
                                    </span>

                                    {faqs.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFaq(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>

                                <label className="block space-y-1 text-sm font-medium">
                                    Question

                                    <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) =>
                                            handleFaqChange(
                                                index,
                                                "question",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter the question..."
                                        className={inputClass}
                                    />
                                </label>

                                <label className="block space-y-1 text-sm font-medium">
                                    Answer

                                    <textarea
                                        value={faq.answer}
                                        onChange={(e) =>
                                            handleFaqChange(
                                                index,
                                                "answer",
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        placeholder="Enter the answer..."
                                        className={inputClass}
                                    />
                                </label>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addFaq}
                        >
                            + Add FAQ
                        </Button>
                    </div>
                </div>

                {/* Status */}
                <div className="border-t pt-5">
                    <label className="space-y-1 text-sm font-medium">
                        Status

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">Update Preparation</Button>
                </div>
            </form>
        </div>
    );
};

export default EditExamPreparation;
