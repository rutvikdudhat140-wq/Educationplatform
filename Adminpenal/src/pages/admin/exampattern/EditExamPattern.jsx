import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function EditExamPattern() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [exams, setExams] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState('');
    const token = localStorage.getItem('adminToken');

    const [formData, setFormData] = useState({
        exam: '',
        examSession: '',
        paperName: '',
        duration: '',
        totalQuestions: '',
        totalMarks: '',
        questionTypes: '',
        markingScheme: '',
        negativeMarking: '',
        description: '',
        status: 'Active',
    });


    useEffect(() => {
        axios.get('http://localhost:5001/api/exam?status=Active', {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setExams(res.data.exams || res.data.data || []);
        });

        axios.get(`http://localhost:5001/api/exam-pattern/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            const data = res.data.data;
            setFormData({
                exam: data.exam?._id || data.exam || '',
                examSession: data.examSession?._id || data.examSession || '',
                paperName: data.paperName || '',
                duration: data.duration || '',
                totalQuestions: data.totalQuestions ?? '',
                totalMarks: data.totalMarks ?? '',
                questionTypes: data.questionTypes || '',
                markingScheme: data.markingScheme || '',
                negativeMarking: data.negativeMarking || '',
                description: data.description || '',
                status: data.status || 'Active',
            });
            setSubjects(data.subjects || []);
        });
    }, [id]);

    const handleExamChange = (e) => {
        const examId = e.target.value;
        setFormData({ ...formData, exam: examId, examSession: '' });

        if (examId) {
            axios.get(`http://localhost:5001/api/exam-session?exam=${examId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                setSessions(res.data.examSessions || res.data.data || []);
            }).catch(() => {
                setSessions([]);
            });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addSubject = () => {
        if (newSubject.trim()) {
            setSubjects([...subjects, newSubject.trim()]);
            setNewSubject('');
        }
    };

    const removeSubject = (index) => {
        setSubjects(subjects.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                subjects,
                totalQuestions: formData.totalQuestions !== '' ? Number(formData.totalQuestions) : 0,
                totalMarks: formData.totalMarks !== '' ? Number(formData.totalMarks) : 0,
            };
            await axios.put(
                `http://localhost:5001/api/exam-pattern/${id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/admin/exam-pattern/list');
        } catch (error) {

        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/exam-pattern/list">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Edit Exam Pattern</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg border shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Exam</label>
                        <select
                            required
                            name="exam"
                            value={formData.exam}
                            onChange={handleExamChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select Exam</option>
                            {exams.map((exam) => (
                                <option key={exam._id} value={exam._id}>{exam.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Session</label>
                        <select
                            required
                            name="examSession"
                            value={formData.examSession}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select Session</option>
                            {sessions.map((session) => (
                                <option key={session._id} value={session._id}>
                                    {session.academicYear ? `${session.academicYear} - ${session.sessionName}` : session.sessionName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Paper Name</label>
                        <input
                            required
                            name="paperName"
                            value={formData.paperName}
                            onChange={handleChange}
                            placeholder="e.g. Paper 1"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Duration</label>
                        <input
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g. 180 Minutes"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Total Questions</label>
                        <input
                            type="number"
                            name="totalQuestions"
                            value={formData.totalQuestions}
                            onChange={handleChange}
                            placeholder="e.g. 75"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Total Marks</label>
                        <input
                            type="number"
                            name="totalMarks"
                            value={formData.totalMarks}
                            onChange={handleChange}
                            placeholder="e.g. 300"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Question Types</label>
                        <input
                            name="questionTypes"
                            value={formData.questionTypes}
                            onChange={handleChange}
                            placeholder="e.g. MCQ + Numerical"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Marking Scheme</label>
                        <input
                            name="markingScheme"
                            value={formData.markingScheme}
                            onChange={handleChange}
                            placeholder="e.g. +4"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Negative Marking</label>
                        <input
                            name="negativeMarking"
                            value={formData.negativeMarking}
                            onChange={handleChange}
                            placeholder="e.g. -1"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>


                    <div className="space-y-2">
                        <lable className="text-sm font-medium">Status</lable>
                        <select name='status' value={formData.status} onChange={handleChange} className='flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm'>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option></option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Subjects</label>
                    <div className="flex gap-2">
                        <input
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Enter subject name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }}
                        />
                        <Button type="button" variant="outline" onClick={addSubject}>
                            <Plus className="size-4" />
                            Add
                        </Button>
                    </div>
                    {subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject, index) => (
                                <span key={index} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                                    {subject}
                                    <button type="button" onClick={() => removeSubject(index)} className="ml-1 text-muted-foreground hover:text-foreground">
                                        <Trash2 className="size-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter exam pattern description"
                        rows={4}
                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                    />
                </div>

                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">
                        Update
                    </Button>
                </div>
            </form>
        </div>
    );
}
