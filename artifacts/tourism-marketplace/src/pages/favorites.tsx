import { useFavorites } from "@/hooks/api-hooks";
import { ProgramCard } from "@/components/program-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">Programs you've saved for later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))
        ) : favorites && favorites.length > 0 ? (
          favorites.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't saved any programs yet. Start exploring and heart your favorites!
            </p>
            <Link href="/programs">
              <Button>Explore Programs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
