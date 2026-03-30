import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useSeason } from '@/contexts/SeasonContext'
import type { Season } from '@birdogey/shared'

export default function SeasonPickerModal(): React.ReactNode {
  const { availableSeasons, setSelectedSeasonId } = useSeason()

  function selectSeason(seasonId: string): void {
    setSelectedSeasonId(seasonId)
    router.dismiss()
    router.replace(`/(protected)/${seasonId}`)
  }

  function renderSeason({ item }: { item: Season }): React.ReactElement {
    return (
      <Pressable style={styles.seasonItem} onPress={() => selectSeason(item.id)}>
        <Text style={styles.seasonName}>{item.name}</Text>
        <Text style={styles.courseName}>{item.course.name}</Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
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
    paddingTop: 0,
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
