import { Router } from 'express';
import { getAllCourses, getCourseById, createCourse } from '../controllers/courseController';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse); // Admin only in production

export default router;
