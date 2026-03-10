import Constants from 'expo-constants'

interface AppConfig {
  apiBaseUrl: string,
}

function getConfig(): AppConfig {
  const extra = Constants.expoConfig?.extra

  return {
    apiBaseUrl: extra?.apiBaseUrl ?? 'https://birdogey.up.railway.app/api',
  }
}

export const config = getConfig()
