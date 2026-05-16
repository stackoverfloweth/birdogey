import { Hono } from 'hono'
import ImageKit from 'imagekit'
import { ENV } from 'varlock/env'

const imagekit = new Hono()

imagekit.get('/auth', (context) => {
  const ik = new ImageKit({
    urlEndpoint: ENV.IMAGEKIT_URL,
    publicKey: ENV.IMAGEKIT_PUBLIC_KEY,
    privateKey: ENV.IMAGEKIT_PRIVATE_KEY,
  })

  return context.json(ik.getAuthenticationParameters())
})

export { imagekit }
