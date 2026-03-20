import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type AppLoaderProps = {
  /** "page" = full content area, "inline" = compact, "card" = card-sized */
  variant?: "page" | "inline" | "card";
  /** Optional message below the spinner */
  message?: string;
  /** Show skeleton placeholders instead of spinner */
  skeleton?: boolean;
  /** Additional class names */
  className?: string;
};

export function AppLoader({
  variant = "page",
  message,
  skeleton = false,
  className,
}: AppLoaderProps) {
  if (skeleton) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3",
          variant === "page" && "min-h-[200px] justify-center items-center py-12",
          variant === "card" && "py-6 space-y-4",
          variant === "inline" && "py-4",
          className
        )}
      >
        {variant === "page" && (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </>
        )}
        {variant === "card" && (
          <>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </>
        )}
        {variant === "inline" && (
          <Skeleton className="h-8 w-full" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        variant === "page" && "min-h-[200px] py-12",
        variant === "card" && "py-8",
        variant === "inline" && "py-4",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-primary",
          variant === "page" && "h-10 w-10",
          variant === "card" && "h-8 w-8",
          variant === "inline" && "h-6 w-6"
        )}
        aria-hidden
      />
      {message && (
        <p className="text-sm font-medium">{message}</p>
      )}
    </div>
  );
}
