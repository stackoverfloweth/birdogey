import { ObjectId } from 'mongodb'

export type Car = {
  id: string,
  make: string,
  model: string,
}

export type CarResponse = {
  _id: ObjectId,
  make: string,
  model: string,
}