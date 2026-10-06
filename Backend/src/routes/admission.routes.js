import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  checkEligibility,
  createOrUpdateDraft,
  submitApplication,
  uploadDocument,
  getMyAdmissions,
  getAdmissionById,
  processPayment
} from '../controllers/admission.controller.js';

import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/eligibility', authMiddleware, checkEligibility);
router.post('/draft', authMiddleware, createOrUpdateDraft);
router.put('/:id/submit', authMiddleware, submitApplication);
router.put('/:id/documents', authMiddleware, upload.single('file'), uploadDocument);

router.get('/my', authMiddleware, getMyAdmissions);
router.get('/:id', authMiddleware, getAdmissionById,
  processPayment);

router.post('/:id/payments', authMiddleware, processPayment);

export default router;

