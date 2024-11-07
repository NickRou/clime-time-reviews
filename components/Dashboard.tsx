"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import UserReviews from "@/components/UserReviews";
import { NavUser } from "@/components/NavUser";
import { AppSidebar } from "@/components/AppSidebar";

export default function Dashboard() {
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
          <NavUser></NavUser>
        </header>
        <UserReviews />
      </SidebarInset>
    </SidebarProvider>
  );
}
