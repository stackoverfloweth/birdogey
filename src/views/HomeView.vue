<script lang="ts" setup>
  import EventsTable from '@/components/EventsTable.vue'
</script>

<template>
  <div class="home-view">
    <!-- tab set, each week is a tab, first tab is always a button to create new event -->
    <!-- new event modal -->
    <!-- within each tab, EventsTable, last row has button to add row -->
    <EventsTable />
  </div>
</template>