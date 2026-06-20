import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';
import { signToken } from '../utils/jwt';

const PRIVATE_SCHOOLS = ['IC', 'ACS', 'College'];

export async function getStats(_req: Request, res: Response): Promise<void> {
  const [totalUsers, totalProfessionals, totalCourses, totalVisitors, clicksResult] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'professional' } }),
    prisma.course.count(),
    prisma.visitorLog.count(),
    prisma.course.aggregate({ _sum: { clicks: true } }),
  ]);

  const privateSchoolStats = await Promise.all(
    PRIVATE_SCHOOLS.map(async (school) => {
      const [students, kidTutors] = await Promise.all([
        prisma.user.count({ where: { school, role: 'student' } }),
        prisma.user.count({ where: { school, role: 'kid_tutor' } }),
      ]);
      return { school, students, kidTutors };
    })
  );

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

// School-admin scoped approve — checks the kid tutor belongs to the caller's school
export async function approveKidTutorScoped(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const callerRole = req.user!.role;
  const callerSchool = req.user!.school;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (user.role !== 'kid_tutor') {
    res.status(400).json({ error: 'User is not a kid tutor' });
    return;
  }

  // school_admin can only approve kid tutors from their school
  if (callerRole === 'school_admin') {
    if (!callerSchool || user.school !== callerSchool) {
      res.status(403).json({ error: 'You can only approve kid tutors from your school' });
      return;
    }
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

export async function getPendingCourses(_req: Request, res: Response): Promise<void> {
  const courses = await prisma.course.findMany({
    where: { status: 'pending' },
    include: { teacher: { select: { id: true, name: true, username: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(courses);
}

export async function approveCourse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
  const updated = await prisma.course.update({ where: { id }, data: { status: 'approved' } });
  res.json(updated);
}

export async function rejectCourse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
  const updated = await prisma.course.update({ where: { id }, data: { status: 'rejected' } });
  res.json(updated);
}

// ── School Admin endpoints ─────────────────────────────────────────────────

export async function createSchoolAdmin(req: Request, res: Response): Promise<void> {
  const { username, name, email, password, school } = req.body;

  if (!username || !name || !password || !school) {
    res.status(400).json({ error: 'username, name, password and school are required' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    res.status(409).json({ error: 'Username already taken' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      name,
      email: email || null,
      password: hashed,
      role: 'school_admin',
      school,
    },
    select: { id: true, username: true, name: true, role: true, school: true, createdAt: true },
  });

  res.status(201).json(user);
}

export async function resetUserPassword(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id }, data: { password: hashed } });

  res.json({ success: true });
}

export async function getSchoolAdminUsers(req: AuthRequest, res: Response): Promise<void> {
  const callerRole = req.user!.role;
  const school = callerRole === 'school_admin' ? req.user!.school : (req.query.school as string | undefined);

  if (callerRole === 'school_admin' && !school) {
    res.status(400).json({ error: 'School admin has no school assigned' });
    return;
  }

  const users = await prisma.user.findMany({
    where: school ? { school } : {},
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      grade: true,
      school: true,
      kidTutorApproved: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
}

// ── School Requests ────────────────────────────────────────────────────────

export async function getPrivateSchools(_req: Request, res: Response): Promise<void> {
  const approved = await prisma.schoolRequest.findMany({
    where: { status: 'approved' },
    select: { schoolName: true },
    orderBy: { schoolName: 'asc' },
  });
  const base = ['IC', 'ACS', 'CPF'];
  const extra = approved.map((s) => s.schoolName).filter((n) => !base.includes(n));
  res.json([...base, ...extra]);
}

export async function createSchoolRequest(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { schoolName } = req.body;
  if (!schoolName?.trim()) { res.status(400).json({ error: 'School name is required' }); return; }
  const existing = await prisma.schoolRequest.findFirst({ where: { schoolName: schoolName.trim(), status: { not: 'rejected' } } });
  if (existing) { res.status(409).json({ error: 'A request for this school already exists' }); return; }
  const request = await prisma.schoolRequest.create({ data: { schoolName: schoolName.trim(), userId } });
  res.status(201).json(request);
}

export async function getSchoolRequests(_req: Request, res: Response): Promise<void> {
  const requests = await prisma.schoolRequest.findMany({
    where: { status: 'pending' },
    include: { requestedBy: { select: { id: true, name: true, username: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(requests);
}

export async function approveSchoolRequest(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const sr = await prisma.schoolRequest.findUnique({ where: { id } });
  if (!sr) { res.status(404).json({ error: 'Not found' }); return; }
  const updated = await prisma.schoolRequest.update({ where: { id }, data: { status: 'approved' } });
  res.json(updated);
}

export async function rejectSchoolRequest(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const sr = await prisma.schoolRequest.findUnique({ where: { id } });
  if (!sr) { res.status(404).json({ error: 'Not found' }); return; }
  const updated = await prisma.schoolRequest.update({ where: { id }, data: { status: 'rejected' } });
  res.json(updated);
}

export async function getSchoolAdminPendingKidTutors(req: AuthRequest, res: Response): Promise<void> {
  const callerRole = req.user!.role;
  const school = callerRole === 'school_admin' ? req.user!.school : (req.query.school as string | undefined);

  if (callerRole === 'school_admin' && !school) {
    res.status(400).json({ error: 'School admin has no school assigned' });
    return;
  }

  const pending = await prisma.user.findMany({
    where: {
      role: 'kid_tutor',
      kidTutorApproved: false,
      ...(school ? { school } : {}),
    },
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
