<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import UserForm from '@/components/UserForm.vue'
  import { useApi } from '@/composables'
  import { UserRequest } from '@birdogey/shared'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    isOpen: boolean,
    seasonId: string,
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
  }>()

  const isOpen = computed({
    get() {
      return props.isOpen
    },
    set(value) {
      emit('update:isOpen', value)
    },
  })

  const api = useApi()
  const router = useRouter()

  const { seasonId } = toRefs(props)
  const playerSubscription = useSubscription(api.users.getUsersInSeason, [seasonId])
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  async function addPlayer(request: UserRequest): Promise<void> {
    startLoading()
    await api.users.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    stopLoading()

    router.push(routes.users(seasonId.value))
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" class="player-create-modal" title="Add Player" auto-close>
    <UserForm
      :loading="loading"
      :season-id="seasonId"
      @submit="addPlayer"
      @cancel="router.back"
    />
  </p-modal>
</template>
