import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllRequests,
  getRequestById,
  assignCounsellor,
  updateStatus,
  scheduleSession,
  completeSession,
  addRecommendations,
  setFollowUp,
  closeCounselling,
  updateRequest,
  deleteCounsellingRequest,
  // Guidance Person (Counsellor) Management
  getAllCounsellors,
  getActiveCounsellors,
  createCounsellor,
  updateCounsellor,
  toggleCounsellorStatus,
  deleteCounsellor,
} from '../controllers/counsellingguidance.controller.js';

const router = express.Router();

// ── Guidance Person Management (must come BEFORE /:id routes) ────────
router.get('/counsellors/all', authMiddleware, getAllCounsellors);
router.get('/counsellors/active', authMiddleware, getActiveCounsellors);
router.post('/counsellors', authMiddleware, createCounsellor);
router.put('/counsellors/:id/toggle', authMiddleware, toggleCounsellorStatus);
router.put('/counsellors/:id', authMiddleware, updateCounsellor);
router.delete('/counsellors/:id', authMiddleware, deleteCounsellor);

// ── Counselling Requests ──────────────────────────────────────────────
router.get('/', authMiddleware, getAllRequests);
router.get('/:id', authMiddleware, getRequestById);
router.put('/:id', authMiddleware, updateRequest);
router.put('/:id/assign', authMiddleware, assignCounsellor);
router.put('/:id/status', authMiddleware, updateStatus);
router.put('/:id/session', authMiddleware, scheduleSession);
router.put('/:id/recommendations', authMiddleware, addRecommendations);
router.put('/:id/follow-up', authMiddleware, setFollowUp);
router.put('/:id/close', authMiddleware, closeCounselling);
router.delete('/:id', authMiddleware, deleteCounsellingRequest);

export default router;
