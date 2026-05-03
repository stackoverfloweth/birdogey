import { Hono } from 'hono'
import ImageKit from 'imagekit'
import { env } from '../env.js'

const imagekit = new Hono()

imagekit.get('/auth', (context) => {
  const ik = new ImageKit({
    urlEndpoint: env().imagekitUrl,
    publicKey: env().imagekitPublicKey,
    privateKey: env().imagekitPrivateKey,
  })

  return context.json(ik.getAuthenticationParameters())
})

export { imagekit }
