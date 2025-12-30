import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularProgress({ 
  value, 
  maxValue = 12, 
  size = 220, 
  strokeWidth = 14,
  className 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--ring-background))"
          strokeWidth={strokeWidth}
          className="opacity-100"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--ring-progress))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out animate-progress"
          style={{
            filter: 'drop-shadow(0 0 8px hsl(var(--ring-progress) / 0.3))',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-display font-bold text-foreground tracking-tight">
          {value.toFixed(1)}
        </span>
        <span className="text-sm font-medium text-muted-foreground mt-1">
          hours/day
        </span>
      </div>
    </div>
  );
}
