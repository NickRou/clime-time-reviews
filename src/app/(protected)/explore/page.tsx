import { getNonFollowedUsers } from '@/actions/users'
import UserExplorer from '@/components/UserExplorer'

export default async function ExplorePage() {
  const usersNotFollowing = await getNonFollowedUsers()

  return <UserExplorer users={usersNotFollowing} />
}
