"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import ReviewCard from "@/app/ui/review-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Input id="search" placeholder="search for reastaurants" />
          </div>
          <SignedIn>
            <Button>
              <Link href="/writeareview">Write a Review</Link>
            </Button>
          </SignedIn>
        </header>
        <ReviewCard
          name="John Doe"
          rating={4}
          date="October 1, 2024"
          address="123 Main St, Anytown, USA"
          restaurantName="The Great Italian Bistro"
          review="The food was fantastic! The service was prompt and friendly, and the ambiance was very welcoming. Highly recommended!"
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex justify-center items-center">
        <h2 className="text-lg font-bold">CLIME TIME REVIEWS</h2>
      </SidebarHeader>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavUser() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-start h-full p-2">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        {user && (
          <span className="p-2 text-gray-700 font-medium">{user.username}</span>
        )}
      </SignedIn>
    </div>
  );
}
