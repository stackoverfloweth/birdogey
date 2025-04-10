import { reactive } from 'vue'
import { User } from '@/models'
import { CreateApi } from '@/services'

const AUTH_STORAGE_KEY = 'birdogey_auth'
const TOKEN_EXPIRY_KEY = 'birdogey_auth_expiry'
const TTL_HOURS = 2

export const auth = reactive<User>({
  id: undefined,
  isAdmin: false,
  isAuthorized: false,
  seasons: [],
})

initAuthFromStorage()

function initAuthFromStorage(): void {
  try {
    const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)

    if (storedExpiry && storedAuth) {
      const expiryTime = parseInt(storedExpiry, 10)
      const authStillValid = Date.now() < expiryTime

      if (!authStillValid) {
        throw new Error('Auth expired')
      }

      const userData = JSON.parse(storedAuth) as User
      Object.assign(auth, userData)
    }
  } catch {
    clearStoredAuth()
  }
}

function saveAuthToStorage(userData: User): void {
  try {
    const expiryTime = Date.now() + TTL_HOURS * 60 * 60 * 1_000
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
  } catch (error) {
    console.error('Error saving auth to storage:', error)
  }
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)

  Object.assign(auth, {
    id: undefined,
    isAdmin: false,
    isAuthorized: false,
    seasons: [],
  })
}

export async function attemptLogin(api: CreateApi, value: string): Promise<boolean> {
  const user = await api.users.attemptLogin(value)

  if (user) {
    Object.assign(auth, user)
    saveAuthToStorage(user)
  }

  return auth.isAuthorized
}
