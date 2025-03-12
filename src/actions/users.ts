'use server'

import { db } from '@/db/drizzle'
import { getCurrentUserIdOrThrow } from './clerk'
import { Follows, Images, Likes, Posts, Users } from '@/db/schema'
import { and, eq, inArray, not } from 'drizzle-orm'
import { User } from '@/lib/types'
import { deleteImagesFromUploadThing } from './images'

export async function getUserByUsername(username: string): Promise<User> {
  await getCurrentUserIdOrThrow()

  const user = await db.query.Users.findFirst({
    where: eq(Users.username, username),
  })

  if (!user) {
    throw new Error(`User '${username}' not found`)
  }

  return user
}

export async function getFollowing(userId: string): Promise<User[]> {
  await getCurrentUserIdOrThrow()

  const following = await db.query.Follows.findMany({
    where: eq(Follows.follower_id, userId),
    with: {
      followee: true,
    },
  })

  return following.map((f) => f.followee)
}

export async function getFollowers(userId: string): Promise<User[]> {
  await getCurrentUserIdOrThrow()

  const followers = await db.query.Follows.findMany({
    where: eq(Follows.followee_id, userId),
    with: {
      follower: true,
    },
  })

  return followers.map((f) => f.follower)
}

export async function getNonFollowedUsers(): Promise<User[]> {
  const userId = await getCurrentUserIdOrThrow()

  const users = await db.query.Users.findMany({
    where: and(
      not(eq(Users.user_id, userId)),
      not(
        inArray(
          Users.user_id,
          db
            .select({ id: Follows.followee_id })
            .from(Follows)
            .where(eq(Follows.follower_id, userId))
        )
      )
    ),
  })

  return users
}

export async function createDbUser(user: User) {
  // TODO: get response form db insert and validate
  console.log('createDbUser', user)
  await db.insert(Users).values(user)
  console.log('createDbUser done')
}

export async function updateDbUser(user: User) {
  await getCurrentUserIdOrThrow()

  // TODO: get response form db update and validate
  await db.update(Users).set(user).where(eq(Users.user_id, user.user_id))
}

export async function deleteDbUser(id: string) {
  await getCurrentUserIdOrThrow()

  // TODO: get response form db deletes and validate

  // Delete all likes by this user
  await db.delete(Likes).where(eq(Likes.user_id, id))

  // Delete all follows relationships involving this user
  await db.delete(Follows).where(eq(Follows.follower_id, id))
  await db.delete(Follows).where(eq(Follows.followee_id, id))

  // Delete all posts by this user
  await db.delete(Posts).where(eq(Posts.user_id, id))

  // Delete all images by this user
  const deletedImages = await db
    .delete(Images)
    .where(eq(Images.user_id, id))
    .returning({ image_url: Images.image_url })

  // Delete all images from upload thing by this user
  deleteImagesFromUploadThing(deletedImages.map((image) => image.image_url))

  // Delete the user
  await db.delete(Users).where(eq(Users.user_id, id))
}

export async function isUserVerified(userId: string): Promise<boolean> {
  await getCurrentUserIdOrThrow()

  const user = await db.query.Users.findFirst({
    where: eq(Users.user_id, userId),
  })

  if (!user) {
    throw new Error(`User '${userId}' not found`)
  }

  return user.is_verified
}
