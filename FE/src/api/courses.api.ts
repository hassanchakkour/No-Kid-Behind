import { AxiosResponse } from 'axios';
import client from './client';

export interface Course {
  id: string;
  title: string;
  subject: string;
  grades: string[];
  school: string | null;
  youtubeVideoId: string;
  clicks: number;
  isHealthContent: boolean;
  isSpecialNeeds: boolean;
  isKidToKid: boolean;
  teacherId: string;
  teacher: { id: string; name: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  grade?: string;
  subject?: string;
  school?: string;
  isHealthContent?: boolean;
  isSpecialNeeds?: boolean;
  isKidToKid?: boolean;
}

export interface CreateCoursePayload {
  title: string;
  subject: string;
  grades?: string[];
  school?: string;
  youtubeUrl: string;
  isHealthContent?: boolean;
  isSpecialNeeds?: boolean;
}

export const coursesApi = {
  getAll: (filters?: CourseFilters) =>
    client.get<Course[]>('/courses', { params: filters }).then((r: AxiosResponse<Course[]>) => r.data),
  getOne: (id: string) =>
    client.get<Course>(`/courses/${id}`).then((r: AxiosResponse<Course>) => r.data),
  create: (data: CreateCoursePayload) =>
    client.post<Course>('/courses', data).then((r: AxiosResponse<Course>) => r.data),
  update: (id: string, data: Partial<CreateCoursePayload>) =>
    client.put<Course>(`/courses/${id}`, data).then((r: AxiosResponse<Course>) => r.data),
  delete: (id: string) =>
    client.delete(`/courses/${id}`).then((r: AxiosResponse) => r.data),
};
