<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useRoute, RouteLocationNormalized } from 'vue-router'
  import { Season } from '@/models'
  import { auth } from '@/services'
  import { isSame } from '@/utilities'

  defineProps<{
    seasonId: string | null | undefined,
  }>()

  const route = useRoute()

  const seasons = ref<Season[]>([])

  const options = computed(() => {
    return auth.seasons.reduce((value, season) => {
      const course = value.get(season.course.name)

      if (!course) {
        value.set(season.course.name, [season])
      } else {
        course.push(season)
      }

      return value
    }, new Map<string, Season[]>())
  })

  function routeWithSeason(seasonId: string): RouteLocationNormalized {
    return { ...route, params: { seasonId }, query: {} }
  }
</script>

<template>
  <div class="season-route-select">
    <p-key-value label="Course">
      <template #value>
        <div class="season-route-select__options">
          <template v-for="[courseName, courseSeasons] in options" :key="courseName">
            <p-button :selected="isSame(courseSeasons, seasons)" class="season-route-select__item" @click="seasons = courseSeasons">
              {{ courseName }}
            </p-button>
          </template>
        </div>
      </template>
    </p-key-value>
    <p-key-value label="Season">
      <template #value>
        <div class="season-route-select__options">
          <template v-for="season in seasons" :key="season.id">
            <p-button :selected="season.id === seasonId" class="season-route-select__item" :to="routeWithSeason(season.id)">
              {{ season.name }}
            </p-button>
          </template>
        </div>
      </template>
    </p-key-value>
  </div>
</template>

<style>
.season-route-select {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

.season-route-select .p-key-value__value {
  width: 100%;
}

.season-route-select__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxs);
}

.season-route-select__item {
  max-width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>