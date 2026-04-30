import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const formStyles = StyleSheet.create({
  form: {
    padding: 24,
    gap: 16,
  },
  formGroup: {
    gap: 8,
    paddingHorizontal: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: colors.on_surface_variant,
  },
  input: {
    marginHorizontal: -18,
  },
  errorText: {
    color: colors.error,
  },
  button: {
    backgroundColor: colors.primary_500,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 9999,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: colors.surface_container_low,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 9999,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.on_surface_variant,
    fontWeight: 'bold',
    fontSize: 18,
  },
  dangerButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 9999,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  iconButton: {
    aspectRatio: 1,
    width: 60,
    borderRadius: 9999,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
