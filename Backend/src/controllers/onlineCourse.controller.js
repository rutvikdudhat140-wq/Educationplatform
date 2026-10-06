import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import OnlineCourse from '../models/onlineCourse.model.js';
import CourseEnrollment from '../models/courseEnrollment.model.js';
import Certificate from '../models/certificate.model.js';
import { issueCertificate } from './certificate.controller.js';
import { stripEmptyValues } from '../utils/relaxedValidation.js';

const LIST_FIELDS =
  'title shortDescription thumbnail category level instructor duration price discountPrice isFree isActive rating studentCount createdAt modules';

const getLessons = (course) =>
  (course?.modules || []).flatMap((module) => module.lessons || []);

const totalLessons = (course) => getLessons(course).length;

const getOptionalUserId = (req) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  try {
    return jwt.verify(header.slice(7), process.env.JWT_SECRET || 'secretkey').id;
  } catch {
    return null;
  }
};

/**
 * A lesson can only be completed once the previous one is done - the curriculum
 * rail already enforces this in the UI, so the API has to enforce it too or the
 * certificate could be earned by calling the endpoint in a loop.
 */
const getLockedReason = (course, lessons, lesson, completedLessons) => {
  const index = lessons.findIndex((item) => item._id.toString() === lesson._id.toString());
  const done = completedLessons.map((item) => item.toString());

  if (index <= 0 || lesson.isFreePreview) {
    return null;
  }

  if (!done.includes(lessons[index - 1]._id.toString())) {
    return 'Complete the previous lesson first';
  }

  return null;
};

const isEligibleForCompletion = (enrollment, course) => {
  const lessons = getLessons(course);
  const done = new Set(enrollment.completedLessons.map((item) => item.toString()));
  const validIds = lessons.map((lesson) => lesson._id.toString());

  // Lessons deleted by an admin must not keep an enrollment "complete" forever.
  const completedCount = validIds.filter((id) => done.has(id)).length;

  return completedCount >= lessons.length;
};

const shouldAwardCertificate = (enrollment, course) => {
  // A course with no lessons and no assessment is complete the moment it is
  // enrolled in, otherwise the learner would be stuck with no way to finish.
  if (totalLessons(course) === 0 && !course.hasAssessment) {
    return false;
  }

  if (!isEligibleForCompletion(enrollment, course)) {
    return false;
  }

  return course.hasAssessment ? Boolean(enrollment.assessmentPassed) : true;
};

/**
 * Marks the enrollment complete and issues the certificate.
 *
 * Safe to call repeatedly: `issueCertificate` is idempotent, and a re-run also
 * repairs enrollments that were completed before the certificate existed.
 */
const checkCompletion = async (enrollment, course) => {
  if (!shouldAwardCertificate(enrollment, course)) {
    return { enrollment, certificate: null, justCompleted: false };
  }

  const alreadyCompleted = enrollment.status === 'COMPLETED';
  let certificate = await Certificate.findOne({
    userId: enrollment.userId,
    onlineCourseId: course._id,
  });

  if (enrollment.status !== 'COMPLETED' || !enrollment.completedAt) {
    enrollment.status = 'COMPLETED';
    enrollment.completedAt = enrollment.completedAt || new Date();
    await enrollment.save();
  }

  certificate = await issueCertificate(enrollment, course);

  return {
    enrollment,
    certificate,
    justCompleted: !alreadyCompleted,
  };
};

export const getOnlineCourses = async (req, res) => {
  try {
    const { search, category, level, type, duration } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (type === 'free' || type === 'paid') {
      filter.isFree = type === 'free';
    }

    if (duration === 'short') {
      filter.duration = { $lte: 5 };
    }

    if (duration === 'medium') {
      filter.duration = { $gt: 5, $lte: 20 };
    }

    if (duration === 'long') {
      filter.duration = { $gt: 20 };
    }

    const [courses, categories] = await Promise.all([
      OnlineCourse.find(filter).select(LIST_FIELDS).sort({ createdAt: -1 }),
      OnlineCourse.distinct('category', { isActive: true }),
    ]);

    res.status(200).json({
      data: courses,
      categories: categories.filter(Boolean).sort(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOnlineCourseById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = await OnlineCourse.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userId = getOptionalUserId(req);
    let enrollment = userId
      ? await CourseEnrollment.findOne({
        userId,
        onlineCourseId: course._id,
      })
      : null;

    // Self-heal: a completed enrollment whose certificate never made it (a
    // failed write, a legacy record) is repaired the next time it is loaded.
    if (enrollment) {
      const { certificate } = await checkCompletion(enrollment, course);

      enrollment = enrollment.toObject();

      if (certificate) {
        enrollment.certificateId = certificate.certificateId;
        enrollment.certificateStatus = certificate.status;
      }
    }

    const data = course.toObject({ virtuals: true });

    data.questions = (course.questions || []).map((question, index) => ({
      _id: question._id || index,
      question: question.question,
      options: question.options,
    }));
    data.enrollment = enrollment || null;

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = await OnlineCourse.findById(req.params.id);

    if (!course || !course.isActive) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existing = await CourseEnrollment.findOne({
      userId: req.user.id,
      onlineCourseId: course._id,
    });

    if (existing) {
      return res.status(200).json({
        message: 'Already enrolled',
        data: existing,
      });
    }

    const enrollment = await CourseEnrollment.create({
      userId: req.user.id,
      onlineCourseId: course._id,
      status: 'ENROLLED',
    });

    await OnlineCourse.updateOne(
      { _id: course._id },
      { $inc: { studentCount: 1 } }
    );

    await checkCompletion(enrollment, course);

    res.status(201).json({
      message: 'Enrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLearning = async (req, res) => {
  try {
    const [enrollments, certificates] = await Promise.all([
      CourseEnrollment.find({ userId: req.user.id })
        .populate('onlineCourseId', 'title thumbnail instructor modules')
        .sort({ lastActivityAt: -1 }),
      Certificate.find({ userId: req.user.id }).select(
        'onlineCourseId certificateId status issuedAt completionDate'
      ),
    ]);

    const certificateByCourse = new Map(
      certificates.map((certificate) => [
        certificate.onlineCourseId.toString(),
        certificate,
      ])
    );

    const data = [];

    for (const enrollment of enrollments) {
      const course = enrollment.onlineCourseId;

      // The course was deleted by an admin - it can no longer be learned, and
      // navigating to it would build a broken "/online-courses/undefined" URL.
      if (!course) {
        continue;
      }

      // Repairs any completed enrollment that is still missing its certificate.
      const { certificate } = await checkCompletion(enrollment, course);
      const linked = certificate || certificateByCourse.get(course._id.toString());

      const lessons = getLessons(course);
      const lastLesson = lessons.find(
        (lesson) =>
          lesson._id.toString() === enrollment.lastAccessedLesson?.toString()
      );

      data.push({
        enrollmentId: enrollment._id,
        status: enrollment.status,
        completedLessons: enrollment.completedLessons.length,
        totalLessons: lessons.length,
        lastAccessedLesson: lastLesson
          ? { _id: lastLesson._id, title: lastLesson.title }
          : null,
        assessmentPassed: enrollment.assessmentPassed,
        assessmentScore: enrollment.assessmentScore,
        startedAt: enrollment.startedAt,
        completedAt: enrollment.completedAt,
        lastActivityAt: enrollment.lastActivityAt,
        certificateId: linked?.certificateId || '',
        certificateRecordId: linked?._id ? String(linked._id) : '',
        certificateStatus: linked?.status || '',
        course,
      });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(lessonId)) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await OnlineCourse.findById(courseId);
    const lessons = getLessons(course);
    const lesson = lessons.find((item) => item._id.toString() === lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const enrollment = await CourseEnrollment.findOne({
      userId: req.user.id,
      onlineCourseId: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        message: 'You are not enrolled in this course',
      });
    }

    const locked = getLockedReason(course, lessons, lesson, enrollment.completedLessons);

    if (locked) {
      return res.status(403).json({ message: locked });
    }

    // $addToSet keeps the array free of duplicates even if the request is
    // retried or double-clicked.
    const updated = await CourseEnrollment.findOneAndUpdate(
      { _id: enrollment._id },
      {
        $addToSet: { completedLessons: lesson._id },
        $set: {
          lastAccessedLesson: lesson._id,
          lastActivityAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (updated.status === 'ENROLLED') {
      updated.status = 'IN_PROGRESS';
      await updated.save();
    }

    const { certificate, justCompleted } = await checkCompletion(updated, course);

    res.status(200).json({
      message: 'Lesson completed',
      status: updated.status,
      completedLessons: updated.completedLessons.length,
      totalLessons: totalLessons(course),
      lastAccessedLesson: lesson._id,
      justCompleted: justCompleted && Boolean(certificate),
      certificateId: certificate?.certificateId || '',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = await OnlineCourse.findById(courseId);

    if (!course?.hasAssessment) {
      return res.status(404).json({
        message: 'Assessment not available for this course',
      });
    }

    const enrollment = await CourseEnrollment.findOne({
      userId: req.user.id,
      onlineCourseId: course._id,
    });

    if (!enrollment) {
      return res.status(404).json({
        message: 'You are not enrolled in this course',
      });
    }

    if (!isEligibleForCompletion(enrollment, course)) {
      return res.status(403).json({
        message: 'Complete all lessons before taking the assessment',
      });
    }

    const answers = req.body.answers || [];
    const questions = course.questions || [];
    const correct = questions.filter(
      (question, index) =>
        Number(answers[index]) === Number(question.correctAnswer)
    ).length;
    const total = questions.length;
    // An assessment with no questions is treated as passed, otherwise the
    // learner could never finish the course.
    const score = total ? Math.round((correct / total) * 100) : 100;
    const passed = score >= course.passingScore;

    enrollment.assessmentScore = score;
    enrollment.assessmentTotal = total;
    enrollment.assessmentLastAttemptAt = new Date();

    // A pass is never downgraded by a later failed retake, so an already
    // issued certificate can never be contradicted by the UI.
    if (passed || !enrollment.assessmentPassed) {
      enrollment.assessmentPassed = passed;
    }

    enrollment.lastActivityAt = new Date();

    await enrollment.save();

    const { certificate, justCompleted } = await checkCompletion(enrollment, course);

    res.status(200).json({
      score,
      total,
      correct,
      passingScore: course.passingScore,
      passed: enrollment.assessmentPassed,
      status: enrollment.status,
      justCompleted: justCompleted && Boolean(certificate),
      certificateId: certificate?.certificateId || '',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminOnlineCourses = async (req, res) => {
  try {
    const data = await OnlineCourse.find().select(LIST_FIELDS);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminOnlineCourse = async (req, res) => {
  try {
    const data = await OnlineCourse.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOnlineCourse = async (req, res) => {
  try {
    const data = await OnlineCourse.create(stripEmptyValues(req.body));

    res.status(201).json({
      message: 'Online course added successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOnlineCourse = async (req, res) => {
  try {
    const data = await OnlineCourse.findByIdAndUpdate(
      req.params.id,
      stripEmptyValues(req.body),
      { returnDocument: 'after', runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Online course updated successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOnlineCourse = async (req, res) => {
  try {
    const course = await OnlineCourse.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Cascade: leaving these behind produces orphan enrollments and
    // certificates that point at a course which no longer exists.
    await Promise.all([
      CourseEnrollment.deleteMany({ onlineCourseId: course._id }),
      Certificate.deleteMany({ onlineCourseId: course._id }),
    ]);

    res.status(200).json({ message: 'Online course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOnlineCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find()
      .populate('userId', 'name email')
      .populate('onlineCourseId', 'title modules')
      .sort({ startedAt: -1 });

    const data = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      student: enrollment.userId,
      course: {
        _id: enrollment.onlineCourseId?._id,
        title: enrollment.onlineCourseId?.title,
      },
      completedLessons: enrollment.completedLessons.length,
      totalLessons: totalLessons(enrollment.onlineCourseId),
      status: enrollment.status,
      startedAt: enrollment.startedAt,
      lastActivityAt: enrollment.lastActivityAt,
      completedAt: enrollment.completedAt,
    }));

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOnlineCourseEnrollment = async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    await OnlineCourse.updateOne(
      {
        _id: enrollment.onlineCourseId,
        studentCount: { $gt: 0 },
      },
      { $inc: { studentCount: -1 } }
    );

    await Certificate.deleteOne({
      userId: enrollment.userId,
      onlineCourseId: enrollment.onlineCourseId,
    });

    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
