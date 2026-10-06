import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createRequest,
  getMyRequests,
  getRequestById,
  getRecommendations,
  // Counsellor (Guidance Person) side
  getMyAssignedRequests,
  saveGuidance,
  markCompleted,
} from '../controllers/counsellingguidance.controller.js';

const router = express.Router();

// ── Student Routes ────────────────────────────────────────────────────
router.post('/recommend', authMiddleware, getRecommendations);
router.post('/', authMiddleware, createRequest);
router.get('/my', authMiddleware, getMyRequests);

// ── Counsellor (Guidance Person) Routes ──────────────────────────────
router.get('/my-assigned', authMiddleware, getMyAssignedRequests);

// ── Shared (must come after specific routes) ──────────────────────────
router.get('/:id', authMiddleware, getRequestById);
router.put('/:id/guidance', authMiddleware, saveGuidance);
router.put('/:id/complete', authMiddleware, markCompleted);

export default router;
