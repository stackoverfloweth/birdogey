import { useSeason } from '@/contexts/SeasonContext'
import { Season } from '@birdogey/shared'
import { FlatList, Pressable, Text, StyleSheet } from 'react-native'

function renderSeason({ item, onPress, isSelected }: { item: Season, onPress: () => void, isSelected: boolean }): React.ReactElement {
  return (
    <Pressable style={[styles.seasonItem, isSelected && styles.seasonItemSelected]} onPress={onPress}>
      <Text style={[styles.seasonName, isSelected && styles.seasonNameSelected]}>{item.name}</Text>
      <Text style={[styles.courseName, isSelected && styles.courseNameSelected]}>{item.course.name}</Text>
    </Pressable>
  )
}

export function SeasonSelectList({ onSeasonPress, selectedSeasonId }: { onSeasonPress: (season: Season) => void, selectedSeasonId?: string }): React.ReactNode {
  const { availableSeasons } = useSeason()

  return (
    <FlatList
      data={availableSeasons}
      keyExtractor={(season) => season.id}
      renderItem={({ item }) => renderSeason({ item, onPress: () => onSeasonPress(item), isSelected: item.id === selectedSeasonId })}
      contentContainerStyle={styles.list}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  seasonItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  seasonItemSelected: {
    backgroundColor: '#2563eb',
  },
  seasonName: {
    fontSize: 18,
    fontWeight: '600',
  },
  seasonNameSelected: {
    color: '#fff',
  },
  courseName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  courseNameSelected: {
    color: '#dbeafe',
  },
})
