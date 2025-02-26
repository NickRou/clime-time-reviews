'use server'

import { db } from '@/db/drizzle'
import { getCurrentUserIdOrThrow } from './clerk'
import { Images } from '@/db/schema'
import { UTApi } from 'uploadthing/server'
import { getImageKey } from '@/lib/utils'

export async function createImageUrls(
  files: { ufsUrl: string }[],
  post_id: string
) {
  const userId = await getCurrentUserIdOrThrow()

  const insertValues = files.map((file) => ({
    post_id: post_id,
    image_url: file.ufsUrl,
    user_id: userId,
  }))

  await db.insert(Images).values(insertValues)
}

export async function deleteImagesFromUploadThing(image_urls: string[]) {
  await getCurrentUserIdOrThrow()

  const utApi = new UTApi()

  await utApi.deleteFiles(image_urls.map((url) => getImageKey(url)))
}
