import mapper, { loadProfiles } from '@kitbag/mapper'
import { plugin as PrefectDesign } from '@stackoverfloweth/prefect-design'
import { createApp } from 'vue'
import * as loaded from '@/maps'
import { router } from '@/router'

import '@stackoverfloweth/prefect-design/dist/style.css'
import '@/styles/index.css'

const profiles = loadProfiles(loaded)

mapper.register(profiles)

declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles,
  }
}

declare module '@kitbag/router' {
  interface Register {
    router: typeof router,
    rejections: ['NotAuthorized'],
  }
}

// We want components imported last because import order determines style order
// eslint-disable-next-line import/order
import App from '@/App.vue'

const app = createApp(App)

app.use(router)
app.use(PrefectDesign)
app.mount('#app')