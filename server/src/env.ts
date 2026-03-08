export type Env = {
  port: number,
  mongodbUrl: string,
  mongodbName: string,
  imagekitUrl: string,
  imagekitPublicKey: string,
  imagekitPrivateKey: string,
  jwtSecret: string,
  recaptchaSecret: string,
  corsOrigins: string[],
}

export function env(): Env {
  const corsOriginsRaw = process.env.CORS_ORIGINS ?? ''

  return {
    port: parseInt(process.env.PORT ?? '8080', 10),
    mongodbUrl: process.env.MONGODB_URI ?? '',
    mongodbName: process.env.MONGODB_NAME ?? '',
    imagekitUrl: process.env.IMAGEKIT_URL ?? '',
    imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? '',
    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? '',
    jwtSecret: process.env.JWT_SECRET ?? '',
    recaptchaSecret: process.env.RECAPTCHA_SECRET ?? '',
    corsOrigins: corsOriginsRaw ? corsOriginsRaw.split(',').map(s => s.trim()) : ['http://localhost:5173'],
  }
}
