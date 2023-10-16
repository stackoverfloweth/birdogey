import { ObjectId } from 'mongodb'

export type Person = {
  id: string,
  name: string,
  age?: number,
  isAlive?: boolean,
  children: Person[],
}

// export const evan: Person = {
//   _mapKey: personKey,
//   id: '1',
//   name: 'Evan',
// }


export type PersonResponse = {
  _id: ObjectId,
  name: string,
  age?: number,
  childrenIds: string[],
}