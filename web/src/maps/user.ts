import mapper, { Profile } from '@kitbag/mapper'
import { User } from '@/models'
import { UserAuthResponse } from '@/models/api'

export const mapUserAuthResponseToUser = {
  sourceKey: 'UserAuthResponse',
  destinationKey: 'User',
  map: (source: UserAuthResponse | null): User => {
    return {
      ...source,
      id: source ? mapper.map('ObjectId', source._id, 'string') : undefined,
      isAuthorized: source?.isAuthorized ?? false,
      isAdmin: source?.isAdmin ?? false,
      isReadonly: source?.isReadonly ?? false,
      seasons: mapper.mapMany('SeasonResponse', source?.seasons ?? [], 'Season'),
    }
  },
} as const satisfies Profile
