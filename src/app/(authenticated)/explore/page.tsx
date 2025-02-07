import UserExplorer from '@/components/UserExplorer'
import { getNonFollowedUsers } from '@/lib/actions'

export default async function ExplorePage() {
  const usersNotFollowing = await getNonFollowedUsers()

  return <UserExplorer users={usersNotFollowing} />
}
