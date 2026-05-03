import { Course } from './course.js'

export type Season = {
  id: string,
  courseId: string,
  name: string,
  start: Date,
  end?: Date,
  password: string,
  course: Course,
  ctpPerPlayer?: number,
  acePerPlayer?: number,
}
