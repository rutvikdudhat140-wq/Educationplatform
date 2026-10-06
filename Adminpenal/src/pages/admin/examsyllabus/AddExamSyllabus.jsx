import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddExamSyllabus() {
    const navigate = useNavigate();
    
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
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        axios.get('http://localhost:5001/api/exam').then(res => setExams(res.data.exams || res.data.data || []));
        axios.get('http://localhost:5001/api/exam-session', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setSessions(res.data.examSessions || res.data.data || []));
        
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (false) {
                await axios.put(`http://localhost:5001/api/exam-syllabus/${id}`, formData);
                toast.success('Updated successfully');
            } else {
                await axios.post(`http://localhost:5001/api/exam-syllabus`, formData);
                toast.success('Added successfully');
            }
            navigate(`/admin/exam-syllabus/list`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter(s => s.exam?._id === formData.exam || s.exam === formData.exam);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to={`/admin/exam-syllabus/list`}>
                    <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Add ExamSyllabus</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Exam</label>
                        <select required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={formData.exam} onChange={e => setFormData({...formData, exam: e.target.value, examSession: ''})}>
                            <option value="">Select Exam</option>
                            {exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Session</label>
                        <select required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={formData.examSession} onChange={e => setFormData({...formData, examSession: e.target.value})}>
                            <option value="">Select Session</option>
                            {filteredSessions.map(s => <option key={s._id} value={s._id}>{s.sessionName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Syllabus 2024" />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Description / Content</label>
                    <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter detailed content..." />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">File/Link URL (Optional)</label>
                        <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                        {loading ? 'Saving...' : 'Save ExamSyllabus'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
