
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AddExamPreparation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

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
            .get("http://localhost:5001/api/exam?status=Active", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
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
                `http://localhost:5001/api/exam-session?exam=${examId}&status=Active`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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
                "http://localhost:5001/api/exam-preparation",
                {
                    ...form,
                    faqs,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                navigate("/admin/exam-preparation/list");
            });
    };

   const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600";

  const textareaClass =
    "w-full resize-none rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600";

    return (
        <div className="min-h-screen bg-slate-50 px-3 py-5">
            <div className="mx-auto">

                {/* Header */}
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Add Exam Preparation
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Add preparation information for a specific exam session.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                    {/* Exam & Session */}
                    <div className="grid gap-4 border-b border-slate-100 pb-5 md:grid-cols-2">

                        <label className="space-y-1.5 text-sm font-medium text-slate-700">
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

                        <label className="space-y-1.5 text-sm font-medium text-slate-700">
                            Exam Session *

                            <select
                                name="examSession"
                                value={form.examSession}
                                onChange={handleChange}
                                required
                                disabled={!form.exam}
                                className={`${inputClass} ${
                                    !form.exam
                                        ? "cursor-not-allowed bg-slate-50"
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
                    <div className="border-b border-slate-100 py-5">
                        <label className="space-y-1.5 text-sm font-medium text-slate-700">
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
                    <div className="border-b border-slate-100 py-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-900">
                            Overview & Strategy
                        </h3>

                        <div className="space-y-4">

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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
                    <div className="border-b border-slate-100 py-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-900">
                            Study Resources
                        </h3>

                        <div className="space-y-4">

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
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
                    <div className="border-b border-slate-100 py-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-900">
                            Tips & Advice
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">

                            <label className="space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="space-y-1.5 text-sm font-medium text-slate-700">
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

                            <label className="space-y-1.5 text-sm font-medium text-slate-700">
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

                        <label className="mt-4 block space-y-1.5 text-sm font-medium text-slate-700">
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
                    <div className="border-b border-slate-100 py-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">
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
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">
                                            FAQ {index + 1}
                                        </span>

                                        {faqs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFaq(index)
                                                }
                                                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
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

                        <label className="space-y-1.5 text-sm font-medium text-slate-700">
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

                        <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">
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
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

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

