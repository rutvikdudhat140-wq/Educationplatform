import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import ExamSessionForm from './ExamSessionForm';

const emptySession = {
    exam: '',
    academicYear: '',
    sessionName: '',
    description: '',
    status: 'Active',
};

export default function EditExamSession() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [exams, setExams] = useState([]);

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        axios.get(
            `http://localhost:5001/api/exam-session/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((response) => {
            const item = response.data.examSession;

            setSession({
                ...emptySession,
                ...item,
                exam: item.exam?._id || item.exam,
            });
        });
        axios.get(
            'http://localhost:5001/api/exam?status=Active',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((response) => {
            setExams(response.data.exams);
        });
    }, [id]);

    const updateSession = async (form) => {
        await axios.put(
            `http://localhost:5001/api/exam-session/${id}`,
            form,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        navigate('/admin/exam-session/list');
    };
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Button variant="ghost"size="icon"title="Back to Exam Sessions"onClick={() => navigate('/admin/exam-session/list')}></Button>
                <h2 className="text-2xl font-semibold">Edit Exam Session</h2>
            </div>

            <ExamSessionForm initialValues={session}exams={exams}onSubmit={updateSession}submitLabel="Save Changes"/>
        </div>
    );
}
