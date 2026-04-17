import { ObjectId } from 'mongodb'
import { UserAuthResponse } from '@birdogey/shared/api'

export class HttpError extends Error {
  public statusCode: number

  public constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export type JwtPayload = UserAuthResponse & {
  iat?: number,
  exp?: number,
}

export type RefreshTokenPayload = {
  userId: string,
  iat?: number,
  exp?: number,
}

export type RefreshTokenDocument = {
  _id?: ObjectId,
  token: string,
  userId: ObjectId,
  createdAt: Date,
}
