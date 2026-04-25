import { Text, StyleSheet, Pressable, View } from 'react-native'
import { colors } from '@/theme/colors'
import type { Event } from '@birdogey/shared'
import { router } from 'expo-router'

type EventListItemProps = {
  event: Event,
  right?: React.ReactNode,
}

export function EventListItem({ event, right }: EventListItemProps): React.ReactNode {
  return (
    <Pressable style={styles.container} onPress={() => router.push(`/events/${event.id}`)}>
      <View style={styles.primary}>
        <Text style={styles.primaryText}>{event.name}</Text>
      </View>
      {right}
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
  primary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
