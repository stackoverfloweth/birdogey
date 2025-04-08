import mapper, { loadProfiles } from '@kitbag/mapper'
import { plugin as PrefectDesign } from '@prefecthq/prefect-design'
import { createApp } from 'vue'
import * as loaded from '@/maps'
import { router } from '@/router'

import '@prefecthq/prefect-design/dist/style.css'
import '@/styles/index.css'

const profiles = loadProfiles(loaded)

mapper.register(profiles)

declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles,
  }
}

// We want components imported last because import order determines style order
// eslint-disable-next-line import/order
import App from '@/App.vue'

const app = createApp(App)

app.use(router)
app.use(PrefectDesign)
app.mount('#app')
