import { Profile } from '@stackoverfloweth/mapper'
import { Course } from '@/models'
import { CourseResponse } from '@/models/api'
import { mapper } from '@/services'

export const mapCourseResponseToCourse = {
  sourceKey: 'CourseResponse',
  destinationKey: 'Course',
  map: (source) => {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
    }
  },
} as const satisfies Profile<'CourseResponse', CourseResponse, 'Course', Course>