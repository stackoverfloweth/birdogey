import { Profile } from '@stackoverfloweth/mapper'
import { Person, PersonResponse } from '@/mapper/models/person'

export const personResponseToPerson: Profile<'PersonResponse', PersonResponse, 'Person', Person> = {
  sourceKey: 'PersonResponse',
  destinationKey: 'Person',
  map: (source) => {
    return {
      id: source._id.toString(),
      name: source.name,
      age: source.age,
      isAlive: !!source.age && source.age < 100,
      children: [],
    }
  },
}