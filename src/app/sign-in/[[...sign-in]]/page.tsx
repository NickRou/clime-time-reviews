import Footer from '@/app/_components/Footer'
import LandingHeader from '@/app/_components/LandingHeader'
import ThemedSignIn from '@/app/_components/ThemedSignIn'

export default function Page() {
  return (
    <>
      <LandingHeader />
      <div className="flex flex-col min-h-screen -mt-[100px]">
        <div className="flex items-center justify-center flex-grow">
          <div className="">
            <ThemedSignIn />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
