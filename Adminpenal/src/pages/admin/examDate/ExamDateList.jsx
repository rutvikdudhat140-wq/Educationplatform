import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ExamDateList = () => {
    const [examDates, setExamDates] = useState([]);
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        fetchExamDates();
    }, []);

    const fetchExamDates = async () => {
        const res = await axios.get(
            'http://localhost:5001/api/exam-date',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.data.success) {
            setExamDates(res.data.examDates);
        }
    };

    const toggleStatus = async (dateItem) => {

        const res = await axios.put(
            `http://localhost:5001/api/exam-date/${dateItem._id}`,
            {
                status: status,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    };
    const deleteExamDate = async (id) => {
        await axios.delete(
            `http://localhost:5001/api/exam-date/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchExamDates();
    };

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-5">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Exam Dates</h2>
                    <p className="text-sm text-muted-foreground">Manage important dates for exam session</p>
                </div>

                <Button asChild><Link to="/admin/exam-date/add">Add Exam Dates</Link></Button>
            </div>
            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam</TableHead>
                            <TableHead>Session</TableHead>
                            <TableHead>Registration</TableHead>
                            <TableHead>Correction</TableHead>
                            <TableHead>Admit Card</TableHead>
                            <TableHead>Exam Date</TableHead>
                            <TableHead>Answer Key</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {examDates.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    className="py-10 text-center">
                                    <p className="text-gray-500">No exam dates found.</p>

                                </TableCell>
                            </TableRow>
                        ) : (
                            examDates.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="whitespace-nowrap font-medium">
                                        {item.exam?.name}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {item.examSession?.sessionName}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-xs">{formatDate(item.registrationStartDate)}
                                        <br />
                                        to {formatDate(item.registrationEndDate)}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-xs">
                                        {formatDate(item.correctionStartDate)}
                                        <br />
                                        to {formatDate(item.correctionEndDate)}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-xs">{formatDate(item.admitCardDate)}</TableCell>

                                    <TableCell className="whitespace-nowrap text-xs">
                                        {formatDate(item.examStartDate)}
                                        <br />
                                        to {formatDate(item.examEndDate)}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-xs">{formatDate(item.answerKeyDate)}</TableCell>

                                    <TableCell className="whitespace-nowrap text-xs">{formatDate(item.resultDate)}</TableCell>

                                    <TableCell>
                                        <span
                                            className={
                                                item.status === 'Active'
                                                    ? 'rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700'
                                                    : 'rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700'}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" asChild>
                                                <Link
                                                    to={`/admin/exam-date/edit/${item._id}`}>Edit
                                                </Link>
                                            </Button>
                                            <Button variant="outline" className="text-red-500" onClick={() => deleteExamDate(item._id)}>Delete</Button>
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

export default ExamDateList;
