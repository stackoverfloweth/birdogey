import { config } from '@/config/env'
import { getAccessToken, setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/services/tokenStorage'
import { isBiometricsEnabled, getAvailableBiometrics } from '@/services/biometrics'
import * as LocalAuthentication from 'expo-local-authentication'
import { createAuthApi, FetchHttpClient, MINUTE, User } from '@birdogey/shared'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type AuthState = {
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  biometricsEnabled: boolean | null,
  availableBiometrics: LocalAuthentication.AuthenticationType[],
  sendCode: (phoneNumber: string) => Promise<void>,
  verifyCode: (phoneNumber: string, code: string) => Promise<void>,
  exchange: () => Promise<void>,
  logout: () => Promise<void>,
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availableBiometrics, setAvailableBiometrics] = useState<LocalAuthentication.AuthenticationType[]>([])
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean | null>(null)

  const apiClient = useRef<FetchHttpClient | null>(null)
  const isAuthenticated = useMemo(() => !!user, [user])

  apiClient.current ??= new FetchHttpClient({ baseUrl: config.apiBaseUrl, getAccessToken })

  const authApiRef = useRef<ReturnType<typeof createAuthApi> | null>(null)

  authApiRef.current ??= createAuthApi(apiClient.current)

  const refreshAccessToken = useCallback(async (): Promise<User | null> => {
    const user = await authApiRef.current?.refresh()
    if (user?.accessToken) {
      setAccessToken(user.accessToken)
      setUser(user)
    }

    return user ?? null
  }, [])

  const exchange = useCallback(async (): Promise<void> => {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }

    const user = await authApiRef.current?.exchange(refreshToken)

    if (!user) {
      throw new Error('No user found')
    }

    if (user.accessToken) {
      setAccessToken(user.accessToken)
      setUser(user)
    }

    if (user.refreshToken) {
      setRefreshToken(user.refreshToken)
    }
  }, [])

  const initAuth = useCallback(async (): Promise<void> => {
    const refreshToken = await getRefreshToken()
    const availableBiometrics = await getAvailableBiometrics()
    setAvailableBiometrics(availableBiometrics)

    const biometricsEnabled = await isBiometricsEnabled()
    setBiometricsEnabled(biometricsEnabled)
  }, [])

  const queryClient = useQueryClient()
  const { error } = useQuery({
    queryKey: ['refreshLogin'],
    queryFn: refreshAccessToken,
    enabled: () => isAuthenticated,
    refetchInterval: MINUTE * 5,
    staleTime: MINUTE * 1,
    refetchOnWindowFocus: true,
    retry: false,
  })

  const sendCode = useCallback(async (phoneNumber: string) => {
    await authApiRef.current?.sendCode(phoneNumber)
  }, [])

  const verifyCode = useCallback(async (phoneNumber: string, code: string) => {
    const user = await authApiRef.current?.verifyCode(phoneNumber, code)

    if (user?.accessToken) {
      setAccessToken(user.accessToken)
      if (user.refreshToken) {
        setRefreshToken(user.refreshToken)
      }
      setUser(user)

      // prevents query from triggering when initialized
      queryClient.setQueryData(['refreshLogin'], user)
    }
  }, [queryClient])

  const logout = useCallback(async () => {
    removeAccessToken()
    removeRefreshToken()
    setUser(null)
  }, [])

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
    biometricsEnabled,
    availableBiometrics,
    sendCode,
    verifyCode,
    logout,
    exchange,
  }), [user, isAuthenticated, isLoading, biometricsEnabled, availableBiometrics, sendCode, verifyCode, logout, exchange])

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
