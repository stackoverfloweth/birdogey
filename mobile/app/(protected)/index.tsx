import { NextEventCard } from '@/components/NextEventCard'
import { PlayerSeasonCard } from '@/components/PlayerSeasonCard'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { Dimensions, FlatList, ScrollView, StyleSheet, View } from 'react-native'

function CarouselSeparator(): React.ReactNode {
  return <View style={{ width: CARD_SPACING }} />
}

const CARD_WIDTH = Dimensions.get('window').width - 64
const CARD_SPACING = 12

export default function ProtectedIndex(): React.ReactNode {
  const api = useApiClient()
  const auth = useAuth()

  const { data: nextEvent } = useQuery({
    queryKey: ['events', 'next'],
    queryFn: () => api.event.getNext(),
  })

  const { data: seasons = [] } = useQuery({
    queryKey: ['players', auth.user?.id, 'seasons'],
    queryFn: () => api.user.getSeasonsForUser(auth.user?.id ?? ''),
    enabled: !!auth.user?.id,
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!!nextEvent && <NextEventCard event={nextEvent} />}
      {seasons.length > 0 && (
        <FlatList
          data={seasons}
          keyExtractor={(item) => item.seasonId}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }}>
              <PlayerSeasonCard userSeason={item} />
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          snapToAlignment="start"
          ItemSeparatorComponent={CarouselSeparator}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  carousel: {
    paddingHorizontal: 16,
  },
})
