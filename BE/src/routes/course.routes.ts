import { Router } from 'express';
import { body } from 'express-validator';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/course.controller';
import { authenticate, requireRole, requireTeacherOrStudentTeacher } from '../middleware/auth';
import { courseCreateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourse);

router.post(
  '/',
  authenticate,
  requireTeacherOrStudentTeacher,
  courseCreateLimiter,
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('subject').trim().isLength({ min: 2, max: 100 }),
    body('grades').optional().isArray(),
    body('school').optional().trim(),
    body('youtubeUrl').trim().notEmpty(),
    body('isHealthContent').optional().isBoolean(),
    body('isSpecialNeeds').optional().isBoolean(),
  ],
  createCourse
);

router.put(
  '/:id',
  authenticate,
  requireRole('professional', 'kid_tutor', 'admin', 'student'),
  [
    body('title').optional().trim().isLength({ min: 3, max: 200 }),
    body('subject').optional().trim().isLength({ min: 2, max: 100 }),
    body('grades').optional().isArray(),
    body('school').optional().trim(),
    body('youtubeUrl').optional().trim(),
    body('isHealthContent').optional().isBoolean(),
  ],
  updateCourse
);

router.delete('/:id', authenticate, requireRole('professional', 'kid_tutor', 'admin', 'student'), deleteCourse);

export default router;
