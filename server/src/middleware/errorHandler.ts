import * as Sentry from '@sentry/node'
import { ErrorHandler } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'
import { HttpError, JwtPayload } from '../types.js'

export const errorHandler: ErrorHandler = (error, context) => {
  if (error instanceof HttpError) {
    return context.json({ error: error.message }, error.statusCode as ContentfulStatusCode)
  }

  console.error('Unhandled error:', error)

  Sentry.withScope((scope) => {
    scope.setTag('method', context.req.method)
    scope.setTag('path', context.req.path)
    scope.setContext('request', {
      method: context.req.method,
      url: context.req.url,
      path: context.req.path,
    })

    const jwtPayload = context.get('jwtPayload') as JwtPayload | undefined
    if (jwtPayload) {
      scope.setUser({ id: jwtPayload._id.toString() })
    }

    Sentry.captureException(error)
  })

  return context.json({ error: 'Internal server error' }, 500)
}
