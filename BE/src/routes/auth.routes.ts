import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, updateMe, toggleLikesToTeachSelf } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['student', 'teacher']),
    body('email').optional({ nullable: true }).isEmail().normalizeEmail(),
    body('grade').optional().trim(),
    body('school').optional().trim(),
    body('isDisplaced').optional().isBoolean(),
    body('syndicateNumber').optional().trim(),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('username').trim().notEmpty(),
    body('password').notEmpty(),
  ],
  login
);

router.patch('/me', authenticate, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional({ nullable: true }).isEmail().normalizeEmail(),
  body('currentPassword').optional().notEmpty(),
  body('newPassword').optional().isLength({ min: 6 }),
], updateMe);
router.patch('/me/likes-to-teach', authenticate, toggleLikesToTeachSelf);

export default router;
