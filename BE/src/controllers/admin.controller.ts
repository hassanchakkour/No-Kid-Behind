import { Request, Response } from 'express';
import { prisma } from '../app';

export async function getStats(_req: Request, res: Response): Promise<void> {
  const [totalUsers, totalTeachers, totalCourses, totalVisitors, clicksResult] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'teacher' } }),
    prisma.course.count(),
    prisma.visitorLog.count(),
    prisma.course.aggregate({ _sum: { clicks: true } }),
  ]);

  res.json({
    totalUsers,
    totalTeachers,
    totalCourses,
    totalVisitors,
    totalCourseClicks: clicksResult._sum.clicks || 0,
  });
}

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      grade: true,
      school: true,
      isDisplaced: true,
      syndicateNumber: true,
      likesToTeach: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
}

export async function toggleLikesToTeach(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (user.role !== 'student') {
    res.status(400).json({ error: 'Only students can have the likesToTeach flag' });
    return;
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { likesToTeach: !user.likesToTeach },
    select: { id: true, likesToTeach: true },
  });
  res.json(updated);
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (user.role === 'admin') {
    res.status(403).json({ error: 'Cannot delete an admin' });
    return;
  }

  // Delete courses first if teacher
  if (user.role === 'teacher') {
    await prisma.course.deleteMany({ where: { teacherId: id } });
  }

  await prisma.user.delete({ where: { id } });
  res.status(204).send();
}

export async function deleteCourse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  await prisma.course.delete({ where: { id } });
  res.status(204).send();
}

export async function getAllCourses(_req: Request, res: Response): Promise<void> {
  const courses = await prisma.course.findMany({
    include: {
      teacher: { select: { id: true, name: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(courses);
}
