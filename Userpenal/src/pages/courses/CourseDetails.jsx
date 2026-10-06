
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/course/${id}`
      );

      setCourse(response.data.data || response.data.course || null);
    };

    getCourse();
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f5f7f5] p-10">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            Course not found
          </h2>

          <Link
            to="/courses"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>



          <Link to="/">Home</Link>



          <Link to="/courses">Courses</Link>



          <span className="text-slate-800">
            {course.name}
          </span>
        </div>

        {/* Course Header */}
        <Card className="mb-5 border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">

            <div className="mb-3 flex gap-2">
              <Badge className="bg-emerald-50 text-emerald-700">
                {course.stream || 'General'}
              </Badge>

              <Badge variant="secondary">
                {course.level || 'UG'}
              </Badge>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl text-emerald-700">
                  {course.icon || '◌'}
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    {course.name}
                  </h1>

                  <p className="text-slate-600">
                    {course.fullName}
                  </p>
                </div>
              </div>



            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">

              <span className="rounded-full bg-slate-100 px-3 py-2">
                 {course.duration }
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-2">
                 ₹{course.fees}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-2">
                 {course.collegeCount}+ colleges
              </span>

            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_300px]">

          <div className="space-y-5">


            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 text-xl font-semibold">
                  About {course.name}
                </h2>

                <p className="text-sm leading-6 text-slate-600">
                  {course.description}
                </p>
              </CardContent>
            </Card>


            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 text-xl font-semibold">
                  Eligibility Criteria
                </h2>

                {course.eligibilityCriteria?.length > 0 ? (
                  <ul className="space-y-2">
                    {course.eligibilityCriteria.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-sm text-slate-600"
                      >
                        <span>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    Eligibility information not available.
                  </p>
                )}
              </CardContent>
            </Card>


            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 text-xl font-semibold">
                  Career Options
                </h2>

                {course.relatedCareers?.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">

                    {course.relatedCareers.map((career) => (
                      <button
                        key={career._id || career}
                        type="button"
                        onClick={() => {
                          const relatedCourseId =
                            career.relatedCourses?.[0]?._id;

                          if (relatedCourseId) {
                            navigate(`/courses/${relatedCourseId}`);
                          } else {
                            navigate('/courses');
                          }
                        }}
                        className="rounded-2xl border bg-slate-50 p-4 text-left hover:bg-white"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">
                            {career.name}
                          </span>

                          <Badge variant="secondary">
                            {career.growthLevel || 'Moderate'}
                          </Badge>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          ₹{career.salaryMin || 0} - ₹
                          {career.salaryMax || 0}{' '}
                          {career.salaryUnit || 'LPA'}
                        </p>
                      </button>
                    ))}

                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Career information not available.
                  </p>
                )}
              </CardContent>
            </Card>

          </div>

  
          <aside>

            <Card>
              <CardContent className="p-5">

                <h3 className="text-xl font-semibold">
                  Quick Facts
                </h3>

                <div className="mt-4 space-y-3 text-sm">

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Level</span>
                    <span>{course.level}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Duration</span>
                    <span>{course.duration }</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Stream</span>
                    <span>{course.stream}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Fees </span>
                    <span>₹{course.fees }</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Colleges</span>
                    <span>{course.collegeCount }+</span>
                  </div>

                </div>

              </CardContent>
            </Card>

            {course.entranceExams?.length > 0 && (
              <Card className="mt-5">
                <CardContent className="p-5">

                  <h3 className="font-semibold">
                    Entrance Exams
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.entranceExams.map((exam, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                      >
                        {exam}
                      </Badge>
                    ))}
                  </div>

                </CardContent>
              </Card>
            )}

          </aside>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
