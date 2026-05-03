import { usePlayerImage } from '@/hooks/usePlayerImage'
import { DimensionValue, Image, StyleSheet } from 'react-native'

export type UserImageProps = {
  userId?: string,
  imageUrl?: string,
  width?: DimensionValue,
  height?: DimensionValue,
}

export function UserImage({ userId, imageUrl, width = '100%', height = '100%' }: UserImageProps): React.ReactNode {
  const { data: uri } = usePlayerImage(userId, imageUrl)

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
