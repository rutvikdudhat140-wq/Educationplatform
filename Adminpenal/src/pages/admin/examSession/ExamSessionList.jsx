import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ExamSessionList() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const token = localStorage.getItem('adminToken');

    const loadSessions = async () => {
        const response = await axios.get(
            'http://localhost:5001/api/exam-session',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setSessions(response.data.examSessions || []);
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const deleteSession = async (id) => {
        await axios.delete(
            `http://localhost:5001/api/exam-session/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        loadSessions();
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold">Exam Sessions</h2>
                    <p className="text-sm text-muted-foreground">Manage yearly exam sessions</p>
                </div>
                <Button onClick={() => navigate('/admin/exam-session/add')}>Add Exam Session</Button>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <table className="w-full min-w-200 text-left text-sm">
                    <thead>
                        <tr className="border-b bg-muted/30">
                            <th className="px-4 py-3">Exam</th>
                            <th>Academic Year</th>
                            <th>Session</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th className="px-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sessions.map((item) => (
                            <tr
                                key={item._id}
                                className="border-b last:border-0">
                                <td className="px-4 py-3 font-medium">
                                    {item.exam?.name || item.exam?.shortName}
                                </td>
                                <td>{item.academicYear}</td>
                                <td>{item.sessionName}</td>
                                <td className="max-w-xs truncate">{item.description}</td>
                                <td>
                                    <Badge
                                        variant={
                                            item.status === 'Active'
                                                ? 'secondary'
                                                : 'outline'}>
                                        {item.status}
                                    </Badge>
                                </td>
                                <td className="px-4">
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => navigate(`/admin/exam-session/edit/${item._id}`)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => deleteSession(item._id)}>Delete</Button>
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
