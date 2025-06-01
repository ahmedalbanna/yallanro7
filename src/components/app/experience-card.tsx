import type { Experience } from "@/models";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Tag, Star } from "lucide-react";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  // Mock rating
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // Random rating between 3.5 and 5.0

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full rounded-xl border-transparent hover:border-primary/50 group">
      <CardHeader className="p-0 relative">
        <Link href={`/experiences/${experience.experienceId}`} className="block aspect-[4/3] w-full overflow-hidden rounded-t-xl">
          <Image
            src={experience.images[0] || "https://placehold.co/600x400.png?text=YallaNro7&font=belleza"}
            alt={experience.title}
            width={600}
            height={400}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint="travel adventure"
          />
        </Link>
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center text-xs font-semibold text-foreground">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1" /> {rating}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/experiences/${experience.experienceId}`}>
          <CardTitle className="mb-2 text-xl font-headline group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2" title={experience.title}>
            {experience.title}
          </CardTitle>
        </Link>
        <div className="text-sm text-muted-foreground space-y-1.5 font-body mt-1">
          <div className="flex items-center">
            <MapPin className="ml-1.5 h-4 w-4 text-primary/80" />
            <span className="truncate">{experience.city}</span>
          </div>
          <div className="flex items-center">
            <Tag className="ml-1.5 h-4 w-4 text-primary/80" />
            {/* In a real app, fetch category name based on experience.categoryRef */}
            <span className="truncate">{experience.categoryRef}</span> 
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t mt-auto">
        <div className="font-body">
          <span className="text-xl font-bold text-primary">{experience.price}</span>
          <span className="text-xs text-muted-foreground mr-1">{experience.currency}/شخص</span>
        </div>
        <Button asChild size="sm" className="font-body rounded-md group-hover:bg-accent transition-colors">
          <Link href={`/experiences/${experience.experienceId}`}>عرض التفاصيل</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
