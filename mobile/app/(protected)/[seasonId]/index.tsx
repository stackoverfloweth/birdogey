import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useSeason } from '@/contexts/SeasonContext'
import { useCallback } from 'react'
import { SeasonSelectList } from '@/components/SeasonSelectList'

export default function HomeScreen(): React.ReactNode {
  const { selectedSeason, setSelectedSeasonId } = useSeason()

  const navigateToSeason = useCallback((seasonId: string): void => {
    setSelectedSeasonId(seasonId)
    router.setParams({ seasonId })
  }, [setSelectedSeasonId])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birdogey</Text>

      <SeasonSelectList onSeasonPress={(season) => navigateToSeason(season.id)} selectedSeasonId={selectedSeason?.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
