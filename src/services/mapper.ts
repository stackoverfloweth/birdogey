import { createMapper } from '@stackoverfloweth/mapper'
import * as profiles from '@/maps'

export const mapper = createMapper(Object.values(profiles))
export type Mapper = typeof mapper