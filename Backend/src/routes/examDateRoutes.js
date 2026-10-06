import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
    createExamDate,
    deleteExamDate,
    getExamDate,
    getExamDates,
    getUpcomingExamDates,
    getOngoingExamDates,
    getCompletedExamDates,
    updateExamDate,
} from '../controllers/examDateController.js';

const router = express.Router();

router.get('/upcoming', getUpcomingExamDates);
router.get('/ongoing', getOngoingExamDates);
router.get('/completed', getCompletedExamDates);

router.use(authMiddleware);
router.get('/', getExamDates);
router.get('/:id', getExamDate);
router.post('/', createExamDate);
router.put('/:id', updateExamDate);
router.delete('/:id', deleteExamDate);

export default router;
