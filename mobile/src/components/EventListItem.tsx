import { Text, StyleSheet, Pressable, View } from 'react-native'
import { colors } from '@/theme/colors'
import { isActiveEvent, penniesToUSD, type Event, type Season } from '@birdogey/shared'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { badgeStyles } from '@/theme/badge'
import { SymbolView } from 'expo-symbols'
import { useAuthSeasons } from '@/hooks/useAuthSeasons'
import { format } from 'date-fns'

type EventListItemProps = {
  event: Event,
  right?: React.ReactNode,
}

export function EventListItem({ event, right }: EventListItemProps): React.ReactNode {
  const seasons = useAuthSeasons()
  const seasonsMap = useMemo(() => {
    return seasons.reduce((map, season) => {
      map.set(season.id, season)
      return map
    }, new Map<string, Season>())
  }, [seasons])

  const bestScore = useMemo(() => {
    return event.players.reduce((best, player) => {
      return Math.min(best, player.score ?? Infinity)
    }, Infinity)
  }, [event.players])

  return (
    <Pressable style={styles.container} onPress={() => router.push(`/events/${event.id}`)}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>{seasonsMap.get(event.seasonId)?.name}</Text>
          <Text>{format(event.start, 'MMMM do')}</Text>
        </View>

        {isActiveEvent(event)
          ? (
              <View style={[badgeStyles.badge, { backgroundColor: colors.primary_500 }]}>
                <Text style={badgeStyles.badgeText}>Active</Text>
              </View>
            )
          : (
              <View style={badgeStyles.badge}>
                <Text style={badgeStyles.badgeText}>Completed</Text>
              </View>
            )}
      </View>

      {event.notes && (
        <View style={styles.iconTextItem}>
          <Text style={styles.iconTextItemText}>{event.notes}</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.iconTextItem}>
          <SymbolView name="person.2.fill" size={20} tintColor={colors.on_surface_variant} />
          <Text style={styles.iconTextItemText}>{event.players.length}</Text>
        </View>

        {bestScore !== Infinity && (
          <View style={styles.iconTextItem}>
            <SymbolView name="trophy.fill" size={14} tintColor={colors.on_surface_variant} />
            <Text style={styles.iconTextItemText}>{bestScore}</Text>
          </View>
        )}

        <View style={styles.iconTextItem}>
          <SymbolView name={event.aceUserIds.length > 0 ? 'a.circle.fill' : 'a.circle'} size={20} tintColor={colors.on_surface_variant} />
          <Text style={styles.iconTextItemText}>{penniesToUSD(event.aceStartingBalance)}</Text>
        </View>
      </View>

      {right}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    backgroundColor: colors.surface_container_lowest,
    borderRadius: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconTextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconTextItemText: {
    fontSize: 12,
    color: colors.on_surface_variant,
  },
})
