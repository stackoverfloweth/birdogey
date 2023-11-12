import { createMapper, loadProfiles } from '@stackoverfloweth/mapper'

const profiles = await loadProfiles(() => import('@/maps'))

export const mapper = createMapper(profiles)
export type Mapper = typeof mapper