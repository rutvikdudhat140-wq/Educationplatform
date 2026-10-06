import express from 'express';
import { getExamSamplePapers, getExamSamplePaper, createExamSamplePaper, updateExamSamplePaper, deleteExamSamplePaper } from '../controllers/ExamSamplePaperController.js';

const router = express.Router();

router.route('/').get(getExamSamplePapers).post(createExamSamplePaper);
router.route('/:id').get(getExamSamplePaper).put(updateExamSamplePaper).delete(deleteExamSamplePaper);

export default router;
