"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    redirect("/reviews");
  }

  return (
    <div className={`min-h-screen flex items-center justify-center`}>
      {children}
    </div>
  );
}
