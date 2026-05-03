import { config } from '@/config/env'
import { useQuery } from '@tanstack/react-query'
import ImageKit from 'imagekit-javascript'

const DEFAULT_TRANSFORMATION = [{ raw: 'fo-face,r-max' }] satisfies Record<string, string>[]

export function usePlayerImage(userId?: string, imageUrl?: string, transformation: Record<string, string>[] = DEFAULT_TRANSFORMATION) {
  const imagekit = new ImageKit({
    urlEndpoint: config.imageKitUrl,
    publicKey: config.imageKitPublicKey,
  })

  const path = `/players/${imageUrl ?? 'default.png'}`

  return useQuery({
    queryKey: ['players', userId, imageUrl, JSON.stringify(transformation)],
    queryFn: () => imagekit.url({
      path,
      transformation,
    }),
    staleTime: Infinity,
  })
}
