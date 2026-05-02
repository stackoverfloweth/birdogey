import { Alert, Pressable, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { UserImage } from '@/components/UserImage'
import { useApiClient } from '@/contexts/ApiClientContext'
import { config } from '@/config/env'
import { colors } from '@/theme/colors'

const IMAGE_SIZE = 250
const MAX_FILE_SIZE = 1024 * 1024 * 5
const UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload'

type UserImageUploadProps = {
  imageUrl?: string,
  onImageUrlChange: (imageUrl: string) => void,
  disabled?: boolean,
}

export function UserImageUpload({ imageUrl, onImageUrlChange, disabled }: UserImageUploadProps): React.ReactNode {
  const api = useApiClient()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function pickImage(): Promise<void> {
    if (loading || disabled) return

    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true,
    })

    if (result.canceled) return

    const [asset] = result.assets

    if (asset.size !== undefined && asset.size > MAX_FILE_SIZE) {
      Alert.alert('Image must be smaller than 5MB')
      return
    }

    void upload(asset)
  }

  async function upload(asset: DocumentPicker.DocumentPickerAsset): Promise<void> {
    setLoading(true)
    setProgress(0)

    try {
      const auth = await api.imagekit.authenticate()

      const formData = new FormData()
      formData.append('file', {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType ?? 'image/jpeg',
      } as unknown as Blob)
      formData.append('fileName', asset.name)
      formData.append('publicKey', config.imageKitPublicKey)
      formData.append('token', auth.token)
      formData.append('expire', String(auth.expire))
      formData.append('signature', auth.signature)
      formData.append('folder', '/players')
      formData.append('useUniqueFileName', 'true')
      formData.append('fileType', 'image')

      const response = await new Promise<{ name: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', UPLOAD_URL)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress((event.loaded * 100) / event.total)
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            reject(new Error(`Upload failed (${xhr.status})`))
          }
        }
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.send(formData)
      })

      onImageUrlChange(response.name)
    } catch {
      Alert.alert('Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => void pickImage()} disabled={loading || disabled}>
        <View style={styles.imageWrapper}>
          <UserImage imageUrl={imageUrl} width={IMAGE_SIZE} height={IMAGE_SIZE} />
        </View>
        {loading && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  progressTrack: {
    marginTop: 8,
    height: 4,
    width: IMAGE_SIZE,
    backgroundColor: colors.surface_container,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.green_500,
  },
})
