"use client";

import { useState } from "react";
import { Plus, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchFriends, addFriend } from "@/app/actions/manage-friends";

interface ClerkUser {
  id: string;
  username: string;
}

export default function AddFriendButton() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClerkUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async () => {
    const results = await searchFriends(searchQuery);
    setSearchResults(results);
  };

  const handleAddFriend = async (friendId: string) => {
    await addFriend(friendId);
    setSearchResults(searchResults.filter((user) => user.id !== friendId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new friend</DialogTitle>
          <DialogDescription>
            Search for users to add as friends.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <span>{user.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddFriend(user.id)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
