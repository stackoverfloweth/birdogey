import mapper, { Profile } from '@kitbag/mapper'
import { User } from '@/models'
import { UserAuthResponse } from '@/models/api'

export const mapUserAuthResponseToUser = {
  sourceKey: 'UserAuthResponse',
  destinationKey: 'User',
  map: (source: UserAuthResponse | null): User => {
    return {
      id: source ? mapper.map('ObjectId', source._id, 'string') : undefined,
      seasons: mapper.mapMany('SeasonResponse', source?.seasons ?? [], 'Season'),
      isAuthorized: !!source,
      isAdmin: !!source && 'name' in source,
    }
  },
} as const satisfies Profile