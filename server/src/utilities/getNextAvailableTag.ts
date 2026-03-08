import { PlayerResponse } from '@/models/api'
import { Collection, ObjectId } from 'mongodb'

export function getNextAvailableTag(seasonId: ObjectId, collection: Collection<PlayerResponse>): Promise<number> {
  return collection.countDocuments({ seasonId }).then((count) => count + 1)
}
