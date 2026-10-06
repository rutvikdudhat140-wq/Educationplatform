import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const AddExamEligibility = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const [exams, setExams] = useState([]);
    const [examSessions, setExamSessions] = useState([]);

    const [form, setForm] = useState({
        exam: '',
        examSession: '',
        minimumQualification: '',
        requiredSubjects: [''],
        minimumPercentage: '',
        ageLimit: '',
        numberOfAttempts: '',
        nationality: '',
        otherRequirements: '',
        description: '',
        status: 'Active',
    });

    useEffect(() => {
        axios
            .get('http://localhost:5001/api/exam', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setExams(res.data.exams || []);
            });
    }, []);

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

            axios
                .get(
                    `http://localhost:5001/api/exam-session?exam=${value}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    setExamSessions(res.data.examSessions || []);
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
                '',
            ],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...form,
            requiredSubjects: form.requiredSubjects.filter(
                (subject) => subject.trim() !== ''
            ),
        };

        axios
            .post(
                'http://localhost:5001/api/exam-eligibility',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                navigate('/admin/exam-eligibility/list');
            });
    };
    return (
        <div className="mx-auto max-w-4xl space-y-5 pb-10">

            <div className="flex items-center gap-3">
                <Button variant="ghost"onClick={() =>navigate('/admin/exam-eligibility/list')}>Back</Button>
                <div>
                    <h2 className="text-2xl font-semibold">Add Exam Eligibility</h2>
                    <p className="text-sm text-muted-foreground">Add eligibility requirements for an exam session</p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-5 shadow-sm" >
                <div className="grid gap-5 md:grid-cols-2">

                    <label className="space-y-1 text-sm font-medium">
                        Exam
                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none">
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

                    <label className="space-y-1 text-sm font-medium">
                        Exam Session
                        <select
                            name="examSession"
                            value={form.examSession}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500">
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

                <div className="border-t pt-5">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Core Requirements</p>

                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="space-y-1 text-sm font-medium md:col-span-2">
                            Minimum Qualification{' '}

                            <input
                                type="text"
                                name="minimumQualification"
                                value={form.minimumQualification}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 12th / Higher Secondary"
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="space-y-1 text-sm font-medium">
                            Minimum Percentage

                            <input
                                type="text"
                                name="minimumPercentage"
                                value={form.minimumPercentage}
                                onChange={handleChange}
                                placeholder="e.g. 75%"
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>
                    </div>
                </div>

                <div className="border-t pt-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Required Subjects</p>
                    <div className="space-y-3">

                        {form.requiredSubjects.map(
                            (subject, index) => (
                                <div key={index}className="flex items-center gap-3">
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
                                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                    <Button type="button"variant="outline"onClick={() =>removeSubject(index)}>Remove</Button>
                                </div>
                            )
                        )}
                        <Button type="button"variant="outline"onClick={addSubject}>Add Subject</Button>
                    </div>
                </div>

                <div className="border-t pt-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Other Details</p>
                    <div className="grid gap-5 md:grid-cols-2">

                        <label className="space-y-1 text-sm font-medium">
                            Age Limit
                            <input
                                type="text"
                                name="ageLimit"
                                value={form.ageLimit}
                                onChange={handleChange}
                                placeholder="e.g. No age limit"
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </label>

                        <label className="space-y-1 text-sm font-medium">
                            Number of Attempts

                            <input
                                type="text"
                                name="numberOfAttempts"
                                value={form.numberOfAttempts}
                                onChange={handleChange}
                                placeholder="e.g. 3"
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </label>

                        <label className="space-y-1 text-sm font-medium">
                            Nationality

                            <input
                                type="text"
                                name="nationality"
                                value={form.nationality}
                                onChange={handleChange}
                                placeholder="e.g. Indian"
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </label>

                        <label className="space-y-1 text-sm font-medium">
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

                        <label className="space-y-1 text-sm font-medium md:col-span-2">
                            Other Requirements

                            <textarea
                                name="otherRequirements"
                                value={form.otherRequirements}
                                onChange={handleChange}
                                placeholder="e.g. Candidate must have passed or be appearing in Class 12."
                                rows={2}
                                className="w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                            />
                        </label>

                        <label className="space-y-1 text-sm font-medium md:col-span-2">
                            Description

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="e.g. Eligibility requirements for JEE Main 2026 Session 1."
                                rows={2}
                                className="w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm outline-none "
                            />
                        </label>

                    </div>
                </div>
                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">Save Eligibility</Button>
                </div>
            </form>
        </div>
    );
};

export default AddExamEligibility;
