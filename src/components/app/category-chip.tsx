"use client";

import type { Category } from "@/models";
import { Button } from "@/components/ui/button";
import { Activity, CookingPot, Paintbrush, Scroll, Mountain, Tag } from "lucide-react";

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onClick?: (categoryId: string) => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  Activity,
  CookingPot,
  Paintbrush,
  Scroll,
  Mountain,
  Default: Tag,
};

export function CategoryChip({ category, isSelected, onClick }: CategoryChipProps) {
  const IconComponent = category.iconUrl && iconMap[category.iconUrl] ? iconMap[category.iconUrl] : iconMap.Default;
  
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={`shrink-0 rounded-full px-5 py-2.5 font-body text-sm transition-all duration-200 ease-in-out transform hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 ${isSelected ? 'shadow-lg bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent/10 hover:border-accent/50 border-border text-foreground'}`}
      onClick={() => onClick?.(category.categoryId)}
      aria-pressed={isSelected}
    >
      <IconComponent className="ml-2 h-4 w-4" />
      {category.name}
    </Button>
  );
}
