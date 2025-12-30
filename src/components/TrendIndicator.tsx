import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  change: number;
  className?: string;
}

export function TrendIndicator({ change, className }: TrendIndicatorProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
      isPositive && "bg-success/10 text-success",
      isNegative && "bg-destructive/10 text-destructive",
      isNeutral && "bg-muted text-muted-foreground",
      className
    )}>
      {isPositive && <TrendingUp className="w-4 h-4" />}
      {isNegative && <TrendingDown className="w-4 h-4" />}
      {isNeutral && <Minus className="w-4 h-4" />}
      <span>
        {isPositive && "+"}
        {change.toFixed(0)}% from last week
      </span>
    </div>
  );
}
