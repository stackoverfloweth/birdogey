import { CourseResponse } from '@/models/api/courseResponse'

export type CourseRequest = Omit<CourseResponse, '_id'>