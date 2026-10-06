import express from 'express';
import { getExamMockTests, getExamMockTest, createExamMockTest, updateExamMockTest, deleteExamMockTest } from '../controllers/ExamMockTestController.js';

const router = express.Router();

router.route('/').get(getExamMockTests).post(createExamMockTest);
router.route('/:id').get(getExamMockTest).put(updateExamMockTest).delete(deleteExamMockTest);

export default router;
