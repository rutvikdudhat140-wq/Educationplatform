import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

const EditExamDate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
    const [exams, setExams] = useState([]);
    const [examSessions, setExamSessions] = useState([]);

    const [form, setForm] = useState({
        exam: '',
        examSession: '',
        registrationStartDate: '',
        registrationEndDate: '',
        correctionStartDate: '',
        correctionEndDate: '',
        admitCardDate: '',
        examStartDate: '',
        examEndDate: '',
        answerKeyDate: '',
        resultDate: '',
        description: '',
        status: 'Active',
    });

    const toInputDate = (date) => {
        return date ? date.slice(0, 10) : '';
    };

    useEffect(() => {
        axios
            .get('http://localhost:5001/api/exam', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setExams(res.data.exams);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:5001/api/exam-date/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const data = res.data.examDate;

                setForm({
                    exam: data.exam?._id || '',
                    examSession: data.examSession?._id || '',
                    registrationStartDate: toInputDate(data.registrationStartDate),
                    registrationEndDate: toInputDate(data.registrationEndDate),
                    correctionStartDate: toInputDate(data.correctionStartDate),
                    correctionEndDate: toInputDate(data.correctionEndDate),
                    admitCardDate: toInputDate(data.admitCardDate),
                    examStartDate: toInputDate(data.examStartDate),
                    examEndDate: toInputDate(data.examEndDate),
                    answerKeyDate: toInputDate(data.answerKeyDate),
                    resultDate: toInputDate(data.resultDate),
                    description: data.description || '',
                    status: data.status || 'Active',
                });
            });
    }, [id]);

    // Get Sessions when Exam changes
    useEffect(() => {
        if (form.exam) {
            axios
                .get(
                    `http://localhost:5001/api/exam-session?exam=${form.exam}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
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

        if (name === 'exam') {
            setForm({
                ...form,
                exam: value,
                examSession: '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            registrationStartDate: form.registrationStartDate || null,
            registrationEndDate: form.registrationEndDate || null,
            correctionStartDate: form.correctionStartDate || null,
            correctionEndDate: form.correctionEndDate || null,
            admitCardDate: form.admitCardDate || null,
            examStartDate: form.examStartDate || null,
            examEndDate: form.examEndDate || null,
            answerKeyDate: form.answerKeyDate || null,
            resultDate: form.resultDate || null,
        };

        await axios.put(
            `http://localhost:5001/api/exam-date/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        navigate('/admin/exam-date/list');
    };
    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/exam-date/list')}>
                </Button>
                <div>
                    <h2 className="text-2xl font-semibold">Edit Exam Dates</h2>
                    <p className="text-sm text-muted-foreground">Update important dates for the exam session</p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">

                <div className="grid gap-5 md:grid-cols-2">

                    <label className="block space-y-1 text-sm font-medium">
                        Exam
                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                        >
                            <option value="">Select Exam</option>

                            {exams.map((exam) => (
                                <option key={exam._id} value={exam._id}>
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
                            disabled={!form.exam}
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                >
                            <option value="">Select Session</option>

                            {examSessions.map((session) => (
                                <option key={session._id} value={session._id}>
                                    {session.sessionName}
                                </option>
                            ))}
                        </select>
                    </label>

                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Registration Dates</p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="block space-y-1 text-sm font-medium">
                            Registration Start Date
                            <input
                                type="date"
                                name="registrationStartDate"
                                value={form.registrationStartDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Registration End Date
                            <input
                                type="date"
                                name="registrationEndDate"
                                value={form.registrationEndDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Correction Dates</p>

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block space-y-1 text-sm font-medium">
                            Correction Start Date
                            <input
                                type="date"
                                name="correctionStartDate"
                                value={form.correctionStartDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">Correction End Date
                            <input
                                type="date"
                                name="correctionEndDate"
                                value={form.correctionEndDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Other Important Dates</p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="block space-y-1 text-sm font-medium">
                            Admit Card Date
                            <input
                                type="date"
                                name="admitCardDate"
                                value={form.admitCardDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Answer Key Date
                            <input
                                type="date"
                                name="answerKeyDate"
                                value={form.answerKeyDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Exam Start Date
                            <input
                                type="date"
                                name="examStartDate"
                                value={form.examStartDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium">
                            Exam End Date
                            <input
                                type="date"
                                name="examEndDate"
                                value={form.examEndDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="block space-y-1 text-sm font-medium md:col-span-2">
                            Result Date
                            <input
                                type="date"
                                name="resultDate"
                                value={form.resultDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
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
                        rows={3}
                        className="w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                    />
                </label>

                <label className="block space-y-1 text-sm font-medium">
                    Status
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </label>

                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">Update</Button>
                </div>
            </form>
        </div>
    );
};

export default EditExamDate;
