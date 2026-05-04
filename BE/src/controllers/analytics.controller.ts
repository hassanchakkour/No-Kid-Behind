import { Request, Response } from 'express';
import { prisma } from '../app';

export async function logMadristiClick(req: Request, res: Response): Promise<void> {
  const { school } = req.body;

  if (!school || typeof school !== 'string' || school.trim().length === 0) {
    res.status(400).json({ error: 'school is required' });
    return;
  }

  await prisma.madristiClick.create({ data: { school: school.trim() } });
  res.status(201).json({ ok: true });
}
