import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getEducationUpdates,
  getEducationUpdateById,
  saveEducationUpdate,
  removeSavedEducationUpdate,
  getMyUpdates,
} from '../controllers/educationUpdate.controller.js';

const router = express.Router();

// GET /api/education-updates - published updates with search and filters
router.get('/education-updates', getEducationUpdates);

// GET /api/my-updates - saved updates, important alerts and recent updates
router.get('/my-updates', authMiddleware, getMyUpdates);

// POST /api/education-updates/:id/save - bookmark an update
router.post('/education-updates/:id/save', authMiddleware, saveEducationUpdate);

// DELETE /api/education-updates/:id/save - remove a bookmark
router.delete(
  '/education-updates/:id/save',
  authMiddleware,
  removeSavedEducationUpdate
);

// GET /api/education-updates/:id - full update with saved state
router.get('/education-updates/:id', getEducationUpdateById);

export default router;
