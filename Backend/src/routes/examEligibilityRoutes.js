import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
    createExamEligibility,
    deleteExamEligibility,
    getExamEligibilities,
    getExamEligibility,
    updateExamEligibility,
} from '../controllers/examEligibilityController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExamEligibilities);
router.get('/:id', getExamEligibility);
router.post('/', createExamEligibility);
router.put('/:id', updateExamEligibility);
router.delete('/:id', deleteExamEligibility);

export default router;
