import { useCallback, useEffect } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useSeason } from '@/contexts/SeasonContext'
import type { Season } from '@birdogey/shared'

export default function SeasonSelectionScreen(): React.ReactNode {
  const { availableSeasons, selectedSeasonId, setSelectedSeasonId } = useSeason()

  const navigateToSeason = useCallback((seasonId: string): void => {
    setSelectedSeasonId(seasonId)
    router.replace(`/(protected)/${seasonId}`)
  }, [setSelectedSeasonId])

  useEffect(() => {
    if (availableSeasons.length === 1) {
      navigateToSeason(availableSeasons[0].id)
    } else if (selectedSeasonId) {
      navigateToSeason(selectedSeasonId)
    }
  }, [availableSeasons, selectedSeasonId, navigateToSeason])

  function renderSeason({ item }: { item: Season }): React.ReactElement {
    return (
      <Pressable style={styles.seasonItem} onPress={() => navigateToSeason(item.id)}>
        <Text style={styles.seasonName}>{item.name}</Text>
        <Text style={styles.courseName}>{item.course.name}</Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Season</Text>
      <FlatList
        data={availableSeasons}
        keyExtractor={(season) => season.id}
        renderItem={renderSeason}
        contentContainerStyle={styles.list}
      />
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
  list: {
    padding: 16,
  },
  seasonItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  seasonName: {
    fontSize: 18,
    fontWeight: '600',
  },
  courseName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
})
