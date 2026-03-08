import { Db, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './env.js'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDb(): Promise<void> {
  client = new MongoClient(env().mongodbUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  await client.connect()
  db = client.db(env().mongodbName)
  console.log('Connected to MongoDB')
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDb() first.')
  }

  return db
}

export async function disconnectDb(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('Disconnected from MongoDB')
  }
}
