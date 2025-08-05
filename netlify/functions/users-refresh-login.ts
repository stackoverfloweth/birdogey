import { Handler } from '@netlify/functions'
import { Api } from '../utilities'
import { generateToken } from '../utilities/jwt'

export const handler: Handler = Api('POST', '/users-refresh-login', (_event, _context, jwtPayload) => async () => {
  // Remove JWT metadata before generating new token
  const { iat, exp, ...userPayload } = jwtPayload

  // Generate a new token with fresh expiry
  const newToken = generateToken(userPayload)

  // Return the user data with the new token
  const refreshedPayload = {
    ...userPayload,
    token: newToken,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(refreshedPayload),
  }
})
