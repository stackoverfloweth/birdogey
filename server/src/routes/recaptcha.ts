import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { RecaptchaVerifyRequest, SignupKeyResponse } from '@/models/api'
import { getDb } from '../db.js'
import { env } from '../env.js'
import { HttpError } from '../types.js'
import { isValidRequest } from '../utilities/requestValidation.js'

const recaptcha = new Hono()

recaptcha.post('/verify', async (c) => {
  const body = await c.req.json()

  if (!isValidRequest<RecaptchaVerifyRequest>(body, [
    ['recaptchaToken', 'string'],
    ['key', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env().recaptchaSecret,
      response: body.recaptchaToken,
    }),
  })

  const recaptchaData = await recaptchaResponse.json() as { success: boolean }

  if (!recaptchaData.success) {
    throw new HttpError(403, 'reCAPTCHA verification failed')
  }

  const db = getDb()
  const keys = db.collection<SignupKeyResponse>('signup')

  const exists = await keys.findOne({ _id: new ObjectId(body.key) })

  return c.json(null, exists ? 202 : 404)
})

export { recaptcha }
