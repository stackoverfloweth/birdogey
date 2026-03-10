import { CourseResponse } from './courseResponse'

export type CourseRequest = Omit<CourseResponse, '_id'>
