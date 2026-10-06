import express from 'express';
import {
  collegePredictor,
  getPredictorSessions,
  rankPredictor,
  listCutoffs,
} from '../controllers/prediction.controller.js';

const router = express.Router();

router.get('/predictor-exam-sessions', getPredictorSessions);
router.post('/rank-predictor', rankPredictor);
router.post('/college-predictor', collegePredictor);
router.get('/cutoffs', listCutoffs);

export default router;
