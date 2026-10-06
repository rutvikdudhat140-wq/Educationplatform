import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createQuestion,
  getQuestionsByCollege,
  getQuestionById,
  addAnswer,
  deleteQuestion,
  deleteAnswer,
} from '../controllers/question.controller.js';

const router = express.Router();

// Public
router.get('/college/:collegeId', getQuestionsByCollege);
router.get('/:id', getQuestionById);

// Auth required
router.post('/', authMiddleware, createQuestion);
router.post('/:id/answers', authMiddleware, addAnswer);
router.delete('/:id', authMiddleware, deleteQuestion);
router.delete('/answers/:answerId', authMiddleware, deleteAnswer);

export default router;
