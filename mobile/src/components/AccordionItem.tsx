import { colors } from '@/theme/colors'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import Animated, { LinearTransition, FadeInUp } from 'react-native-reanimated'

export type AccordionItemProps = {
  title: string,
  expanded?: boolean,
  onExpand?: () => void,
  onCollapse?: () => void,
  onToggle?: (state: boolean) => void,
  children: React.ReactNode,
}

export function AccordionItem({ title, expanded, onExpand, onCollapse, onToggle, children }: AccordionItemProps): React.ReactNode {
  const [state, setState] = useState(expanded ?? false)

  function toggle(): void {
    onToggle?.(state)

    if (state) {
      collapse()
    } else {
      expand()
    }
  }

  function expand(): void {
    onExpand?.()
    setState(true)
  }

  function collapse(): void {
    onCollapse?.()
    setState(false)
  }

  return (
    <Animated.View style={styles.container} layout={LinearTransition}>
      <Pressable style={styles.header} onPress={toggle}>
        <Text style={styles.headerText}>{title}</Text>
        <SymbolView name={state ? 'chevron.up' : 'chevron.down'} size={20} tintColor={colors.on_surface_variant} />
      </Pressable>
      {state && <Animated.View style={styles.content} entering={FadeInUp}>{children}</Animated.View>}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    borderBottomWidth: 1,
    paddingVertical: 12,
    borderBottomColor: colors.outline_variant,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    gap: 12,
  },
  headerText: {
    fontSize: 16,
  },
  content: {
    gap: 12,
  },
})
