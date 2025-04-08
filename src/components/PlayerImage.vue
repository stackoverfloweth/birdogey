<script setup lang="ts">
  import { IKContext, IKImage, IKUpload } from 'imagekitio-vue'
  import { ref } from 'vue'
  import { useApi } from '@/composables/useApi'
  import { env } from '@/utilities'
  import { showToast } from '@prefecthq/prefect-design'

  const imageUrl = defineModel<string>()

  const api = useApi()
  const loading = ref(false)
  const progress = ref(0)

  function onUploadProgress(event: { loaded: number, total: number }): void {
    progress.value = event.loaded * 100 / event.total
  }

  function onUploadStart(): void {
    loading.value = true
    progress.value = 0
  }

  function onSuccess(file: { name: string }): void {
    loading.value = false
    imageUrl.value = file.name

    showToast('Failed to upload image', 'error')
  }

  function onError(): void {
    loading.value = false
    showToast('Failed to upload image', 'error')
  }
</script>

<template>
  <div class="player-image">
    <IKContext :public-key="env().imagekitPublicKey" :url-endpoint="env().imagekitUrl" :authenticator="api.imagekit.authenticate">
      <div class="player-image__current">
        <template v-if="imageUrl">
          <IKImage :url-endpoint="env().imagekitUrl" :path="`/players/${imageUrl}`" width="250" height="250" />
        </template>
        <template v-if="loading">
          <div class="player-image__loading" :style="{ width: `${progress}%` }" />
        </template>
      </div>

      <IKUpload
        folder="/players"
        :file-type="['image']"
        :max-file-size="1024 * 1024 * 5"
        :use-unique-file-name="true"
        v-bind="{
          onUploadProgress,
          onUploadStart,
          onSuccess,
          onError,
        }"
      />
    </IKContext>
  </div>
</template>

<style>
.player-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.player-image__current {
  width: 250px;
  background-color: #f0f0f0;
}

.player-image__loading {
  border: 2px solid var(--p-color-sentiment-positive);
}
</style>
