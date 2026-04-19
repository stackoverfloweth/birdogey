import { Hono } from 'hono'
import twilio, { Twilio } from 'twilio'
import { normalizePhoneNumber } from '@birdogey/shared'
import { UserAuthResponse, UserResponse } from '@birdogey/shared/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, generateToken, getJwtPayload } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'
import { env } from '../env.js'

const auth = new Hono()

function getTwilioClient(): Twilio {
  const { twilioAccountSid, twilioAuthToken } = env()
  return twilio(twilioAccountSid, twilioAuthToken)
}

auth.post('/send-code', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<{ phoneNumber: string }>(body, [['phoneNumber', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const phoneNumber = normalizePhoneNumber(body.phoneNumber)

  const { twilioBypassCode, twilioVerifyServiceSid } = env()

  if (twilioBypassCode) {
    console.warn(`[DEV] Twilio bypassed for ${phoneNumber} — use code: ${twilioBypassCode}`)
    return context.json({ success: true })
  }

  const client = getTwilioClient()

  try {
    await client.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      })
  } catch (error) {
    console.error('Twilio send-code error:', error)
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

  const { twilioBypassCode, twilioVerifyServiceSid } = env()

  if (twilioBypassCode) {
    if (body.code !== twilioBypassCode) {
      throw new HttpError(401, 'Invalid verification code')
    }
  } else {
    const client = getTwilioClient()

    try {
      const verification = await client.verify.v2
        .services(twilioVerifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: body.code,
        })

      if (verification.status !== 'approved') {
        throw new HttpError(401, 'Invalid verification code')
      }
    } catch (error) {
      console.error('Twilio verify-code error:', error)
      throw new HttpError(400, 'Verification failed')
    }
  }

  const db = getDb()
  const collection = db.collection<UserResponse>('users')
  const users = await collection.aggregate<UserAuthResponse>([
    {
      $match: { phoneNumber },
    },
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

  const userAccount = getFirst(users)

  if (!userAccount) {
    throw new HttpError(401, 'No account found for this phone number')
  }

  const user: UserAuthResponse = {
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

function getFirst<T>(array: T[]): T | undefined {
  const [first] = array
  return first
}

export { auth }
