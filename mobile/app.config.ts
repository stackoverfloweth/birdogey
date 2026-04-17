import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Birdogey',
  slug: 'birdogey',
  plugins: [
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
  ],
  extra: {
    ...config.extra,
    apiBaseUrl: process.env.API_BASE_URL,
  },
})
