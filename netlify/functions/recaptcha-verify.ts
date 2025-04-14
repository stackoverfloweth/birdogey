import { Handler } from '@netlify/functions'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { RecaptchaVerifyRequest, SignupKeyResponse } from '@/models/api'
import axios from 'axios'
import { ObjectId } from 'mongodb'

export const handler: Handler = Api('POST', 'recaptcha-verify', (args, body) => async () => {
  if (!isValidRequest<RecaptchaVerifyRequest>(body, [
    ['recaptchaToken', 'string'],
    ['key', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  const recaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: env().recaptchaSecret,
      response: body.recaptchaToken,
    },
  })

  if (!recaptchaResponse.data.success) {
    return { statusCode: 403 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const keys = db.collection<SignupKeyResponse>('signup')

    const exists = await keys.findOne({ _id: new ObjectId(body.key) })

    return { statusCode: exists ? 202 : 404 }
  } finally {
    await client.close()
  }
}, { isPublic: true })
