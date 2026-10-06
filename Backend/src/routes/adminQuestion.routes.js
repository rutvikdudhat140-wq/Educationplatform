import express from 'express';
import authMiddleware, {
  adminMiddleware,
} from '../middleware/auth.middleware.js';
import {
  getAllQuestions,
  getQuestionById,
  deleteQuestion,
  deleteAnswer,
  updateQuestionStatus,
  updateAnswerStatus,
  addAnswer,
} from '../controllers/adminQuestion.controller.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/questions', getAllQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions/:id/answers', addAnswer);
router.delete('/questions/:id', deleteQuestion);
router.delete('/questions/answers/:answerId', deleteAnswer);
router.patch('/questions/:id/status', updateQuestionStatus);
router.patch('/questions/answers/:answerId/status', updateAnswerStatus);

export default router;
