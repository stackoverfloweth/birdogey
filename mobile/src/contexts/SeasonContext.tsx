import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Season } from '@birdogey/shared'
import { useAuth } from './AuthContext'
import { getStoredValue, setStoredValue } from '../services/tokenStorage'

const SEASON_KEY = 'BIRDOGEY_SEASON_ID'

interface SeasonState {
  selectedSeason: Season | null,
  setSelectedSeasonId: (id: string) => void,
  availableSeasons: Season[],
}

const SeasonContext = createContext<SeasonState | null>(null)

export function SeasonProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const { user } = useAuth()
  const [selectedSeason, setSelectedSeasonState] = useState<Season | null>(null)
  const availableSeasons = useMemo(() => user?.seasons ?? [], [user])

  useEffect(() => {
    async function restore(): Promise<void> {
      const stored = await getStoredValue(SEASON_KEY)
      const season = stored ? availableSeasons.find((season) => season.id === stored) : null

      if (season) {
        setSelectedSeasonState(season)
      } else if (availableSeasons.length === 1) {
        setSelectedSeasonState(availableSeasons[0])
        await setStoredValue(SEASON_KEY, availableSeasons[0].id)
      }
    }
    if (availableSeasons.length > 0) {
      restore()
    }
  }, [availableSeasons])

  const setSelectedSeasonId = (id: string): void => {
    const season = availableSeasons.find((season) => season.id === id)

    if (!season) {
      return
    }

    setSelectedSeasonState(season)
    setStoredValue(SEASON_KEY, id)
  }

  return (
    <SeasonContext.Provider value={{ selectedSeason, setSelectedSeasonId, availableSeasons }}>
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
