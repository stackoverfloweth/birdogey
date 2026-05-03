import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { connectDb, disconnectDb } from './db'
import { env } from './env'
import { errorHandler } from './middleware/errorHandler'
import { routes } from './routes/index'

const app = new Hono()

app.use('*', cors({
  origin: env().corsOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.onError(errorHandler)

app.get('/api/health', ({ json }) => json({ status: 'ok' }))

app.route('/api', routes)

async function start(): Promise<void> {
  await connectDb()

  const port = env().port

  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on port ${port}`)
  })
}

process.on('SIGTERM', () => {
  disconnectDb().then(() => {
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  disconnectDb().then(() => {
    process.exit(0)
  })
})

start().catch((error: unknown) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
