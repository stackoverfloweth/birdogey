import { DimensionValue, Image, StyleSheet } from 'react-native'
import { config } from '@/config/env'
import ImageKit from 'imagekit-javascript'

export function UserImage({ imageUrl, width = '100%', height = '100%' }: { imageUrl?: string, width?: DimensionValue, height?: DimensionValue }): React.ReactNode {
  const imagekit = new ImageKit({
    urlEndpoint: config.imageKitUrl,
    publicKey: config.imageKitPublicKey,
  })
  const uri = imagekit.url({
    path: `/players/${imageUrl ?? 'default.png'}`,
    transformation: [
      { raw: 'fo-face,r-max' },
    ],
  })

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
