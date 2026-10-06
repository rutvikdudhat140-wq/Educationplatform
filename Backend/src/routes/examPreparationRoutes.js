import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
    createExamPreparation,
    deleteExamPreparation,
    getExamPreparations,
    getExamPreparationById,
    updateExamPreparation,
} from '../controllers/examPreparationController.js';

const router = express.Router();

// Public GET (user side reads without token)
router.get('/', getExamPreparations);
router.get('/:id', getExamPreparationById);

// Admin protected
router.post('/', authMiddleware, createExamPreparation);
router.put('/:id', authMiddleware, updateExamPreparation);
router.delete('/:id', authMiddleware, deleteExamPreparation);

export default router;
