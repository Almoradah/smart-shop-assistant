import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'default' | 'circle' | 'text';
  count?: number;
}

export function SkeletonLoader({ className, variant = 'default', count = 1 }: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-muted rounded';
  
  const variantClasses = {
    default: 'h-4 w-full',
    circle: 'h-10 w-10 rounded-full',
    text: 'h-4 w-3/4',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(baseClasses, variantClasses[variant])} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-lg bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-6 w-32 bg-muted rounded" />
        </div>
      </div>
      <div className="h-4 w-full bg-muted rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="h-10 bg-muted rounded-lg animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
