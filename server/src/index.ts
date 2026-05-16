import { Sentry } from './instrument.js'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ENV } from 'varlock/env'
import { connectDb, disconnectDb } from './db.js'
import { errorHandler } from './middleware/errorHandler.js'
import { routes } from './routes/index.js'

const corsOrigins = ENV.CORS_ORIGINS
  ? ENV.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173']

const app = new Hono()

app.use('*', cors({
  origin: corsOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.onError(errorHandler)

app.get('/api/health', ({ json }) => json({ status: 'ok' }))

app.route('/api', routes)

async function start(): Promise<void> {
  await connectDb()

  serve({ fetch: app.fetch, port: ENV.PORT }, () => {
    console.log(`Server running on port ${ENV.PORT}`)
  })
}

async function shutdown(signal: string): Promise<void> {
  try {
    await disconnectDb()
    await Sentry.close(2000)
  } catch (error) {
    console.error(`Error during ${signal} shutdown:`, error)
  } finally {
    process.exit(0)
  }
}

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})

process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  Sentry.captureException(error)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
  Sentry.captureException(reason)
})

start().catch((error: unknown) => {
  console.error('Failed to start server:', error)
  Sentry.captureException(error)
  void Sentry.close(2000).finally(() => process.exit(1))
})
