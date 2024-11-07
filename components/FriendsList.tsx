"use client";

import { useState } from "react";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteFriend } from "@/app/actions/manage-friends";

interface ClerkUser {
  id: string;
  username: string;
}

export default function FriendsList({
  title,
  friends,
  type,
}: {
  title: string;
  friends: ClerkUser[];
  type: "following" | "followers";
}) {
  const [localFriends, setLocalFriends] = useState(friends);

  const handleDelete = async (friendId: string) => {
    await deleteFriend(friendId, type);
    setLocalFriends(localFriends.filter((friend) => friend.id !== friendId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {localFriends.length} {type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {localFriends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{friend.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(friend.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
