import { reactive } from 'vue'
import { User } from '@/models'
import { CreateApi } from '@/services'

const TOKEN_STORAGE_KEY = 'birdogey_token'

export const auth = reactive<User>({
  id: undefined,
  isAdmin: false,
  isAuthorized: false,
  isReadonly: true,
  seasons: [],
  token: undefined,
})

export async function initAuthFromStorage(api: CreateApi): Promise<void> {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)

    if (token) {
      Object.assign(auth, { token })

      const user = await api.users.refreshLogin()
      Object.assign(auth, user)
    }
  } catch (error) {
    console.error('Error initializing auth from storage:', error)
    clearStoredAuth()
  }
}

function saveAuthToStorage(userData: User): void {
  try {
    if (userData.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, userData.token)
    }
  } catch (error) {
    console.error('Error saving auth to storage:', error)
  }
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)

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
