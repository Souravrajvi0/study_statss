import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-5 border border-border shadow-soft hover-lift",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-accent">
          <Icon className="w-5 h-5 text-accent-foreground" />
        </div>
      </div>
    </div>
  );
}
