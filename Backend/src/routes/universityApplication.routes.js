import express from 'express';
import {
  checkUniversityApplication,
  createUniversityApplication,
  getMyUniversityApplications,
  getUniversityApplications,
} from '../controllers/universityApplication.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createUniversityApplication);
router.get('/my', authMiddleware, getMyUniversityApplications);
router.get('/check/:universityId', authMiddleware, checkUniversityApplication);
router.get('/university/:universityId', authMiddleware, getUniversityApplications);

export default router;
