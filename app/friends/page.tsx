import { Suspense } from "react";
import FriendsList from "@/components/FriendsList";
import AddFriendButton from "@/components/AddFriendButton";
import { getFriends } from "@/app/actions/manage-friends";

export default async function FriendsPage() {
  const { following, followers } = await getFriends();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Suspense fallback={<div>Loading following...</div>}>
          <FriendsList title="Following" friends={following} type="following" />
        </Suspense>
        <Suspense fallback={<div>Loading followers...</div>}>
          <FriendsList title="Followers" friends={followers} type="followers" />
        </Suspense>
      </div>
      <div className="mt-8">
        <AddFriendButton />
      </div>
    </div>
  );
}
