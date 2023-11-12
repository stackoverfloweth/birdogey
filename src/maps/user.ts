import { Profile } from '@stackoverfloweth/mapper'
import { User } from '@/models'
import { UserAuthResponse } from '@/models/api'
import { mapper } from '@/services'

export const mapUserAuthResponseToUser = {
  sourceKey: 'UserAuthResponse',
  destinationKey: 'User',
  map: (source) => {
    return {
      id: mapper.map('ObjectId', source?._id, 'string'),
      seasons: mapper.map('SeasonResponse', source?.seasons ?? [], 'Season'),
      isAuthorized: !!source,
      isAdmin: !!source && 'name' in source,
    }
  },
} as const satisfies Profile<'UserAuthResponse', UserAuthResponse | null, 'User', User>