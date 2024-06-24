<script lang="ts" setup>
  import { useRoute, useRouter, isRoute } from '@kitbag/router'
  import { Crumb } from '@prefecthq/prefect-design'
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

  const selection = computed({
    get() {
      if (isRoute(route, 'home', { exact: false })) {
        return !!route.params.selection
      }

      return false
    },
    set(value) {
      if (isRoute(route, 'home', { exact: false })) {
        return route.params.select = value
      }

      return false
    },
  })

  const seasonId = computed(() => {
    if (isRoute(route, 'home', { exact: false })) {
      return route.params
    }

    if (isRoute(route, 'players', { exact: false })) {
      return route.params.seasonId
    }

    if (isRoute(route, 'events', { exact: false })) {
      return route.params.seasonId
    }

    return undefined
  })

  const season = computed(() => {
    return auth.seasons.find(({ id }) => id === seasonId.value)
  })

  const crumbs = computed<Crumb[]>(() => {
    const homeHref = router.resolve('home', { seasonId: seasonId.value })
    const canChangeSeason = auth.seasons.length > 1
    const openSelection = canChangeSeason ? { ...route, query: { select: 'season' } } : homeHref

    if (!season.value) {
      return [{ text: 'Select Season', to: openSelection }]
    }

    return [
      { text: season.value.course.name, to: openSelection },
      { text: season.value.name, to: homeHref },
      ...props.crumbs,
    ]
  })
</script>

<template>
  <p-bread-crumbs v-bind="attrs" :crumbs="crumbs" class="context-bread-crumbs" />
  <p-modal v-model:show-modal="selection" title="Select Season" auto-close>
    <template v-if="selection">
      <SeasonRouteSelect :season-id="seasonId" />
    </template>
  </p-modal>
</template>