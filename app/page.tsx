import dynamic from "next/dynamic";
import { useMemo } from "react";

export default async function Page() {
    const Map = useMemo(() => dynamic(
        () => import('../app/components/Map'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
      <div className="bg-white-700 mx-auto my-5 w-[98%] h-[1000px]">
          <Map posix={[4.79029, -75.69003]} />
      </div>
    )
}