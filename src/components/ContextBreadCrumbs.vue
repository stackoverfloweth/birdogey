<script lang="ts" setup>
  import { Crumb } from '@prefecthq/prefect-design'
  import { useRouteParam, useRouteQueryParam } from '@prefecthq/vue-compositions'
  import { computed, useAttrs } from 'vue'
  import { useRoute } from 'vue-router'
  import SeasonRouteSelect from '@/components/SeasonRouteSelect.vue'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps<{
    crumbs: Crumb[],
  }>()

  const attrs = useAttrs()
  const route = useRoute()
  const selection = useRouteQueryParam('select')
  const seasonId = useRouteParam('seasonId')

  const showModal = computed({
    get() {
      return !!selection.value
    },
    set(value) {
      if (!value) {
        selection.value = undefined
      }
    },
  })

  const season = computed(() => {
    return auth.seasons.find(({ id }) => id === seasonId.value)
  })

  const crumbs = computed<Crumb[]>(() => {
    const openSelection = { ...route, query: { select: 'season' } }

    if (!season.value) {
      return [{ text: 'Select Season', to: openSelection }]
    }

    return [
      { text: season.value.course.name, to: openSelection },
      { text: season.value.name, to: routes.home(seasonId.value) },
      ...props.crumbs,
    ]
  })
</script>

<template>
  <p-bread-crumbs v-bind="attrs" :crumbs="crumbs" class="context-bread-crumbs" />
  <p-modal v-model:show-modal="showModal" title="Select Season" auto-close>
    <template v-if="selection">
      <SeasonRouteSelect :season-id="seasonId" />
    </template>
  </p-modal>
</template>