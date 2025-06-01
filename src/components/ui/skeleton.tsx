import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
};

// Preset skeleton components for common use cases
const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full" // Last line is shorter
          )}
        />
      ))}
    </div>
  );
};

const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={cn("h-10 w-24 rounded-md", className)} />;
};

const SkeletonInput: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="w-20 h-4" /> {/* Label */}
      <Skeleton className="w-full h-10 rounded-md" /> {/* Input */}
    </div>
  );
};

const SkeletonCard: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        "dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      {children || (
        <div className="space-y-4">
          <Skeleton className="w-32 h-6" /> {/* Title */}
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-4/5 h-4" />
            <Skeleton className="w-3/5 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};

const SkeletonAvatar: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
  );
};

const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={`header-${i}`} className="flex-1 h-6" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="flex-1 h-8"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Export all components
export {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonInput,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonTable,
};

export default Skeleton;
