import BackgroundCanvas from '@/app/_components/BackgroundCanvas'
import { SignIn } from '@clerk/nextjs'
import Footer from '@/app/_components/Footer'
import { dark } from '@clerk/themes'

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <BackgroundCanvas />
      <div className="relative z-10 flex h-full flex-col items-center px-4">
        <div className="flex flex-1 flex-col items-center justify-center">
          <SignIn appearance={{ baseTheme: dark }} />
        </div>
        <Footer />
      </div>
    </div>
  )
}
