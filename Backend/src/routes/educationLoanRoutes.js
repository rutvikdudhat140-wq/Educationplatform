import express from 'express';
import {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus
} from '../controllers/educationLoanController.js';

const router = express.Router();

// Public routes
router.get('/articles', (req, res, next) => {
  // If not admin, restrict to published
  if (req.headers['x-admin-request'] !== 'true') {
    req.query.status = 'published';
  }
  next();
}, getArticles);

router.get('/articles/id/:id', getArticleById);

router.get('/articles/:slug', getArticleBySlug);

router.post('/enquiries', createEnquiry);

// Admin routes (assuming simple admin check or to be protected by auth middleware)
// For the sake of this task, relying on standard REST. In production, add auth middleware.
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

router.get('/enquiries', getEnquiries);
router.put('/enquiries/:id/status', updateEnquiryStatus);

export default router;
