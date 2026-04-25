import Constants from 'expo-constants'

interface AppConfig {
  apiBaseUrl: string,
  imageKitUrl: string,
  imageKitPublicKey: string,
}

function getConfig(): AppConfig {
  const extra = Constants.expoConfig?.extra

  return {
    apiBaseUrl: extra?.apiBaseUrl,
    imageKitUrl: extra?.imageKitUrl,
    imageKitPublicKey: extra?.imageKitPublicKey,
  }
}

export const config = getConfig()
