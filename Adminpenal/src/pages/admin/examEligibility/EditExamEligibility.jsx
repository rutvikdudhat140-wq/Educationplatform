import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const EditExamEligibility = () => {
    const { id } = useParams();
    const navigate = useNavigate();

const [exams, setExams] = useState([]);
    const [examSessions, setExamSessions] = useState([]);

    const [form, setForm] = useState({
        exam: "",
        examSession: "",
        minimumQualification: "",
        requiredSubjects: [""],
        minimumPercentage: "",
        ageLimit: "",
        numberOfAttempts: "",
        nationality: "",
        otherRequirements: "",
        description: "",
        status: "Active",
    });

    // Get Exams
    useEffect(() => {
        axios.get("/api/exam").then((res) => {
            setExams(res.data.exams);
        });
    }, []);

    // Get Eligibility
    useEffect(() => {
        axios.get(`/api/exam-eligibility/${id}`).then((res) => {
            const data = res.data.examEligibility;

            setForm({
                exam: data.exam?._id || "",
                examSession: data.examSession?._id || "",
                minimumQualification: data.minimumQualification || "",
                requiredSubjects:
                    data.requiredSubjects?.length > 0
                        ? data.requiredSubjects
                        : [""],
                minimumPercentage: data.minimumPercentage || "",
                ageLimit: data.ageLimit || "",
                numberOfAttempts: data.numberOfAttempts || "",
                nationality: data.nationality || "",
                otherRequirements: data.otherRequirements || "",
                description: data.description || "",
                status: data.status || "Active",
            });
        });
    }, [id]);

    // Get Sessions
    useEffect(() => {
        if (form.exam) {
            axios.get(
                `/api/exam-session?exam=${form.exam}`
            ).then((res) => {
                setExamSessions(res.data.examSessions);
            });
        }
    }, [form.exam]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        if (name === "exam") {
            setForm({
                ...form,
                exam: value,
                examSession: "",
            });
        }
    };

    const handleSubjectChange = (index, value) => {
        const subjects = [...form.requiredSubjects];

        subjects[index] = value;

        setForm({
            ...form,
            requiredSubjects: subjects,
        });
    };

    const addSubject = () => {
        setForm({
            ...form,
            requiredSubjects: [
                ...form.requiredSubjects,
                "",
            ],
        });
    };

    const removeSubject = (index) => {
        const subjects = form.requiredSubjects.filter(
            (_, i) => i !== index
        );

        if (subjects.length === 0) {
            subjects.push("");
        }

        setForm({
            ...form,
            requiredSubjects: subjects,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            requiredSubjects: form.requiredSubjects.filter(
                (subject) => subject.trim() !== ""
            ),
        };

        axios.put(
            `/api/exam-eligibility/${id}`,
            payload
        ).then(() => {
            navigate("/admin/exam-eligibility/list");
        });
    };

    const inputClass =
        "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500";

    const labelClass =
        "block space-y-1 text-sm font-medium";

    return (
        <div className="mx-auto max-w-4xl space-y-5 pb-10">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        navigate("/admin/exam-eligibility/list")
                    }
                >
                    <ArrowLeft />
                </Button>

                <div>
                    <h2 className="text-2xl font-semibold">
                        Edit Exam Eligibility
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Modify eligibility requirements for an exam session
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-5 shadow-sm"
            >

                {/* Exam */}
                <div className="grid gap-5 md:grid-cols-2">

                    <label className={labelClass}>
                        Exam <span className="text-red-500">*</span>

                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
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

                    <label className={labelClass}>
                        Exam Session <span className="text-red-500">*</span>

                        <select
                            name="examSession"
                            value={form.examSession}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">
                                Select Session
                            </option>

                            {examSessions.map((session) => (
                                <option
                                    key={session._id}
                                    value={session._id}
                                >
                                    {session.sessionName}
                                </option>
                            ))}
                        </select>
                    </label>

                </div>

                {/* Core Requirements */}
                <div className="border-t pt-5">

                    <p className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Core Requirements
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label
                            className={`md:col-span-2 ${labelClass}`}
                        >
                            Minimum Qualification
                            <span className="text-red-500">*</span>

                            <input
                                type="text"
                                name="minimumQualification"
                                value={form.minimumQualification}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 12th / Higher Secondary"
                                className={inputClass}
                            />
                        </label>

                        <label className={labelClass}>
                            Minimum Percentage

                            <input
                                type="text"
                                name="minimumPercentage"
                                value={form.minimumPercentage}
                                onChange={handleChange}
                                placeholder="e.g. 75%"
                                className={inputClass}
                            />
                        </label>

                    </div>
                </div>

                {/* Required Subjects */}
                <div className="border-t pt-5">

                    <p className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Required Subjects
                    </p>

                    <div className="space-y-3">

                        {form.requiredSubjects.map(
                            (subject, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) =>
                                            handleSubjectChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Physics"
                                        className={inputClass}
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 text-red-500"
                                        onClick={() =>
                                            removeSubject(index)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addSubject}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subject
                        </Button>

                    </div>
                </div>

                {/* Other Details */}
                <div className="border-t pt-5">

                    <p className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Other Details
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label className={labelClass}>
                            Age Limit

                            <input
                                type="text"
                                name="ageLimit"
                                value={form.ageLimit}
                                onChange={handleChange}
                                placeholder="e.g. No age limit"
                                className={inputClass}
                            />
                        </label>

                        <label className={labelClass}>
                            Number of Attempts

                            <input
                                type="text"
                                name="numberOfAttempts"
                                value={form.numberOfAttempts}
                                onChange={handleChange}
                                placeholder="e.g. 3"
                                className={inputClass}
                            />
                        </label>

                        <label className={labelClass}>
                            Nationality

                            <input
                                type="text"
                                name="nationality"
                                value={form.nationality}
                                onChange={handleChange}
                                placeholder="e.g. Indian"
                                className={inputClass}
                            />
                        </label>

                        <label className={labelClass}>
                            Status

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>
                        </label>

                        <label
                            className={`md:col-span-2 ${labelClass}`}
                        >
                            Other Requirements

                            <textarea
                                name="otherRequirements"
                                value={form.otherRequirements}
                                onChange={handleChange}
                                placeholder="e.g. Candidate must have passed or be appearing in Class 12."
                                rows={2}
                                className={`${inputClass} resize-y`}
                            />
                        </label>

                        <label
                            className={`md:col-span-2 ${labelClass}`}
                        >
                            Description

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="e.g. Eligibility requirements for JEE Main 2026 Session 1."
                                rows={2}
                                className={`${inputClass} resize-y`}
                            />
                        </label>

                    </div>
                </div>

<div className="flex justify-end border-t pt-5">

                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Update Eligibility
                    </Button>

                </div>

            </form>
        </div>
    );
};

export default EditExamEligibility;
