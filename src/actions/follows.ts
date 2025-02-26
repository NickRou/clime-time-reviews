'use server'

import { db } from '@/db/drizzle'
import { getCurrentUserIdOrThrow } from './clerk'
import { Follows } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function followUser(followeeId: string) {
  const userId = await getCurrentUserIdOrThrow()

  await db.insert(Follows).values({
    follower_id: userId,
    followee_id: followeeId,
  })
}

export async function unfollowUser(followeeId: string) {
  const userId = await getCurrentUserIdOrThrow()

  await db
    .delete(Follows)
    .where(
      and(eq(Follows.follower_id, userId), eq(Follows.followee_id, followeeId))
    )
}

export async function removeFollower(followerId: string) {
  const userId = await getCurrentUserIdOrThrow()

  await db
    .delete(Follows)
    .where(
      and(eq(Follows.follower_id, followerId), eq(Follows.followee_id, userId))
    )
}
