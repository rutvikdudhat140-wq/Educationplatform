import express from 'express';
import {
  createCareer,
  deleteCareer,
  getCareer,
  getCareers,
  updateCareer,
  submitMentorshipRequest,
  getAllMentorshipRequests,
  updateMentorshipRequestStatus
} from '../controllers/career.controller.js';

const router = express.Router();

router.get('/', getCareers);
router.get('/:id', getCareer);
router.post('/', createCareer);
router.put('/:id', updateCareer);
router.delete('/:id', deleteCareer);

// Mentorship Requests
router.post('/:id/mentor-request', submitMentorshipRequest);
router.get('/admin/mentorship-requests', getAllMentorshipRequests);
router.put('/admin/mentorship-requests/:id', updateMentorshipRequestStatus);

export default router;
