import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
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

useEffect(() => {
        axios.get(
            `/api/exam-session/${id}`
        ).then((response) => {
            const item = response.data.examSession;

            setSession({
                ...emptySession,
                ...item,
                exam: item.exam?._id || item.exam,
            });
        });
        axios.get(
            '/api/exam?status=Active'
        ).then((response) => {
            setExams(response.data.exams);
        });
    }, [id]);

    const updateSession = async (form) => {
        await axios.put(
            `/api/exam-session/${id}`,
            form
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
