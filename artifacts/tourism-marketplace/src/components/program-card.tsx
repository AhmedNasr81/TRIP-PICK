import { Link } from "wouter";
import { ProgramSimple } from "@/lib/types";
import { getImageUrl } from "@/lib/api";
import { StarRating } from "./star-rating";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ProgramCardProps {
  program: ProgramSimple;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const image = getImageUrl(program.main_image) || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";

  return (
    <Link href={`/programs/${program.id}`}>
      <Card className="overflow-hidden cursor-pointer group hover-elevate transition-all duration-300 h-full flex flex-col border-border/50 hover:border-primary/30">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img 
            src={image} 
            alt={program.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-primary">
            {program.country_name}
          </div>
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-sm font-bold text-foreground">
            ${program.price.toLocaleString()}
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {program.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin size={14} />
            <span className="truncate">{program.company_name}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {program.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm border-t border-border/50 mt-auto pt-3">
          <div className="flex flex-col gap-1 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{program.duration} days</span>
            </div>
            {program.start_at && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{format(new Date(program.start_at), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <StarRating rating={program.avg_rating || 0} size={14} />
            <span className="text-xs text-muted-foreground font-medium">
              {program.avg_rating ? program.avg_rating.toFixed(1) : "New"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
