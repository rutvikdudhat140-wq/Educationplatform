import { useEffect, useState } from 'react';
import axios from "axios";
import { Button } from '@/components/ui/button';

export default function ExamSessionForm({
    initialValues,
    onSubmit,
    submitLabel,
}) {
    const [form, setForm] = useState(initialValues || {
        exam: '',
        academicYear: '',
        sessionName: '',
        description: '',
        status: 'Active',
    });
    const [exams, setExams] = useState([]);

useEffect(() => {
        axios.get(
            '/api/exam?status=Active'
        ).then((response) => {
            setExams(response.data.exams || []);
        });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            ...form,
            academicYear: Number(form.academicYear),
        });
    };

    return (
        <div className="mx-auto w-full max-w-4xl">
            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">

                    <label className="space-y-2 text-sm font-medium">
                        Exam
                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            required>
                            <option value="">Select exam</option>

                            {exams.map((exam) => (
                                <option key={exam._id} value={exam._id}>{exam.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="space-y-2 text-sm font-medium">
                        Academic Year
                        <input
                            type="number"
                            name="academicYear"
                            value={form.academicYear}
                            onChange={handleChange}
                            min="1900"
                            max="2100"
                            placeholder="2026"
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            required
                        />
                    </label>

                    <label className="space-y-2 text-sm font-medium">
                        Session Name
                        <input
                            name="sessionName"
                            value={form.sessionName}
                            onChange={handleChange}
                            placeholder="Session 1"
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            required
                        />
                    </label>

                    <label className="space-y-2 text-sm font-medium">
                        Status
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-60">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </label>
                </div>

                <label className="block space-y-2 text-sm font-medium">
                    Description
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="JEE Main January 2026 examination session"
                        rows={5}
                        className="w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                    />
                </label>

                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">{submitLabel}</Button>
                </div>
            </form>
        </div>
    );
}
