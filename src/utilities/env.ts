export type Env = {
  isDevelopment: boolean,
  baseApiUrl: string,
  prod: boolean,
  sitePassword: string,
}

export function env(): Env {
  return {
    isDevelopment: import.meta.env.MODE === 'development',
    baseApiUrl: import.meta.env.VITE_BASE_API_URL,
    prod: import.meta.env.PROD,
    sitePassword: import.meta.env.VITE_SITE_PASSWORD,
  }
}