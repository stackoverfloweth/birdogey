import { usePlayerImage } from '@/hooks/usePlayerImage'
import { DimensionValue, Image, StyleSheet } from 'react-native'

export function UserImage({ imageUrl, width = '100%', height = '100%' }: { imageUrl?: string, width?: DimensionValue, height?: DimensionValue }): React.ReactNode {
  const { data: uri } = usePlayerImage(imageUrl)

  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width, height }]}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    borderRadius: '50%',
    backgroundColor: 'darkgray',
  },
})
