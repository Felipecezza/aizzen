
import { LucideIcon } from "lucide-react";
import { PALETTE } from "@/styles/colorSystem";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  Icon: LucideIcon;
  className?: string;
}

export const MetricCard = ({ title, value, change, Icon, className }: MetricCardProps) => (
  <div className="rounded-lg bg-dark-700 p-4 transition-all hover:ring-1 hover:ring-zinc-700 border border-zinc-800">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-400">{title}</span>
      <Icon className="h-4 w-4 icon-primary" />
    </div>
    <div className={`text-lg font-medium text-white ${className}`}>{value}</div>
    {change && (
      <div className={`mt-1 text-sm ${change.isPositive ? 'text-[#4fefa2]' : 'text-[#FF6A6A]'}`}>
        {change.isPositive ? "↑" : "↓"} {change.value}% {change.isPositive ? "a mais" : "a menos"}
      </div>
    )}
  </div>
);
