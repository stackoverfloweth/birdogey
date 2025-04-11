import jwt from 'jsonwebtoken'
import { User } from '@/models'
import { env } from './env'

const TOKEN_EXPIRY = '2h'

export type JwtPayload = Required<User> & {
  iat?: number,
  exp?: number,
}

export function generateToken(user: User): string {
  return jwt.sign(user, env().jwtSecret, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env().jwtSecret) as JwtPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  return removeBearerPrefix(authHeader)
}

function removeBearerPrefix(authHeader: string): string {
  return authHeader.substring(7)
}
