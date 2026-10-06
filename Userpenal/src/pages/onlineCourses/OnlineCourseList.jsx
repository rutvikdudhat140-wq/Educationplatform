import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';

import {
  Clock,
  Home,
  Search,
  Star,
  ChevronRight,
  Layers,
  PlayCircle,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const OnlineCourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (level) params.set('level', level);
    if (type) params.set('type', type);
    if (duration) params.set('duration', duration);

    fetch(createApiUrl(`/online-courses?${params.toString()}`))
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.data || []);
        setCategories(data.categories || []);
      });
  }, [search, category, level, type, duration]);

  return (
    <div className="min-h-screen bg-surface">

      <div className="edu-page-head">
        <div className="edu-container py-4 md:py-5">

          <div className="edu-breadcrumb">
            <Link to="/" className="edu-breadcrumb-link">
              <Home size={14} />
              Home
            </Link>

            <ChevronRight className="size-3.5 text-line-strong" />

            <span className="font-semibold text-ink">
              Online Courses
            </span>
          </div>

          <h1 className="edu-h1 mt-2.5">
            Online Courses &amp; Certificates
          </h1>

          <p className="mt-1.5 max-w-2xl text-[0.8125rem] text-ink-muted">
            Learn at your own pace, complete every lesson and earn a
            certificate.
          </p>

          <div className="mt-3.5 flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search online courses..."
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[15rem_1fr] lg:gap-6">

          <aside>
            <div className="edu-rail edu-card overflow-hidden">

              <div className="edu-panel-head">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-brand" />
                  <h2 className="text-[0.8125rem] font-semibold text-ink">
                    Filters
                  </h2>
                </div>

                {(category || level || type || duration) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('');
                      setLevel('');
                      setType('');
                      setDuration('');
                    }}
                    className="text-[0.75rem] font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="px-4 py-1">

                <div className="border-b border-line py-3.5">
                  <p className="text-[0.8125rem] font-semibold text-ink">
                    Category
                  </p>

                  <div className="mt-2 space-y-0.5">
                    {categories.length === 0 ? (
                      <p className="edu-meta">No categories yet</p>
                    ) : (
                      categories.map((item) => (
                        <label key={item} className="edu-check-row">
                          <Checkbox
                            checked={category === item}
                            onCheckedChange={() =>
                              setCategory(category === item ? '' : item)
                            }
                          />
                          <span className="text-[0.8125rem] text-ink-muted">
                            {item}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-b border-line py-3.5">
                  <p className="text-[0.8125rem] font-semibold text-ink">
                    Level
                  </p>

                  <div className="mt-2 space-y-0.5">
                    {['Beginner', 'Intermediate', 'Advanced'].map((item) => (
                      <label key={item} className="edu-check-row">
                        <Checkbox
                          checked={level === item}
                          onCheckedChange={() =>
                            setLevel(level === item ? '' : item)
                          }
                        />
                        <span className="text-[0.8125rem] text-ink-muted">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-b border-line py-3.5">
                  <p className="text-[0.8125rem] font-semibold text-ink">
                    Price
                  </p>

                  <div className="mt-2 space-y-0.5">
                    {[
                      ['free', 'Free'],
                      ['paid', 'Paid'],
                    ].map(([value, label]) => (
                      <label key={value} className="edu-check-row">
                        <Checkbox
                          checked={type === value}
                          onCheckedChange={() =>
                            setType(type === value ? '' : value)
                          }
                        />
                        <span className="text-[0.8125rem] text-ink-muted">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="py-3.5">
                  <p className="text-[0.8125rem] font-semibold text-ink">
                    Duration
                  </p>

                  <div className="mt-2 space-y-0.5">
                    {[
                      ['short', 'Up to 5 Hours'],
                      ['medium', '5 to 20 Hours'],
                      ['long', 'Above 20 Hours'],
                    ].map(([value, label]) => (
                      <label key={value} className="edu-check-row">
                        <Checkbox
                          checked={duration === value}
                          onCheckedChange={() =>
                            setDuration(duration === value ? '' : value)
                          }
                        />
                        <span className="text-[0.8125rem] text-ink-muted">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section>

            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.8125rem] text-ink-muted">
                <span className="font-semibold text-ink">
                  {courses.length}
                </span>{' '}
                {courses.length === 1 ? 'course' : 'courses'} found
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="edu-empty">
                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  No online courses found.
                </h2>
                <p className="text-[0.8125rem] text-ink-muted">
                  Try a different keyword or clear your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">

                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="group flex flex-col overflow-hidden rounded-md border border-[#E5E7EB] bg-white transition-all duration-150 hover:border-[#93C5FD] hover:shadow-[0_4px_16px_rgba(37,99,235,0.06)]"
                  >

                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-38 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-38 w-full items-center justify-center bg-[#F8FAFC]">
                        <PlayCircle size={32} className="text-[#2563EB]" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-4">

                      <div className="mb-2 flex items-center justify-between gap-1.5">
                        <span className={`px-2 py-0.5 text-[0.6875rem] font-bold rounded-[4px] border ${
                          course.isFree
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]'
                            : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]'
                        }`}>
                          {course.isFree ? 'Free Course' : 'Certificate Course'}
                        </span>

                        {course.category && (
                          <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-0.5 text-[0.6875rem] font-medium text-slate-600">
                            {course.category}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/online-courses/${course._id}`}
                        className="line-clamp-2 min-h-[2.5rem] text-[0.9375rem] font-bold leading-snug text-[#172554] transition-colors group-hover:text-[#2563EB]"
                      >
                        {course.title}
                      </Link>

                      <p className="mt-1 text-[0.75rem] text-[#64748B]">
                        By <strong className="text-slate-700">{course.instructor || 'Certified Instructor'}</strong>
                      </p>

                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <span className="rounded-[3px] border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.5 text-[0.6875rem] font-medium text-slate-600">{course.level || 'All Levels'}</span>

                        <span className="inline-flex items-center gap-1 rounded-[3px] border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.5 text-[0.6875rem] font-medium text-slate-600">
                          <Clock size={11} className="text-slate-400" />
                          {course.duration || '6'} Hours
                        </span>

                        <span className="rounded-[3px] border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.5 text-[0.6875rem] font-medium text-slate-600">
                          {course.lessonCount || '10'} Lessons
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[0.75rem] text-[#64748B]">
                        <span className="inline-flex items-center gap-1 font-bold text-[#172554]">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {Number(course.rating || 4.8).toFixed(1)}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Users size={12} className="text-slate-400" />
                          {course.studentCount || 120} learners
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#E5E7EB] pt-3 mt-3.5">
                        <div>
                          {course.isFree ? (
                            <span className="text-[1rem] font-extrabold text-[#16A34A]">
                              Free
                            </span>
                          ) : course.discountPrice ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[1rem] font-extrabold text-[#172554]">
                                ₹{course.discountPrice}
                              </span>
                              <span className="text-[0.75rem] text-[#64748B] line-through">
                                ₹{course.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[1rem] font-extrabold text-[#172554]">
                              ₹{course.price || 499}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="h-8 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-xs font-semibold shadow-none"
                          onClick={() =>
                            navigate(`/online-courses/${course._id}`)
                          }
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default OnlineCourseList;
