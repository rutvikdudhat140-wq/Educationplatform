import express from 'express';
import { signUp, login, getProfile } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

export default router;
