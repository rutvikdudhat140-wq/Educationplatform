import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllScholarships,
  getScholarshipById,
  getScholarshipsByCollege,
  applyForScholarship,
  getUserApplications,
  getApplicationById,
} from '../controllers/scholarship.controller.js';

const router = express.Router();

// Public routes (no authentication required)
// GET /api/scholarships - Get all active scholarships with filters
router.get('/', getAllScholarships);

// GET /api/scholarships/:id - Get scholarship details by ID
router.get('/:id', getScholarshipById);

// GET /api/scholarships/college/:collegeId - Get scholarships by college ID
router.get('/college/:collegeId', getScholarshipsByCollege);

// Protected routes (authentication required)
// POST /api/scholarships/:scholarshipId/apply - Apply for a scholarship
router.post('/:scholarshipId/apply', authMiddleware, applyForScholarship);

// GET /api/scholarships/my/applications - Get user's scholarship applications
router.get('/my/applications', authMiddleware, getUserApplications);

// GET /api/scholarships/applications/:id - Get application details by ID
router.get('/applications/:id', authMiddleware, getApplicationById);

export default router;