import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import adminRoutes from './routes/admin.routes';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Visitor tracking middleware
app.use(async (req, res, next) => {
  if (req.method === 'GET' && req.path.startsWith('/courses')) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
    prisma.visitorLog.create({ data: { ip } }).catch(() => {});
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
