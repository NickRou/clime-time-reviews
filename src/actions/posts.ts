'use server'

import { Images, Posts } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, and, inArray } from 'drizzle-orm'
import { Post, PostState } from '@/lib/types'
import { Follows } from '@/db/schema'
import { Likes } from '@/db/schema'
import { usePlaceDetails } from '@/actions/places'
import { getCurrentUserIdOrThrow } from './clerk'
import { deleteImagesFromUploadThing } from './images'

export async function createPost(postState: PostState) {
  const userId = await getCurrentUserIdOrThrow()

  if (
    postState.loc_place_id === '' ||
    postState.loc_name === '' ||
    postState.loc_address === '' ||
    postState.loc_cost === 0 ||
    postState.loc_content === ''
  ) {
    throw new Error('Missing required fields!')
  }

  const result = await db
    .insert(Posts)
    .values({
      user_id: userId,
      loc_place_id: postState.loc_place_id,
      loc_review: postState.loc_review,
      loc_content: postState.loc_content,
      loc_cost: postState.loc_cost,
    })
    .returning({ post_id: Posts.post_id })

  return result[0].post_id
}

export async function deletePost(postId: string) {
  const userId = await getCurrentUserIdOrThrow()

  // Delete all likes associated with the post first
  await db.delete(Likes).where(eq(Likes.post_id, postId))

  // Delete all images associated with the post
  const deletedImages = await db
    .delete(Images)
    .where(eq(Images.post_id, postId))
    .returning({ image_url: Images.image_url })

  // Delete all images from upload thing
  await deleteImagesFromUploadThing(
    deletedImages.map((image) => image.image_url)
  )

  // Then delete the post
  await db
    .delete(Posts)
    .where(and(eq(Posts.user_id, userId), eq(Posts.post_id, postId)))
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  await getCurrentUserIdOrThrow()

  const posts = await db.query.Posts.findMany({
    where: eq(Posts.user_id, userId),
    with: {
      user: true,
      images: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  // Fetch and populate place details for each post
  const postsWithPlaces = await Promise.all(
    posts.map(async (post) => {
      const placeDetails = await usePlaceDetails(post.loc_place_id)
      return {
        ...post,
        ...placeDetails,
      }
    })
  )

  return postsWithPlaces
}

export async function getFollowingPosts(): Promise<Post[]> {
  const userId = await getCurrentUserIdOrThrow()

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
      images: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createTs)],
  })

  // Fetch and populate place details for each post
  const postsWithPlaces = await Promise.all(
    posts.map(async (post) => {
      const placeDetails = await usePlaceDetails(post.loc_place_id)
      return {
        ...post,
        ...placeDetails,
      }
    })
  )

  return postsWithPlaces
}
