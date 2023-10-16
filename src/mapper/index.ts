import { createMapper, loadProfiles } from '@stackoverfloweth/mapper'

const profiles = await loadProfiles(() => import('@/mapper/maps'))

export const mapper = createMapper(profiles)
export type Mapper = typeof mapper

export type MapFunction<TSource, TDestination> = (source: TSource, mapper: Mapper) => TDestination

// [x] does it work with primitives
// [x] does it work with arrays of primitives
// [x] does it work with arrays of classes
// [x] can you register profiles in safer way than barrel? can't export anything that's not a profile or it will break
// can you access other maps within a map
// can this work when most of the code is loaded from npm?
// can _mapKey on models help?
// is it any good?