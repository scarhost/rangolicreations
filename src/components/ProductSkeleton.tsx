import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border">
    <Skeleton className="aspect-[4/5] w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3 mt-2" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
