import express from 'express';
import { signUp, login, getProfile } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createCutoff,
  createRule,
  deleteCutoff,
  deleteRule,
  getCutoff,
  listCutoffs,
  listRules,
  updateCutoff,
  updateRule,
} from '../controllers/prediction.controller.js';


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

router.get('/cutoffs', authMiddleware, listCutoffs);
router.post('/cutoffs', authMiddleware, createCutoff);
router.get('/cutoffs/:id', authMiddleware, getCutoff);
router.put('/cutoffs/:id', authMiddleware, updateCutoff);
router.delete('/cutoffs/:id', authMiddleware, deleteCutoff);

router.get('/rank-prediction-rules', authMiddleware, listRules);
router.post('/rank-prediction-rules', authMiddleware, createRule);
router.put('/rank-prediction-rules/:id', authMiddleware, updateRule);
router.delete('/rank-prediction-rules/:id', authMiddleware, deleteRule);



export default router;
