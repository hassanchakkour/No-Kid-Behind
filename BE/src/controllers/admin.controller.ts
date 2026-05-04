import { Request, Response } from 'express';
import { prisma } from '../app';

const PRIVATE_SCHOOLS = ['IC', 'ACS', 'College'];

export async function getStats(_req: Request, res: Response): Promise<void> {
  const [totalUsers, totalProfessionals, totalCourses, totalVisitors, clicksResult] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'professional' } }),
    prisma.course.count(),
    prisma.visitorLog.count(),
    prisma.course.aggregate({ _sum: { clicks: true } }),
  ]);

  // Private school student & kid tutor counts
  const privateSchoolStats = await Promise.all(
    PRIVATE_SCHOOLS.map(async (school) => {
      const [students, kidTutors] = await Promise.all([
        prisma.user.count({ where: { school, role: 'student' } }),
        prisma.user.count({ where: { school, role: 'kid_tutor' } }),
      ]);
      return { school, students, kidTutors };
    })
  );

  // Madristi click analytics by school
  const madristiRaw = await prisma.madristiClick.groupBy({
    by: ['school'],
    _count: { school: true },
    orderBy: { _count: { school: 'desc' } },
  });
  const madristiClicks = madristiRaw.map((r) => ({ school: r.school, clicks: r._count.school }));

  res.json({
    totalUsers,
    totalProfessionals,
    totalCourses,
    totalVisitors,
    totalCourseClicks: clicksResult._sum.clicks || 0,
    privateSchoolStats,
    madristiClicks,
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
      kidTutorApproved: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
}

export async function getPendingKidTutors(_req: Request, res: Response): Promise<void> {
  const pending = await prisma.user.findMany({
    where: { role: 'kid_tutor', kidTutorApproved: false },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      grade: true,
      school: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  res.json(pending);
}

export async function approveKidTutor(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (user.role !== 'kid_tutor') {
    res.status(400).json({ error: 'User is not a kid tutor' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { kidTutorApproved: true },
    select: { id: true, kidTutorApproved: true },
  });
  res.json(updated);
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

  // Delete their courses first
  await prisma.course.deleteMany({ where: { teacherId: id } });
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
