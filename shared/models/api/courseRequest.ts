import { CourseResponse } from './courseResponse.js'

export type CourseRequest = Omit<CourseResponse, '_id'>
