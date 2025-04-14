import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-t-transparent", 
      className ? className : "h-4 w-4 border-white"
    )} />
  );
}; 