import BackgroundCanvas from '@/components/BackgroundCanvas'
import { SignUp } from '@clerk/nextjs'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <BackgroundCanvas />
      <div className="relative z-10 flex h-full flex-col items-center px-4">
        <div className="flex flex-1 flex-col items-center justify-center">
          <SignUp />
        </div>
        <Footer />
      </div>
    </div>
  )
}
