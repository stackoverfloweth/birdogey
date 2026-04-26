import { colors } from '@/theme/colors'
import { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

type ScoreProps = {
  value?: number,
}

export function Score({ value }: ScoreProps): React.ReactNode {
  const classes = useMemo(() => {
    const container: StyleProp<ViewStyle>[] = [styles.container]
    const text: StyleProp<TextStyle>[] = [styles.text]

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
  }, [value])

  return (
    <View style={classes.container}>
      <Text style={classes.text}>{value === 0 ? 'E' : value}</Text>
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
})
