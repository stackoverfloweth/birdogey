import { ObjectId } from 'mongodb'

export type UserResponse = {
  _id: ObjectId,
  name: string,
  phoneNumber?: string,
  udiscId?: string,
  pdgaNumber?: string,
  imageUrl?: string,
  role?: string,
  isReadonly?: boolean,
  deletedAt?: Date,
}
