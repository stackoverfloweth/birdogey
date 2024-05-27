import mapper, { Profile } from '@kitbag/mapper'
import { Course } from '@/models'
import { CourseResponse } from '@/models/api'

export const mapCourseResponseToCourse = {
  sourceKey: 'CourseResponse',
  destinationKey: 'Course',
  map: function(source: CourseResponse): Course {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
    }
  },
} as const satisfies Profile