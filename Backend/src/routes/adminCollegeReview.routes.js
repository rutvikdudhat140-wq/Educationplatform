import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  adminGetReviews,
  adminGetReviewById,
  adminUpdateStatus,
  adminDeleteReview,
} from '../controllers/collegeReview.controller.js';

const router = express.Router();

router.get('/', authMiddleware, adminGetReviews);
router.get('/:id', authMiddleware, adminGetReviewById);
router.put('/:id/status', authMiddleware, adminUpdateStatus);
router.delete('/:id', authMiddleware, adminDeleteReview);

export default router;
