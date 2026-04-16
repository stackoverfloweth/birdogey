import { config } from '@/config/env'
import { getToken, setToken, removeToken } from '@/services/tokenStorage'
import { createAuthApi, FetchHttpClient, MINUTE, User } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type AuthState = {
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  sendCode: (phoneNumber: string) => Promise<void>,
  verifyCode: (phoneNumber: string, code: string) => Promise<void>,
  logout: () => Promise<void>,
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const apiClient = useRef<FetchHttpClient | null>(null)
  const isAuthenticated = useMemo(() => !!user, [user])

  apiClient.current ??= new FetchHttpClient({ baseUrl: config.apiBaseUrl, getToken })

  const authApiRef = useRef<ReturnType<typeof createAuthApi> | null>(null)

  authApiRef.current ??= createAuthApi(apiClient.current)

  const refresh = useCallback(async (): Promise<void> => {
    const user = await authApiRef.current?.refresh()
    if (user?.token) {
      setToken(user.token)
      setUser(user)
    }
  }, [])

  const initAuth = useCallback(async (): Promise<void> => {
    const token = await getToken()

    if (!token) {
      return
    }

    return refresh()
  }, [refresh])

  const sendCode = useCallback(async (phoneNumber: string) => {
    await authApiRef.current?.sendCode(phoneNumber)
  }, [])

  const verifyCode = useCallback(async (phoneNumber: string, code: string) => {
    // const user = await authApiRef.current?.verifyCode(phoneNumber, code)

    // if (user?.token) {
    //   setToken(user.token)
    //   setUser(user)
    // }
    setUser({ phoneNumber } as User)
  }, [])

  const logout = useCallback(async () => {
    removeToken()
    // push to login screen?
  }, [])

  const { error } = useQuery({
    queryKey: ['refreshLogin'],
    queryFn: refresh,
    enabled: () => isAuthenticated,
    refetchInterval: MINUTE * 5,
    staleTime: MINUTE * 1,
    refetchOnWindowFocus: true,
    retry: false,
  })

  useEffect(() => {
    if (error) {
      logout()
    }
  }, [error, logout])

  useEffect(() => {
    initAuth().finally(() => setIsLoading(false))
  }, [initAuth])

  const value = useMemo<AuthState>(() => ({
    user,
    isAuthenticated,
    isLoading,
    sendCode,
    verifyCode,
    logout,
  }), [user, isAuthenticated, isLoading, sendCode, verifyCode, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
