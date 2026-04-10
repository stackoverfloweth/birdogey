import { Hono } from 'hono'
import twilio, { Twilio } from 'twilio'
import { normalizePhoneNumber } from '@birdogey/shared'
import { UserResponse } from '@birdogey/shared/api'
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

  const client = getTwilioClient()
  const { twilioVerifyServiceSid } = env()

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

  const client = getTwilioClient()
  const { twilioVerifyServiceSid } = env()

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

  const db = getDb()
  const collection = db.collection<UserResponse>('users')
  const users = await collection.aggregate([
    {
      $match: { phoneNumber },
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

  const userAccount = getFirst(users)

  if (!userAccount) {
    throw new HttpError(401, 'No account found for this phone number')
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

function getFirst<T>(array: T[]): T | undefined {
  const [first] = array
  return first
}

export { auth }
