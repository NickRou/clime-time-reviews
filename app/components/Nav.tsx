import Link from "next/link";

export default function Nav() {
  return (
    <header className="bg-white">
      <div className="mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              <Link href="/">Clime Time Reviews</Link>
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Reviews by your friends
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="inline-block rounded px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-100 focus:outline-none focus:ring"
              type="button"
            >
              <Link href="/writeareview">Write A Review</Link>
            </button>
            <button
              className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
              type="button"
            >
              <Link href="/login">Login</Link>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
