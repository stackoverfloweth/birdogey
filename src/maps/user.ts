import { Profile } from '@stackoverfloweth/mapper'
import { User } from '@/models'
import { UserAuthResponse } from '@/models/api'
import { mapper } from '@/services'

export const mapUserAuthResponseToUser = {
  sourceKey: 'UserAuthResponse',
  destinationKey: 'User',
  map: (source: UserAuthResponse | null): User => {
    return {
      id: source ? mapper.map('ObjectId', source?._id, 'string') : undefined,
      seasons: mapper.mapMany('SeasonResponse', source?.seasons ?? [], 'Season'),
      isAuthorized: !!source,
      isAdmin: !!source && 'name' in source,
    }
  },
} as const satisfies Profile