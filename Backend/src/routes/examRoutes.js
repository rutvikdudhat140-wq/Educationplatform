import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createExam, deleteExam, getExam, getExams, updateExam } from '../controllers/examController.js';

const router = express.Router();

router.get('/', getExams);
router.get('/:id', getExam);

router.use(authMiddleware);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
