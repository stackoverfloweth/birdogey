import { Collection, Db, MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { ENV } from 'varlock/env'
import { RefreshTokenDocument } from './types.js'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDb(): Promise<void> {
  client = new MongoClient(ENV.MONGODB_URI, {
    ignoreUndefined: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  await client.connect()
  db = client.db(ENV.MONGODB_NAME)
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
  }
}

function refreshTokens(): Collection<RefreshTokenDocument> {
  return getDb().collection<RefreshTokenDocument>('refreshTokens')
}

export async function storeRefreshToken(token: string, userId: ObjectId): Promise<void> {
  await deleteUserRefreshTokens(userId)

  await refreshTokens().insertOne({
    token,
    userId,
    createdAt: new Date(),
  })
}

export async function findRefreshToken(token: string): Promise<RefreshTokenDocument | null> {
  return refreshTokens().findOne({ token })
}

export async function deleteUserRefreshTokens(userId: ObjectId): Promise<void> {
  await refreshTokens().deleteMany({ userId })
}
