import { Profile } from '@stackoverfloweth/mapper'
import { MapFunction } from '@/mapper'
import { Car, CarResponse } from '@/mapper/models/car'

const map: MapFunction<CarResponse, Car> = (source, mapper) => {
  return {
    id: mapper.map('ObjectId', source._id, 'string'),
    // id: source._id.toString(),
    make: source.make,
    model: source.model,
  }
}

export const carProfile: Profile<'CarResponse', CarResponse, 'Car', Car> = {
  sourceKey: 'CarResponse',
  destinationKey: 'Car',
  map,
}