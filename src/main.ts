import mapper, { loadProfiles } from '@kitbag/mapper'
import { plugin as PrefectDesign } from '@prefecthq/prefect-design'
import { createApp } from 'vue'
import * as loaded from '@/maps'
import { router } from '@/router'
import App from '@/App.vue'
import { auth, initAuthFromStorage } from '@/services/auth'
import { ApiConfig } from '@/services/api'
import { apiKey, createApi } from '@/services/createApi'
import { env } from '@/utilities/env'
import { install as VueRecaptcha } from 'vue3-recaptcha-v2'

import '@prefecthq/prefect-design/dist/style.css'
import '@/styles/index.css'

const profiles = loadProfiles(loaded)

mapper.register(profiles)

declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles,
  }
}

const config: ApiConfig = {
  baseUrl: env().baseApiUrl,
  token: () => auth.token,
}

const api = createApi(config)

await initAuthFromStorage(api)

const app = createApp(App)
app.provide(apiKey, api)
app.use(router)
app.use(PrefectDesign)
app.use(VueRecaptcha, { sitekey: env().recaptchaSiteKey })
app.mount('#app')
