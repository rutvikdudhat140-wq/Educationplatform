import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getMyRecommendations,
  getMyCourseRecommendations,
  getMyCollegeRecommendations,
  getMyProfile,
  updateMyProfile,
  removeRecommendation
} from '../controllers/recommendation.controller.js';

const router = express.Router();

// Everything here belongs to the signed-in student, identified from the token.
router.get('/', authMiddleware, getMyRecommendations);
router.get('/courses', authMiddleware, getMyCourseRecommendations);
router.get('/colleges', authMiddleware, getMyCollegeRecommendations);
router.get('/profile', authMiddleware, getMyProfile);
router.put('/profile', authMiddleware, updateMyProfile);

router.delete('/:type/:id', authMiddleware, removeRecommendation);

export default router;

