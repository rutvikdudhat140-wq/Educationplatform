import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const ExamPreparationList = () => {
    const [preparations, setPreparations] = useState([]);

const fetchPreparations = () => {
        axios
            .get('/api/exam-preparation')
            .then((res) => {
                setPreparations(res.data.examPreparations || []);
            });
    };

    useEffect(() => {
        fetchPreparations();
    }, []);

    const toggleStatus = (item) => {
        const status = item.status === 'Active' ? 'Inactive' : 'Active';
        axios
            .put(
                `/api/exam-preparation/${item._id}`,
                { status }
            )
            .then(() => fetchPreparations());
    };

    const deletePreparation = (id) => {
        axios
            .delete(`/api/exam-preparation/${id}`)
            .then(() => fetchPreparations());
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Exam Preparation</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage preparation content for exam sessions
                    </p>
                </div>
                <Button asChild>
                    <Link to="/admin/exam-preparation/add">Add Preparation</Link>
                </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Exam</TableHead>
                            <TableHead>Session</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {preparations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center">
                                    <p className="text-gray-500">No preparation records found.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            preparations.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.exam?.name}</TableCell>
                                    <TableCell>{item.examSession?.sessionName}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                item.status === 'Active'
                                                    ? 'bg-green-50 text-brand'
                                                    : 'bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleStatus(item)}
                                            >
                                                {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/admin/exam-preparation/edit/${item._id}`}>
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deletePreparation(item._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ExamPreparationList;
