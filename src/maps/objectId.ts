import { ObjectId } from 'mongodb'
import { MapFunction } from '@/services/mapper'

export const mapObjectIdToString: MapFunction<ObjectId, string> = function(source) {
  return source.toString()
}