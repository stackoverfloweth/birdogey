import { setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/services/tokenStorage'
import { isBiometricsEnabled, getAvailableBiometrics } from '@/services/biometrics'
import * as LocalAuthentication from 'expo-local-authentication'
import { MINUTE, User } from '@birdogey/shared'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useApiClient } from './ApiClientContext'

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
  const api = useApiClient()
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = useMemo(() => !!user, [user])

  const refreshAccessToken = useCallback(async (): Promise<User | null> => {
    const user = await api.auth.refresh()
    if (user?.accessToken) {
      setAccessToken(user.accessToken)
      setUser(user)
    }

    return user ?? null
  }, [api])

  const exchange = useCallback(async (): Promise<void> => {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }

    const user = await api.auth.exchange(refreshToken)

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
  }, [api])

  const queryClient = useQueryClient()

  useQuery({
    queryKey: ['refreshLogin'],
    queryFn: () => refreshAccessToken().catch(logout),
    enabled: () => isAuthenticated,
    refetchInterval: MINUTE * 5,
    staleTime: MINUTE * 1,
    refetchOnWindowFocus: true,
    retry: false,
  })

  const { data: availableBiometrics = [], isLoading: isAvailableBiometricsLoading } = useQuery({
    queryKey: ['biometrics', 'available'],
    queryFn: getAvailableBiometrics,
    staleTime: Infinity,
  })

  const { data: biometricsEnabled = null, isLoading: isBiometricsEnabledLoading } = useQuery({
    queryKey: ['biometrics', 'enabled'],
    queryFn: isBiometricsEnabled,
    staleTime: Infinity,
  })

  const sendCode = useCallback(async (phoneNumber: string) => {
    await api.auth.sendCode(phoneNumber)
  }, [api])

  const verifyCode = useCallback(async (phoneNumber: string, code: string) => {
    const user = await api.auth.verifyCode(phoneNumber, code)

    if (user?.accessToken) {
      setAccessToken(user.accessToken)
      if (user.refreshToken) {
        setRefreshToken(user.refreshToken)
      }
      setUser(user)

      // prevents query from triggering when initialized
      queryClient.setQueryData(['refreshLogin'], user)
    }
  }, [api, queryClient])

  const logout = useCallback(async () => {
    removeAccessToken()
    removeRefreshToken()
    setUser(null)
  }, [])

  const isLoading = useMemo(() => {
    return isAvailableBiometricsLoading || isBiometricsEnabledLoading
  }, [isAvailableBiometricsLoading, isBiometricsEnabledLoading])

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
