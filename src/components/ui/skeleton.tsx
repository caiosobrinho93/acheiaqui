import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  )
}

export { Skeleton }

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-white/5 rounded-[1.5rem] p-5 flex flex-col gap-4">
      <Skeleton className="aspect-[4/5] rounded-xl w-full" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
           <Skeleton className="h-2 w-16" />
           <Skeleton className="h-2 w-8" />
        </div>
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 animate-pulse">
      <div className="flex flex-col gap-6">
        <Skeleton className="aspect-square rounded-[13px] md:rounded-[3rem] w-full" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-[60px] w-[60px] shrink-0 rounded-xl" />)}
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-32 w-full rounded-[2rem]" />
        <Skeleton className="h-40 w-full rounded-[2rem]" />
        <div className="flex gap-6 mt-4">
           <Skeleton className="h-16 w-32 rounded-xl" />
           <Skeleton className="h-16 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
