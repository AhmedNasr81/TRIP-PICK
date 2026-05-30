import { useState } from "react";
import { useCountries, usePrograms } from "@/hooks/api-hooks";
import { ProgramCard } from "@/components/program-card";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Compass, ArrowRight, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [heroSearch, setHeroSearch] = useState("");

  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  const { data: programs, isLoading: isLoadingPrograms } = usePrograms({ page_size: 6, sort_by: "created_at", order: "desc" });
  const { user } = useAuth();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setLocation(`/programs?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      setLocation("/programs");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        {/* Background image with Ken Burns */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 10, ease: "easeOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none z-0"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/6 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none z-0"
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-5 text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Discover Your Next<br className="hidden md:block" /> Adventure
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium text-white/90 drop-shadow"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            Explore curated tours from trusted travel companies around the world.
          </motion.p>

          {/* Hero search bar */}
          <motion.form
            onSubmit={handleHeroSearch}
            className="flex items-center gap-0 max-w-2xl mx-auto mb-8 shadow-2xl rounded-full overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search destinations, tours, companies..."
                className="pl-14 pr-4 h-16 text-base rounded-none border-0 bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                data-testid="input-hero-search"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-16 px-8 rounded-none text-base font-semibold"
              data-testid="button-hero-search"
            >
              Search
            </Button>
          </motion.form>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
          >
            <Link href="/programs">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white rounded-full px-8">
                <Compass className="mr-2 h-5 w-5" /> Browse All Tours
              </Button>
            </Link>
            {!user && (
              <Link href="/register">
                <Button size="lg" variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 rounded-full px-8">
                  Join as Tourist
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick filter chips */}
      <section className="bg-card border-b py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-muted-foreground mr-2">Quick filters:</span>
            {[
              { label: "Highest Rated", params: "sort_by=rate&order=desc" },
              { label: "Lowest Price", params: "sort_by=price&order=asc" },
              { label: "Shortest Trip", params: "sort_by=duration&order=asc" },
              { label: "Longest Trip", params: "sort_by=duration&order=desc" },
              { label: "Newest", params: "sort_by=created_at&order=desc" },
            ].map(chip => (
              <Link key={chip.label} href={`/programs?${chip.params}`}>
                <button className="px-4 py-1.5 rounded-full text-sm font-medium border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  {chip.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-2 px-3 py-1 rounded-full bg-primary/10">
                Destinations
              </span>
              <h2 className="text-3xl font-bold mb-2">Featured Destinations</h2>
              <p className="text-muted-foreground">Discover tours in our most popular countries</p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="hidden sm:flex group gap-1">
                All destinations <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {isLoadingCountries
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
              : countries?.slice(0, 8).map(country => (
                  <Link key={country.id} href={`/countries/${country.id}`}>
                    <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300" data-testid={`card-country-${country.id}`}>
                      <img
                        src={getImageUrl(country.image) || `https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80`}
                        alt={country.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-5">
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                          <MapPin size={16} /> {country.name}
                        </h3>
                        <p className="text-white/80 text-sm">{country.program_count} programs</p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Latest Programs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-2 px-3 py-1 rounded-full bg-primary/10">
                Latest
              </span>
              <h2 className="text-3xl font-bold mb-2">Latest Adventures</h2>
              <p className="text-muted-foreground">Recently added tours from our partners</p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="hidden sm:flex group gap-1">
                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPrograms
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[400px] rounded-2xl" />)
              : programs?.map(program => <ProgramCard key={program.id} program={program} />)
            }
          </div>

          <div className="mt-10 text-center">
            <Link href="/programs">
              <Button size="lg" variant="outline" className="gap-2 rounded-full px-8">
                Explore all tours <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
