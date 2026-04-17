import { reactive } from 'vue'
import { User } from '@birdogey/shared'
import { CreateApi } from '@/services'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const auth = reactive<User>({
  id: '',
  name: '',
  isAdmin: false,
  isAuthorized: false,
  isReadonly: true,
  seasons: [],
  accessToken: undefined,
})

const { value: storedAccessToken, set: setStoredAccessToken, remove: removeStoredAccessToken } = useLocalStorage('BIRDOGEY_ACCESS_TOKEN')
const { value: storedRefreshToken, set: setStoredRefreshToken, remove: removeStoredRefreshToken } = useLocalStorage('BIRDOGEY_REFRESH_TOKEN')

export async function initAuthFromStorage(api: CreateApi): Promise<void> {
  try {
    if (storedRefreshToken.value) {
      Object.assign(auth, { accessToken: storedAccessToken })

      const user = await api.auth.exchange(storedRefreshToken.value)
      Object.assign(auth, user)
      saveAuthToStorage(auth)
    }
  } catch {
    clearStoredAuth()
  }
}

function saveAuthToStorage(userData: User): void {
  try {
    if (userData.accessToken) {
      setStoredAccessToken(userData.accessToken)
    }
    if (userData.refreshToken) {
      setStoredRefreshToken(userData.refreshToken)
    }
  } catch (error) {
    console.error('Error saving auth to storage:', error)
  }
}

export function clearStoredAuth(): void {
  removeStoredAccessToken()
  removeStoredRefreshToken()

  Object.assign(auth, {
    id: undefined,
    isAdmin: false,
    isAuthorized: false,
    isReadonly: true,
    seasons: [],
    accessToken: undefined,
  })
}

export async function sendVerificationCode(api: CreateApi, phoneNumber: string): Promise<void> {
  await api.auth.sendCode(phoneNumber)
}

export async function verifyCode(api: CreateApi, phoneNumber: string, code: string): Promise<boolean> {
  const response = await api.auth.verifyCode(phoneNumber, code)

  Object.assign(auth, response)
  saveAuthToStorage(auth)

  return auth.isAuthorized
}

export async function refreshAccessToken(api: CreateApi): Promise<User | null> {
  if (!auth.isAuthorized) {
    return null
  }

  const user = await api.auth.refresh()
  Object.assign(auth, user)

  saveAuthToStorage(auth)

  return user
}

export function getAccessToken(): string | undefined {
  return auth.accessToken
}
