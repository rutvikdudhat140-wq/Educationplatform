import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';

import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Home,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('userToken')}`,
});

const MyLearning = () => {
  const navigate = useNavigate();

  const [learning, setLearning] = useState([]);

  useEffect(() => {
    fetch(createApiUrl('/online-courses/my-learning'), { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setLearning(data.data || []))
      .catch((err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem('userToken');
          navigate('/login', { replace: true });
        }
      });
  }, [navigate]);

  const { inProgress, completed } = useMemo(
    () => ({
      inProgress: learning.filter((item) => item.status !== 'COMPLETED'),
      completed: learning.filter((item) => item.status === 'COMPLETED'),
    }),
    [learning]
  );

  const openCertificate = (item) => {
    if (item.certificateRecordId) {
      navigate(
        `/my-certificates?certificate=${encodeURIComponent(
          item.certificateRecordId
        )}`
      );
      return;
    }

    navigate('/my-certificates');
  };

  const renderProgress = (item) => {
    const percent =
      item.totalLessons > 0
        ? Math.round((item.completedLessons / item.totalLessons) * 100)
        : 0;

    return (
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-soft">
            {item.completedLessons} of {item.totalLessons} lessons completed
          </p>

          <p className="text-[0.75rem] font-semibold text-ink-muted">
            {percent}%
          </p>
        </div>

        <div
          className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${item.course?.title} progress`}
        >
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  const renderThumbnail = (item, fallbackIcon) =>
    item.course?.thumbnail ? (
      <img
        src={item.course.thumbnail}
        alt={item.course.title}
        className="h-32 w-full object-cover"
      />
    ) : (
      <div className="flex h-32 w-full items-center justify-center bg-brand-softest">
        {fallbackIcon}
      </div>
    );

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

            <span className="font-semibold text-ink">My Learning</span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="edu-h1">My Learning</h1>

              <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                Continue your enrolled courses and track completed lessons.
              </p>
            </div>

            <p className="text-[0.8125rem] text-ink-muted">
              <span className="font-semibold text-ink">
                {inProgress.length}
              </span>{' '}
              in progress ·{' '}
              <span className="font-semibold text-brand">
                {completed.length}
              </span>{' '}
              completed
            </p>
          </div>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">
        {learning.length === 0 ? (
          <div className="edu-empty">
            <BookOpen size={30} className="text-brand" />

            <h2 className="text-[0.9375rem] font-semibold text-ink">
              You have not enrolled in any course yet.
            </h2>

            <p className="text-[0.8125rem] text-ink-muted">
              Pick a course to start learning and earn a certificate.
            </p>

            <Button onClick={() => navigate('/online-courses')}>
              Browse Online Courses
            </Button>
          </div>
        ) : (
          <div className="space-y-7">

            <section>
              <h2 className="edu-h2">Continue Learning</h2>

              {inProgress.length === 0 ? (
                <p className="mt-2 text-[0.8125rem] text-ink-muted">
                  No courses in progress.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">

                  {inProgress.map((item) => (
                    <div
                      key={item.enrollmentId}
                      className="edu-card edu-card-hover flex flex-col overflow-hidden"
                    >

                      {renderThumbnail(
                        item,
                        <PlayCircle size={26} className="text-brand" />
                      )}

                      <div className="flex flex-1 flex-col p-3.5">
                        <h3 className="line-clamp-2 text-[0.9375rem] font-semibold leading-5 text-ink">
                          {item.course?.title}
                        </h3>

                        <p className="mt-1 text-[0.75rem] text-ink-muted">
                          Instructor: {item.course?.instructor || 'N/A'}
                        </p>

                        <div className="mt-3">{renderProgress(item)}</div>

                        {item.course?.hasAssessment && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] text-ink-muted">
                            {item.assessmentPassed ? (
                              <CheckCircle2 size={12} className="text-brand" />
                            ) : (
                              <CircleAlert size={12} />
                            )}
                            Assessment{' '}
                            {item.assessmentPassed
                              ? `passed (${item.assessmentScore}%)`
                              : 'still required'}
                          </p>
                        )}

                        <p className="mt-1.5 text-[0.75rem] text-ink-muted">
                          Last Lesson:{' '}
                          {item.lastAccessedLesson?.title || 'Not started'}
                        </p>

                        <Button
                          className="mt-auto w-full"
                          onClick={() =>
                            navigate(`/online-courses/${item.course?._id}/learn`)
                          }
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="edu-h2">Completed</h2>

              {completed.length === 0 ? (
                <p className="mt-2 text-[0.8125rem] text-ink-muted">
                  No completed courses yet.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">

                  {completed.map((item) => {
                    const certificateRevoked =
                      Boolean(item.certificateStatus) &&
                      item.certificateStatus !== 'Valid';

                    return (
                      <div
                        key={item.enrollmentId}
                        className="edu-card flex flex-col overflow-hidden"
                      >

                        {renderThumbnail(
                          item,
                          <CheckCircle2 size={26} className="text-brand" />
                        )}

                        <div className="flex flex-1 flex-col p-3.5">
                          <h3 className="line-clamp-2 text-[0.9375rem] font-semibold leading-5 text-ink">
                            {item.course?.title}
                          </h3>

                          <p className="mt-1 text-[0.75rem] text-ink-muted">
                            Instructor: {item.course?.instructor || 'N/A'}
                          </p>

                          <p className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brand">
                            <CheckCircle2 size={14} />
                            Completed
                          </p>

                          <p className="mt-1 text-[0.75rem] text-ink-muted">
                            {item.totalLessons} of {item.totalLessons} lessons
                            completed
                          </p>

                          {item.certificateId ? (
                            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.75rem] text-ink-muted">
                              <Award
                                size={13}
                                className={
                                  certificateRevoked
                                    ? 'text-destructive'
                                    : 'text-brand'
                                }
                              />
                              {item.certificateId}

                              {certificateRevoked && (
                                <span className="edu-tag">
                                  {item.certificateStatus}
                                </span>
                              )}
                            </p>
                          ) : (
                            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-ink-muted">
                              <CircleAlert size={13} className="text-ink-muted" />
                              Certificate is being generated. Refresh in a
                              moment.
                            </p>
                          )}

                          <div className="mt-auto flex gap-2 pt-3">
                            <Button
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/online-courses/${item.course?._id}/learn`
                                )
                              }
                            >
                              Revise
                            </Button>

                            <Button
                              variant={item.certificateId ? 'default' : 'outline'}
                              disabled={!item.certificateId}
                              onClick={() => openCertificate(item)}
                            >
                              View Certificate
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyLearning;
