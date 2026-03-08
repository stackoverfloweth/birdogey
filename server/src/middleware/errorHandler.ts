import { ErrorHandler } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'
import { HttpError } from '../types.js'

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof HttpError) {
    return c.json({ error: error.message }, error.statusCode as ContentfulStatusCode)
  }

  console.error('Unhandled error:', error)
  return c.json({ error: 'Internal server error' }, 500)
}
