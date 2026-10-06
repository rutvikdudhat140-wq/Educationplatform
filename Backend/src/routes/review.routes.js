import express from 'express';
import {
    addReview,
    getReviewsByCollege,
    getAllReviews,
    deleteReview,
    updateReviewStatus
} from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', addReview);
router.get('/college/:collegeId', getReviewsByCollege);
router.get('/', getAllReviews);
router.delete('/:id', deleteReview);
router.put('/:id/status', updateReviewStatus);

export default router;
