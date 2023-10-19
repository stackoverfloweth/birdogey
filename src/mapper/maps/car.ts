import { Profile } from '@stackoverfloweth/mapper'
import { MapFunction } from '@/mapper'
import { Car, CarResponse } from '@/mapper/models/car'

export const carProfile: Profile<'CarResponse', CarResponse, 'Car', Car> = {
  sourceKey: 'CarResponse',
  destinationKey: 'Car',
  map: (source, mapper) => {
    return {
      id: mapper.map('ObjectId', source._id, 'string'),
      make: source.make,
      model: source.model,
    }
  },
} as const satisfies MapFunction<CarResponse, Car>