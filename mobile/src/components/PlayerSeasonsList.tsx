import { useApiClient } from '@/contexts/ApiClientContext'
import { colors } from '@/theme/colors'
import { useQuery } from '@tanstack/react-query'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { useState } from 'react'
import { UserSeason } from '@birdogey/shared'
import { PlayerSeasonFormModal } from './PlayerSeasonFormModal'

type PlayerSeasonsListProps = {
  userId: string,
}

export function PlayerSeasonsList({ userId }: PlayerSeasonsListProps): React.ReactNode {
  const api = useApiClient()
  const [selectedSeason, setSelectedSeason] = useState<UserSeason | null>(null)
  const [newSeasonModalVisible, setNewSeasonModalVisible] = useState(false)

  const { data: seasons = [] } = useQuery({
    queryKey: ['players', userId, 'seasons'],
    queryFn: () => api.user.getSeasonsForUser(userId),
  })

  return (
    <View style={styles.container}>
      {seasons.map((userSeason) => (
        <Pressable key={userSeason.season._id} style={formStyles.secondaryButton} onPress={() => setSelectedSeason(userSeason)}>
          <Text style={formStyles.secondaryButtonText}>{userSeason.season.name}</Text>
          <SymbolView name="chevron.right" size={20} tintColor={colors.on_surface_variant} />
        </Pressable>
      ))}

      <Pressable style={formStyles.secondaryButton} onPress={() => setNewSeasonModalVisible(true)}>
        <SymbolView name="plus" size={20} tintColor={colors.on_surface_variant} />
        <Text style={formStyles.secondaryButtonText}>New Season</Text>
      </Pressable>

      {selectedSeason && (
        <PlayerSeasonFormModal
          userId={userId}
          initialValues={selectedSeason}
          visible={!!selectedSeason}
          onDismiss={() => setSelectedSeason(null)}
        />
      )}

      <PlayerSeasonFormModal
        userId={userId}
        visible={newSeasonModalVisible}
        onDismiss={() => setNewSeasonModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  seasonContainer: {
    gap: 8,
    backgroundColor: colors.surface_container_low,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
