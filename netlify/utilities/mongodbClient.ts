import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '../utilities/env'

export const getClient: () => Promise<MongoClient> = () => new MongoClient(env().mongodbUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}).connect()