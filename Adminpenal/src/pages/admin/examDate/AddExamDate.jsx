import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios";

const AddExamDate = () => {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [examSessions, setExamSessions] = useState([]);

    const [form, setForm] = useState({
        exam: "",
        examSession: "",
        registrationStartDate: "",
        registrationEndDate: "",
        correctionStartDate: "",
        correctionEndDate: "",
        admitCardDate: "",
        answerKeyDate: "",
        examStartDate: "",
        examEndDate: "",
        resultDate: "",
        description: "",
        status: "Active",
    });

    useEffect(() => {
        axios
            .get("/api/exam")
            .then((res) => {
                setExams(res.data.exams);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        if (name === "exam") {
            axios
                .get(`/api/exam-session?exam=${value}`)
                .then((res) => {
                    setExamSessions(res.data.examSessions || []);
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post("/api/exam-date", form)
            .then(() => {
                navigate("/admin/exam-date/list");
            });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-5">

            <div className="flex items-center gap-3">

<div>
                    <h2 className="text-2xl font-semibold">Add Exam Date</h2>
                    <p className="text-sm text-muted-foreground">Add important dates for an exam session</p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-5 shadow-sm" >

                <div className="grid gap-5 md:grid-cols-2">

                    <label className="block space-y-1 text-sm font-medium">
                        Exam
                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm">
                            <option value="">Select Exam</option>

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

                    <label className="block space-y-1 text-sm font-medium">
                        Exam Session
                        <select
                            name="examSession"
                            value={form.examSession}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        >
                            <option value="">Select Session</option>

                            {examSessions.map((session) => (
                                <option
                                    key={session._id}
                                    value={session._id}>
                                    {session.sessionName}
                                </option>
                            ))}
                        </select>
                    </label>

                </div>

<div>
                    <p className="mb-3 text-sm font-semibold">Registration Date</p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="block space-y-1 text-sm font-medium">
                            Registration Start Date

                            <input
                                type="date"
                                name="registrationStartDate"
                                value={form.registrationStartDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Registration End Date

                            <input
                                type="date"
                                name="registrationEndDate"
                                value={form.registrationEndDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold">Correction Dates</p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="block space-y-1 text-sm font-medium">
                            Correction Start Date

                            <input
                                type="date"
                                name="correctionStartDate"
                                value={form.correctionStartDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Correction End Date

                            <input
                                type="date"
                                name="correctionEndDate"
                                value={form.correctionEndDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold">Other Important Dates</p>
                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="block space-y-1 text-sm font-medium">
                            Admit Card Date
                            <input
                                type="date"
                                name="admitCardDate"
                                value={form.admitCardDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Answer Key Date
                            <input
                                type="date"
                                name="answerKeyDate"
                                value={form.answerKeyDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Exam Start Date
                            <input
                                type="date"
                                name="examStartDate"
                                value={form.examStartDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Exam End Date
                            <input
                                type="date"
                                name="examEndDate"
                                value={form.examEndDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium md:col-span-2">
                            Result Date

                            <input
                                type="date"
                                name="resultDate"
                                value={form.resultDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            />
                        </label>

                    </div>
                </div>

                <label className="block space-y-1 text-sm font-medium">
                    Description

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        rows={3}
                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                    />
                </label>

                <label className="block space-y-1 text-sm font-medium">
                    Status

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm">
                        <option value="Active">Active</option>

                        <option value="Inactive">Inactive</option>
                    </select>
                </label>

                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddExamDate;
