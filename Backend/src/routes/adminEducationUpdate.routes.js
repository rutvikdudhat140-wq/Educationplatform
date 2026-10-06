import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAdminEducationUpdates,
  createEducationUpdate,
  updateEducationUpdate,
  deleteEducationUpdate,
  getAdminAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} from '../controllers/adminEducationUpdate.controller.js';

const router = express.Router();

router.use(authMiddleware);

// Education Update Management Routes
// GET /api/admin/education-updates - all updates including drafts
router.get('/education-updates', getAdminEducationUpdates);

// POST /api/admin/education-updates - create a new update
router.post('/education-updates', createEducationUpdate);

// PUT /api/admin/education-updates/:id - update an update
router.put('/education-updates/:id', updateEducationUpdate);

// DELETE /api/admin/education-updates/:id - delete an update
router.delete('/education-updates/:id', deleteEducationUpdate);

// Alert Management Routes
// GET /api/admin/alerts - all alerts
router.get('/alerts', getAdminAlerts);

// POST /api/admin/alerts - create a new alert
router.post('/alerts', createAlert);

// PUT /api/admin/alerts/:id - update an alert
router.put('/alerts/:id', updateAlert);

// DELETE /api/admin/alerts/:id - delete an alert
router.delete('/alerts/:id', deleteAlert);

export default router;
