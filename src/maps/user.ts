import { User } from '@/models'
import { UserAuthResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapUserAuthResponseToUser: MapFunction<UserAuthResponse | null, User> = function(source) {
  return {
    id: this.map('ObjectId', source?._id, 'string'),
    seasons: this.map('SeasonResponse', source?.seasons ?? [], 'Season'),
    isAuthorized: !!source,
    isAdmin: !!source && 'name' in source,
  }
}