import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getEducationAlerts,
  markAlertAsRead,
  getUnreadAlertCount,
} from '../controllers/educationAlert.controller.js';

const router = express.Router();

// GET /api/education-alerts - active alerts with the student's read state
router.get('/education-alerts', authMiddleware, getEducationAlerts);

// GET /api/education-alerts/unread-count - badge count for the header
router.get('/education-alerts/unread-count', authMiddleware, getUnreadAlertCount);

// PUT /api/education-alerts/:id/read - mark a single alert as read
router.put('/education-alerts/:id/read', authMiddleware, markAlertAsRead);

export default router;
