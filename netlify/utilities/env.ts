export type Env = {
  url: string,
  mongodbUrl: string,
  mongodbName: string,
  imagekitUrl: string,
  imagekitPublicKey: string,
  imagekitPrivateKey: string,
  jwtSecret: string,
}

export function env(): Env {
  return {
    url: process.env.URL ?? '',
    mongodbUrl: process.env.MONGODB_URI ?? '',
    mongodbName: process.env.MONGODB_NAME ?? '',
    imagekitUrl: process.env.IMAGEKIT_URL ?? '',
    imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? '',
    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? '',
    jwtSecret: process.env.JWT_SECRET ?? '',
  }
}
