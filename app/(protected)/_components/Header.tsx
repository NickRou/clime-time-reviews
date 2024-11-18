import Link from "next/link";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="flex items-center justify-between h-full p-2">
        {/* Logo - always visible */}
        <Link
          href="/reviews"
          className="inline-block px-4 py-2 text-xl font-bold text-black hover:shadow-lg"
          aria-label="Clime Time Reviews"
        >
          Clime Time Reviews
        </Link>

        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-4">
          {/* Navigation links */}
          <div className="flex items-center space-x-2">
            <Link
              href="/reviews"
              className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
              aria-label="Reviews"
            >
              [reviews]
            </Link>
            <SignedIn>
              <Link
                href="/friends"
                className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
                aria-label="Friends"
              >
                [friends]
              </Link>
              <Link
                href="/writeareview"
                className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
                aria-label="Write a Review"
              >
                [write a review]
              </Link>
              <Link
                href="/managereviews"
                className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
                aria-label="Manage Reviews"
              >
                [manage your reviews]
              </Link>
            </SignedIn>
          </div>

          {/* Desktop Auth components */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Link
                href="/profile"
                className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
                aria-label="Profile"
              >
                [profile]
              </Link>
              <div className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg">
                <SignOutButton>[sign out]</SignOutButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button & Sheet - visible only on mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/reviews"
                    className="text-md font-medium text-black hover:text-gray-700"
                  >
                    [reviews]
                  </Link>
                  <SignedIn>
                    <Link
                      href="/friends"
                      className="text-md font-medium text-black hover:text-gray-700"
                    >
                      [friends]
                    </Link>
                    <Link
                      href="/writeareview"
                      className="text-md font-medium text-black hover:text-gray-700"
                    >
                      [write a review]
                    </Link>
                    <Link
                      href="/managereviews"
                      className="text-md font-medium text-black hover:text-gray-700"
                    >
                      [manage your reviews]
                    </Link>
                  </SignedIn>
                </nav>

                {/* Mobile Auth Components */}
                <div className="flex flex-col space-y-4 mt-4 border-t pt-4">
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                    {/* Profile line */}
                    <div className="flex flex-col space-y-4">
                      <Link
                        href="/profile"
                        className="text-md font-medium text-black hover:text-gray-70"
                        aria-label="Profile"
                      >
                        [profile]
                      </Link>
                    </div>
                    {/* Sign Out button on new line */}
                    <div className="text-md font-medium text-black hover:text-gray-70">
                      <SignOutButton>[sign out]</SignOutButton>
                    </div>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
