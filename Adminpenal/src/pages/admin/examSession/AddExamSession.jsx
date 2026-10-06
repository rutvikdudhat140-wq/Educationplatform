import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { Button } from '@/components/ui/button';
import ExamSessionForm from './ExamSessionForm';

const initialValues = {
    exam: '',
    academicYear: new Date().getFullYear(),
    sessionName: '',
    description: '',
    status: 'Active',
};

export default function AddExamSession() {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);

useEffect(() => {
        axios.get(
            '/api/exam?status=Active'
        ).then((response) => {
            setExams(response.data.exams);
        });
    }, []);

    const saveSession = async (form) => {
        await axios.post(
            '/api/exam-session',
            form
        );

        navigate('/admin/exam-session/list');
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Button variant="ghost"size="icon"title="Back to Exam Sessions"onClick={() => navigate('/admin/exam-session/list')}></Button>
                <div>
                    <h2 className='text-2xl font-semibold'>Add exam session</h2>
                    <p className='text-sm text-muted-foreground'>Add yearly session information to an exam</p>
                </div>
            </div>
            <ExamSessionForm initialValues={initialValues}exams={exams}onSubmit={saveSession}submitLabel="Add Exam Session"/>
        </div>
    );
}
