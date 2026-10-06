import { useEffect, useState } from 'react';
import axios from "axios";
import { DeleteBtn, EmptyRow, PageHeader } from '@/components/layout/AdminUI';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const OnlineCourseEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const getEnrollments = async () => {
      const response = await axios.get('/api/admin/online-course-enrollments');
      setEnrollments(response.data.data);
    };

    getEnrollments();
  }, []);

  const deleteEnrollment = async (id) => {
    await axios.delete(`/api/admin/online-course-enrollments/${id}`);
    setEnrollments((prev) => prev.filter((row) => row._id !== id));
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Online Course Enrollments" />

      <div className="rounded-xl border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Completed Lessons</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {enrollments.length === 0 ? (
              <EmptyRow colSpan={7} message="No enrollments found." />
            ) : (
              enrollments.map((row) => (
                <TableRow key={row._id}>

                  <TableCell>
                    <div className="font-medium text-ink">
                      {row.student?.name}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {row.student?.email}
                    </div>
                  </TableCell>

                  <TableCell>{row.course?.title}</TableCell>

                  <TableCell>
                    {new Date(row.startedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{row.completedLessons} of {row.totalLessons}
                  </TableCell>

                  <TableCell>
                    {row.status === 'COMPLETED' ? (
                      <span className="edu-chip">{row.status}</span>
                    ) : (
                      <span className="edu-tag">{row.status}</span>
                    )}
                  </TableCell>

                  <TableCell> {new Date(row.lastActivityAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1.5">
                      <DeleteBtn onClick={() => deleteEnrollment(row._id)} />
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

export default OnlineCourseEnrollments;
