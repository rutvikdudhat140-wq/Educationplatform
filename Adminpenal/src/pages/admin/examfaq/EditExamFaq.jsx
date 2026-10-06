
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditExamFaq() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [exams, setExams] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [formData, setFormData] = useState({
        exam: '',
        examSession: '',
        title: '',
        description: '',
        fileUrl: '',
        status: 'Active'
    });

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        axios.get('http://localhost:5001/api/exam')
            .then((res) => {
                setExams(res.data.exams || res.data.data || []);
            });

        axios.get('http://localhost:5001/api/exam-session', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setSessions(res.data.examSessions || res.data.data || []);
        });

        axios.get(`http://localhost:5001/api/exam-faq/${id}`)
            .then((res) => {
                const data = res.data.data;

                setFormData({
                    exam: data.exam?._id || data.exam || '',
                    examSession: data.examSession?._id || data.examSession || '',
                    title: data.title || '',
                    description: data.description || '',
                    fileUrl: data.fileUrl || '',
                    status: data.status || 'Active'
                });
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleExamChange = (e) => {
        setFormData({
            ...formData,
            exam: e.target.value,
            examSession: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.put(
            `http://localhost:5001/api/exam-faq/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        navigate('/admin/exam-faq/list');
    };

    const filteredSessions = sessions.filter((session) => {
        const sessionExam = session.exam?._id || session.exam;

        return sessionExam === formData.exam;
    });

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/exam-faq/list">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>

                <h1 className="text-2xl font-bold tracking-tight">
                    Edit Exam FAQ
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-lg border shadow-sm"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Select Exam
                        </label>

                        <select
                            required
                            name="exam"
                            value={formData.exam}
                            onChange={handleExamChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select Exam</option>

                            {exams.map((exam) => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Select Session
                        </label>

                        <select
                            required
                            name="examSession"
                            value={formData.examSession}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select Session</option>

                            {filteredSessions.map((session) => (
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
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Title
                    </label>

                    <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. JEE Main Syllabus"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Description / Content
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter detailed content..."
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            File/Link URL (Optional)
                        </label>

                        <input
                            type="text"
                            name="fileUrl"
                            value={formData.fileUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700"
                    >
                        Update Exam FAQ
                    </Button>
                </div>
            </form>
        </div>
    );
}

