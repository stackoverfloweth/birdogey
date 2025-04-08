import { reactive } from 'vue'
import { User } from '@/models'
import { CreateApi } from '@/services'

export const auth = reactive<User>({
  id: undefined,
  isAdmin: false,
  isAuthorized: false,
  seasons: [],
})

export async function attemptLogin(api: CreateApi, value: string): Promise<boolean> {
  const user = await api.users.attemptLogin(value)

  Object.assign(auth, user)

  return auth.isAuthorized
}
