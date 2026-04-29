import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.outline_variant,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
})
