import { ObjectId } from 'mongodb'

export type UserResponse = {
  _id: ObjectId,
  name: string,
  phoneNumber?: string,
  udiscId?: string,
  pdgaNumber?: string,
  imageUrl?: string,
  isAdmin?: boolean,
  isReadonly?: boolean,
  deletedAt?: Date,
}
