"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, UserPlus } from "lucide-react";
import { ClerkUser } from "@/lib/types";
import { getClerkUsers } from "@/app/actions/clerk";
import {
  addFriend,
  deleteFriend,
  getFriendFollowRelationships,
} from "@/app/actions/friends";

export default function FriendListWithPopup() {
  const [isFollowing, setIsFollowing] = useState(true);
  const [friendData, setFriendData] = useState<{
    following: ClerkUser[];
    followers: ClerkUser[];
    allUsers: ClerkUser[];
  }>({ following: [], followers: [], allUsers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchFriendData = useCallback(async () => {
    setIsLoading(true);
    try {
      let following = await getFriendFollowRelationships("following");
      let followers = await getFriendFollowRelationships("followers");
      let allUsers = await getClerkUsers();

      // Add image_url to following/followers by matching with allUsers
      following = following.map(followedUser => ({
        ...followedUser,
        image_url: allUsers.find(user => user.id === followedUser.id)?.image_url || followedUser.image_url
      }));

      followers = followers.map(follower => ({
        ...follower, 
        image_url: allUsers.find(user => user.id === follower.id)?.image_url || follower.image_url
      }));

      // Filter out users in `allUsers` who are in the `following` list
      allUsers = allUsers.filter(
        (user) => !following.some((followedUser) => followedUser.id === user.id)
      );

      setFriendData({
        following,
        followers,
        allUsers,
      });
    } catch (error) {
      console.error("Failed to fetch friend data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriendData();
  }, [fetchFriendData]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await deleteFriend(friendId, isFollowing);
      setFriendData((prevData) => {
        // Determine which list to update and filter out the friend
        const updatedList = prevData[
          isFollowing ? "following" : "followers"
        ].filter((friend) => friend.id !== friendId);

        // Find the friend that was removed (to add back to allUsers)
        const removedFriend = prevData[
          isFollowing ? "following" : "followers"
        ].find((friend) => friend.id === friendId);

        // Only add to allUsers if the friend was found and removed
        const updatedAllUsers = removedFriend
          ? [...prevData.allUsers, removedFriend]
          : prevData.allUsers;

        // Return the updated friend data
        return {
          ...prevData,
          [isFollowing ? "following" : "followers"]: updatedList,
          allUsers: updatedAllUsers,
        };
      });
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  const handleAddFriend = async (friend: ClerkUser) => {
    try {
      await addFriend(friend);
      const addedFriend = friendData.allUsers.find(
        (user) => user.id === friend.id
      );
      if (addedFriend) {
        setFriendData((prevData) => ({
          ...prevData,
          following: [...prevData.following, addedFriend],
          allUsers: prevData.allUsers.filter((user) => user.id !== friend.id),
        }));
      }
    } catch (error) {
      console.error("Failed to add friend:", error);
    }
  };

  const filteredUsers = searchQuery
    ? friendData.allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friendData.allUsers;

  const currentList = isFollowing ? friendData.following : friendData.followers;

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      <Card className="w-full max-w-md outline-none">
        <CardHeader>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Button
              variant="link"
              className={`text-lg ${isFollowing ? "underline underline-offset-4 font-semibold" : ""}`}
              onClick={() => setIsFollowing(true)}
            >
              Following
            </Button>
            <Button
              variant="link"
              className={`text-lg ${!isFollowing ? "underline underline-offset-4 font-semibold" : ""}`}
              onClick={() => setIsFollowing(false)}
            >
              Followers
            </Button>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Find more Friends
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-4">
                  Find Friends
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <div className="max-h-[60vh] overflow-y-auto">
                  <ul className="space-y-4" aria-label="Search results">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={user.image_url}
                            alt={`${user.username}'s avatar`}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">@{user.username}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFriend(user)}
                          aria-label={`Follow ${user.username}`}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <ul
              className="space-y-4"
              aria-label={isFollowing ? "Following list" : "Followers list"}
            >
              {currentList.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={friend.image_url}
                      alt={`${friend.username}'s avatar`}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">@{friend.username}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFriend(friend.id)}
                    aria-label={`Remove ${friend.username} from ${isFollowing ? "following" : "followers"}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
