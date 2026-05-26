import { usePrograms, useCountries } from "@/hooks/api-hooks";
import { ProgramCard } from "@/components/program-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Programs() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [countryId, setCountryId] = useState<string>("-1");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<string>("desc");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

  const { data: countries } = useCountries();
  
  const params = {
    search: debouncedSearch,
    country_id: countryId,
    sort_by: sortBy,
    order: order,
    price_max: priceRange[1] === 10000 ? -1 : priceRange[1],
    price_min: priceRange[0] === 0 ? -1 : priceRange[0]
  };

  const { data: programs, isLoading } = usePrograms(params);

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Destination</label>
        <Select value={countryId} onValueChange={setCountryId}>
          <SelectTrigger>
            <SelectValue placeholder="Any Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">Any Destination</SelectItem>
            {countries?.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Max Price: ${priceRange[1]}</label>
        </div>
        <Slider 
          value={[priceRange[1]]} 
          min={0} 
          max={10000} 
          step={100}
          onValueChange={(val) => setPriceRange([0, val[0]])} 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
            <SelectItem value="rate">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortBy !== 'created_at' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Order</label>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">High to Low</SelectItem>
              <SelectItem value="asc">Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={() => {
        setCountryId("-1");
        setSortBy("created_at");
        setOrder("desc");
        setPriceRange([0, 10000]);
        setSearch("");
      }}>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Explore Tours</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Find your next adventure from our curated list of global travel programs.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-6 font-bold text-lg border-b pb-4">
              <Filter className="w-5 h-5" /> Filters
            </div>
            <FilterContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search programs..." 
                className="pl-10 h-12 text-base rounded-full bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Mobile Filters Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="lg:hidden h-12 rounded-full px-6 border bg-card text-foreground hover:bg-muted" variant="outline">
                  <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {programs?.length || 0} results</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))
            ) : programs && programs.length > 0 ? (
              programs.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-card rounded-xl border border-dashed">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No programs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
