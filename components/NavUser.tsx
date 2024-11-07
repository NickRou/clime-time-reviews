import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import * as React from "react";

export function NavUser() {
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
