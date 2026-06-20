import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import adminRoutes from './routes/admin.routes';
import analyticsRoutes from './routes/analytics.routes';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nokidbehind.com',
  'https://www.nokidbehind.com',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Visitor tracking middleware
app.use(async (req, _res, next) => {
  if (req.method === 'GET' && req.path.startsWith('/courses')) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
    prisma.visitorLog.create({ data: { ip } }).catch(() => {});
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/admin', adminRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
