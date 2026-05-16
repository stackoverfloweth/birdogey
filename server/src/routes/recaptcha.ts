import * as Sentry from '@sentry/node'
import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { RecaptchaVerifyRequest, SignupKeyResponse } from '@birdogey/shared/api'
import { ENV } from 'varlock/env'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { isValidRequest } from '../utilities/requestValidation.js'

const recaptcha = new Hono()

recaptcha.post('/verify', async (context) => {
  const body = await context.req.json()

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
      secret: ENV.RECAPTCHA_SECRET,
      response: body.recaptchaToken,
    }),
  })

  const recaptchaData = await recaptchaResponse.json() as { 'success': boolean, 'error-codes'?: string[] }

  if (!recaptchaData.success) {
    Sentry.captureMessage('reCAPTCHA verification failed', {
      level: 'warning',
      tags: { service: 'recaptcha' },
      extra: { errorCodes: recaptchaData['error-codes'] },
    })
    throw new HttpError(403, 'reCAPTCHA verification failed')
  }

  const db = getDb()
  const keys = db.collection<SignupKeyResponse>('signup')

  const exists = await keys.findOne({ _id: new ObjectId(body.key) })

  return context.json(null, exists ? 202 : 404)
})

export { recaptcha }
