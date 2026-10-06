import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

import { AddButton, PageHeader } from '@/components/layout/AdminUI';

const emptyLesson = () => ({
  title: '',
  description: '',
  videoUrl: '',
  duration: '',
  resourceUrl: '',
  isFreePreview: false,
});

const emptyModule = () => ({ title: '', lessons: [emptyLesson()] });

const emptyQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
});

const OnlineCourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    level: 'Beginner',
    instructor: '',
    instructorTitle: '',
    thumbnail: '',
    language: 'English',
    duration: '',
    price: '',
    discountPrice: '',
    isFree: false,
    isActive: true,
    learningOutcomes: '',
    requirements: '',
    targetAudience: '',
    modules: [emptyModule()],
    hasAssessment: false,
    assessmentTitle: 'Final Assessment',
    passingScore: 60,
    questions: [emptyQuestion()],
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    const getCourse = async () => {
      const response = await axios.get(`/api/admin/online-courses/${id}`);

      const course = response.data.data;

      setForm({
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        category: course.category,
        level: course.level || 'Beginner',
        instructor: course.instructor,
        instructorTitle: course.instructorTitle,
        thumbnail: course.thumbnail,
        language: course.language || 'English',
        duration: course.duration,
        price: course.price,
        discountPrice: course.discountPrice,
        isFree: Boolean(course.isFree),
        isActive: course.isActive !== false,
        learningOutcomes: (course.learningOutcomes || []).join(', '),
        requirements: (course.requirements || []).join(', '),
        targetAudience: (course.targetAudience || []).join(', '),
        modules:
          course.modules?.length > 0
            ? course.modules.map((module) => ({
              _id: module._id,
              title: module.title || '',
              lessons:
                module.lessons?.length > 0
                  ? module.lessons.map((lesson) => ({ ...lesson }))
                  : [emptyLesson()],
            }))
            : [emptyModule()],
        hasAssessment: Boolean(course.hasAssessment),
        assessmentTitle: course.assessmentTitle || 'Final Assessment',
        passingScore: course.passingScore ?? 60,
        questions:
          course.questions?.length > 0
            ? course.questions.map((question) => ({ ...question }))
            : [emptyQuestion()],
      });
    };

    getCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const updateModule = (moduleIndex, key, value) => {
    setForm({
      ...form,
      modules: form.modules.map((module, index) =>
        index === moduleIndex ? { ...module, [key]: value } : module
      ),
    });
  };

  const updateLesson = (moduleIndex, lessonIndex, key, value) => {
    setForm({
      ...form,
      modules: form.modules.map((module, index) =>
        index === moduleIndex
          ? {
            ...module,
            lessons: module.lessons.map((lesson, position) =>
              position === lessonIndex ? { ...lesson, [key]: value } : lesson
            ),
          }
          : module
      ),
    });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setForm({
      ...form,
      modules: form.modules.map((module, index) =>
        index === moduleIndex
          ? {
            ...module,
            lessons: module.lessons.filter(
              (_, position) => position !== lessonIndex
            ),
          }
          : module
      ),
    });
  };

  const moveLesson = (moduleIndex, lessonIndex, direction) => {
    setForm({
      ...form,
      modules: form.modules.map((module, index) => {
        if (index !== moduleIndex) {
          return module;
        }

        const lessons = [...module.lessons];
        const target = lessonIndex + direction;

        if (target < 0 || target >= lessons.length) {
          return module;
        }

        [lessons[lessonIndex], lessons[target]] = [
          lessons[target],
          lessons[lessonIndex],
        ];

        return { ...module, lessons };
      }),
    });
  };

  const updateQuestion = (questionIndex, key, value) => {
    setForm({
      ...form,
      questions: form.questions.map((question, index) =>
        index === questionIndex ? { ...question, [key]: value } : question
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      category: form.category,
      level: form.level,
      instructor: form.instructor,
      instructorTitle: form.instructorTitle,
      thumbnail: form.thumbnail,
      language: form.language,
      duration: Number(form.duration) || 0,
      price: form.isFree ? 0 : Number(form.price) || 0,
      discountPrice: Number(form.discountPrice) || 0,
      isFree: form.isFree,
      isActive: form.isActive,
      learningOutcomes: form.learningOutcomes
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      requirements: form.requirements
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      targetAudience: form.targetAudience
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      modules: form.modules.map((module, moduleIndex) => ({
        title: module.title,
        order: moduleIndex + 1,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          order: lessonIndex + 1,
        })),
      })),
      hasAssessment: form.hasAssessment,
      assessmentTitle: form.assessmentTitle,
      passingScore: Number(form.passingScore) || 60,
      questions: form.questions,
    };

    if (id) {
      await axios.put(
        `/api/admin/online-courses/${id}`,
        payload);
    } else {
      await axios.post(
        '/api/admin/online-courses',
        payload);
    }

    navigate('/admin/online-courses');
  };

  return (
    <div className="space-y-4">
      <PageHeader title={id ? 'Edit Online Course' : 'Add Online Course'} />

      <form onSubmit={handleSubmit} className="space-y-4">

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[0.9375rem] font-semibold text-ink">
            Basic Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="edu-field-label">Course Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="MERN Stack Development"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="edu-field-label">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="One line summary shown on the course card"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="edu-field-label">Full Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="About this course"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Web Development"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="edu-field-label">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                placeholder="John Patel"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Instructor Title</label>
              <input
                type="text"
                name="instructorTitle"
                value={form.instructorTitle}
                onChange={handleChange}
                placeholder="Senior Full Stack Developer"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="edu-field-label">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/course.jpg"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Language</label>
              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="English"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Duration (Hours)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="18"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                disabled={form.isFree}
                placeholder="2999"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                disabled={form.isFree}
                placeholder="1999"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={form.isFree}
                  onChange={handleChange}
                />
                Free Course
              </label>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[0.9375rem] font-semibold text-ink">
            Learning Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="edu-field-label">
                Learning Outcomes (comma separated)
              </label>
              <input
                type="text"
                name="learningOutcomes"
                value={form.learningOutcomes}
                onChange={handleChange}
                placeholder="Build REST APIs, Work with MongoDB, Deploy on the cloud"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">
                Requirements (comma separated)
              </label>
              <input
                type="text"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Basic programming knowledge, Laptop with internet"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">
                Target Audience (comma separated)
              </label>
              <input
                type="text"
                name="targetAudience"
                value={form.targetAudience}
                onChange={handleChange}
                placeholder="Beginner developers, Final year students"
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[0.9375rem] font-semibold text-ink">
              Curriculum
            </h2>

            <AddButton
              label="Add Module"
              onClick={() =>
                setForm({ ...form, modules: [...form.modules, emptyModule()] })
              }
            />
          </div>

          <div className="space-y-4">
            {form.modules.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className="rounded-lg border border-line bg-surface p-4"
              >

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) =>
                      updateModule(moduleIndex, 'title', e.target.value)
                    }
                    placeholder={`Module ${moduleIndex + 1} title`}
                    className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        modules: form.modules.filter(
                          (_, index) => index !== moduleIndex
                        ),
                      })
                    }
                    className="rounded-lg border border-line bg-white px-2.5 py-2 text-xs font-semibold text-destructive"
                  >
                    Delete Module
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="rounded-lg border border-line bg-white p-3"
                    >

                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(
                              moduleIndex,
                              lessonIndex,
                              'title',
                              e.target.value
                            )
                          }
                          placeholder="Lesson title"
                          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
                        />

                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) =>
                            updateLesson(
                              moduleIndex,
                              lessonIndex,
                              'duration',
                              e.target.value
                            )
                          }
                          placeholder="12 min"
                          className="w-24 rounded-lg border border-line px-3 py-2 text-sm"
                        />
                      </div>

                      <textarea
                        value={lesson.description}
                        onChange={(e) =>
                          updateLesson(
                            moduleIndex,
                            lessonIndex,
                            'description',
                            e.target.value
                          )
                        }
                        rows={2}
                        placeholder="Lesson description"
                        className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm"
                      />

                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <input
                          type="text"
                          value={lesson.videoUrl}
                          onChange={(e) =>
                            updateLesson(
                              moduleIndex,
                              lessonIndex,
                              'videoUrl',
                              e.target.value
                            )
                          }
                          placeholder="Video URL"
                          className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                        />

                        <input
                          type="text"
                          value={lesson.resourceUrl}
                          onChange={(e) =>
                            updateLesson(
                              moduleIndex,
                              lessonIndex,
                              'resourceUrl',
                              e.target.value
                            )
                          }
                          placeholder="Resource / PDF URL"
                          className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-ink-soft">
                          <input
                            type="checkbox"
                            checked={Boolean(lesson.isFreePreview)}
                            onChange={(e) =>
                              updateLesson(
                                moduleIndex,
                                lessonIndex,
                                'isFreePreview',
                                e.target.checked
                              )
                            }
                          />
                          Free Preview
                        </label>

                        <div className="ml-auto flex gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              moveLesson(moduleIndex, lessonIndex, -1)
                            }
                            className="rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold text-ink-soft"
                          >
                            Up
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveLesson(moduleIndex, lessonIndex, 1)
                            }
                            className="rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold text-ink-soft"
                          >
                            Down
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeLesson(moduleIndex, lessonIndex)
                            }
                            className="rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold text-destructive"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateModule(moduleIndex, 'lessons', [
                      ...module.lessons,
                      emptyLesson(),
                    ])
                  }
                  className="mt-3 rounded-lg border border-dashed border-brand-border bg-brand-softest px-3 py-2 text-xs font-semibold text-brand"
                >
                  Add Lesson
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[0.9375rem] font-semibold text-ink">
            Final Assessment
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-ink md:col-span-1">
              <input
                type="checkbox"
                name="hasAssessment"
                checked={form.hasAssessment}
                onChange={handleChange}
              />
              Enable Assessment
            </label>

            <div>
              <label className="edu-field-label">Assessment Title</label>
              <input
                type="text"
                name="assessmentTitle"
                value={form.assessmentTitle}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="edu-field-label">Passing Score (%)</label>
              <input
                type="number"
                name="passingScore"
                value={form.passingScore}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {form.hasAssessment && (
            <div className="mt-4 space-y-3">
              {form.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="rounded-lg border border-line bg-surface p-4"
                >

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(questionIndex, 'question', e.target.value)
                      }
                      placeholder={`Question ${questionIndex + 1}`}
                      className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          questions: form.questions.filter(
                            (_, index) => index !== questionIndex
                          ),
                        })
                      }
                      className="rounded-lg border border-line bg-white px-2.5 py-2 text-xs font-semibold text-destructive"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() =>
                            updateQuestion(
                              questionIndex,
                              'correctAnswer',
                              optionIndex
                            )
                          }
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const options = [...question.options];

                            options[optionIndex] = e.target.value;

                            updateQuestion(questionIndex, 'options', options);
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
                        />
                      </label>
                    ))}
                  </div>

                  <p className="mt-2 text-[0.6875rem] text-ink-muted">
                    Tick the circle next to the correct answer.
                  </p>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    questions: [...form.questions, emptyQuestion()],
                  })
                }
                className="rounded-lg border border-dashed border-brand-border bg-brand-softest px-3 py-2 text-xs font-semibold text-brand"
              >
                Add Question
              </button>
            </div>
          )}
        </section>

        <div className="flex justify-end gap-2 pb-4">
          <button
            type="button"
            onClick={() => navigate('/admin/online-courses')}
            className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {id ? 'Update Course' : 'Save Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnlineCourseForm;
