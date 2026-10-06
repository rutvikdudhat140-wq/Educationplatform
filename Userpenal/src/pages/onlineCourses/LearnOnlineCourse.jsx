import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';

import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  FileText,
  Lock,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

const formatVideoUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

const LearnOnlineCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(createApiUrl(`/online-courses/${id}`), { headers })
      .then((r) => r.json())
      .then((data) => {
        setCourse(data.data);
        setEnrollment(data.data?.enrollment || null);
      });
  }, [id]);

  const modules = course?.modules || [];

  const lessons = modules.flatMap(
    (module) => module.lessons || []
  );

  const completedLessons = (
    enrollment?.completedLessons || []
  ).map((item) => item.toString());

  const currentLesson =
    lessons.find((lesson) => lesson._id === currentLessonId) ||
    lessons.find(
      (lesson) =>
        lesson._id === enrollment?.lastAccessedLesson
    ) ||
    lessons[0];

  const lastAccessedLesson = lessons.find(
    (lesson) =>
      lesson._id === enrollment?.lastAccessedLesson
  );

  const allLessonsDone =
    completedLessons.length >= lessons.length;

  const isLocked = (lesson) => {
    const index = lessons.findIndex(
      (item) => item._id === lesson._id
    );

    if (index <= 0 || lesson.isFreePreview) {
      return false;
    }

    return !completedLessons.includes(
      lessons[index - 1]._id
    );
  };

  const isDone = (lesson) =>
    completedLessons.includes(lesson._id);

  const handleEnroll = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return navigate('/login');

    await fetch(createApiUrl(`/online-courses/${id}/enroll`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await fetch(createApiUrl(`/online-courses/${id}`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCourse(data.data);
    setEnrollment(data.data?.enrollment || null);
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson) return;

    const token = localStorage.getItem('userToken');
    const res = await fetch(createApiUrl(`/online-courses/${id}/lessons/${currentLesson._id}/complete`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const response = await res.json();

    setEnrollment((prev) => ({
      ...prev,
      status: response.status,
      completedLessons: completedLessons.includes(currentLesson._id)
        ? completedLessons
        : [...completedLessons, currentLesson._id],
      lastAccessedLesson: currentLesson._id,
    }));

    if (response.justCompleted && response.certificateId) {
      setCertificate({ certificateId: response.certificateId, status: 'Valid' });
    }

    const index = lessons.findIndex((lesson) => lesson._id === currentLesson._id);
    const next = lessons[index + 1];
    if (next) setCurrentLessonId(next._id);
  };

  const handleSubmitQuiz = async () => {
    const token = localStorage.getItem('userToken');
    const res = await fetch(createApiUrl(`/online-courses/${id}/assessment/submit`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const response = await res.json();

    setResult(response);

    if (response.status === 'COMPLETED') {
      setEnrollment((prev) => ({
        ...prev,
        status: 'COMPLETED',
        assessmentPassed: response.passed,
        assessmentScore: response.score,
      }));
    }

    if (response.justCompleted && response.certificateId) {
      setCertificate({ certificateId: response.certificateId, status: 'Valid' });
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
  };

  const questions = course?.questions || [];
  const question = questions[questionIndex];

  const certificateId =
    certificate?.certificateId ||
    enrollment?.certificateId;

  const certificateStatus =
    certificate?.status ||
    enrollment?.certificateStatus;

  if (!course) return null;
  if (!enrollment) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="edu-container py-10">
          <div className="edu-empty">
            <Lock size={30} className="text-brand" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">
              You are not enrolled in this course
            </h2>
            <p className="max-w-md text-[0.8125rem] text-ink-muted">
              Enrol in {course.title} to start learning and earn your certificate.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/online-courses/${id}`)}>
                View Course
              </Button>
              <Button onClick={handleEnroll}>Enroll Now</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="edu-page-head">
        <div className="edu-container py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.75rem] text-ink-muted">
                You are learning
              </p>

              <h1 className="text-[1.0625rem] font-semibold text-ink">
                {course.title}
              </h1>
            </div>

            <div className="text-right">
              <p className="text-[0.8125rem] font-semibold text-ink">
                {completedLessons.length} of {lessons.length}{' '}
                lessons completed
              </p>

              {enrollment.status === 'COMPLETED' ? (
                <p className="mt-0.5 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-brand">
                  <CheckCircle2 size={12} />
                  Completed
                </p>
              ) : (
                <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                  Last Lesson:{' '}
                  {lastAccessedLesson?.title ||
                    'Not started'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="edu-container py-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_20rem] lg:gap-6">
          <div className="order-1 min-w-0">
            {enrollment.status === 'COMPLETED' && (
              <div className="edu-card mb-4 border-brand-border bg-brand-softest p-4">
                <h2 className="text-[1rem] font-semibold text-ink">
                  Congratulations!
                </h2>

                <p className="mt-1 text-[0.8125rem] text-ink-soft">
                  You have successfully completed:
                </p>

                <p className="mt-0.5 text-[0.875rem] font-semibold text-ink">
                  {course.title}
                </p>

                {certificateId && (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.75rem] text-ink-muted">
                    <Award
                      size={13}
                      className="text-brand"
                    />

                    Certificate ID: {certificateId}

                    {certificateStatus &&
                      certificateStatus !== 'Valid' && (
                        <span className="edu-tag">
                          {certificateStatus}
                        </span>
                      )}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      navigate('/my-certificates')
                    }
                    disabled={!certificateId}
                  >
                    <Award size={15} />
                    View Certificate
                  </Button>

                  {course.hasAssessment && (
                    <Button
                      variant="outline"
                      onClick={startQuiz}
                    >
                      Retake Assessment
                    </Button>
                  )}
                </div>
              </div>
            )}

            {course.hasAssessment && allLessonsDone && (
              <div className="edu-card mb-4 p-4">
                <h2 className="edu-h3">
                  {course.assessmentTitle}
                </h2>

                <p className="mt-1 text-[0.8125rem] text-ink-muted">
                  {questions.length} Questions · Passing
                  Score: {course.passingScore}%

                  {enrollment.assessmentPassed && (
                    <span className="ml-2 font-semibold text-brand">
                      Best score:{' '}
                      {enrollment.assessmentScore}%
                    </span>
                  )}
                </p>

                {result ? (
                  <div className="mt-3">
                    <p className="text-[0.875rem] font-semibold text-ink">
                      Score: {result.correct}/
                      {result.total} ({result.score}%)
                    </p>

                    <p className="mt-1 text-[0.875rem] font-semibold">
                      Status:{' '}
                      <span
                        className={
                          result.passed
                            ? 'text-brand'
                            : 'text-destructive'
                        }
                      >
                        {result.passed
                          ? 'Passed'
                          : 'Not Passed'}
                      </span>
                    </p>

                    {result.justCompleted &&
                      result.certificateId && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-brand">
                          <Award size={13} />
                          Certificate{' '}
                          {result.certificateId} issued
                        </p>
                      )}

                    <Button
                      className="mt-3"
                      variant="outline"
                      onClick={startQuiz}
                    >
                      Retake Assessment
                    </Button>
                  </div>
                ) : showQuiz ? (
                  question && (
                    <div className="mt-3">
                      <p className="text-[0.875rem] font-semibold text-ink">
                        {questionIndex + 1}.{' '}
                        {question.question}
                      </p>

                      <RadioGroup
                        className="mt-3 gap-2"
                        value={String(
                          answers[questionIndex] ?? ''
                        )}
                        onValueChange={(value) => {
                          const next = [...answers];

                          next[questionIndex] =
                            Number(value);

                          setAnswers(next);
                        }}
                      >
                        {question.options.map(
                          (option, index) => (
                            <label
                              key={option}
                              className="edu-check-row"
                            >
                              <RadioGroupItem
                                value={String(index)}
                                id={`option-${index}`}
                              />

                              <span className="text-[0.8125rem] text-ink-soft">
                                {option}
                              </span>
                            </label>
                          )
                        )}
                      </RadioGroup>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={questionIndex === 0}
                          onClick={() =>
                            setQuestionIndex(
                              questionIndex - 1
                            )
                          }
                        >
                          <ChevronLeft size={14} />
                          Previous
                        </Button>

                        {questionIndex ===
                        questions.length - 1 ? (
                          <Button
                            size="sm"
                            onClick={handleSubmitQuiz}
                          >
                            Submit Quiz
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() =>
                              setQuestionIndex(
                                questionIndex + 1
                              )
                            }
                          >
                            Next
                            <ChevronRight size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <Button
                    className="mt-3"
                    onClick={startQuiz}
                  >
                    {enrollment.assessmentPassed
                      ? 'Retake Assessment'
                      : 'Start Assessment'}
                  </Button>
                )}
              </div>
            )}

            {currentLesson && (
              <>
                {currentLesson.videoUrl ? (
                  <div className="overflow-hidden rounded-md border border-line bg-black">
                    <iframe
                      src={formatVideoUrl(currentLesson.videoUrl)}
                      title={currentLesson.title}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-md border border-line bg-brand-softest">
                    <PlayCircle
                      size={40}
                      className="text-brand"
                    />
                  </div>
                )}

                <div className="edu-card mt-4 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="edu-h2">
                        {currentLesson.title}
                      </h2>

                      <p className="mt-1 text-[0.75rem] text-ink-muted">
                        {currentLesson.duration}
                      </p>
                    </div>

                    {isDone(currentLesson) ? (
                      <span className="edu-chip">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleCompleteLesson}
                      >
                        <CheckCircle2 size={14} />
                        Mark as Complete
                      </Button>
                    )}
                  </div>

                  {currentLesson.description && (
                    <p className="edu-prose mt-3">
                      {currentLesson.description}
                    </p>
                  )}

                  {currentLesson.resourceUrl && (
                    <div className="mt-4 border-t border-line pt-3.5">
                      <p className="edu-label">
                        Resources
                      </p>

                      <a
                        href={currentLesson.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brand hover:text-brand-dark"
                      >
                        <FileText size={14} />
                        Download Lesson Notes (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className="order-2">
            <div className="edu-rail edu-card overflow-hidden">
              <div className="edu-panel-head">
                <h2 className="text-[0.8125rem] font-semibold text-ink">
                  Course Curriculum
                </h2>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {modules.map((module) => (
                  <div key={module._id}>
                    <p className="bg-surface px-3.5 py-2 text-[0.75rem] font-semibold text-ink">
                      {module.title}
                    </p>

                    {module.lessons.map((lesson) => {
                      const locked = isLocked(lesson);
                      const done = isDone(lesson);
                      const isCurrent =
                        currentLesson?._id ===
                        lesson._id;

                      return (
                        <button
                          key={lesson._id}
                          type="button"
                          disabled={locked}
                          onClick={() => {
                            setCurrentLessonId(
                              lesson._id
                            );
                            setShowQuiz(false);
                            setResult(null);
                          }}
                          className={`flex w-full items-center gap-2 border-t border-line px-3.5 py-2.5 text-left transition-colors ${
                            isCurrent
                              ? 'bg-brand-softest'
                              : locked
                                ? 'cursor-not-allowed opacity-60'
                                : 'hover:bg-surface'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2
                              size={14}
                              className="shrink-0 text-brand"
                            />
                          ) : locked ? (
                            <Lock
                              size={14}
                              className="shrink-0 text-line-strong"
                            />
                          ) : isCurrent ? (
                            <PlayCircle
                              size={14}
                              className="shrink-0 text-brand"
                            />
                          ) : (
                            <Circle
                              size={14}
                              className="shrink-0 text-line-strong"
                            />
                          )}

                          <span
                            className={`flex-1 truncate text-[0.8125rem] ${
                              isCurrent
                                ? 'font-semibold text-brand-darker'
                                : 'text-ink-soft'
                            }`}
                          >
                            {lesson.title}
                          </span>

                          {lesson.duration && (
                            <span className="shrink-0 text-[0.6875rem] text-ink-muted">
                              {lesson.duration}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="border-t border-line px-3.5 py-3">
                <Link
                  to={`/online-courses/${course._id}`}
                  className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brand hover:text-brand-dark"
                >
                  <ChevronLeft size={14} />
                  Back to Course
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LearnOnlineCourse;
