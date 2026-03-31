import { useCallback, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useSeason } from '@/contexts/SeasonContext'
import { SeasonSelectList } from '@/components/SeasonSelectList'

export default function SeasonSelectionScreen(): React.ReactNode {
  const { availableSeasons, selectedSeason, setSelectedSeasonId } = useSeason()
  const isInitialMount = useRef(true)

  const navigateToSeason = useCallback((seasonId: string): void => {
    setSelectedSeasonId(seasonId)
    router.push(`/(protected)/${seasonId}`)
  }, [setSelectedSeasonId])

  useEffect(() => {
    if (!isInitialMount.current) return
    isInitialMount.current = false

    if (availableSeasons.length === 1) {
      navigateToSeason(availableSeasons[0].id)
    } else if (selectedSeason) {
      navigateToSeason(selectedSeason.id)
    }
  }, [availableSeasons, selectedSeason, navigateToSeason])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Season</Text>
      <SeasonSelectList onSeasonPress={(season) => navigateToSeason(season.id)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
})
