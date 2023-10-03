import { Handler } from '@netlify/functions'
import { Api } from '../utilities/api'

export const handler: Handler = Api('GET', '/hello-world', () => async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World from!',
    }),
  }
})