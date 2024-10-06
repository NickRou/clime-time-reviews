import { Search, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { createClient } from "../utils/supabase/server";
import { logout } from "../login/actions";

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <a href="/" className="text-2xl font-bold text-red-600 mr-6">
              Clime Time Reviews
            </a>
            <div className="hidden md:flex flex-grow max-w-2xl">
              <div className="flex w-full">
                <div className="relative flex-grow">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="Search restaurants, services..."
                    className="pl-10 pr-4 py-2 rounded-l-full w-full"
                  />
                </div>
                <div className="relative w-1/3">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="Location"
                    className="pl-10 pr-4 py-2 rounded-l-none rounded-r-none border-l-0 w-full"
                  />
                </div>
                <Button className="rounded-l-none rounded-r-full bg-red-600 hover:bg-red-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {user !== null ? (
              <form
                action={logout}
                className="hidden md:flex items-center space-x-4"
              >
                <p>{user.user_metadata.display_name}</p>
                <Button>
                  <Link href="/login">Logout</Link>
                </Button>
              </form>
            ) : (
              <Button>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
