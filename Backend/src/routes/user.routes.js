import express from 'express';
import {
    signUp,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    // changePassword,
} from '../controllers/user.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
// router.post('/change-password', authMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);


export default router
