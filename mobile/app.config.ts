import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Birdogey',
  slug: 'birdogey',
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        imageWidth: 200,
      },
    ],
    [
      'expo-font',
      {
        fonts: ['./assets/fonts/Ephesis-Regular.ttf'],
      },
    ],
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow Birdogey to use Face ID for sign-in.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Birdogey to access your photos so you can set a player image.',
      },
    ],
    '@sentry/react-native/expo',
  ],
  extra: {
    ...config.extra,
    apiBaseUrl: process.env.API_BASE_URL,
    imageKitUrl: process.env.IMAGEKIT_URL,
    imageKitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    sentryDsn: process.env.SENTRY_DSN,
  },
})
