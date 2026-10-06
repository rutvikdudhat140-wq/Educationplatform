import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const getCourses = async (pageNum) => {
    const response = await axios.get(`/api/course?page=${pageNum}&limit=${limit}`);

    setCourses(response.data.data || response.data.courses || []);
    setTotalPages(response.data.totalPages || 1);
  };

  const deleteCourse = async (id) => {
    await axios.delete(`/api/course/${id}`);
    getCourses(page);
  };

  useEffect(() => {
    getCourses(page);
  }, [page]);

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Course List </h2>

        <Button onClick={() => navigate('/admin/course/add')}>Add Course</Button>
      </div>
      <Card>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-0 text-center">No courses found</TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-xs text-gray-500">{course.fullName}</div>
                    </TableCell>
                    <TableCell>{course.stream}</TableCell>
                    <TableCell> {course.level} </TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>₹{course.fees}</TableCell>
                    <TableCell>
                      {course.isPopular ? (
                        <Badge>Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{course.status}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/course/edit/${course._id}`)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCourse(course._id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
          <Button
            key={pNum}
            size="sm"
            variant={pNum === page ? "default" : "outline"}
            onClick={() => setPage(pNum)}
          >
            {pNum}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

    </div>
  );
};

export default CourseList;
