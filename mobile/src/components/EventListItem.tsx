import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Event } from '@birdogey/shared'

interface Props {
  event: Event,
  onPress: () => void,
}

export function EventListItem({ event, onPress }: Props): React.ReactNode {
  const dateStr = event.created.toLocaleDateString()
  const isCompleted = !!event.completed

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.name}>{event.name}</Text>
        <View style={[styles.badge, isCompleted ? styles.completed : styles.active]}>
          <Text style={styles.badgeText}>{isCompleted ? 'Completed' : 'Active'}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.detail}>{dateStr}</Text>
        <Text style={styles.detail}>
          {event.players.length}
          {' '}
          players
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  completed: {
    backgroundColor: '#d1fae5',
  },
  active: {
    backgroundColor: '#dbeafe',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detail: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
})
