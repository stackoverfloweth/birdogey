import { cardStyles } from '@/theme/card'
import { View, Text, StyleSheet } from 'react-native'
import { UserSeason } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'

export type PlayerSeasonCardProps = {
  userSeason: UserSeason,
}

export function PlayerSeasonCard({ userSeason }: PlayerSeasonCardProps): React.ReactNode {
  const api = useApiClient()
  const { data: season } = useQuery({
    queryKey: ['seasons', userSeason.seasonId],
    queryFn: () => api.season.getById(userSeason.seasonId),
  })

  return (
    <View style={[cardStyles.card, styles.container]}>
      <Text style={styles.subTitle}>{season?.name}</Text>
      <View style={styles.tagContainer}>
        <Text style={styles.tagLabel}>#</Text>
        <Text style={styles.tag}>{userSeason.tagId}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.on_surface_variant,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagLabel: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'Ephesis',
  },
  tag: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.on_surface,
  },
})
