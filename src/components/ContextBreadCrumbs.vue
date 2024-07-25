<script lang="ts" setup>
  import { useRoute, useRouter, isRoute } from '@kitbag/router'
  import { Crumb } from '@stackoverfloweth/prefect-design'
  import { computed, useAttrs } from 'vue'
  import SeasonRouteSelect from '@/components/SeasonRouteSelect.vue'
  import { auth } from '@/services'

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps<{
    crumbs: Crumb[],
  }>()

  const attrs = useAttrs()
  const router = useRouter()
  const route = useRoute()

  const select = computed({
    get() {
      if (isRoute(route, 'home') || isRoute(route, 'players') || isRoute(route, 'events')) {
        return !!route.params.select
      }

      return false
    },
    set(value) {
      if (isRoute(route, 'home') || isRoute(route, 'players') || isRoute(route, 'events')) {
        return route.params.select = value
      }

      return false
    },
  })

  const seasonId = computed(() => {
    if (isRoute(route, 'home') || isRoute(route, 'players') || isRoute(route, 'events')) {
      return route.params.seasonId
    }

    return undefined
  })

  const season = computed(() => {
    return auth.seasons.find(({ id }) => id === seasonId.value)
  })

  const crumbs = computed<Crumb[]>(() => {
    const canChangeSeason = auth.seasons.length > 1
    const to = canChangeSeason ? '/' : null

    if (!season.value) {
      return [{ text: 'Select Season', to }]
    }

    return [
      { text: 'Change Course', to },
      { text: 'Change Season', to },
      ...props.crumbs,
    ]
  })

  function openSelect(): void {
    select.value = true
  }
</script>

<template>
  <p-bread-crumbs v-bind="attrs" :crumbs="crumbs" class="context-bread-crumbs">
    <template #select-season>
      <span @click="openSelect">
        Select Season
      </span>
    </template>

    <template #change-course>
      <span @click="openSelect">{{ season?.course.name }}</span>
    </template>

    <template #change-season>
      <span @click="openSelect">{{ season?.name }}</span>
    </template>
  </p-bread-crumbs>
  <p-modal v-model:show-modal="select" title="Select Season" auto-close>
    <template v-if="select">
      <SeasonRouteSelect :season-id="seasonId" />
    </template>
  </p-modal>
</template>