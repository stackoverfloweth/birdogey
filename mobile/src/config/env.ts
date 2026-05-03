import Constants from 'expo-constants'

interface AppConfig {
  apiBaseUrl: string,
  imageKitUrl: string,
  imageKitPublicKey: string,
  sentryDsn: string,
}

function getConfig(): AppConfig {
  const extra = Constants.expoConfig?.extra

  return {
    apiBaseUrl: extra?.apiBaseUrl,
    imageKitUrl: extra?.imageKitUrl,
    imageKitPublicKey: extra?.imageKitPublicKey,
    sentryDsn: extra?.sentryDsn,
  }
}

export const config = getConfig()
