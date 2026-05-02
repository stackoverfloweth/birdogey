import { colors } from '@/theme/colors'
import { cardStyles } from '@/theme/card'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { Event } from '@birdogey/shared'
import { badgeStyles } from '@/theme/badge'
import { useSeason } from '@/hooks/useSeason'
import { formatDistanceToNow } from 'date-fns'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'

export type NextEventCardProps = {
  event: Event,
}

export function NextEventCard({ event }: NextEventCardProps): React.ReactNode {
  const season = useSeason(event.seasonId)
  const startsIn = formatDistanceToNow(event.created)

  return (
    <View style={[cardStyles.card, styles.container]}>
      <View style={badgeStyles.badge}>
        <Text style={badgeStyles.badgeText}>Next Event</Text>
      </View>

      <View>
        {season && <Text style={styles.headerText}>{season.name}</Text>}
        <Text style={styles.subheaderText}>{event.name}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, width: '100%', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.clockLabel}>Starts in</Text>
          <Text style={styles.clockValue}>{startsIn}</Text>
        </View>

        <Pressable style={[formStyles.iconButton, { backgroundColor: colors.surface_container_low }]} onPress={() => router.push(`/events/${event.id}`)}>
          <SymbolView name="chevron.right" size={24} tintColor={colors.on_surface_variant} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.primary,
    borderRadius: 42,
    gap: 16,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
  subheaderText: {
    fontSize: 24,
    fontWeight: 'normal',
    color: colors.primary_200,
  },
  clockLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.primary_200,
  },
  clockValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
})
