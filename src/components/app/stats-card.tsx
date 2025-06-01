import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  colorClass?: string; 
  isLoading?: boolean;
}

export function StatsCard({ title, value, icon: Icon, description, colorClass = "text-primary", isLoading = false }: StatsCardProps) {
  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body text-muted-foreground">{title}</CardTitle>
        {!isLoading && <Icon className={`h-5 w-5 ${colorClass}`} />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded-md"></div>
        ) : (
            <div className={`text-3xl font-bold font-headline ${colorClass}`}>{value}</div>
        )}
        {!isLoading && description && <p className="text-xs text-muted-foreground pt-1 font-body">{description}</p>}
         {isLoading && <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md mt-1"></div> }
      </CardContent>
    </Card>
  );
}
