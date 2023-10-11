import 'vue-router'
import { RouteGuard } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    guards?: RouteGuard[],
  }
}