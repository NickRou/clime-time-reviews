"use client";

import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import "./globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import * as React from "react";
import { Inconsolata } from "next/font/google";
import "leaflet/dist/leaflet.css";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inconsolata.className}>
        <body>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <SignedIn>
                  <Button>
                    <Link href="/writeareview">Write a Review</Link>
                  </Button>
                </SignedIn>
                <div className="ml-auto">
                  <NavUser />
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
