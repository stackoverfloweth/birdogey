import 'varlock/auto-load'
import * as Sentry from '@sentry/node'
import { ENV } from 'varlock/env'

if (ENV.SENTRY_DSN) {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.SENTRY_ENVIRONMENT ?? 'development',
    beforeSend(event) {
      const frames = event.exception?.values?.flatMap((value) => value.stacktrace?.frames ?? []) ?? []
      const files = frames.map((frame) => frame.filename ?? '').filter(Boolean)

      if (['/auth/refresh'].some((file) => files.includes(file))) {
        return null
      }

      return event
    },
  })
}

export { Sentry }
