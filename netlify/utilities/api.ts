import { Handler } from '@netlify/functions'
import { Pattern, HttpError } from '../types'
import { extractTokenFromHeader, JwtPayload, verifyToken } from './jwt'

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ApiHandlerPublic<T> = (args: string[], body: T | null, jwtPayload: null) => Handler
export type ApiHandler<T> = (args: string[], body: T | null, jwtPayload: JwtPayload) => Handler
export type ApiContext = Parameters<Handler>[1]

export type ApiOptions = {
  isPublic?: boolean,
  requireAdmin?: boolean,
}

function tryParseBody(...[event]: Parameters<Handler>): unknown {
  if (event.body === null) {
    return null
  }

  try {
    return JSON.parse(event.body)
  } catch {
    return null
  }
}

export function Api<T>(method: ApiMethod, path: string, apiHandler: ApiHandler<T>, options?: ApiOptions & { isPublic?: false }): Handler
export function Api<T>(method: ApiMethod, path: string, apiHandler: ApiHandlerPublic<T>, options: ApiOptions & { isPublic: true }): Handler
export function Api<T>(method: ApiMethod, path: string, apiHandler: ApiHandlerPublic<T> | ApiHandler<T>, options: ApiOptions = {}): Handler {
  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
      }
    }

    const pattern = new Pattern(method, path)

    try {
      if (pattern.matches([event, context])) {
        const [, ...args] = pattern.regexp.exec(event.path) ?? []
        const body = tryParseBody(event, context) as T | null
        const handler = getHandler(apiHandler, args, body, event.headers, options)

        const result = await handler(event, context)

        if (result) {
          return result
        }
      }

      console.error('NO MATCH')

      throw new HttpError(404, 'Not found')
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          statusCode: error.statusCode,
          body: JSON.stringify({ error: error.message }),
        }
      }

      throw error
    }
  }
}

function getHandler<T>(apiHandler: ApiHandlerPublic<T> | ApiHandler<T>, args: string[], body: T | null, headers: Record<string, string | undefined>, options: ApiOptions): Handler {
  if (options.isPublic) {
    return (apiHandler as ApiHandlerPublic<T>)(args, body, null)
  }

  return (apiHandler as ApiHandler<T>)(args, body, getJwtPayload(headers, options))
}

function getJwtPayload(headers: Record<string, string | undefined>, options: ApiOptions): JwtPayload {
  const token = extractTokenFromHeader(headers.authorization)
  if (!token) {
    throw new HttpError(401, 'Authentication required')
  }

  const jwtPayload = verifyToken(token)
  if (!jwtPayload) {
    throw new HttpError(401, 'Invalid or expired token')
  }

  if (options.requireAdmin && !jwtPayload.isAdmin) {
    throw new HttpError(403, 'Admin access required')
  }

  return jwtPayload
}
