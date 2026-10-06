import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllScholarshipsAdmin,
  getScholarshipByIdAdmin,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getAllApplicationsAdmin,
  getApplicationByIdAdmin,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/adminScholarship.controller.js';

const router = express.Router();

// All admin routes require authentication
router.use(authMiddleware);

// Scholarship Management Routes
// GET /api/admin/scholarships - Get all scholarships (including inactive)
router.get('/scholarships', getAllScholarshipsAdmin);

// POST /api/admin/scholarships - Create new scholarship
router.post('/scholarships', createScholarship);

// GET /api/admin/scholarships/:id - Get scholarship by ID
router.get('/scholarships/:id', getScholarshipByIdAdmin);

// PUT /api/admin/scholarships/:id - Update scholarship
router.put('/scholarships/:id', updateScholarship);

// DELETE /api/admin/scholarships/:id - Delete/Deactivate scholarship
router.delete('/scholarships/:id', deleteScholarship);

// Application Management Routes
// GET /api/admin/scholarship-applications - Get all applications
router.get('/scholarship-applications', getAllApplicationsAdmin);

// GET /api/admin/scholarship-applications/:id - Get application by ID
router.get('/scholarship-applications/:id', getApplicationByIdAdmin);

// PUT /api/admin/scholarship-applications/:id/status - Update application status
router.put('/scholarship-applications/:id/status', updateApplicationStatus);

// DELETE /api/admin/scholarship-applications/:id - Delete application
router.delete('/scholarship-applications/:id', deleteApplication);

export default router;