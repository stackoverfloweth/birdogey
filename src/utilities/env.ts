export type Env = {
  isDevelopment: boolean,
  baseApiUrl: string,
  prod: boolean,
  imagekitPublicKey: string,
  imagekitUrl: string,
}

export function env(): Env {
  return {
    isDevelopment: import.meta.env.MODE === 'development',
    baseApiUrl: import.meta.env.VITE_BASE_API_URL,
    imagekitPublicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    imagekitUrl: import.meta.env.VITE_IMAGEKIT_URL,
    prod: import.meta.env.PROD,
  }
}
