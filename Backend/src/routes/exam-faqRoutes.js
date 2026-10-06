import express from 'express';
import { getExamFaqs, getExamFaq, createExamFaq, updateExamFaq, deleteExamFaq } from '../controllers/ExamFaqController.js';

const router = express.Router();

router.route('/').get(getExamFaqs).post(createExamFaq);
router.route('/:id').get(getExamFaq).put(updateExamFaq).delete(deleteExamFaq);

export default router;
