import { Profile } from '@stackoverfloweth/mapper'
import { ObjectId } from 'mongodb'

export const objectIdToString: Profile<'ObjectId', ObjectId, 'string', string> = {
  sourceKey: 'ObjectId',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
}

export const numberToString: Profile<'number', number, 'string', string> = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
}

export const numbersArrayToNumbersSet: Profile<'array', unknown[], 'Set', Set<unknown>> = {
  sourceKey: 'array',
  destinationKey: 'Set',
  map: (source) => {
    return new Set(source)
  },
}

export const numberToDate: Profile<'number', number, 'Date', Date> = {
  sourceKey: 'number',
  destinationKey: 'Date',
  map: (source) => {
    return new Date(source)
  },
}