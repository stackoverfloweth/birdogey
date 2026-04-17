import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'BIRDOGEY_ACCESS_TOKEN'
const REFRESH_TOKEN_KEY = 'BIRDOGEY_REFRESH_TOKEN'

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
}

export async function setAccessToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    return
  }
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token)
}

export async function removeAccessToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    return
  }
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
}

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

export async function setRefreshToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
    return
  }
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token)
}

export async function removeRefreshToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    return
  }
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}

export async function getStoredValue(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key)
  }
  return SecureStore.getItemAsync(key)
}

export async function setStoredValue(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value)
    return
  }
  await SecureStore.setItemAsync(key, value)
}
