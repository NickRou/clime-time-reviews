import dynamic from "next/dynamic";
import { useMemo } from "react";
import Nav from "./components/Nav";

export default async function Page() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../app/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <div className="flex flex-grow">
        <div className="w-1/5 p-4 border">Filters</div>
        <div className="w-2/5 p-4 border">Reviews</div>
        <div className="w-2/5 border">
          <Map posix={[4.79029, -75.69003]} />
        </div>
      </div>
    </div>
  );
}
