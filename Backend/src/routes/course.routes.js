import express from 'express';

import {
    addCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getPopularCourses
} from '../controllers/course.controller.js';

const router = express.Router();

router.post('/', addCourse);
router.get('/', getCourses);
router.get('/popular', getPopularCourses);
router.get('/id/:id', getCourseById);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
export default router;
