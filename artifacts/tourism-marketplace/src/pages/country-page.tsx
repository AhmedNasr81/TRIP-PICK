import { useCountry, usePrograms } from "@/hooks/api-hooks";
import { useParams } from "wouter";
import { ProgramCard } from "@/components/program-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/api";

export default function CountryPage() {
  const { id } = useParams();
  const { data: country, isLoading: isLoadingCountry } = useCountry(id || "");
  const { data: programs, isLoading: isLoadingPrograms } = usePrograms({ country_id: id });

  if (isLoadingCountry) {
    return <div className="container mx-auto py-20"><Skeleton className="h-64 w-full rounded-2xl" /></div>;
  }

  if (!country) {
    return <div className="container mx-auto py-20 text-center font-bold text-2xl">Country not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(country.image) || `https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80&${country.id}`} 
            alt={country.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="text-5xl font-bold tracking-tight mb-2 drop-shadow-md">{country.name}</h1>
          <p className="text-xl font-medium text-white/90 drop-shadow">{country.program_count} adventures await</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Popular programs in {country.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingPrograms ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))
          ) : programs && programs.length > 0 ? (
            programs.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No programs found for this destination yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
