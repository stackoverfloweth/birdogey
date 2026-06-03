import { Context, MiddlewareHandler } from 'hono'
import jwt from 'jsonwebtoken'
import { UserAuthResponse } from '@birdogey/shared/api'
import { ENV } from 'varlock/env'
import { HttpError, JwtPayload, RefreshTokenPayload } from '../types.js'

const ACCESS_TOKEN_EXPIRY = '2h'
const REFRESH_TOKEN_EXPIRY = '30d'

export function generateAccessToken(user: UserAuthResponse): string {
  return jwt.sign(user, ENV.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

export function generateRefreshToken(user: UserAuthResponse): string {
  return jwt.sign(user, ENV.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as RefreshTokenPayload
  } catch (error) {
    console.error('Refresh token verification failed:', error)
    return null
  }
}

function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload
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

export const requireAdmin: MiddlewareHandler = async (context, next) => {
  const jwtPayload = context.get('jwtPayload') as JwtPayload | undefined

  if (jwtPayload?.role !== 'admin') {
    throw new HttpError(403, 'Admin required')
  }

  await next()
}

export function getJwtPayload({ get }: Context): JwtPayload {
  return get('jwtPayload') as JwtPayload
}
