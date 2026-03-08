import { UserResponse } from '@/models/api'

export class HttpError extends Error {
  public statusCode: number

  public constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export type JwtPayload = Required<UserResponse> & {
  iat?: number,
  exp?: number,
}
