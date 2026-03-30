import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { type User, createAuthApi, FetchHttpClient, MINUTE } from '@birdogey/shared'
import { config } from '../config/env'
import { getToken, setToken, removeToken } from '../services/tokenStorage'

interface AuthState {
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (password: string) => Promise<void>,
  logout: () => Promise<void>,
  apiClient: FetchHttpClient,
}

const AuthContext = createContext<AuthState>(null as unknown as AuthState)

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const [apiClient] = useState(() => new FetchHttpClient({ baseUrl: config.apiBaseUrl, getToken }))
  const [authApi] = useState(() => createAuthApi(apiClient))

  const refreshToken = useCallback(async () => {
    try {
      const refreshedUser = await authApi.refresh()
      if (refreshedUser.token) {
        await setToken(refreshedUser.token)
      }
      setUser(refreshedUser)
    } catch {
      setUser(null)
      await removeToken()
    }
  }, [authApi])

  useEffect(() => {
    async function init(): Promise<void> {
      const token = await getToken()
      if (token) {
        await refreshToken()
      }
      setIsLoading(false)
    }
    init()
  }, [refreshToken])

  useEffect(() => {
    if (user) {
      refreshInterval.current = setInterval(() => {
        refreshToken()
      }, MINUTE * 5)
    }
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current)
      }
    }
  }, [user, refreshToken])

  const login = useCallback(async (password: string) => {
    const loggedInUser = await authApi.login(password)
    if (loggedInUser.token) {
      await setToken(loggedInUser.token)
    }
    setUser(loggedInUser)
  }, [authApi])

  const logout = useCallback(async () => {
    setUser(null)
    await removeToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        apiClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  return useContext(AuthContext)
}
