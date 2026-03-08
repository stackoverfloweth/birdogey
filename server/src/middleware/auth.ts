import { Context, MiddlewareHandler } from 'hono'
import jwt from 'jsonwebtoken'
import { UserResponse } from '@/models/api'
import { env } from '../env.js'
import { HttpError, JwtPayload } from '../types.js'

const TOKEN_EXPIRY = '2h'

export function generateToken(user: UserResponse): string {
  return jwt.sign(user, env().jwtSecret, { expiresIn: TOKEN_EXPIRY })
}

function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env().jwtSecret) as JwtPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = extractTokenFromHeader(c.req.header('authorization'))

  if (!token) {
    throw new HttpError(401, 'Authentication required')
  }

  const jwtPayload = verifyToken(token)

  if (!jwtPayload) {
    throw new HttpError(401, 'Invalid or expired token')
  }

  c.set('jwtPayload', jwtPayload)

  await next()
}

export function getJwtPayload(c: Context): JwtPayload {
  return c.get('jwtPayload') as JwtPayload
}
