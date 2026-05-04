import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { prisma } from '../app';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { username, name, email, password, role, grade, school, isDisplaced, syndicateNumber } = req.body;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    res.status(409).json({ error: 'Username already taken' });
    return;
  }

  // Duplicate syndicate number check for professionals
  if (role === 'professional' && syndicateNumber) {
    const dupSyndicate = await prisma.user.findFirst({ where: { syndicateNumber } });
    if (dupSyndicate) {
      res.status(409).json({ error: 'A professional with the same syndicate number already exists' });
      return;
    }
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      name,
      email: email || null,
      password: hashed,
      role: role || 'student',
      grade: grade || null,
      school: school || null,
      isDisplaced: isDisplaced || false,
      syndicateNumber: syndicateNumber || null,
    },
  });

  const token = signToken({ userId: user.id, role: user.role, username: user.username, likesToTeach: user.likesToTeach, kidTutorApproved: user.kidTutorApproved });
  res.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      grade: user.grade,
      school: user.school,
      likesToTeach: user.likesToTeach,
      kidTutorApproved: user.kidTutorApproved,
    },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role, username: user.username, likesToTeach: user.likesToTeach, kidTutorApproved: user.kidTutorApproved });
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      grade: user.grade,
      school: user.school,
      likesToTeach: user.likesToTeach,
      kidTutorApproved: user.kidTutorApproved,
    },
  });
}

export async function updateMe(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { name, email, currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  const data: Record<string, unknown> = {};
  if (name?.trim()) data.name = name.trim();
  if (email !== undefined) data.email = email?.trim() || null;

  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: 'Current password is required to set a new password' });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({ where: { id: userId }, data });

  const token = signToken({ userId: updated.id, role: updated.role, username: updated.username, likesToTeach: updated.likesToTeach, kidTutorApproved: updated.kidTutorApproved });
  res.json({
    token,
    user: {
      id: updated.id,
      username: updated.username,
      name: updated.name,
      role: updated.role,
      grade: updated.grade,
      school: updated.school,
      likesToTeach: updated.likesToTeach,
      kidTutorApproved: updated.kidTutorApproved,
    },
  });
}

export async function toggleLikesToTeachSelf(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (user.role !== 'student') {
    res.status(400).json({ error: 'Only students can toggle this setting' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { likesToTeach: !user.likesToTeach },
  });

  const token = signToken({ userId: updated.id, role: updated.role, username: updated.username, likesToTeach: updated.likesToTeach, kidTutorApproved: updated.kidTutorApproved });
  res.json({
    token,
    user: {
      id: updated.id,
      username: updated.username,
      name: updated.name,
      role: updated.role,
      grade: updated.grade,
      school: updated.school,
      likesToTeach: updated.likesToTeach,
      kidTutorApproved: updated.kidTutorApproved,
    },
  });
}
