import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { User, Users } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { getFriends } from "@/app/actions/manage-friends";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [following, setFollowing] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const friends = await getFriends();
        const friendUsernames = friends.following.map((user) => user.username);
        setFollowing(friendUsernames);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers().catch(console.error);
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex justify-center items-center">
        <h2 className="text-lg font-bold">
          <Link href="/">CLIME TIME REVIEWS</Link>
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex items-center gap-2 pt-4 pl-3">
          <Users className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Friends You Follow</h4>
        </div>
        <aside>
          <Command>
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup heading="Users">
                <ScrollArea className="h-[300px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      Loading users...
                    </div>
                  ) : (
                    following.map((username) => (
                      <CommandItem
                        key={username}
                        value={username}
                        className="flex items-center gap-2 px-4 py-2"
                      >
                        <User className="h-4 w-4" />
                        <span>{username}</span>
                      </CommandItem>
                    ))
                  )}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
            <CommandGroup className="pl-2">
              <Button>
                <Link href="/friends">Manage Friends</Link>
              </Button>
            </CommandGroup>
          </Command>
        </aside>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
