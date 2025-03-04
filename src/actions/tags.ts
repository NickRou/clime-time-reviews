'use server'

import { db } from '@/db/drizzle'
import { PostTags, Tags } from '@/db/schema'
import { Tag } from '@/lib/types'
import { getCurrentUserIdOrThrow } from './clerk'

export async function createTags(tags: Tag[]): Promise<Tag[]> {
  await getCurrentUserIdOrThrow()

  const tags_res = await db
    .insert(Tags)
    .values(tags.map((tag) => ({ tag_text: tag.tag_text })))
    .returning()
  return tags_res
}

export async function createPostTags(tags: Tag[], post_id: string) {
  await getCurrentUserIdOrThrow()

  await db
    .insert(PostTags)
    .values(tags.map((tag) => ({ post_id, tag_id: tag.tag_id })))
    .returning()
}

export async function getAllTags(): Promise<Tag[]> {
  await getCurrentUserIdOrThrow()

  const tags = await db.select().from(Tags)

  return tags
}
