import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getOnlineCourses,
  getOnlineCourseById,
  enrollInCourse,
  getMyLearning,
  completeLesson,
  submitAssessment,
} from '../controllers/onlineCourse.controller.js';

const router = express.Router();

router.get('/', getOnlineCourses);
router.get('/my-learning', authMiddleware, getMyLearning);
router.get('/:id', getOnlineCourseById);
router.post('/:id/enroll', authMiddleware, enrollInCourse);
router.post(
  '/:courseId/lessons/:lessonId/complete',
  authMiddleware,
  completeLesson
);
router.post('/:courseId/assessment/submit', authMiddleware, submitAssessment);

export default router;
