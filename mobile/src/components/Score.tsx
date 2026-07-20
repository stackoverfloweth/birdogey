import { colors } from '@/theme/colors'
import { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

type ScoreProps = {
  value?: number,
  dnf?: boolean,
}

export function Score({ value, dnf }: ScoreProps): React.ReactNode {
  const classes = useMemo(() => {
    const container: StyleProp<ViewStyle>[] = [styles.container]
    const text: StyleProp<TextStyle>[] = [styles.text]

    if (dnf) {
      container.push(styles.containerDnf)
      text.push(styles.textDnf)
      return { container, text }
    }

    if (value === undefined) {
      return {
        container,
        text,
      }
    }

    if (value > 0) {
      container.push(styles.containerPositive)
      text.push(styles.textPositive)
    } else if (value < 0) {
      container.push(styles.containerNegative)
      text.push(styles.textNegative)
    }

    return {
      container,
      text,
    }
  }, [value, dnf])

  const formattedValue = useMemo(() => {
    if (dnf) {
      return 'DNF'
    }

    if (value === 0) {
      return 'E'
    }

    if (!!value && value > 0) {
      return `+${value}`
    }

    return value?.toString()
  }, [value, dnf])

  return (
    <View style={classes.container}>
      <Text style={classes.text}>{formattedValue}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: 34,
    height: 34,
  },
  containerNegative: {
    borderRadius: 9999,
    backgroundColor: colors.primary_500,
  },
  containerPositive: {
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textNegative: {
    color: colors.surface_container_lowest,
  },
  textPositive: {
    color: colors.surface_container_lowest,
  },
  containerDnf: {
    backgroundColor: colors.error,
    transform: [{ rotate: '45deg' }],
  },
  textDnf: {
    color: colors.surface_container_lowest,
    fontSize: 11,
    transform: [{ rotate: '-45deg' }],
  },
})
