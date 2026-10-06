import express from "express";

import {
  createUniversity,
  getUniversities,
  getUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/university.controller.js";

const router = express.Router();

router.post('/', createUniversity);
router.get('/', getUniversities);
router.get('/:id', getUniversity);
router.put('/:id', updateUniversity);
router.delete('/:id', deleteUniversity);

export default router
