import express from 'express';
import authMiddleware, {
  adminMiddleware,
} from '../middleware/auth.middleware.js';
import {
  getAdminOnlineCourses,
  getAdminOnlineCourse,
  createOnlineCourse,
  updateOnlineCourse,
  deleteOnlineCourse,
  getOnlineCourseEnrollments,
  deleteOnlineCourseEnrollment,
} from '../controllers/onlineCourse.controller.js';
import {
  getAdminCertificates,
  getAdminCertificateById,
  updateCertificateStatus,
} from '../controllers/certificate.controller.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/online-courses', getAdminOnlineCourses);
router.post('/online-courses', createOnlineCourse);
router.get('/online-courses/:id', getAdminOnlineCourse);
router.put('/online-courses/:id', updateOnlineCourse);
router.delete('/online-courses/:id', deleteOnlineCourse);

router.get('/online-course-enrollments', getOnlineCourseEnrollments);
router.delete(
  '/online-course-enrollments/:id',
  deleteOnlineCourseEnrollment
);

router.get('/certificates', getAdminCertificates);
router.get('/certificates/:id', getAdminCertificateById);
router.patch('/certificates/:id/status', updateCertificateStatus);

export default router;
