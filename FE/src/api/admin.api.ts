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
};
