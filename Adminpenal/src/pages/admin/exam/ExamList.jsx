import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ExamList() {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);

    const loadExams = async () => {
        const response = await axios.get(
            '/api/exam'
        );

        setExams(response.data.exams);
    };

    useEffect(() => {
        loadExams();
    }, []);

    const toggleStatus = async (exam) => {
        await axios.put(
            `/api/exam/${exam._id}`,
            {
                status: exam.status === 'Active' ? 'Inactive' : 'Active'
            }
        );
        loadExams();
    };

    const deleteExam = async (id) => {
        await axios.delete(
            `/api/exam/${id}`
        );

        loadExams();
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold">Exam Management</h2>

                    <p className="text-sm text-muted-foreground">Manage entrance and competitive exams</p>
                </div>

                <Button onClick={() => navigate('/admin/exam/add')}>Add Exam</Button>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                        <tr className="border-b bg-muted/30">
                            <th className="px-4 py-3">Exam Name</th>
                            <th>Short Name</th>
                            <th>Conducting Body</th>
                            <th>Stream</th>
                            <th>Level</th>
                            <th>Exam Type</th>
                            <th>Status</th>
                            <th className="px-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {exams.map((exam) => (
                            <tr
                                key={exam._id}
                                className="border-b last:border-0">
                                <td className="px-4 py-3 font-medium">{exam.name} </td>
                                <td>{exam.shortName}</td>
                                <td>{exam.conductingBody}</td>
                                <td>{exam.stream}</td>
                                <td>{exam.level}</td>
                                <td>{exam.examType}</td>

                                <td>
                                    <Badge
                                        variant={
                                            exam.status === 'Active'
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                    >
                                        {exam.status}
                                    </Badge>
                                </td>

                                <td className="px-4">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/exam/edit/${exam._id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteExam(exam._id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
