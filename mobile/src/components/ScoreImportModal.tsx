import { ActivityIndicator, Alert, Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { modalStyles } from '@/theme/modals'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'
import { SymbolView } from 'expo-symbols'
import { useUDiscImport } from '@/hooks/useUdiscImport'
import { EventPlayerRequest, pluralize, UserRequest, UserSeason } from '@birdogey/shared'
import { useState } from 'react'
import * as Linking from 'expo-linking'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useSeason } from '@/hooks/useSeason'
import { AccordionItem } from './AccordionItem'
import Animated, { LinearTransition } from 'react-native-reanimated'

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

  const [selectedAsset, setSelectedAsset] = useState<DocumentPicker.DocumentPickerAsset>()
  const [processing, setProcessing] = useState(false)

  async function pickFile(): Promise<void> {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    if (result.canceled) return

    const [asset] = result.assets

    setSelectedAsset(asset)
    processFile(asset)
  }

  async function processFile(asset: DocumentPicker.DocumentPickerAsset): Promise<void> {
    setProcessing(true)

    try {
      const response = await fetch(asset.uri)
      const data = await response.arrayBuffer()
      await parseFile(data)
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
    setSelectedAsset(undefined)
    setProcessing(false)
    resetImport()
  }

  if (processing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onDismiss}>
      <Pressable style={modalStyles.backdrop} onPress={onDismiss} />

      <View style={[modalStyles.content, styles.modalContent, !!selectedAsset ? style : {}]}>
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable onPress={onDismiss} style={[formStyles.iconButton, { backgroundColor: colors.outline_variant }]}>
            <SymbolView name="xmark" size={30} tintColor="#fff" weight="bold" />
          </Pressable>
        </View>

        {selectedAsset === undefined && (
          <>
            {!!season?.course.udiscId && (
              <Pressable
                style={formStyles.secondaryButton}
                onPress={() => void Linking.openURL(`https://udisc.com/leagues/${season.course.udiscId}`)}
              >
                <Text style={formStyles.secondaryButtonText}>Open in UDisc</Text>
                <SymbolView name="arrow.up.right.square.fill" size={16} tintColor={colors.on_surface} />
              </Pressable>
            )}
            <Pressable style={formStyles.button} onPress={() => void pickFile()}>
              <SymbolView name="arrow.up.document.fill" size={24} tintColor="#fff" weight="bold" />
              <Text style={formStyles.buttonText}>Select a file</Text>
            </Pressable>
          </>
        )}

        {!!selectedAsset && (
          <>
            <Animated.ScrollView contentContainerStyle={styles.review} layout={LinearTransition}>
              <View style={styles.summary}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{scores.size}</Text>
                <Text style={{ fontSize: 16 }}>
                  {pluralize(scores.size, 'score')}
                  {' '}
                  ready to apply.
                </Text>
              </View>

              <AccordionItem
                title={`Not found in Birdogey (${notInBirdogey.length})`}
                children={(
                  <View style={styles.list}>
                    {notInBirdogey.map((player) => (
                      <View style={styles.listItem} key={player.username}>
                        <SymbolView name="circle.fill" size={10} tintColor={colors.on_surface} />
                        <Text>
                          {player.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              />

              <AccordionItem
                title={`Not found in UDisc import (${unmatchedInEvent.length})`}
                children={(
                  <View>
                    {unmatchedInEvent.map((player) => (
                      <View style={styles.listItem} key={player.userId}>
                        <SymbolView name="circle.fill" size={10} tintColor={colors.on_surface} />
                        <Text>
                          {player.userName}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              />

              {missingMetadata.size > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Set missing profile data (opt in)</Text>

                  {Array.from(missingMetadata.entries()).map(([userId, meta]) => (
                    <View style={styles.metadataRow} key={userId}>
                      <View style={styles.metadataInfo}>
                        <Text style={styles.metadataName}>{meta.name}</Text>
                        <View style={styles.metadataDetail}>
                          {meta.udiscId && (
                            <View style={{ gap: 2, flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={styles.metadataDetailText}>UDisc ID:</Text>
                              <Text style={styles.metadataValue}>
                                {meta.udiscId}
                              </Text>
                            </View>
                          )}
                          {meta.pdgaNumber && (
                            <View style={{ gap: 2, flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={styles.metadataDetailText}>PDGA #: </Text>
                              <Text style={styles.metadataValue}>
                                {meta.pdgaNumber}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <Pressable style={[formStyles.iconButton, { width: 42, backgroundColor: colors.surface_container_low }]} onPress={() => void saveUserMetadata(userId, meta)}>
                        <SymbolView name="checkmark" size={18} tintColor={colors.primary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </Animated.ScrollView>

            <Pressable style={formStyles.secondaryButton} onPress={reset}>
              <SymbolView name="arrow.left" size={24} tintColor={colors.on_surface_variant} weight="bold" />
              <Text style={formStyles.secondaryButtonText}>Back</Text>
            </Pressable>

            <Pressable style={formStyles.button} onPress={applyScores}>
              <SymbolView name="checkmark" size={24} tintColor="#fff" weight="bold" />
              <Text style={formStyles.buttonText}>Import scores</Text>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    gap: 16,
  },
  review: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    borderWidth: 1,
    borderColor: colors.outline_variant,
    borderRadius: 12,
    padding: 12,
  },
  sectionSummary: {
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '500',
    userSelect: 'none',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  list: {
    marginTop: 8,
    marginLeft: 12,
    display: 'flex',
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 8,
  },
  metadataInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  metadataName: {
    fontSize: 14,
    fontWeight: '500',
  },
  metadataDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  metadataDetailText: {
    fontSize: 12,
    color: colors.on_surface_variant,
  },
  metadataValue: {
    color: colors.primary,
  },
})
