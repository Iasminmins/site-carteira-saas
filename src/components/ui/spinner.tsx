
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

export function Spinner({ className, size = "medium" }: SpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-8 w-8",
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}
