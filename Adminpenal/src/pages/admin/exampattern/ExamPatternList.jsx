import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ExamPatternList() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const token = localStorage.getItem('adminToken');

    const fetchData = async () => {

        try {
            const res = await axios.get('http://localhost:5001/api/exam-pattern', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data.data || []);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {

        try {
            await axios.delete(`http://localhost:5001/api/exam-pattern/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (error) {
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            await axios.put(
                `http://localhost:5001/api/exam-pattern/${item._id}`,
                {
                    status: item.status === 'Active' ? 'Inactive' : 'Active',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            fetchData();
        } catch (error) {
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold">Exam Pattern</h2>
                    <p className="text-sm text-muted-foreground">Manage exam patterns</p>
                </div>
                <Button onClick={() => navigate('/admin/exam-pattern/add')}>Add Exam Pattern</Button>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">

                <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead>
                        <tr className="border-b bg-muted/30">
                            <th className="px-4 py-3">Paper Name</th>
                            <th>Exam</th>
                            <th>Exam Session</th>
                            <th>Duration</th>
                            <th>Total Questions</th>
                            <th>Total Marks</th>
                            <th>Question Types</th>
                            <th>Negative Marking</th>
                            <th>Status</th>
                            <th className="px-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item._id}
                                className="border-b last:border-0">

                                <td className="px-4 py-3 font-medium">{item.paperName}</td>
                                <td>{item.exam?.name}</td>
                                <td>
                                    {item.examSession?.academicYear &&
                                        item.examSession?.sessionName
                                        ? `${item.examSession.academicYear} - ${item.examSession.sessionName}`
                                        : item.examSession?.sessionName ||
                                        item.examSession?.academicYear}
                                </td>
                                <td>{item.duration}</td>
                                <td>{item.totalQuestions ?? ''}</td>
                                <td>{item.totalMarks ?? ''}</td>
                                <td>{item.questionTypes}</td>
                                <td>{item.negativeMarking}</td>
                                <td><Badge variant={item.status === 'Active' ? 'secondary' : 'outline'}>{item.status}</Badge></td>

                                <td className="px-4">
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/exam-pattern/edit/${item._id}`)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>Delete</Button>
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
