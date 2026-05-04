import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';
import { extractYoutubeVideoId } from '../utils/youtube';

export async function getCourses(req: Request, res: Response): Promise<void> {
  const { grade, subject, school, isHealthContent, isSpecialNeeds, isKidToKid } = req.query;

  const courses = await prisma.course.findMany({
    where: {
      ...(grade ? { grades: { has: String(grade) } } : {}),
      ...(subject ? { subject: { contains: String(subject), mode: 'insensitive' } } : {}),
      ...(school ? { school: { contains: String(school), mode: 'insensitive' } } : {}),
      ...(isHealthContent !== undefined ? { isHealthContent: isHealthContent === 'true' } : {}),
      ...(isSpecialNeeds !== undefined ? { isSpecialNeeds: isSpecialNeeds === 'true' } : {}),
      ...(isKidToKid !== undefined ? { isKidToKid: isKidToKid === 'true' } : {}),
    },
    include: {
      teacher: { select: { id: true, name: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(courses);
}

export async function getCourse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { id: true, name: true, username: true } },
    },
  });

  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  await prisma.course.update({ where: { id }, data: { clicks: { increment: 1 } } });
  res.json({ ...course, clicks: course.clicks + 1 });
}

export async function createCourse(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, subject, grades, school, youtubeUrl, isHealthContent, isSpecialNeeds } = req.body;
  const userRole = req.user!.role;

  const wantsHealth = isHealthContent === true || isHealthContent === 'true';
  const wantsSpecialNeeds = isSpecialNeeds === true || isSpecialNeeds === 'true';

  // Only admins can create health content
  if (wantsHealth && userRole !== 'admin') {
    res.status(403).json({ error: 'Only admins can add health content' });
    return;
  }
  // Only admins can create learning difficulties (special needs) content
  if (wantsSpecialNeeds && userRole !== 'admin') {
    res.status(403).json({ error: 'Only admins can add learning difficulties content' });
    return;
  }

  // Professionals can ONLY create health or learning difficulties content
  if (userRole === 'professional' && !wantsHealth && !wantsSpecialNeeds) {
    res.status(403).json({ error: 'Professionals can only create Wellbeing or Learning Difficulties content' });
    return;
  }

  // Kid tutors can only create kid-to-kid content (not health or special needs)
  if (userRole === 'kid_tutor' && (wantsHealth || wantsSpecialNeeds)) {
    res.status(403).json({ error: 'Kid tutors cannot create this type of content' });
    return;
  }

  const videoId = extractYoutubeVideoId(youtubeUrl);
  if (!videoId) {
    res.status(400).json({ error: 'Invalid YouTube URL or video ID' });
    return;
  }

  const existing = await prisma.course.findUnique({ where: { youtubeVideoId: videoId } });
  if (existing) {
    res.status(409).json({ error: 'This video already exists as a course' });
    return;
  }

  const isKidToKid =
    userRole === 'kid_tutor' ||
    (userRole === 'student' && req.user!.likesToTeach);

  const gradesArray: string[] = Array.isArray(grades) ? grades : grades ? [grades] : [];

  const course = await prisma.course.create({
    data: {
      title,
      subject,
      grades: gradesArray,
      school: school || null,
      youtubeVideoId: videoId,
      isHealthContent: wantsHealth,
      isSpecialNeeds: wantsSpecialNeeds,
      isKidToKid,
      teacherId: req.user!.userId,
    },
    include: {
      teacher: { select: { id: true, name: true, username: true } },
    },
  });

  res.status(201).json(course);
}

export async function updateCourse(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { title, subject, grades, school, youtubeUrl } = req.body;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  if (req.user!.role !== 'admin' && course.teacherId !== req.user!.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  let videoId = course.youtubeVideoId;
  if (youtubeUrl) {
    const parsed = extractYoutubeVideoId(youtubeUrl);
    if (!parsed) {
      res.status(400).json({ error: 'Invalid YouTube URL or video ID' });
      return;
    }
    videoId = parsed;
  }

  const gradesArray: string[] | undefined = grades !== undefined
    ? (Array.isArray(grades) ? grades : [grades])
    : undefined;

  const updated = await prisma.course.update({
    where: { id },
    data: {
      ...(title ? { title } : {}),
      ...(subject ? { subject } : {}),
      ...(gradesArray !== undefined ? { grades: gradesArray } : {}),
      school: school !== undefined ? school || null : course.school,
      youtubeVideoId: videoId,
    },
    include: {
      teacher: { select: { id: true, name: true, username: true } },
    },
  });

  res.json(updated);
}

export async function deleteCourse(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  if (req.user!.role !== 'admin' && course.teacherId !== req.user!.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  await prisma.course.delete({ where: { id } });
  res.status(204).send();
}
