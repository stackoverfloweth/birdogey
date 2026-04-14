import { plugin as PrefectDesign } from '@prefecthq/prefect-design'
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { router } from '@/router'
import App from '@/App.vue'
import { auth, initAuthFromStorage } from '@/services/auth'
import { apiKey, createApi } from '@/services/createApi'
import { env } from '@/utilities/env'
import { install as VueRecaptcha } from 'vue3-recaptcha-v2'
import * as Sentry from '@sentry/vue'

import '@prefecthq/prefect-design/prefect-design.css'
import '@/styles/index.css'

const api = createApi({
  baseUrl: env().baseApiUrl,
  getToken: () => auth.token ?? null,
})

await initAuthFromStorage(api)

const app = createApp(App)

Sentry.init({
  app,
  dsn: env().sentryDsn,
  environment: env().prod ? 'production' : 'development',
  beforeSend(event) {
    const frames = event.exception?.values?.flatMap((value) => value.stacktrace?.frames ?? []) ?? []
    const files = frames.map((frame) => frame.filename ?? '').filter(Boolean)

    if (['/auth/refresh'].some((file) => files.includes(file))) {
      return null
    }

    return event
  },
})

app.provide(apiKey, api)
app.use(VueQueryPlugin)
app.use(router)
app.use(PrefectDesign)
app.use(VueRecaptcha, { sitekey: env().recaptchaSiteKey })
app.mount('#app')
