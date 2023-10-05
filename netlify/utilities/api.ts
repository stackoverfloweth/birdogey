import { Handler } from '@netlify/functions'
import { Pattern } from '../types'

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Max-Age': '2592000',
  'Access-Control-Allow-Credentials': 'true',
}

export type ApiMethod = 'GET'|'POST'|'PUT'|'DELETE'
export type ApiHandler<T> = (args: string[], body: T | null) => Handler
export type ApiContext = Parameters<Handler>[1]

function tryParseBody<T>(...[event]: Parameters<Handler>): T | null {
  if (event.body === null) {
    return null
  }

  try {
    return JSON.parse(event.body) as T
  } catch {
    return null
  }
}

export function Api<T>(method: ApiMethod, path: string, apiHandler: ApiHandler<T>): Handler {
  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
      }
    }

    const pattern = new Pattern(method, path)

    if (pattern.matches([event, context])) {
      const [, ...args] = pattern.regexp.exec(event.path) ?? []
      const body = tryParseBody<T>(event, context)
      const result = await apiHandler(args, body)(event, context)

      if (result) {
        return {
          headers,
          ...result,
        }
      }
    }

    console.error('NO MATCH')

    return {
      statusCode: 404,
      headers,
    }
  }
}