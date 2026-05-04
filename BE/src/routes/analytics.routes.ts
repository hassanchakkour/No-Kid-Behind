import { Router } from 'express';
import { body } from 'express-validator';
import { logMadristiClick } from '../controllers/analytics.controller';

const router = Router();

router.post('/madristi-click', [
  body('school').trim().notEmpty(),
], logMadristiClick);

export default router;
