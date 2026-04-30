import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const cardStyles = StyleSheet.create({
  card: {
    position: 'relative',
    columnGap: 16,
    alignItems: 'stretch',
    borderRadius: 42,
    padding: 24,
    backgroundColor: colors.surface,
  },
  cardPrimaryText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
  cardSecondaryText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.surface_container_highest,
  },
})
