export type Env = {
  url: string,
  mongodbUrl: string,
  mongodbName: string,
}

export function env(): Env {
  return {
    url: process.env.URL ?? '',
    mongodbUrl: process.env.MONGODB_URI ?? '',
    mongodbName: process.env.MONGODB_NAME ?? '',
  }
}