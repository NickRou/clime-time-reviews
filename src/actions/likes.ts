'use server'

import { db } from '@/db/drizzle'
import { getCurrentUserIdOrThrow } from './clerk'
import { Likes } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { Like } from '@/lib/types'

export async function likePost(postId: string): Promise<Like> {
  const userId = await getCurrentUserIdOrThrow()

  const [like] = await db
    .insert(Likes)
    .values({
      post_id: postId,
      user_id: userId,
    })
    .returning()
  return like
}

export async function unlikePost(postId: string) {
  const userId = await getCurrentUserIdOrThrow()

  await db
    .delete(Likes)
    .where(and(eq(Likes.user_id, userId), eq(Likes.post_id, postId)))
}

export async function getPostLikes(postId: string): Promise<Like[]> {
  await getCurrentUserIdOrThrow()

  const likes = await db.query.Likes.findMany({
    where: eq(Likes.post_id, postId),
  })
  return likes
}
