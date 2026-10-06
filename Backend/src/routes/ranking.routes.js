import express from 'express';
import {
  getAllRankings,
  getRankingById,
  createRanking,
  updateRanking,
  deleteRanking,
  getUserRankings,
  getRankingsByCollege
} from '../controllers/ranking.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin routes FIRST (protected)
router.get('/admin/list', authMiddleware, getAllRankings);
router.post('/admin/create', authMiddleware, createRanking);
router.get('/admin/single/:id', authMiddleware, getRankingById);
router.put('/admin/update/:id', authMiddleware, updateRanking);
router.delete('/admin/delete/:id', authMiddleware, deleteRanking);

// User routes (public)
router.get('/college/:collegeId', getRankingsByCollege);
router.get('/', getUserRankings);

export default router;
