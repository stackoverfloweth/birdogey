import { Season } from '@/models'
import { SeasonResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapSeasonResponseToSeason: MapFunction<SeasonResponse, Season> = function(source) {
  return {
    id: source._id.toString(),
    name: source.name,
  }
}