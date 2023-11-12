import { Profile } from '@stackoverfloweth/mapper'
import { Season } from '@/models'
import { SeasonResponse } from '@/models/api'
import { mapper } from '@/services'

export const mapSeasonResponseToSeason = {
  sourceKey: 'SeasonResponse',
  destinationKey: 'Season',
  map: (source) => {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
      courseId: mapper.map('ObjectId', source.courseId, 'string'),
    }
  },
} as const satisfies Profile<'SeasonResponse', SeasonResponse, 'Season', Season>