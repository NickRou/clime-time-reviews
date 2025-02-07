'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { Posts } from '@/db/schema'
import { db } from '@/db'
import { eq, and, inArray, not } from 'drizzle-orm'
import { PostWithUser, User } from '@/lib/types'
import { Follows } from '@/db/schema'
import { Likes } from '@/db/schema'
import { Users } from '@/db/schema'

// ---- CLERK ----
export async function getCurrentUser(): Promise<User> {
  const clerkUser = await currentUser()
  if (
    !clerkUser ||
    !clerkUser.username ||
    !clerkUser.firstName ||
    !clerkUser.lastName ||
    !clerkUser.imageUrl
  ) {
    throw new Error('User not found')
  }
  return {
    user_id: clerkUser.id,
    username: clerkUser.username,
    first_name: clerkUser.firstName,
    last_name: clerkUser.lastName,
    image_url: clerkUser.imageUrl,
  }
}

// ---- POSTS ----
export async function createPost(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  const locName = formData.get('locName') as string
  const locAddress = formData.get('locAddress') as string
  const locReview = formData.get('locReview') as string
  const locContent = formData.get('locContent') as string

  await db.insert(Posts).values({
    user_id: userId,
    loc_name: locName,
    loc_address: locAddress,
    loc_review: parseInt(locReview),
    loc_content: locContent,
  })
}

export async function deletePost(postId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  // Delete all likes associated with the post first
  await db.delete(Likes).where(eq(Likes.post_id, postId))

  // Then delete the post
  await db
    .delete(Posts)
    .where(and(eq(Posts.user_id, userId), eq(Posts.post_id, postId)))
}

export async function getAllPosts() {
  const posts = await db.query.Posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  return posts
}

export async function getPostsByUserId(
  userId: string
): Promise<PostWithUser[]> {
  const posts = await db.query.Posts.findMany({
    where: eq(Posts.user_id, userId),
    with: {
      user: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  return posts
}

export async function getFollowingPosts(): Promise<PostWithUser[]> {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  // Get posts from followed users with user information included
  const posts = await db.query.Posts.findMany({
    where: inArray(
      Posts.user_id,
      db
        .select({ id: Follows.followee_id })
        .from(Follows)
        .where(eq(Follows.follower_id, userId))
    ),
    with: {
      user: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  return posts
}

// ---- FOLLOWS ----

export async function followUser(followeeId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  await db.insert(Follows).values({
    follower_id: userId,
    followee_id: followeeId,
  })
}

export async function unfollowUser(followeeId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  await db
    .delete(Follows)
    .where(
      and(eq(Follows.follower_id, userId), eq(Follows.followee_id, followeeId))
    )
}

export async function removeFollower(followerId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  await db
    .delete(Follows)
    .where(
      and(eq(Follows.follower_id, followerId), eq(Follows.followee_id, userId))
    )
}

// ---- LIKES ----
export async function likePost(postId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  // Insert new like and return the like object
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
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  await db
    .delete(Likes)
    .where(and(eq(Likes.user_id, userId), eq(Likes.post_id, postId)))
}

export async function getPostLikes(postId: string) {
  const likes = await db.query.Likes.findMany({
    where: eq(Likes.post_id, postId),
  })
  return likes
}

// ---- USERS ----
export async function getUserByUsername(username: string) {
  const user = await db.query.Users.findFirst({
    where: eq(Users.username, username),
  })
  return user
}

export async function createDbUser(
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  imageUrl: string
) {
  await db.insert(Users).values({
    user_id: id,
    username: username,
    first_name: firstName,
    last_name: lastName,
    image_url: imageUrl,
  })
}

export async function updateDbUser(
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  imageUrl: string
) {
  await db
    .update(Users)
    .set({
      username: username,
      first_name: firstName,
      last_name: lastName,
      image_url: imageUrl,
    })
    .where(eq(Users.user_id, id))
}

export async function deleteDbUser(id: string) {
  // Delete all likes by this user
  await db.delete(Likes).where(eq(Likes.user_id, id))

  // Delete all follows relationships involving this user
  await db.delete(Follows).where(eq(Follows.follower_id, id))
  await db.delete(Follows).where(eq(Follows.followee_id, id))

  // Delete all posts by this user
  await db.delete(Posts).where(eq(Posts.user_id, id))

  // Finally, delete the user
  await db.delete(Users).where(eq(Users.user_id, id))
}

export async function getFollowing(userId: string): Promise<User[]> {
  const following = await db.query.Follows.findMany({
    where: eq(Follows.follower_id, userId),
    with: {
      followee: true, // Include the user being followed
    },
  })

  return following.map((f) => f.followee) // Return just the user objects
}

export async function getFollowers(userId: string): Promise<User[]> {
  const followers = await db.query.Follows.findMany({
    where: eq(Follows.followee_id, userId),
    with: {
      follower: true, // Include the user who is following
    },
  })

  return followers.map((f) => f.follower) // Return just the user objects
}

export async function getNonFollowedUsers(): Promise<User[]> {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  // Get all users except the current user and those they already follow
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
