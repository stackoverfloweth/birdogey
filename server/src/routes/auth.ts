import * as Sentry from '@sentry/node'
import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import twilio, { Twilio } from 'twilio'
import { normalizePhoneNumber } from '@birdogey/shared'
import { UserAuthResponse, UserResponse } from '@birdogey/shared/api'
import { getDb, storeRefreshToken, findRefreshToken } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, generateAccessToken, generateRefreshToken, getJwtPayload, verifyRefreshToken } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'
import { ENV } from 'varlock/env'

const auth = new Hono()

function getTwilioClient(): Twilio {
  return twilio(ENV.TWILIO_ACCOUNT_SID, ENV.TWILIO_AUTH_TOKEN)
}

auth.post('/send-code', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<{ phoneNumber: string }>(body, [['phoneNumber', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const phoneNumber = normalizePhoneNumber(body.phoneNumber)

  if (ENV.TWILIO_BYPASS_CODE) {
    console.warn(`[DEV] Twilio bypassed for ${phoneNumber} — use code: ${ENV.TWILIO_BYPASS_CODE}`)
    return context.json({ success: true })
  }

  const client = getTwilioClient()

  try {
    await client.verify.v2
      .services(ENV.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      })
  } catch (error) {
    console.error('Twilio send-code error:', error)
    Sentry.captureException(error, {
      tags: { route: 'auth/send-code', service: 'twilio' },
    })
    throw new HttpError(400, 'Failed to send verification code')
  }

  return context.json({ success: true })
})

auth.post('/verify-code', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<{ phoneNumber: string, code: string }>(body, [['phoneNumber', 'string'], ['code', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const phoneNumber = normalizePhoneNumber(body.phoneNumber)

  if (ENV.TWILIO_BYPASS_CODE) {
    if (body.code !== ENV.TWILIO_BYPASS_CODE) {
      throw new HttpError(401, 'Invalid verification code')
    }
  } else {
    const client = getTwilioClient()

    try {
      const verification = await client.verify.v2
        .services(ENV.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: phoneNumber,
          code: body.code,
        })

      if (verification.status !== 'approved') {
        throw new HttpError(401, 'Invalid verification code')
      }
    } catch (error) {
      console.error('Twilio verify-code error:', error)
      if (!(error instanceof HttpError)) {
        Sentry.captureException(error, {
          tags: { route: 'auth/verify-code', service: 'twilio' },
        })
      }
      throw new HttpError(400, 'Verification failed')
    }
  }

  const user = await fetchUser({ phoneNumber })

  if (!user) {
    throw new HttpError(401, 'No account found for this phone number')
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  await storeRefreshToken(refreshToken, user._id)

  return context.json({ ...user, accessToken, refreshToken })
})

// Refresh the access token for an active session.
// Requires a valid access token in the Authorization header.
// Returns a new access token and fresh user data.
auth.post('/refresh', authMiddleware, async (context) => {
  const jwtPayload = getJwtPayload(context)
  const user = await fetchUser({ _id: ObjectId.createFromHexString(jwtPayload._id.toString()) })

  if (!user) {
    throw new HttpError(401, 'User not found')
  }

  const accessToken = generateAccessToken(user)

  return context.json({ ...user, accessToken })
})

// Exchange a refresh token for new access + refresh tokens.
// Used to revive a dead session (e.g. biometric login after app restart).
// Does not require an Authorization header.
auth.post('/exchange', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<{ refreshToken: string }>(body, [['refreshToken', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const payload = verifyRefreshToken(body.refreshToken)

  if (!payload) {
    throw new HttpError(401, 'Invalid or expired refresh token')
  }

  const storedToken = await findRefreshToken(body.refreshToken)

  if (!storedToken) {
    throw new HttpError(401, 'Refresh token has been revoked')
  }

  const user = await fetchUser({ _id: storedToken.userId })

  if (!user) {
    throw new HttpError(401, 'User not found')
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  await storeRefreshToken(refreshToken, user._id)

  return context.json({ ...user, accessToken, refreshToken })
})

async function fetchUser(match: Record<string, unknown>): Promise<UserAuthResponse | undefined> {
  const db = getDb()
  const collection = db.collection<UserResponse>('users')
  const users = await collection.aggregate<UserAuthResponse>([
    { $match: { ...match, deletedAt: { $exists: false } } },
    {
      $lookup: {
        from: 'userSeasons',
        localField: '_id',
        foreignField: 'userId',
        as: 'userSeasonDocs',
      },
    },
    {
      $addFields: {
        seasonIds: '$userSeasonDocs.seasonId',
      },
    },
    {
      $lookup: {
        from: 'seasons',
        let: { seasonIds: '$seasonIds' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$_id', '$$seasonIds'] },
                  { $or: [{ $eq: [{ $type: '$start' }, 'missing'] }, { $lte: ['$start', '$$NOW'] }] },
                  { $or: [{ $eq: [{ $type: '$end' }, 'missing'] }, { $gte: ['$end', '$$NOW'] }] },
                ],
              },
            },
          },
        ],
        as: 'seasons',
      },
    },
    { $project: { password: 0, userSeasonDocs: 0, seasonIds: 0 } },
  ]).toArray()

  const [userAccount] = users

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!userAccount) {
    return undefined
  }

  return {
    ...userAccount,
    isAuthorized: true,
    role: userAccount.role ?? '',
    isReadonly: userAccount.isReadonly ?? false,
  }
}

export { auth }
