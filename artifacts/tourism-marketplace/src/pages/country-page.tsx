import { useState, useCallback } from "react";
import { useCountry, useCountryPrograms } from "@/hooks/api-hooks";
import { useParams } from "wouter";
import { ProgramCard } from "@/components/program-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 12;
const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 10000;
const DEFAULT_DURATION_MIN = 1;
const DEFAULT_DURATION_MAX = 90;

export default function CountryPage() {
  const { id } = useParams();
  const { data: country, isLoading: isLoadingCountry } = useCountry(id || "");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [priceRange, setPriceRange] = useState([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX]);
  const [durationRange, setDurationRange] = useState([DEFAULT_DURATION_MIN, DEFAULT_DURATION_MAX]);
  const [startFrom, setStartFrom] = useState("");
  const [startTo, setStartTo] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, any> = {
    search: debouncedSearch || undefined,
    sort_by: sortBy,
    order,
    price_min: priceRange[0] > DEFAULT_PRICE_MIN ? priceRange[0] : undefined,
    price_max: priceRange[1] < DEFAULT_PRICE_MAX ? priceRange[1] : undefined,
    duration_min: durationRange[0] > DEFAULT_DURATION_MIN ? durationRange[0] : undefined,
    duration_max: durationRange[1] < DEFAULT_DURATION_MAX ? durationRange[1] : undefined,
    start_at_from: startFrom || undefined,
    start_at_to: startTo || undefined,
    page,
    page_size: PAGE_SIZE,
  };

  const { data: programs, isLoading: isLoadingPrograms } = useCountryPrograms(id || "", params);

  const activeFilterCount = [
    !!debouncedSearch,
    priceRange[0] > DEFAULT_PRICE_MIN || priceRange[1] < DEFAULT_PRICE_MAX,
    durationRange[0] > DEFAULT_DURATION_MIN || durationRange[1] < DEFAULT_DURATION_MAX,
    !!startFrom,
    !!startTo,
  ].filter(Boolean).length;

  const resetFilters = useCallback(() => {
    setSearch("");
    setSortBy("created_at");
    setOrder("desc");
    setPriceRange([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX]);
    setDurationRange([DEFAULT_DURATION_MIN, DEFAULT_DURATION_MAX]);
    setStartFrom("");
    setStartTo("");
    setPage(1);
  }, []);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-foreground">Price Range</label>
          <span className="text-xs text-muted-foreground font-medium">
            ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={priceRange}
          min={DEFAULT_PRICE_MIN}
          max={DEFAULT_PRICE_MAX}
          step={100}
          onValueChange={(val) => { setPriceRange(val); setPage(1); }}
          className="mt-2"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-foreground">Duration (days)</label>
          <span className="text-xs text-muted-foreground font-medium">
            {durationRange[0]} – {durationRange[1]} days
          </span>
        </div>
        <Slider
          value={durationRange}
          min={DEFAULT_DURATION_MIN}
          max={DEFAULT_DURATION_MAX}
          step={1}
          onValueChange={(val) => { setDurationRange(val); setPage(1); }}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Start Date From</label>
        <Input
          type="date"
          value={startFrom}
          onChange={(e) => { setStartFrom(e.target.value); setPage(1); }}
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Start Date To</label>
        <Input
          type="date"
          value={startTo}
          onChange={(e) => { setStartTo(e.target.value); setPage(1); }}
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Sort By</label>
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
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

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Order</label>
        <Select value={order} onValueChange={(v) => { setOrder(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">High to Low / Newest</SelectItem>
            <SelectItem value="asc">Low to High / Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={resetFilters}>
        <X className="w-4 h-4" /> Reset Filters
      </Button>
    </div>
  );

  if (isLoadingCountry) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[40vh] w-full" />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Country not found</h2>
        <p className="text-muted-foreground">This destination doesn't exist or has been removed.</p>
      </div>
    );
  }

  const hasPrev = page > 1;
  const hasNext = programs && programs.length === PAGE_SIZE;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[42vh] min-h-[280px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(country.image) || `https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80`}
            alt={country.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold tracking-tight mb-2 drop-shadow-lg">{country.name}</h1>
          <p className="text-lg font-medium text-white/90 drop-shadow">
            {country.program_count} adventure{country.program_count !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar — Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-2 font-bold text-base">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 px-1.5 text-xs">{activeFilterCount}</Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={`Search tours in ${country.name}...`}
                  className="pl-10 h-11 rounded-lg"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  data-testid="input-search-country-programs"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile filter sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-11 gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="h-5 px-1.5 text-xs">{activeFilterCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                className="hidden lg:flex h-11 gap-2 items-center"
                onClick={() => setOrder(o => o === "desc" ? "asc" : "desc")}
              >
                <ArrowUpDown className="w-4 h-4" />
                {order === "desc" ? "High → Low" : "Low → High"}
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
              <span>
                {isLoadingPrograms
                  ? "Searching..."
                  : `${programs?.length ?? 0} result${programs?.length !== 1 ? "s" : ""} on page ${page}`}
              </span>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="flex items-center gap-1 text-primary hover:underline text-xs font-medium">
                  <X className="w-3 h-3" /> Clear {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoadingPrograms
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <Skeleton key={i} className="h-[400px] rounded-xl" />
                  ))
                : programs && programs.length > 0
                ? programs.map(program => <ProgramCard key={program.id} program={program} />)
                : (
                  <div className="col-span-full py-24 text-center bg-card rounded-xl border border-dashed">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-40" />
                    <h3 className="text-xl font-bold mb-2">No programs found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or search term.</p>
                    <Button variant="outline" onClick={resetFilters} className="gap-2">
                      <X className="w-4 h-4" /> Clear Filters
                    </Button>
                  </div>
                )}
            </div>

            {/* Pagination */}
            {(hasPrev || hasNext) && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!hasPrev} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="text-sm font-medium px-4 py-2 bg-muted rounded-md">Page {page}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!hasNext} className="gap-2">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
