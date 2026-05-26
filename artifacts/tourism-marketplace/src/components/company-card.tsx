import { Link } from "wouter";
import { CompanyOut } from "@/lib/types";
import { getImageUrl } from "@/lib/api";
import { StarRating } from "./star-rating";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanyCardProps {
  company: CompanyOut;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const image = getImageUrl(company.image);

  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="overflow-hidden cursor-pointer group hover-elevate transition-all duration-300 h-full border-border/50 hover:border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-xl border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
              <AvatarImage src={image || undefined} alt={company.name} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-primary/5 text-primary">
                <Building2 size={24} />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                {company.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-1 mb-2">
                <StarRating rating={company.avg_rating || 0} size={14} />
                <span className="text-xs text-muted-foreground font-medium">
                  ({company.rate_count} reviews)
                </span>
              </div>
              
              <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{company.address || "No address provided"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {company.description || "No description provided."}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
