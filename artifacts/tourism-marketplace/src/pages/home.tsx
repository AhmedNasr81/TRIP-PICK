import { useCountries, usePrograms, useAdminStats } from "@/hooks/api-hooks";
import { ProgramCard } from "@/components/program-card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Compass, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  const { data: programs, isLoading: isLoadingPrograms } = usePrograms({ page_size: 6 });
  const { data: stats } = useAdminStats();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80" 
            alt="Travel Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
            Discover Your Next<br/>Great Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium text-white/90 drop-shadow-md">
            Explore carefully curated tours from top travel companies around the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/programs">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg">
                <Compass className="mr-2 h-5 w-5" /> Explore Tours
              </Button>
            </Link>
            {!user && (
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white shadow-lg">
                  Join as Tourist
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Destinations</h2>
              <p className="text-muted-foreground">Discover tours in our most popular countries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoadingCountries ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))
            ) : (
              countries?.slice(0, 8).map(country => (
                <Link key={country.id} href={`/countries/${country.id}`}>
                  <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer">
                    <img 
                      src={getImageUrl(country.image) || `https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80&${country.id}`} 
                      alt={country.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <MapPin size={18} /> {country.name}
                      </h3>
                      <p className="text-white/80 text-sm">{country.program_count} programs</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Programs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Adventures</h2>
              <p className="text-muted-foreground">Recently added tours from our partners</p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="hidden sm:flex group">
                View all <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPrograms ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))
            ) : (
              programs?.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/programs">
              <Button variant="outline" className="w-full">
                View all adventures
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl md:text-5xl font-bold mb-2">{stats.total_programs}+</p>
                <p className="text-primary-foreground/80 font-medium">Active Tours</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold mb-2">{stats.total_countries}</p>
                <p className="text-primary-foreground/80 font-medium">Destinations</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold mb-2">{stats.total_companies}+</p>
                <p className="text-primary-foreground/80 font-medium">Travel Partners</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold mb-2">{stats.total_tourists}+</p>
                <p className="text-primary-foreground/80 font-medium">Happy Travelers</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
