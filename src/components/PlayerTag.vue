<script lang="ts" setup>
  defineProps<{
    tag: number,
  }>()
</script>

<template>
  <div class="player-tag">
    {{ tag }}
  </div>
</template>

<style>
.player-tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: black;
  font-weight: bold;
  background: white;
  border-radius: 100%;
  height: 18px;
  width: 18px;
}
</style>