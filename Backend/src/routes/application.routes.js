import express from "express";

import {
  createApplication,
  getMyApplications,
  getCollegeApplications,
  getApplications,
  checkApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/", createApplication);
router.get("/my", getMyApplications);
router.get("/college/:collegeId", getCollegeApplications);
router.get("/check/:collegeId", checkApplication);
router.get("/", getApplications);

export default router;
