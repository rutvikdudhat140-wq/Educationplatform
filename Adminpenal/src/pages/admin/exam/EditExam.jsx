import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

import { Button } from '@/components/ui/button';
import ExamForm from './ExamForm';

const emptyExam = {
    name: '',
    shortName: '',
    conductingBody: '',
    stream: '',
    level: '',
    examType: '',
    description: '',
    syllabus: '',
    examPattern: '',
    questionPaper: '',
    otherInformation: '',
    status: 'Active'
};

export default function EditExam() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [exam, setExam] = useState(null);

    useEffect(() => {
        axios.get(`/api/exam/${id}`).then((response) => {
            setExam(response.data.exam);
        });
    }, [id]);

    const updateExam = async (form) => {
        await axios.put(`/api/exam/${id}`, form);

        navigate('/admin/exam/list');
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" title="Back to Exams" onClick={() => navigate('/admin/exam/list')}></Button>
                <h2 className="text-2xl font-semibold">Edit Exam</h2>
            </div>
            <ExamForm initialValues={{ ...emptyExam, ...exam }} onSubmit={updateExam} submitLabel="Save Changes" />
        </div>
    );
}
