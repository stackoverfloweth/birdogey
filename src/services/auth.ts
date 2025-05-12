import { reactive } from 'vue'
import { User } from '@/models'
import { CreateApi } from '@/services'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const auth = reactive<User>({
  id: undefined,
  isAdmin: false,
  isAuthorized: false,
  isReadonly: true,
  seasons: [],
  token: undefined,
})

const { value: storedToken, set: setStoredToken, remove: removeStoredToken } = useLocalStorage('BIRDOGEY_TOKEN')

export async function initAuthFromStorage(api: CreateApi): Promise<void> {
  try {
    if (storedToken.value) {
      Object.assign(auth, { token: storedToken })

      const user = await api.users.refreshLogin()
      Object.assign(auth, user)
    }
  } catch {
    clearStoredAuth()
  }
}

function saveAuthToStorage(userData: User): void {
  try {
    if (userData.token) {
      setStoredToken(userData.token)
    }
  } catch (error) {
    console.error('Error saving auth to storage:', error)
  }
}

export function clearStoredAuth(): void {
  removeStoredToken()

  Object.assign(auth, {
    id: undefined,
    isAdmin: false,
    isAuthorized: false,
    isReadonly: true,
    seasons: [],
    token: undefined,
  })
}

export async function attemptLogin(api: CreateApi, value: string): Promise<boolean> {
  const response = await api.users.attemptLogin(value)

  if (response) {
    Object.assign(auth, response)
    saveAuthToStorage(auth)
  }

  return auth.isAuthorized
}

export function getAuthToken(): string | undefined {
  return auth.token
}
