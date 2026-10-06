
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const STREAM_OPTIONS = [
  'Engineering',
  'Technology',
  'Management',
  'Science',
  'Commerce',
  'Arts',
  'Education',
  'Agriculture',
  'Design',
  'Pharmacy',
  'Medical',
  'Law',
  'Hotel Management',
  'Computer Applications',
];

const LEVEL_OPTIONS = ['UG', 'PG', 'Diploma', 'PhD'];

const formatFees = (fees) => {
  if (!fees) return '₹0';
  return `₹${Number(fees).toLocaleString('en-IN')}`;
};

const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [stream, setStream] = useState('');

  useEffect(() => {
    const getCourses = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/course?search=${search}&level=${level}&stream=${stream}`
      );

      setCourses(response.data?.data || response.data?.courses || []);
    };

    getCourses();
  }, [search, level, stream]);

  const handleSearch = () => {
    navigate(`/courses?search=${search}&level=${level}&stream=${stream}`);
  };



  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-900">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-5 lg:px-6">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <Link to="/" className="hover:text-slate-800">
            Home
          </Link>

          <span>/</span>

          <span className="text-slate-800">
            Courses
          </span>
        </div>

    
        <Card className="mb-4 border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">

            <Badge className="mb-2 rounded-full border-emerald-200 bg-emerald-50 text-[10px] uppercase text-emerald-700">
              Explore
            </Badge>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Explore All Courses
            </h1>

            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Compare fees, duration, eligibility, and career options across top
              courses.
            </p>

            {/* Search */}
            <div className="mt-4 flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by name..."
                className="h-10 flex-1 rounded-xl border-slate-200 bg-slate-50"
              />

              <Button
                onClick={handleSearch}
                className="h-10 rounded-xl bg-emerald-600 px-5 hover:bg-emerald-700"
              >
                Search
              </Button>
            </div>

          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">

          {/* Filters */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="mb-4 text-sm font-semibold">
              Filters
            </div>

            {/* Level */}
            <div className="mb-5">
              <div className="mb-2 text-xs font-semibold uppercase">
                Level
              </div>

              {LEVEL_OPTIONS.map((item) => (
                <label
                  key={item}
                  className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={level === item}
                    onChange={() =>
                      setLevel(level === item ? '' : item)
                    }
                  />

                  {item}
                </label>
              ))}
            </div>

            {/* Stream */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase">
                Stream
              </div>

              <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={!stream}
                  onChange={() => setStream('')}
                />

                All Streams
              </label>

              {STREAM_OPTIONS.map((item) => (
                <label
                  key={item}
                  className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={stream === item}
                    onChange={() =>
                      setStream(stream === item ? '' : item)
                    }
                  />

                  {item}
                </label>
              ))}
            </div>

          </aside>

          {/* Courses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">

              <div className="text-sm text-slate-600">
                {courses.length} courses found
              </div>



            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >

                  <div className="mb-3 flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      {course.icon || '◌'}
                    </div>

                    <Badge className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700">
                      {course.stream || 'General'}
                    </Badge>

                  </div>

                  <h2 className="text-lg font-bold">
                    {course.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {course.fullName}
                  </p>

                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded-full bg-slate-200 px-2 py-1">
                      {course.duration || 'N/A'}
                    </span>

                    <span className="rounded-full bg-slate-200 px-2 py-1">
                      {course.level || 'N/A'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-[10px] uppercase text-slate-400">
                      Fees
                    </div>

                    <div className="mt-1 text-sm font-semibold">
                      {formatFees(course.fees)}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">

                    <div>
                      <div className="text-slate-400">
                        Colleges
                      </div>

                      <div className="mt-1 font-semibold">
                        {course.collegeCount || 0}+
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400">
                        Exams
                      </div>

                      <div className="mt-1 font-semibold">
                        {course.entranceExams?.[0] || 'N/A'}
                      </div>
                    </div>

                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">

                    <span className="text-[10px] uppercase text-slate-400">
                      Course
                    </span>

                    <span className="text-xs font-semibold text-emerald-700">
                      View Details →
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;

