import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getExamPatterns, getExamPatternById, createExamPattern, updateExamPattern, deleteExamPattern } from '../controllers/ExamPatternController.js';

const router = express.Router();

router.get('/', getExamPatterns);

router.use(authMiddleware);

router.post('/', createExamPattern);
router.route('/:id').get(getExamPatternById).put(updateExamPattern).delete(deleteExamPattern);

export default router;
