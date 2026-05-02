import { cardStyles } from '@/theme/card'
import { View, Text, StyleSheet } from 'react-native'
import { useSeason } from '@/hooks/useSeason'
import { UserSeason } from '@birdogey/shared'
import { colors } from '@/theme/colors'

export type UserSeasonCardProps = {
  userSeason: UserSeason,
}

export function UserSeasonCard({ userSeason }: UserSeasonCardProps): React.ReactNode {
  const season = useSeason(userSeason.seasonId)

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
