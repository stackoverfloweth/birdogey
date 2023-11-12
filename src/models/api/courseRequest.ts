import { CourseResponse } from '@/models/api'

export type CourseRequest = Omit<CourseResponse, '_id'>