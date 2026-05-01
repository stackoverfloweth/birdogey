import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  content: {
    width: '100%',
    backgroundColor: colors.surface_container_lowest,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'space-between',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 18,
  },
  title: {
    fontSize: 18,
    color: colors.on_surface,
  },
  body: {
    flex: 1,
    gap: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
})
