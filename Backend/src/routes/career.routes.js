import express from 'express';
import {
  createCareer,
  deleteCareer,
  getCareer,
  getCareers,
  updateCareer,
} from '../controllers/career.controller.js';

const router = express.Router();

router.get('/', getCareers);
router.get('/:id', getCareer);
router.post('/', createCareer);
router.put('/:id', updateCareer);
router.delete('/:id', deleteCareer);

export default router;
