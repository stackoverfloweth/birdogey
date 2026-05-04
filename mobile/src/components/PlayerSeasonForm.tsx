import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable, ActivityIndicator, Switch } from 'react-native'
import { SeasonSelect } from '@/components/SeasonSelect'
import { NumericInput } from '@/components/NumericInput'
import { SymbolView } from 'expo-symbols'
import { userSeasonSchema, UserSeasonSchema, UserSeasonSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/contexts/ApiClientContext'

export type PlayerSeasonFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  cancelText?: string,
  cancelIcon?: React.ReactNode,
  deleteText?: string,
  deleteIcon?: React.ReactNode,
  initialValues?: UserSeasonSchemaInput | undefined,
  onSubmit: (data: UserSeasonSchema) => void,
  onCancel?: () => void,
  onDelete?: (seasonId: string) => void,
}

export function PlayerSeasonForm({ submitText, submitIcon, cancelText, cancelIcon, deleteText, deleteIcon, initialValues, onSubmit, onCancel, onDelete }: PlayerSeasonFormProps): React.ReactNode {
  const api = useApiClient()

  const { control, handleSubmit, formState: { errors, isLoading } } = useForm<UserSeasonSchemaInput, any, UserSeasonSchema>({
    resolver: zodResolver(userSeasonSchema),
    defaultValues: initialValues,
  })

  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => api.season.getList(),
  })

  return (
    <View style={formStyles.form}>
      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Notes</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <SeasonSelect
              seasons={seasons}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          name="seasonId"
        />
        {errors.seasonId && <Text style={formStyles.errorText}>{errors.seasonId.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Tag</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumericInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="number-pad"
            />
          )}
          name="tagId"
        />
        {errors.tagId && <Text style={formStyles.errorText}>{errors.tagId.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Entry Paid</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Switch
              trackColor={{ true: colors.primary }}
              value={value}
              onValueChange={onChange}
              onBlur={onBlur}
            />
          )}
          name="entryPaid"
        />
        {errors.entryPaid && <Text style={formStyles.errorText}>{errors.entryPaid.message}</Text>}
      </View>

      <View style={formStyles.actions}>
        <Pressable
          disabled={isLoading}
          style={formStyles.button}
          onPress={() => void handleSubmit(onSubmit)()}
        >
          {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : submitIcon}
          <Text style={formStyles.buttonText}>{submitText}</Text>
        </Pressable>

        {onCancel && (
          <Pressable
            style={formStyles.secondaryButton}
            onPress={onCancel}
          >
            {cancelIcon}
            <Text style={formStyles.secondaryButtonText}>{cancelText ?? 'Cancel'}</Text>
          </Pressable>
        )}

        {onDelete && initialValues?.seasonId && (
          <Pressable
            style={formStyles.secondaryButton}
            onPress={() => onDelete(initialValues.seasonId)}
          >
            {deleteIcon ?? <SymbolView name="trash" size={20} tintColor={colors.error} weight="bold" />}
            <Text style={[formStyles.secondaryButtonText, { color: colors.error }]}>{deleteText ?? 'Delete'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
