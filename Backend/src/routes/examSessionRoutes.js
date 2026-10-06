import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
    createExamSession,
    deleteExamSession,
    getExamSession,
    getExamSessions,
    updateExamSession,
} from '../controllers/examSessionController.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getExamSessions);
router.get('/:id', getExamSession);
router.post('/', createExamSession);
router.put('/:id', updateExamSession);
router.delete('/:id', deleteExamSession);

export default router;
