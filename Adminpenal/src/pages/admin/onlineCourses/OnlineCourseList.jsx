import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import {
  AddButton,
  DeleteBtn,
  EditBtn,
  EmptyRow,
  PageHeader,
  StatusBadge,
  ViewBtn,
} from '@/components/layout/AdminUI';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const OnlineCourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      const response = await axios.get('/api/admin/online-courses');

      setCourses(response.data.data);
    };

    getCourses();
  }, []);

  const deleteCourse = async (id) => {
    await axios.delete(`/api/admin/online-courses/${id}`);

    setCourses((prev) => prev.filter((course) => course._id !== id));
  };

  return (
    <div className="space-y-4">

      <PageHeader title="All Online Courses">
        <AddButton
          label="Add Online Course"
          onClick={() => navigate('/admin/online-course/add')}
        />
      </PageHeader>

      <div className="rounded-xl border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 ? (
              <EmptyRow colSpan={10} message="No online courses found." />
            ) : (
              courses.map((course) => (
                <TableRow key={course._id}>

                  <TableCell>
                    <div className="font-medium text-ink">{course.title}</div>
                    <div className="text-xs text-ink-muted">
                      {course.lessonCount} Lessons
                    </div>
                  </TableCell>

                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.category }</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.duration} Hours</TableCell>
                  <TableCell>{course.studentCount}</TableCell>

                  <TableCell>
                    {course.isFree ? 'Free' : `₹${course.price}`}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={course.isActive ? 'Active' : 'Inactive'}
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString('en-GB')}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1.5">
                      <ViewBtn
                        onClick={() =>
                          navigate(`/admin/online-course/edit/${course._id}`)
                        }
                      />

                      <EditBtn
                        onClick={() =>
                          navigate(`/admin/online-course/edit/${course._id}`)
                        }
                      />

                      <DeleteBtn onClick={() => deleteCourse(course._id)} />
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

export default OnlineCourseList;
