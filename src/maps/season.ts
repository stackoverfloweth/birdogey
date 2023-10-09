import { Season } from '@/models'
import { SeasonResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapSeasonResponseToSeason: MapFunction<SeasonResponse, Season> = function(source) {
  return {
    ...source,
    id: this.map('ObjectId', source._id, 'string'),
    courseId: this.map('ObjectId', source.courseId, 'string'),
  }
}