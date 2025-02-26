import { getFollowingPosts } from '@/actions/posts'
import { Separator } from '@/components/ui/separator'
import UserPost from '@/components/UserPost'
import { Fragment } from 'react'

interface UserPostFeedProps {
  currentUserId: string
}

export async function UserPostFeed({ currentUserId }: UserPostFeedProps) {
  const posts = await getFollowingPosts()

  return (
    <>
      {posts.map((post, index) => {
        return (
          <Fragment key={post.post_id}>
            <UserPost post={post} currentUserId={currentUserId} />
            {index < posts.length && <Separator />}
          </Fragment>
        )
      })}
    </>
  )
}
