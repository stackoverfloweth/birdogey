import { Handler } from '@netlify/functions'
import { Api } from '../utilities'

export const handler: Handler = Api('POST', '/users-refresh-login', (_event, _context, jwtPayload) => async () => ({
  statusCode: 200,
  body: JSON.stringify(jwtPayload),
}))
