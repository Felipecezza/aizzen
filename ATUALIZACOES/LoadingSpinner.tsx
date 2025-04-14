
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LoadingSpinner = ({ className, ...props }: LoadingSpinnerProps) => {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-t-transparent", className)}
      {...props}
    ></div>
  );
};
