import { ReactNode, useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '@/theme/colors'

const DISMISS_DISTANCE = 120
const DISMISS_VELOCITY = 800
const SPRING = { damping: 22, stiffness: 220, mass: 0.7 }

type BottomSheetProps = {
  visible: boolean,
  onDismiss: () => void,
  children: ReactNode,
  showHandle?: boolean,
  contentStyle?: StyleProp<ViewStyle>,
}

export function BottomSheet({ visible, onDismiss, children, showHandle = true, contentStyle }: BottomSheetProps): React.ReactNode {
  const { height: screenHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(screenHeight)
  const [rendered, setRendered] = useState(visible)

  useEffect(() => {
    if (visible) {
      setRendered(true)
      translateY.value = withSpring(0, SPRING)
    } else if (rendered) {
      translateY.value = withTiming(screenHeight, { duration: 220 }, (finished) => {
        if (finished) {
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          runOnJS(setRendered)(false)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, screenHeight])

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY)
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY) {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        runOnJS(onDismiss)()
      } else {
        translateY.value = withSpring(0, SPRING)
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, screenHeight], [1, 0], Extrapolation.CLAMP),
  }))

  if (!rendered) return null

  return (
    <Modal animationType="none" transparent visible onRequestClose={onDismiss}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            { maxHeight: screenHeight - insets.top - 12, paddingBottom: insets.bottom },
            contentStyle,
            sheetStyle,
          ]}
        >
          {showHandle && (
            <GestureDetector gesture={pan}>
              <View style={styles.handleArea}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>
          )}

          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    backgroundColor: colors.surface_container_lowest,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handleArea: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.outline_variant,
  },
})
