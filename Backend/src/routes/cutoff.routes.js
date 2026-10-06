import express from 'express';
import {
  getCutoffs,
  getCutoffById,
  createCutoff,
  updateCutoff,
  deleteCutoff,
} from '../controllers/cutoff.controller.js';
import authMiddleware, { adminMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Reads are public - the college detail page shows cutoffs to signed-out visitors.
router.get('/', getCutoffs);
router.get('/:id', getCutoffById);

// Writes are admin-only.
router.post('/', authMiddleware, adminMiddleware, createCutoff);
router.put('/:id', authMiddleware, adminMiddleware, updateCutoff);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCutoff);

export default router;
