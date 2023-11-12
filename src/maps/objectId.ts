import { Profile } from '@stackoverfloweth/mapper'
import { ObjectId } from 'mongodb'

export const mapObjectIdToString = {
  sourceKey: 'ObjectId',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
} as const satisfies Profile<'ObjectId', ObjectId, 'string', string>