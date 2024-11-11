import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
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
          href="/"
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
              href="/"
              className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
              aria-label="Home"
            >
              Home
            </Link>
            <Link
              href="/friends"
              className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
            <Link
              href="/writeareview"
              className="inline-block px-4 py-2 text-md font-medium text-black hover:shadow-lg"
              aria-label="Write a Review"
            >
              Write a Review
            </Link>
          </div>

          {/* Desktop Auth components */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="rounded-full">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-4 cursor-pointer">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonTrigger: "flex items-center gap-2",
                    },
                  }}
                ></UserButton>
              </div>
            </SignedIn>
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
                    href="/"
                    className="text-md font-medium text-black hover:text-gray-700"
                  >
                    Home
                  </Link>
                  <Link
                    href="/friends"
                    className="text-md font-medium text-black hover:text-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/writeareview"
                    className="text-md font-medium text-black hover:text-gray-700"
                  >
                    Write a Review
                  </Link>
                </nav>

                {/* Mobile Auth Components */}
                <div className="pt-4 border-t">
                  <SignedOut>
                    <SignInButton>
                      <Button className="w-full rounded-full" variant="outline">
                        Login
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center space-x-2">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                            userButtonTrigger: "flex items-center gap-2",
                          },
                        }}
                      />
                    </div>
                  </SignedIn>
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
