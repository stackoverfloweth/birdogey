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
