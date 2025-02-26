import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonUserPostFeed() {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-lg bg-card text-card-foreground w-full max-w-3xl border-0 shadow-none"
        >
          <div className="p-6 pt-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-4 w-32 mt-2" />
                  <Skeleton className="h-4 w-64 mt-2" />
                  <div className="flex items-center gap-1 mt-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8 ml-2" />
                  </div>
                </div>
                <div className="mt-2">
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
