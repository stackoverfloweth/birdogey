import { Context, MiddlewareHandler } from 'hono'
import jwt from 'jsonwebtoken'
import { UserAuthResponse } from '@birdogey/shared/api'
import { env } from '../env'
import { HttpError, JwtPayload, RefreshTokenPayload } from '../types'

const ACCESS_TOKEN_EXPIRY = '2h'
const REFRESH_TOKEN_EXPIRY = '30d'

export function generateAccessToken(user: UserAuthResponse): string {
  return jwt.sign(user, env().jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

export function generateRefreshToken(user: UserAuthResponse): string {
  return jwt.sign(user, env().jwtRefreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY })
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, env().jwtRefreshSecret) as RefreshTokenPayload
  } catch (error) {
    console.error('Refresh token verification failed:', error)
    return null
  }
}

function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env().jwtSecret) as JwtPayload
  } catch (error) {
    console.error('Access token verification failed:', error)
    return null
  }
}

function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const token = extractTokenFromHeader(context.req.header('authorization'))

  if (!token) {
    throw new HttpError(401, 'Authentication required')
  }

  const jwtPayload = verifyAccessToken(token)

  if (!jwtPayload) {
    throw new HttpError(401, 'Invalid or expired token')
  }

  context.set('jwtPayload', jwtPayload)

  await next()
}

export function getJwtPayload({ get }: Context): JwtPayload {
  return get('jwtPayload') as JwtPayload
}
