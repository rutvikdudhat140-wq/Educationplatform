import express from 'express';
import { getExamSyllabuses, getExamSyllabus, createExamSyllabus, updateExamSyllabus, deleteExamSyllabus } from '../controllers/ExamSyllabusController.js';

const router = express.Router();

router.route('/').get(getExamSyllabuses).post(createExamSyllabus);
router.route('/:id').get(getExamSyllabus).put(updateExamSyllabus).delete(deleteExamSyllabus);

export default router;
