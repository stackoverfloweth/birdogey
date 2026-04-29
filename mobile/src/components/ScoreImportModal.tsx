import { ActivityIndicator, Alert, Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { modalsStyles } from '@/theme/modals'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'
import { SymbolView } from 'expo-symbols'
import { useUDiscImport } from '@/hooks/useUdiscImport'
import { EventPlayerRequest, UserRequest, UserSeason } from '@birdogey/shared'
import { useState } from 'react'
import * as Linking from 'expo-linking'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useSeason } from '@/hooks/useSeason'

type ScoreImportModalProps = {
  visible: boolean,
  onSubmit: (scores: Map<string, number>) => void,
  onDismiss: () => void,
  seasonId: string,
  players: UserSeason[],
  eventPlayers: EventPlayerRequest[],
  style?: StyleProp<ViewStyle>,
}

export function ScoreImportModal({ visible, onSubmit, onDismiss, seasonId, players, eventPlayers, style }: ScoreImportModalProps): React.ReactNode {
  const { scores, notInBirdogey, unmatchedInEvent, missingMetadata, parseFile, reset: resetImport } = useUDiscImport(players, eventPlayers)
  const api = useApiClient()
  const season = useSeason(seasonId)

  console.log({ season })

  const [selectedFile, setSelectedFile] = useState<File>()
  const [processing, setProcessing] = useState(false)

  async function pickFile(): Promise<void> {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    if (result.canceled) return

    const [asset] = result.assets
    const file = new File([asset.uri], asset.name, { type: asset.mimeType })
    setSelectedFile(file)
    processFile(file)
  }

  async function processFile(file: File): Promise<void> {
    setProcessing(true)

    try {
      await parseFile(file)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse file'
      Alert.alert('Error', message)
    } finally {
      setProcessing(false)
    }
  }

  async function saveUserMetadata(userId: string, meta: Partial<UserRequest>): Promise<void> {
    await api.user.update(userId, meta)
    missingMetadata.delete(userId)
    Alert.alert('User metadata updated!')
  }

  function applyScores(): void {
    onSubmit(scores)
    onDismiss()
  }

  function reset(): void {
    setSelectedFile(undefined)
    setProcessing(false)
    resetImport()
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onDismiss}>
      <Pressable style={modalsStyles.backdrop} onPress={onDismiss} />

      <View style={[modalsStyles.content, styles.modalContent, !!selectedFile ? style : styles.stepSelectFile]}>
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable onPress={onDismiss} style={[formStyles.iconButton, { backgroundColor: colors.primary }]}>
            <SymbolView name="checkmark" size={30} tintColor="#fff" weight="bold" />
          </Pressable>
        </View>

        {processing && <ActivityIndicator size="large" color={colors.primary} />}

        {selectedFile === undefined && (
          <>
            {!!season?.course.udiscId && (
              <Pressable
                style={{ flexDirection: 'row', gap: 2, alignItems: 'flex-start' }}
                onPress={() => void Linking.openURL(`https://udisc.com/leagues/${season.course.udiscId}`)}
              >
                <Text>Open in UDisc</Text>
                <SymbolView name="arrow.up.right.square.fill" size={16} tintColor={colors.on_surface} />
              </Pressable>
            )}
            <Pressable style={formStyles.button} onPress={() => void pickFile()}>
              <SymbolView name="arrow.up.document.fill" size={24} tintColor="#fff" weight="bold" />
              <Text style={formStyles.buttonText}>Select a file</Text>
            </Pressable>
          </>
        )}

        {!!selectedFile && <Text>{JSON.stringify(season)}</Text>}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    gap: 16,
  },
  stepSelectFile: {
    height: 240,
  },
})
