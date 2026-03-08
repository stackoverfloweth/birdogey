import { useLocalStorage as useLocalStoragePrefect } from '@prefecthq/vue-compositions'

const LOCAL_STORAGE_KEYS = {
  BIRDOGEY_SELECTED_SEASON: '',
  BIRDOGEY_TOKEN: '',
}

export function useLocalStorage<T extends keyof typeof LOCAL_STORAGE_KEYS>(key: T): ReturnType<typeof useLocalStoragePrefect<typeof LOCAL_STORAGE_KEYS[T]>> {
  return useLocalStoragePrefect(key, LOCAL_STORAGE_KEYS[key])
}
