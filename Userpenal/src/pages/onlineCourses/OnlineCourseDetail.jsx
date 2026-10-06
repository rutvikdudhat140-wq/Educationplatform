import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';

import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  Home,
  IndianRupee,
  Lock,
  PlayCircle,
  Star,
  User,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const OnlineCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(createApiUrl(`/online-courses/${id}`), { headers })
      .then((r) => r.json())
      .then((data) => {
        setCourse(data.data);
        setCompletedLessons(data.data?.enrollment?.completedLessons || []);
      });
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(createApiUrl(`/online-courses/${id}/enroll`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate('/my-learning'));
  };

  if (!course) {
    return null;
  }

  const modules = course.modules || [];
  const lessons = modules.flatMap((module) => module.lessons || []);

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

            <Link to="/online-courses" className="edu-breadcrumb-link">
              Online Courses
            </Link>

            <ChevronRight className="size-3.5 text-line-strong" />

            <span className="font-semibold text-ink">
              {course.title}
            </span>
          </div>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_20rem] lg:gap-6">

          <div className="min-w-0">

            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-56 w-full rounded-md object-cover md:h-72 border border-[#E5E7EB]"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center rounded-md bg-[#F8FAFC] border border-[#E5E7EB] md:h-72">
                <PlayCircle size={40} className="text-[#2563EB]" />
              </div>
            )}

            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                <span className="edu-chip">
                  {course.isFree ? 'Free' : 'Paid'}
                </span>

                {course.category && (
                  <span className="edu-tag">{course.category}</span>
                )}

                <span className="edu-tag">{course.level}</span>
              </div>

              <h1 className="edu-h1 mt-2">{course.title}</h1>

              <p className="mt-2 max-w-3xl text-[0.875rem] text-ink-soft">
                {course.shortDescription}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-[0.8125rem] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} />
                  Instructor: {course.instructor || 'N/A'}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Star size={14} className="text-brand" />
                  {course.rating || 0} Rating
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} />
                  {course.studentCount || 0} Students Enrolled
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {course.duration} Hours
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={14} />
                  {course.lessonCount} Lessons
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Globe size={14} />
                  {course.language || 'English'}
                </span>
              </div>
            </div>

            {(course.learningOutcomes?.length > 0 ||
              course.requirements?.length > 0 ||
              course.targetAudience?.length > 0) && (
              <div className="mt-5 space-y-4">

                {course.learningOutcomes?.length > 0 && (
                  <section className="edu-card p-4">
                    <h2 className="edu-h3">What You Will Learn</h2>

                    <ul className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {course.learningOutcomes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 text-[0.8125rem] text-ink-soft"
                        >
                          <CheckCircle2
                            size={14}
                            className="mt-0.5 shrink-0 text-brand"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {course.requirements?.length > 0 && (
                  <section className="edu-card p-4">
                    <h2 className="edu-h3">Requirements</h2>

                    <ul className="mt-2.5 space-y-1.5">
                      {course.requirements.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 text-[0.8125rem] text-ink-soft"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-line-strong" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {course.targetAudience?.length > 0 && (
                  <section className="edu-card p-4">
                    <h2 className="edu-h3">Who This Course Is For</h2>

                    <ul className="mt-2.5 space-y-1.5">
                      {course.targetAudience.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 text-[0.8125rem] text-ink-soft"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-line-strong" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            <section className="edu-card mt-5 p-4">
              <h2 className="edu-h3">About This Course</h2>

              <div className="edu-prose mt-2.5">
                {(course.description || '')
                  .split('\n')
                  .filter(Boolean)
                  .map((line) => (
                    <p key={line}>{line}</p>
                  ))}
              </div>
            </section>

            <section className="edu-card mt-5 overflow-hidden">
              <div className="edu-panel-head">
                <h2 className="edu-h3">Course Curriculum</h2>
                <span className="edu-meta">
                  {lessons.length} Lessons
                </span>
              </div>

              {modules.length === 0 ? (
                <p className="p-4 text-[0.8125rem] text-ink-muted">
                  Curriculum will be added soon.
                </p>
              ) : (
                modules.map((module) => (
                  <div key={module._id} className="border-b border-line last:border-b-0">

                    <p className="bg-surface px-4 py-2.5 text-[0.8125rem] font-semibold text-ink">
                      {module.title}
                    </p>

                    {module.lessons.map((lesson) => {
                      const isDone = completedLessons.some(
                        (item) =>
                          item.toString?.() === lesson._id.toString() ||
                          item === lesson._id
                      );

                      return (
                        <div
                          key={lesson._id}
                          className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2
                                size={14}
                                className="shrink-0 text-brand"
                              />
                            ) : lesson.isFreePreview ? (
                              <PlayCircle
                                size={14}
                                className="shrink-0 text-brand"
                              />
                            ) : (
                              <Lock size={14} className="shrink-0 text-line-strong" />
                            )}

                            <span className="text-[0.8125rem] text-ink-soft">
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isDone && (
                              <span className="edu-chip">Completed</span>
                            )}

                            {lesson.isFreePreview && (
                              <span className="edu-tag">Free Preview</span>
                            )}

                            {lesson.duration && (
                              <span className="text-[0.75rem] text-ink-muted">
                                {lesson.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </section>

            <section className="edu-card mt-5 p-4">
              <h2 className="edu-h3">Instructor</h2>

              <div className="mt-2.5 flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-softest text-brand">
                  <User size={18} />
                </span>

                <div>
                  <p className="text-[0.875rem] font-semibold text-ink">
                    {course.instructor || 'N/A'}
                  </p>
                  <p className="text-[0.75rem] text-ink-muted">
                    {course.instructorTitle || 'Course Instructor'}
                  </p>
                </div>
              </div>
            </section>

            <section className="edu-card mt-5 p-4">
              <h2 className="edu-h3">Reviews</h2>

              {(course.reviews?.length || 0) === 0 ? (
                <p className="mt-2 text-[0.8125rem] text-ink-muted">
                  No reviews yet.
                </p>
              ) : (
                <div className="mt-2.5 space-y-3">
                  {course.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-line pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[0.8125rem] font-semibold text-ink">
                          {review.name}
                        </p>

                        <span className="inline-flex items-center gap-1 text-[0.75rem] text-ink-muted">
                          <Star size={12} className="text-brand" />
                          {review.rating}
                        </span>
                      </div>

                      <p className="mt-1 text-[0.8125rem] text-ink-soft">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {(course.faqs?.length || 0) > 0 && (
              <section className="edu-card mt-5 p-4">
                <h2 className="edu-h3">FAQ</h2>

                <div className="mt-2.5 space-y-3">
                  {course.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                      <p className="text-[0.8125rem] font-semibold text-ink">
                        {faq.question}
                      </p>
                      <p className="mt-1 text-[0.8125rem] text-ink-soft">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside>
            <div className="edu-rail edu-card p-4">

              <p className="edu-label">Price</p>

              <div className="mt-1 flex items-end gap-2">
                {course.isFree ? (
                  <span className="text-[1.5rem] font-bold text-ink">
                    Free
                  </span>
                ) : course.discountPrice ? (
                  <>
                    <span className="text-[1.5rem] font-bold text-ink">
                      ₹{course.discountPrice}
                    </span>
                    <span className="pb-1 text-[0.8125rem] text-ink-muted line-through">
                      ₹{course.price}
                    </span>
                  </>
                ) : (
                  <span className="text-[1.5rem] font-bold text-ink">
                    ₹{course.price}
                  </span>
                )}
              </div>

              {course.enrollment ? (
                <Button
                  className="mt-3.5 w-full"
                  onClick={() => navigate(`/online-courses/${course._id}/learn`)}
                >
                  Continue Learning
                </Button>
              ) : (
                <Button
                  className="mt-3.5 w-full"
                  onClick={handleEnroll}
                >
                  <IndianRupee size={15} />
                  Enroll Now
                </Button>
              )}

              <div className="mt-4 space-y-2 border-t border-line pt-3.5">
                <p className="flex items-center justify-between text-[0.8125rem] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} />
                    Duration
                  </span>
                  <span className="font-semibold text-ink">
                    {course.duration} Hours
                  </span>
                </p>

                <p className="flex items-center justify-between text-[0.8125rem] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={14} />
                    Lessons
                  </span>
                  <span className="font-semibold text-ink">
                    {course.lessonCount}
                  </span>
                </p>

                <p className="flex items-center justify-between text-[0.8125rem] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={14} />
                    Rating
                  </span>
                  <span className="font-semibold text-ink">
                    {course.rating || 0}
                  </span>
                </p>

                <p className="flex items-center justify-between text-[0.8125rem] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe size={14} />
                    Language
                  </span>
                  <span className="font-semibold text-ink">
                    {course.language || 'English'}
                  </span>
                </p>
              </div>

              {course.hasAssessment && (
                <p className="mt-4 flex items-start gap-1.5 border-t border-line pt-3.5 text-[0.75rem] text-ink-muted">
                  <Award size={14} className="mt-0.5 shrink-0 text-brand" />
                  This course includes a final assessment. Passing score{' '}
                  {course.passingScore}%.
                </p>
              )}

              <p className="mt-3 flex items-start gap-1.5 text-[0.75rem] text-ink-muted">
                <Award size={14} className="mt-0.5 shrink-0 text-brand" />
                Complete all lessons to get a certificate.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OnlineCourseDetail;
