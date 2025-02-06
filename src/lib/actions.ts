'use server'

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { Posts } from '@/db/schema'
import { db } from '@/db'
import { eq, and, inArray } from 'drizzle-orm'
import { User } from '@/lib/types'
import { Follows } from '@/db/schema'
import { Likes } from '@/db/schema'
import { Users } from '@/db/schema'

// ---- CLERK USERS ----
export async function getCurrentUser() {
  const user = await currentUser()
  if (!user) {
    return null
  }
  return user
}

export async function getAllUsers(): Promise<User[] | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const client = await clerkClient()
  const usersResourceResponse = await client.users.getUserList()
  if (usersResourceResponse.data.length === 0) {
    return null
  }
  const users = usersResourceResponse.data.map((user) => ({
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  })) as User[]

  return users
}

export async function getUserByUsername(username: string) {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const client = await clerkClient()
  const users = await client.users.getUserList({
    username: [username],
  })

  return users.data[0] || null
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

export async function getPostsByUserId(userId: string) {
  const posts = await db.query.Posts.findMany({
    where: eq(Posts.user_id, userId),
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  return posts
}

export async function getFollowingPosts() {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  // Get list of users being followed
  const following = await db.query.Follows.findMany({
    where: eq(Follows.follower_id, userId),
  })

  if (following.length === 0) return []

  // Get posts from all followed users using Drizzle's query builder
  const followeeIds = following.map((f) => f.followee_id)
  const posts = await db.query.Posts.findMany({
    where: inArray(Posts.user_id, followeeIds),
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  return posts
}

// ---- FOLLOWS ----
export async function getFollowing(userId: string) {
  // Get all users that userId is following
  const following = await db.query.Follows.findMany({
    where: eq(Follows.follower_id, userId),
  })

  if (following.length === 0) return []

  const users = await getAllUsers()
  if (!users) return []

  // Filter users list to only include those being followed
  const followeeIds = following.map((f) => f.followee_id)
  return users.filter((user) => followeeIds.includes(user.id))
}

export async function getFollowers(userId: string) {
  // Get all users that follow userId
  const followers = await db.query.Follows.findMany({
    where: eq(Follows.followee_id, userId),
  })

  if (followers.length === 0) return []

  const users = await getAllUsers()
  if (!users) return []

  // Filter users list to only include followers
  const followerIds = followers.map((f) => f.follower_id)
  return users.filter((user) => followerIds.includes(user.id))
}

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

  // Insert new like
  await db.insert(Likes).values({
    post_id: postId,
    user_id: userId,
  })
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

// ---- DB USERS ----
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
