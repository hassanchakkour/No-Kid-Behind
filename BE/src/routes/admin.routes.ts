import { Router } from 'express';
import {
  getStats, getUsers, deleteUser, deleteCourse, getAllCourses,
  toggleLikesToTeach, getPendingKidTutors, approveKidTutor,
} from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.patch('/user/:id/likes-to-teach', toggleLikesToTeach);
router.patch('/user/:id/approve-kid-tutor', approveKidTutor);
router.get('/pending-kid-tutors', getPendingKidTutors);
router.get('/courses', getAllCourses);
router.delete('/course/:id', deleteCourse);

export default router;
