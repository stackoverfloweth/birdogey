<script setup lang="ts">
  import { IKImage } from 'imagekitio-vue'
  import { env } from '@/utilities'

  const { imageUrl } = defineProps<{
    imageUrl?: string,
  }>()
</script>

<template>
  <IKImage class="player-image" :url-endpoint="env().imagekitUrl" :path="`/players/${imageUrl ?? 'default.png'}`" :transformation="[{ raw: 'fo-face,r-max' }]" />
</template>

<style>
.player-image {
  border-radius: 50%;
  background-color: darkgray;
}
</style>
