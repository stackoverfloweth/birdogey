import { Text, StyleSheet, Pressable } from 'react-native'
import { colors } from '@/theme/colors'
import type { Event } from '@birdogey/shared'
import { router } from 'expo-router'

export function EventListItem({ event }: { event: Event }): React.ReactNode {
  return (
    <Pressable style={styles.container} onPress={() => router.push(`/events/${event.id}`)}>
      <Text>{event.name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: colors.surface_container_lowest,
    borderRadius: 9999,
  },
})
