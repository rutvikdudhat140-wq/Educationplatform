import express from 'express';
import {
  getColleges,
  getCompareColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege
} from '../controllers/college.controller.js';

const router = express.Router();

router.get('/', getColleges);
router.get('/compare', getCompareColleges);
router.get('/:id', getCollege);
router.post('/', createCollege);
router.put('/:id', updateCollege);
router.delete('/:id', deleteCollege);

export default router;
