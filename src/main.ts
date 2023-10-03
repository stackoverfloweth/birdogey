import { createApp } from 'vue'
import { router } from '@/router'

import '@/styles/index.css'

// We want components imported last because import order determines style order
// eslint-disable-next-line import/order
import App from '@/App.vue'

const app = createApp(App)

app.use(router)
app.mount('#app')