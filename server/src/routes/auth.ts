import { Hono } from 'hono'
import { Db, ObjectId } from 'mongodb'
import { SeasonResponse, UserAuthResponse, UserResponse } from '@/models/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, generateToken, getJwtPayload } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'

const auth = new Hono()

auth.post('/login', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<{ password: string }>(body, [['password', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const collection = db.collection<UserResponse>('users')

  const users = await collection.aggregate([
    {
      $match: { password: body.password },
    },
    {
      $lookup: {
        from: 'seasons',
        localField: 'courseIds',
        foreignField: 'courseId',
        as: 'seasons',
      },
    },
    { $project: { courseIds: 0, password: 0 } },
  ]).toArray()

  const userAccount = getFirst(users) ?? await checkReadonlyPassword(body.password, db)

  if (!userAccount) {
    throw new HttpError(401, 'Invalid credentials')
  }

  const user = {
    ...userAccount,
    isAuthorized: true,
    isAdmin: userAccount.isAdmin ?? false,
    isReadonly: userAccount.isReadonly ?? false,
    seasons: userAccount.seasons ?? [],
  }

  const token = generateToken(user)

  return context.json({ ...user, token })
})

auth.post('/refresh', authMiddleware, async (context) => {
  const jwtPayload = getJwtPayload(context)
  const { iat, exp, ...userPayload } = jwtPayload

  const newToken = generateToken(userPayload)

  return context.json({ ...userPayload, token: newToken })
})

async function checkReadonlyPassword(password: string, db: Db): Promise<UserAuthResponse | null> {
  const collection = db.collection<SeasonResponse>('seasons')
  const season = await collection.findOne({ password })

  if (!season) {
    return null
  }

  return {
    _id: new ObjectId(),
    isAuthorized: true,
    isReadonly: true,
    seasons: [season],
  }
}

function getFirst<T>(array: T[]): T | undefined {
  const [first] = array
  return first
}

export { auth }
