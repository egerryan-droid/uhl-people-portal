import { Skeleton } from "@/components/ui/skeleton"

export default function HandbookLoading() {
  return (
    <div className="flex gap-6">
      <div className="hidden w-64 shrink-0 md:block space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}
