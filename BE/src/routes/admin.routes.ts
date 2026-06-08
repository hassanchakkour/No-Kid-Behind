import { Router } from 'express';
import {
  getStats, getUsers, deleteUser, deleteCourse, getAllCourses,
  toggleLikesToTeach, getPendingKidTutors, approveKidTutor,
  createSchoolAdmin, getSchoolAdminUsers, getSchoolAdminPendingKidTutors,
  approveKidTutorScoped, resetUserPassword,
  getPendingCourses, approveCourse, rejectCourse,
} from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// ── Super admin only ────────────────────────────────────────────────────────
router.get('/stats', requireRole('admin'), getStats);
router.get('/users', requireRole('admin'), getUsers);
router.delete('/user/:id', requireRole('admin'), deleteUser);
router.patch('/user/:id/likes-to-teach', requireRole('admin'), toggleLikesToTeach);
router.patch('/user/:id/approve-kid-tutor', requireRole('admin'), approveKidTutor);
router.get('/pending-kid-tutors', requireRole('admin'), getPendingKidTutors);
router.get('/courses', requireRole('admin'), getAllCourses);
router.delete('/course/:id', requireRole('admin'), deleteCourse);
router.post('/create-school-admin', requireRole('admin'), createSchoolAdmin);
router.patch('/user/:id/password', requireRole('admin'), resetUserPassword);
router.get('/pending-courses', requireRole('admin'), getPendingCourses);
router.patch('/course/:id/approve', requireRole('admin'), approveCourse);
router.patch('/course/:id/reject', requireRole('admin'), rejectCourse);

// ── School admin scoped (admin OR school_admin) ─────────────────────────────
router.get('/school/users', requireRole('admin', 'school_admin'), getSchoolAdminUsers);
router.get('/school/pending-kid-tutors', requireRole('admin', 'school_admin'), getSchoolAdminPendingKidTutors);
router.patch('/school/approve-kid-tutor/:id', requireRole('admin', 'school_admin'), approveKidTutorScoped);

export default router;
