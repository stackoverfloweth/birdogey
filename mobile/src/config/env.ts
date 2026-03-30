import Constants from 'expo-constants'

interface AppConfig {
  apiBaseUrl: string,
}

function getConfig(): AppConfig {
  const extra = Constants.expoConfig?.extra

  return {
    apiBaseUrl: extra?.apiBaseUrl,
  }
}

export const config = getConfig()
