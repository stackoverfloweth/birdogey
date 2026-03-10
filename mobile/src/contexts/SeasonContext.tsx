import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Season } from '@birdogey/shared'
import { useAuth } from './AuthContext'
import { getStoredValue, setStoredValue } from '../services/tokenStorage'

const SEASON_KEY = 'BIRDOGEY_SEASON_ID'

interface SeasonState {
  selectedSeasonId: string | null,
  setSelectedSeasonId: (id: string) => void,
  availableSeasons: Season[],
}

const SeasonContext = createContext<SeasonState | null>(null)

export function SeasonProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const { user } = useAuth()
  const [selectedSeasonId, setSelectedSeasonIdState] = useState<string | null>(null)
  const availableSeasons = useMemo(() => user?.seasons ?? [], [user])

  useEffect(() => {
    async function restore(): Promise<void> {
      const stored = await getStoredValue(SEASON_KEY)
      if (stored && availableSeasons.some((season) => season.id === stored)) {
        setSelectedSeasonIdState(stored)
      } else if (availableSeasons.length === 1) {
        setSelectedSeasonIdState(availableSeasons[0].id)
        await setStoredValue(SEASON_KEY, availableSeasons[0].id)
      }
    }
    if (availableSeasons.length > 0) {
      restore()
    }
  }, [availableSeasons])

  const setSelectedSeasonId = (id: string): void => {
    setSelectedSeasonIdState(id)
    setStoredValue(SEASON_KEY, id)
  }

  return (
    <SeasonContext.Provider value={{ selectedSeasonId, setSelectedSeasonId, availableSeasons }}>
      {children}
    </SeasonContext.Provider>
  )
}

export function useSeason(): SeasonState {
  const context = useContext(SeasonContext)
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider')
  }
  return context
}
