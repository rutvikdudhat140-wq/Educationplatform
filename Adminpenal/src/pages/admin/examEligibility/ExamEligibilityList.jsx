import { useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';

const ExamEligibilityList = () => {
    const [eligibilities, setEligibilities] = useState([]);

    const token = localStorage.getItem('adminToken');

    const fetchEligibilities = () => {
        axios
            .get('http://localhost:5001/api/exam-eligibility', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setEligibilities(res.data.examEligibilities || []);
            });
    };

    useEffect(() => {
        fetchEligibilities();
    }, []);

    const toggleStatus = (item) => {
        const status =
            item.status === 'Active' ? 'Inactive' : 'Active';

        axios
            .put(
                `http://localhost:5001/api/exam-eligibility/${item._id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                fetchEligibilities();
            });
    };
    const deleteEligibility = (id) => {
        axios
            .delete(
                `http://localhost:5001/api/exam-eligibility/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                fetchEligibilities();
            });
    };

    return (
        <div className="space-y-5">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Exam Eligibility</h2>

                    <p className="text-sm text-muted-foreground">Manage eligibility requirements for exam sessions</p>
                </div>

                <Button asChild>
                    <Link to="/admin/exam-eligibility/add">Add Eligibility</Link>
                </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam</TableHead>
                            <TableHead>Session</TableHead>
                            <TableHead>Qualification</TableHead>
                            <TableHead>Required Subjects</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Age Limit</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead>Nationality</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {eligibilities.length === 0 ? (

                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    className="py-10 text-center"
                                >
                                    <p className="text-gray-500">
                                        No eligibility records found.
                                    </p>

                                </TableCell>
                            </TableRow>

                        ) : (

                            eligibilities.map((item) => (

                                <TableRow key={item._id}>

                                    <TableCell className="font-medium">{item.exam?.name}</TableCell>
                                    <TableCell>{item.examSession?.sessionName}</TableCell>
                                    <TableCell>{item.minimumQualification}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">

                                            {item.requiredSubjects?.length ? (
                                                item.requiredSubjects.map(
                                                    (subject, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs font-normal"
                                                        >
                                                            {subject}
                                                        </Badge>
                                                    )
                                                )
                                            ) : (
                                                '-'
                                            )}

                                        </div>
                                    </TableCell>

                                    <TableCell>{item.minimumPercentage}</TableCell>
                                    <TableCell>{item.ageLimit}</TableCell>
                                    <TableCell>{item.numberOfAttempts}</TableCell>
                                    <TableCell> {item.nationality} </TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                item.status === 'Active'
                                                    ? 'bg-green-50 text-green-700'
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
                                                asChild>
                                                <Link to={`/admin/exam-eligibility/edit/${item._id}`}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    deleteEligibility(item._id)
                                                }>Delete
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

export default ExamEligibilityList;
