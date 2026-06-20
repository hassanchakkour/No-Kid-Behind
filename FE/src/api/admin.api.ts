import { AxiosResponse } from 'axios';
import client from './client';
import { Course } from './courses.api';

export interface PrivateSchoolStat {
  school: string;
  students: number;
  kidTutors: number;
}

export interface MadristiClickStat {
  school: string;
  clicks: number;
}

export interface AdminStats {
  totalUsers: number;
  totalProfessionals: number;
  totalCourses: number;
  totalVisitors: number;
  totalCourseClicks: number;
  privateSchoolStats: PrivateSchoolStat[];
  madristiClicks: MadristiClickStat[];
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: string;
  grade: string | null;
  school: string | null;
  isDisplaced: boolean;
  syndicateNumber: string | null;
  likesToTeach: boolean;
  kidTutorApproved: boolean;
  createdAt: string;
}

export interface PendingKidTutor {
  id: string;
  username: string;
  name: string;
  email: string | null;
  grade: string | null;
  school: string | null;
  createdAt: string;
}

export interface SchoolUser {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: string;
  grade: string | null;
  school: string | null;
  kidTutorApproved: boolean;
  createdAt: string;
}

export interface SchoolRequest {
  id: string;
  schoolName: string;
  userId: string;
  requestedBy: { id: string; name: string; username: string };
  status: string;
  createdAt: string;
}

export const adminApi = {
  getStats: () =>
    client.get<AdminStats>('/admin/stats').then((r: AxiosResponse<AdminStats>) => r.data),
  getUsers: () =>
    client.get<AdminUser[]>('/admin/users').then((r: AxiosResponse<AdminUser[]>) => r.data),
  getCourses: () =>
    client.get<Course[]>('/admin/courses').then((r: AxiosResponse<Course[]>) => r.data),
  deleteUser: (id: string) =>
    client.delete(`/admin/user/${id}`).then((r: AxiosResponse) => r.data),
  deleteCourse: (id: string) =>
    client.delete(`/admin/course/${id}`).then((r: AxiosResponse) => r.data),
  toggleLikesToTeach: (id: string) =>
    client.patch<{ id: string; likesToTeach: boolean }>(`/admin/user/${id}/likes-to-teach`).then((r) => r.data),
  getPendingKidTutors: () =>
    client.get<PendingKidTutor[]>('/admin/pending-kid-tutors').then((r: AxiosResponse<PendingKidTutor[]>) => r.data),
  approveKidTutor: (id: string) =>
    client.patch<{ id: string; kidTutorApproved: boolean }>(`/admin/user/${id}/approve-kid-tutor`).then((r) => r.data),
  createSchoolAdmin: (data: { username: string; name: string; password: string; school: string; email?: string }) =>
    client.post('/admin/create-school-admin', data).then((r: AxiosResponse) => r.data),
  // School-scoped endpoints (used by both admin and school_admin)
  getSchoolUsers: () =>
    client.get<SchoolUser[]>('/admin/school/users').then((r: AxiosResponse<SchoolUser[]>) => r.data),
  getSchoolPendingKidTutors: () =>
    client.get<PendingKidTutor[]>('/admin/school/pending-kid-tutors').then((r: AxiosResponse<PendingKidTutor[]>) => r.data),
  schoolApproveKidTutor: (id: string) =>
    client.patch<{ id: string; kidTutorApproved: boolean }>(`/admin/school/approve-kid-tutor/${id}`).then((r) => r.data),
  resetUserPassword: (id: string, password: string) =>
    client.patch(`/admin/user/${id}/password`, { password }).then((r: AxiosResponse) => r.data),
  getPendingCourses: () =>
    client.get<import('./courses.api').Course[]>('/admin/pending-courses').then((r) => r.data),
  approveCourse: (id: string) =>
    client.patch(`/admin/course/${id}/approve`).then((r: AxiosResponse) => r.data),
  rejectCourse: (id: string) =>
    client.patch(`/admin/course/${id}/reject`).then((r: AxiosResponse) => r.data),
  getPrivateSchools: () =>
    client.get<string[]>('/admin/private-schools').then((r: AxiosResponse<string[]>) => r.data),
  addPrivateSchool: (schoolName: string) =>
    client.post('/admin/private-schools', { schoolName }).then((r: AxiosResponse) => r.data),
  removePrivateSchool: (name: string) =>
    client.delete(`/admin/private-schools/${encodeURIComponent(name)}`).then((r: AxiosResponse) => r.data),
  createSchoolRequest: (schoolName: string) =>
    client.post('/admin/school-request', { schoolName }).then((r: AxiosResponse) => r.data),
  getSchoolRequests: () =>
    client.get<SchoolRequest[]>('/admin/school-requests').then((r: AxiosResponse<SchoolRequest[]>) => r.data),
  approveSchoolRequest: (id: string) =>
    client.patch(`/admin/school-request/${id}/approve`).then((r: AxiosResponse) => r.data),
  rejectSchoolRequest: (id: string) =>
    client.patch(`/admin/school-request/${id}/reject`).then((r: AxiosResponse) => r.data),
};
