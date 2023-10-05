<script lang="ts" setup>
  import { useSeason } from '@/composables/useSeason.ts'
  const { season } = useSeason()
</script>

<template>
  <div class="events-table">
    {{ season }}
  </div>
</template>

<style>

</style>