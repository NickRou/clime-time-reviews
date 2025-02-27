import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Profile Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end px-4">
          <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex mt-2 space-x-4">
              <div className="flex items-center">
                <Skeleton className="w-4 h-4 mr-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center">
                <Skeleton className="w-4 h-4 mr-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="grid w-full grid-cols-3 max-w-3xl mx-auto mb-6">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

      {/* Content Skeleton */}
      <Card className="border-0 shadow-none max-w-3xl mx-auto">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            {item < 3 && <Skeleton className="h-px w-full my-6" />}
          </div>
        ))}
      </Card>
    </div>
  )
}
