import { Course } from '@/models/course'

export type Season = {
  id: string,
  courseId: string,
  name: string,
  start: Date,
  end?: Date,
  password: string,
  course: Course,
}