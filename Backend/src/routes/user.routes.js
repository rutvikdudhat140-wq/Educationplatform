import express from 'express';
import {
    signUp,
    login,
    logout,
    changePassword,
} from '../controllers/user.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);
router.post('/logout', logout);


export default router
