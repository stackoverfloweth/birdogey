import { ObjectId } from 'mongodb'
import { CourseResponse } from '@/models/api'

export type SeasonResponse = {
  _id: ObjectId,
  courseId: ObjectId,
  name: string,
  start: Date,
  end?: Date,
  password: string,
  course: CourseResponse,
}