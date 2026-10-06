import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AddExamPreparation = () => {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [examSessions, setExamSessions] = useState([]);

    const [faqs, setFaqs] = useState([
        {
            question: "",
            answer: "",
        },
    ]);

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
            .get("/api/exam?status=Active")
            .then((res) => {
                setExams(res.data.exams || []);
            });
    }, []);

    const handleExamChange = (e) => {
        const examId = e.target.value;

        setForm({
            ...form,
            exam: examId,
            examSession: "",
        });

        setExamSessions([]);

        if (!examId) return;

        axios
            .get(
                `/api/exam-session?exam=${examId}&status=Active`
            )
            .then((res) => {
                setExamSessions(res.data.examSessions || []);
            });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleFaqChange = (index, field, value) => {
        const updatedFaqs = [...faqs];

        updatedFaqs[index][field] = value;

        setFaqs(updatedFaqs);
    };

    const addFaq = () => {
        setFaqs([
            ...faqs,
            {
                question: "",
                answer: "",
            },
        ]);
    };

    const removeFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(
                "/api/exam-preparation",
                {
                    ...form,
                    faqs,
                }
            )
            .then(() => {
                navigate("/admin/exam-preparation/list");
            });
    };

   const inputClass =
    "w-full rounded-md border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600";

  const textareaClass =
    "w-full resize-none rounded-md border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600";

    return (
        <div className="min-h-screen bg-surface px-3 py-5">
            <div className="mx-auto">

                {/* Header */}
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-ink">
                        Add Exam Preparation
                    </h2>

                    <p className="mt-1 text-sm text-ink-muted">
                        Add preparation information for a specific exam session.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-line bg-white p-5 shadow-sm"
                >

                    {/* Exam & Session */}
                    <div className="grid gap-4 border-b border-line pb-5 md:grid-cols-2">

                        <label className="space-y-1.5 text-sm font-medium text-ink">
                            Exam *

                            <select
                                name="exam"
                                value={form.exam}
                                onChange={handleExamChange}
                                required
                                className={inputClass}
                            >
                                <option value="">
                                    Select Exam
                                </option>

                                {exams.map((exam) => (
                                    <option
                                        key={exam._id}
                                        value={exam._id}
                                    >
                                        {exam.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-1.5 text-sm font-medium text-ink">
                            Exam Session *

                            <select
                                name="examSession"
                                value={form.examSession}
                                onChange={handleChange}
                                required
                                disabled={!form.exam}
                                className={`${inputClass} ${
                                    !form.exam
                                        ? "cursor-not-allowed bg-surface"
                                        : ""
                                }`}
                            >
                                <option value="">
                                    Select Session
                                </option>

                                {examSessions.map((session) => (
                                    <option
                                        key={session._id}
                                        value={session._id}
                                    >
                                        {session.academicYear
                                            ? `${session.academicYear} - ${session.sessionName}`
                                            : session.sessionName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Title */}
                    <div className="border-b border-line py-5">
                        <label className="space-y-1.5 text-sm font-medium text-ink">
                            Preparation Title *

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Example: JEE Main 2026 Preparation Guide"
                                className={inputClass}
                            />
                        </label>
                    </div>

                    {/* Overview */}
                    <div className="border-b border-line py-5">
                        <h3 className="mb-4 text-sm font-semibold text-ink">
                            Overview & Strategy
                        </h3>

                        <div className="space-y-4">

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Overview

                                <textarea
                                    name="overview"
                                    value={form.overview}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Explain the exam and overall preparation approach."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Preparation Strategy

                                <textarea
                                    name="preparationStrategy"
                                    value={form.preparationStrategy}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Explain how students should prepare for this exam."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Subject-wise Preparation

                                <textarea
                                    name="subjectWisePreparation"
                                    value={form.subjectWisePreparation}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Physics: ...&#10;Chemistry: ...&#10;Mathematics: ..."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Important Topics

                                <textarea
                                    name="importantTopics"
                                    value={form.importantTopics}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter important and high-weightage topics."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Study Plan

                                <textarea
                                    name="studyPlan"
                                    value={form.studyPlan}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Create a realistic weekly or monthly preparation plan."
                                    className={textareaClass}
                                />
                            </label>

                        </div>
                    </div>

                    {/* Resources */}
                    <div className="border-b border-line py-5">
                        <h3 className="mb-4 text-sm font-semibold text-ink">
                            Study Resources
                        </h3>

                        <div className="space-y-4">

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Best Books

                                <textarea
                                    name="bestBooks"
                                    value={form.bestBooks}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Book name - Author&#10;Book name - Author"
                                    className={textareaClass}
                                />
                            </label>

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Previous Year Papers

                                <textarea
                                    name="previousYearPapers"
                                    value={form.previousYearPapers}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Explain how students should use previous year papers."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="block space-y-1.5 text-sm font-medium text-ink">
                                Mock Test

                                <textarea
                                    name="mockTest"
                                    value={form.mockTest}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Explain mock test frequency and analysis."
                                    className={textareaClass}
                                />
                            </label>

                        </div>
                    </div>

                    {/* Tips */}
                    <div className="border-b border-line py-5">
                        <h3 className="mb-4 text-sm font-semibold text-ink">
                            Tips & Advice
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">

                            <label className="space-y-1.5 text-sm font-medium text-ink">
                                Time Management

                                <textarea
                                    name="timeManagement"
                                    value={form.timeManagement}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="How to manage study and exam time."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="space-y-1.5 text-sm font-medium text-ink">
                                Revision Strategy

                                <textarea
                                    name="revisionStrategy"
                                    value={form.revisionStrategy}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Explain revision strategy."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="space-y-1.5 text-sm font-medium text-ink">
                                Last Minute Tips

                                <textarea
                                    name="lastMinuteTips"
                                    value={form.lastMinuteTips}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Important things to do before the exam."
                                    className={textareaClass}
                                />
                            </label>

                            <label className="space-y-1.5 text-sm font-medium text-ink">
                                Exam Day Tips

                                <textarea
                                    name="examDayTips"
                                    value={form.examDayTips}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Important exam-day instructions."
                                    className={textareaClass}
                                />
                            </label>

                        </div>

                        <label className="mt-4 block space-y-1.5 text-sm font-medium text-ink">
                            Common Mistakes

                            <textarea
                                name="commonMistakes"
                                value={form.commonMistakes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Mention common mistakes students should avoid."
                                className={textareaClass}
                            />
                        </label>
                    </div>

                    {/* FAQs */}
                    <div className="border-b border-line py-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-ink">
                                Frequently Asked Questions
                            </h3>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFaq}
                            >
                                + Add FAQ
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-line bg-surface p-3"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-ink-muted">
                                            FAQ {index + 1}
                                        </span>

                                        {faqs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFaq(index)
                                                }
                                                className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
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
                                            placeholder="Question"
                                            className={inputClass}
                                        />

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
                                            placeholder="Answer"
                                            className={textareaClass}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status & Description */}
                    <div className="grid gap-4 py-5 md:grid-cols-2">

                        <label className="space-y-1.5 text-sm font-medium text-ink">
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

                        <label className="space-y-1.5 text-sm font-medium text-ink md:col-span-2">
                            Description

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Additional information about this preparation guide."
                                className={textareaClass}
                            />
                        </label>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t border-line pt-5">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate("/admin/exam-preparation/list")
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="bg-teal-700 hover:bg-teal-800"
                        >
                            Save Preparation
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddExamPreparation;

