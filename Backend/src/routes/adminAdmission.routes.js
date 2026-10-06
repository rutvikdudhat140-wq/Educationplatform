import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllAdmissions,
  getAdminAdmissionById,
  updateAdmissionStatus,
  verifyDocument,
  deleteAdmission
} from '../controllers/admission.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getAllAdmissions);
router.get('/:id', authMiddleware, getAdminAdmissionById);
router.put('/:id/status', authMiddleware, updateAdmissionStatus);
router.put('/:id/documents/verify', authMiddleware, verifyDocument);
router.delete('/:id', authMiddleware, deleteAdmission);

export default router;
