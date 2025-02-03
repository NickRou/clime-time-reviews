import { ThemeToggle } from '@/components/ThemeToggle'
import { UserButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Home page</h1>
      <UserButton />
      <ThemeToggle />
    </div>
  )
}
