import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button } from '@/components/ui/button';
import ExamForm from './ExamForm';

const initialValues = {
    name: '',
    shortName: '',
    conductingBody: '',
    stream: '',
    level: '',
    examType: '',
    description: '',
    status: 'Active'
};

export default function AddExam() {
    const navigate = useNavigate();

    const saveExam = async (form) => {

        await axios.post(
            '/api/exam',
            form
        );

        navigate('/admin/exam/list');
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/exam/list')}>
                </Button>

                <div>
                    <h2 className="text-2xl font-semibold">Add Exam</h2>
                    <p className="text-sm text-muted-foreground">Create an entrance or competitive exam.</p>
                </div>
            </div>

            <ExamForm initialValues={initialValues}onSubmit={saveExam}submitLabel="Add Exam"/>
        </div>
    );
}

