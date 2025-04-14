import { Handler } from '@netlify/functions'
import ImageKit from 'imagekit'
import { Api, env } from '../utilities'

export const handler: Handler = Api('GET', 'imagekit-auth', () => () => {
  const imagekit = new ImageKit({
    urlEndpoint: env().imagekitUrl,
    publicKey: env().imagekitPublicKey,
    privateKey: env().imagekitPrivateKey,
  })

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify(imagekit.getAuthenticationParameters()),
  })
})
