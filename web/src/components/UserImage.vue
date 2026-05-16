<script setup lang="ts">
  import { IKImage } from 'imagekitio-vue'
  import { ENV } from 'varlock/env'

  const { imageUrl } = defineProps<{
    imageUrl?: string,
  }>()
</script>

<template>
  <IKImage class="player-image" :url-endpoint="ENV.VITE_IMAGEKIT_URL" :path="`/players/${imageUrl ?? 'default.png'}`" :transformation="[{ raw: 'fo-face,r-max' }]" />
</template>

<style>
.player-image {
  border-radius: 50%;
  background-color: darkgray;
}
</style>
