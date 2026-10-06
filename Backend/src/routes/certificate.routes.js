import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getMyCertificates,
  getMyCertificateById,
  verifyCertificate,
} from '../controllers/certificate.controller.js';

const router = express.Router();

// Public: anyone with a certificate ID can confirm it is genuine.
router.get('/verify/:certificateId', verifyCertificate);

router.use(authMiddleware);

router.get('/my', getMyCertificates);
router.get('/my/:id', getMyCertificateById);

export default router;
